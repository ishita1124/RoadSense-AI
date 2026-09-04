import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { getAccidents } from "../services/api";


// ============================================================
// DEFAULT CENTER
// ============================================================

const DEFAULT_CENTER = [22.9734, 78.6569];


// ============================================================
// CLOSE-ZOOM SAFETY LIMIT
// ============================================================

const MAX_INDIVIDUAL_MARKERS = 700;


// ============================================================
// FORMAT LABEL
// ============================================================

const formatLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};


// ============================================================
// SEVERITY COLOR
// ============================================================

const getSeverityColor = (severity) => {
  const value = String(
    severity || ""
  ).toLowerCase();

  if (value === "fatal") {
    return "#ef4444";
  }

  if (value === "major") {
    return "#f97316";
  }

  return "#22c55e";
};


// ============================================================
// FULL CLICK POPUP
// ============================================================

const buildPopupHtml = (accident) => {

  const severity =
    String(
      accident.accident_severity || ""
    ).toLowerCase();

  const severityColor =
    getSeverityColor(severity);

  return `
    <div
      style="
        min-width:230px;
        font-family:Arial,sans-serif;
        color:#334155;
      "
    >

      <div
        style="
          font-size:15px;
          font-weight:700;
          color:#0f172a;
          padding-bottom:8px;
          margin-bottom:8px;
          border-bottom:1px solid #e2e8f0;
        "
      >
        Accident #${accident.accident_id ?? ""}
      </div>

      <div
        style="
          font-size:13px;
          line-height:1.65;
        "
      >

        <div>
          <strong>City:</strong>
          ${accident.city || "Unknown"}
        </div>

        <div>
          <strong>State:</strong>
          ${accident.state || "Unknown"}
        </div>

        <div>
          <strong>Date:</strong>
          ${accident.date || "N/A"}
        </div>

        <div>
          <strong>Time:</strong>
          ${accident.time || "N/A"}
        </div>

        <div>
          <strong>Severity:</strong>

          <span
            style="
              color:${severityColor};
              font-weight:700;
            "
          >
            ${formatLabel(
              accident.accident_severity
            )}
          </span>
        </div>

        <div>
          <strong>Cause:</strong>
          ${formatLabel(accident.cause)}
        </div>

        <div>
          <strong>Weather:</strong>
          ${formatLabel(accident.weather)}
        </div>

        <div>
          <strong>Road Type:</strong>
          ${formatLabel(accident.road_type)}
        </div>

        <div>
          <strong>Risk Score:</strong>
          ${Number(
            accident.risk_score || 0
          ).toFixed(2)}
        </div>

        <div>
          <strong>Risk Band:</strong>
          ${formatLabel(
            accident.risk_band
          )}
        </div>

        <div
          style="
            margin-top:8px;
            color:#94a3b8;
            font-size:11px;
          "
        >
          ${Number(
            accident.latitude
          ).toFixed(5)},
          ${Number(
            accident.longitude
          ).toFixed(5)}
        </div>

      </div>

    </div>
  `;
};


// ============================================================
// HOVER DETAIL CARD
//
// This is displayed automatically when the mouse moves over
// an accident circle/dot.
//
// It does NOT replace the existing click popup.
// ============================================================

const buildHoverHtml = (
  accident,
  extra = {}
) => {

  const severity =
    String(
      accident?.accident_severity || ""
    ).toLowerCase();

  const severityColor =
    getSeverityColor(severity);

  return `
    <div
      style="
        min-width:230px;
        max-width:270px;
        font-family:Arial,sans-serif;
        color:#334155;
        font-size:12px;
        line-height:1.55;
      "
    >

      <div
        style="
          font-size:14px;
          font-weight:800;
          color:#0f172a;
          padding-bottom:6px;
          margin-bottom:6px;
          border-bottom:1px solid #e2e8f0;
        "
      >
        Accident #${accident?.accident_id ?? "—"}
      </div>

      <div>
        <strong>Location:</strong>
        ${accident?.city || "Unknown"},
        ${accident?.state || "Unknown"}
      </div>

      <div>
        <strong>Date:</strong>
        ${accident?.date || "N/A"}
      </div>

      <div>
        <strong>Time:</strong>
        ${accident?.time || "N/A"}
      </div>

      <div>
        <strong>Severity:</strong>

        <span
          style="
            color:${severityColor};
            font-weight:800;
          "
        >
          ${formatLabel(
            accident?.accident_severity
          )}
        </span>
      </div>

      <div>
        <strong>Cause:</strong>
        ${formatLabel(accident?.cause)}
      </div>

      <div>
        <strong>Weather:</strong>
        ${formatLabel(accident?.weather)}
      </div>

      <div>
        <strong>Road Type:</strong>
        ${formatLabel(accident?.road_type)}
      </div>

      <div>
        <strong>Risk:</strong>
        ${formatLabel(accident?.risk_band)}
      </div>

      <div>
        <strong>Risk Score:</strong>
        ${Number(
          accident?.risk_score || 0
        ).toFixed(2)}
      </div>

      ${
        extra.totalCount !== undefined
          ? `
            <div
              style="
                margin-top:7px;
                padding-top:7px;
                border-top:1px solid #e2e8f0;
                font-weight:700;
                color:#2563eb;
              "
            >
              Accidents in this area:
              ${Number(
                extra.totalCount
              ).toLocaleString()}
            </div>
          `
          : ""
      }

      ${
        Number.isFinite(
          Number(accident?.latitude)
        ) &&
        Number.isFinite(
          Number(accident?.longitude)
        )
          ? `
            <div
              style="
                margin-top:5px;
                font-size:10px;
                color:#94a3b8;
              "
            >
              ${Number(
                accident.latitude
              ).toFixed(5)},
              ${Number(
                accident.longitude
              ).toFixed(5)}
            </div>
          `
          : ""
      }

    </div>
  `;
};


// ============================================================
// GET GRID SIZE BASED ON ZOOM
// ============================================================

const getGridSize = (zoom) => {

  if (zoom <= 5) {
    return 2.5;
  }

  if (zoom === 6) {
    return 1.25;
  }

  if (zoom === 7) {
    return 0.65;
  }

  if (zoom === 8) {
    return 0.32;
  }

  if (zoom === 9) {
    return 0.16;
  }

  if (zoom === 10) {
    return 0.08;
  }

  if (zoom === 11) {
    return 0.04;
  }

  if (zoom === 12) {
    return 0.02;
  }

  return 0.01;
};


// ============================================================
// AGGREGATE RECORDS
// ============================================================

const aggregateRecords = (
  records,
  zoom,
  bounds
) => {

  const gridSize =
    getGridSize(zoom);

  const groups =
    new Map();

  let sourceRecords = records;

  if (
    zoom >= 8 &&
    bounds
  ) {

    sourceRecords =
      records.filter(
        (accident) => {

          const lat =
            Number(
              accident.latitude
            );

          const lng =
            Number(
              accident.longitude
            );

          return bounds.contains([
            lat,
            lng,
          ]);

        }
      );

  }


  sourceRecords.forEach(
    (accident) => {

      const lat =
        Number(
          accident.latitude
        );

      const lng =
        Number(
          accident.longitude
        );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      const latCell =
        Math.floor(
          lat / gridSize
        );

      const lngCell =
        Math.floor(
          lng / gridSize
        );

      const key =
        `${latCell}_${lngCell}`;

      if (!groups.has(key)) {

        groups.set(key, {

          latSum: 0,

          lngSum: 0,

          count: 0,

          fatal: 0,

          major: 0,

          minor: 0,

          sample: null,

        });

      }

      const group =
        groups.get(key);

      group.latSum += lat;

      group.lngSum += lng;

      group.count += 1;

      if (!group.sample) {
        group.sample = accident;
      }

      const severity =
        String(
          accident.accident_severity ||
          ""
        ).toLowerCase();

      if (
        severity === "fatal"
      ) {

        group.fatal += 1;

      } else if (
        severity === "major"
      ) {

        group.major += 1;

      } else {

        group.minor += 1;

      }

    }
  );


  return Array
    .from(groups.values())
    .map((group) => {

      let severity =
        "minor";

      if (
        group.fatal >= group.major &&
        group.fatal >= group.minor
      ) {

        severity =
          "fatal";

      } else if (
        group.major >= group.fatal &&
        group.major >= group.minor
      ) {

        severity =
          "major";

      }

      return {

        latitude:
          group.latSum /
          group.count,

        longitude:
          group.lngSum /
          group.count,

        count:
          group.count,

        fatal:
          group.fatal,

        major:
          group.major,

        minor:
          group.minor,

        severity,

        sample:
          group.sample,

      };

    });

};


// ============================================================
// CREATE AGGREGATED CIRCLE
// ============================================================

const createAggregateCircle = (
  item,
  map,
  zoom
) => {

  const color =
    getSeverityColor(
      item.severity
    );


  // ----------------------------------------------------------
  // CIRCLE SIZE
  // ----------------------------------------------------------

  let radius;

  if (item.count >= 5000) {

    radius = 34;

  } else if (item.count >= 2000) {

    radius = 31;

  } else if (item.count >= 1000) {

    radius = 28;

  } else if (item.count >= 500) {

    radius = 25;

  } else if (item.count >= 100) {

    radius = 22;

  } else if (item.count >= 20) {

    radius = 18;

  } else if (item.count >= 5) {

    radius = 14;

  } else {

    radius = 10;

  }


  if (zoom >= 11) {

    radius =
      Math.min(
        radius,
        13
      );

  }


  // ----------------------------------------------------------
  // CREATE CIRCLE
  // ----------------------------------------------------------

  const circle =
    L.circleMarker(
      [
        item.latitude,
        item.longitude,
      ],
      {

        radius,

        color: "#ffffff",

        weight: 1.5,

        fillColor: color,

        fillOpacity: 0.45,

        opacity: 0.82,

        renderer:
          map.options.renderer,

      }
    );


  // ----------------------------------------------------------
  // PERMANENT COUNT
  //
  // THIS REMAINS EXACTLY AS BEFORE.
  // ----------------------------------------------------------

  circle.bindTooltip(
    item.count.toLocaleString(),
    {

      permanent: true,

      direction: "center",

      className:
        "roadsense-count-label",

      opacity: 1,

      interactive: false,

    }
  );


  // ==========================================================
  // NEW: HOVER DETAIL CARD
  // ==========================================================

  let hoverTooltip = null;


  circle.on(
    "mouseover",
    (event) => {

      if (hoverTooltip) {

        map.closeTooltip(
          hoverTooltip
        );

        hoverTooltip = null;

      }


      if (!item.sample) {
        return;
      }


      hoverTooltip =
        L.tooltip({

          direction: "top",

          className:
            "roadsense-hover-tooltip",

          opacity: 1,

          offset: [0, -8],

          sticky: false,

        })
        .setContent(
          buildHoverHtml(
            item.sample,
            {
              totalCount:
                item.count,
            }
          )
        )
        .setLatLng(
          event.latlng
        );


      hoverTooltip.addTo(
        map
      );

    }
  );


  circle.on(
    "mouseout",
    () => {

      if (hoverTooltip) {

        map.closeTooltip(
          hoverTooltip
        );

        hoverTooltip = null;

      }

    }
  );


  // ----------------------------------------------------------
  // EXISTING CLICK POPUP
  // ----------------------------------------------------------

  if (item.sample) {

    circle.bindPopup(`
      <div
        style="
          min-width:220px;
          font-family:Arial,sans-serif;
          color:#334155;
        "
      >

        <div
          style="
            font-size:15px;
            font-weight:700;
            color:#0f172a;
            margin-bottom:8px;
          "
        >
          ${item.sample.city || "Location"}
        </div>

        <div
          style="
            font-size:13px;
            line-height:1.65;
          "
        >

          <div>
            <strong>State:</strong>
            ${item.sample.state || "Unknown"}
          </div>

          <div>
            <strong>Total Accidents:</strong>
            ${item.count.toLocaleString()}
          </div>

          <div>
            <strong>Fatal:</strong>
            ${item.fatal.toLocaleString()}
          </div>

          <div>
            <strong>Major:</strong>
            ${item.major.toLocaleString()}
          </div>

          <div>
            <strong>Minor:</strong>
            ${item.minor.toLocaleString()}
          </div>

          <div
            style="
              margin-top:7px;
              font-size:11px;
              color:#94a3b8;
            "
          >
            Center:
            ${item.latitude.toFixed(5)},
            ${item.longitude.toFixed(5)}
          </div>

        </div>

      </div>
    `);

  }


  return circle;
};


// ============================================================
// CLOSE-ZOOM INDIVIDUAL POINTS
// ============================================================

const createIndividualPoints = (
  records,
  map
) => {

  const bounds =
    map.getBounds().pad(0.15);


  const visible =
    records.filter(
      (accident) => {

        const lat =
          Number(
            accident.latitude
          );

        const lng =
          Number(
            accident.longitude
          );

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          bounds.contains([
            lat,
            lng,
          ])
        );

      }
    );


  const limited =
    visible.slice(
      0,
      MAX_INDIVIDUAL_MARKERS
    );


  return limited.map(
    (accident) => {

      const color =
        getSeverityColor(
          accident.accident_severity
        );


      const circle =
        L.circleMarker(
          [
            Number(
              accident.latitude
            ),
            Number(
              accident.longitude
            ),
          ],
          {

            radius: 5,

            color: "#ffffff",

            weight: 1.2,

            fillColor: color,

            fillOpacity: 0.48,

            opacity: 0.82,

            renderer:
              map.options.renderer,

          }
        );


      // --------------------------------------------------------
      // EXISTING CLICK POPUP
      // --------------------------------------------------------

      circle.bindPopup(
        buildPopupHtml(
          accident
        )
      );


      // ========================================================
      // NEW: HOVER DETAIL CARD
      // ========================================================

      let hoverTooltip = null;


      circle.on(
        "mouseover",
        (event) => {

          if (hoverTooltip) {

            map.closeTooltip(
              hoverTooltip
            );

            hoverTooltip = null;

          }


          hoverTooltip =
            L.tooltip({

              direction: "top",

              className:
                "roadsense-hover-tooltip",

              opacity: 1,

              offset: [0, -7],

              sticky: false,

            })
            .setContent(
              buildHoverHtml(
                accident
              )
            )
            .setLatLng(
              event.latlng
            );


          hoverTooltip.addTo(
            map
          );

        }
      );


      circle.on(
        "mouseout",
        () => {

          if (hoverTooltip) {

            map.closeTooltip(
              hoverTooltip
            );

            hoverTooltip = null;

          }

        }
      );


      return circle;

    }
  );

};


// ============================================================
// MAP DRAWING COMPONENT
// ============================================================

function AccidentMapLayer({
  accidents,
}) {

  const map =
    useMap();


  const layerRef =
    useRef(null);


  const redrawTimer =
    useRef(null);


  const drawingRef =
    useRef(false);


  // ==========================================================
  // CLEAR CURRENT LAYER
  // ==========================================================

  const clearLayer =
    () => {

      if (
        layerRef.current
      ) {

        map.removeLayer(
          layerRef.current
        );

        layerRef.current =
          null;

      }

    };


  // ==========================================================
  // DRAW MAP
  // ==========================================================

  const drawMap =
    () => {

      if (
        drawingRef.current
      ) {

        return;

      }


      drawingRef.current =
        true;


      clearLayer();


      const zoom =
        map.getZoom();


      const bounds =
        map.getBounds();


      // ------------------------------------------------------
      // ONE CANVAS RENDERER
      // ------------------------------------------------------

      if (
        !map.options.renderer
      ) {

        map.options.renderer =
          L.canvas({
            padding: 0.5,
          });

      }


      const layer =
        L.layerGroup();


      // ======================================================
      // CLOSEST ZOOM
      // ======================================================

      if (zoom >= 13) {

        const points =
          createIndividualPoints(
            accidents,
            map
          );


        points.forEach(
          (point) => {

            layer.addLayer(
              point
            );

          }
        );


      } else {

        // ====================================================
        // AGGREGATED VIEW
        // ====================================================

        const groups =
          aggregateRecords(
            accidents,
            zoom,
            bounds
          );


        groups.forEach(
          (group) => {

            const circle =
              createAggregateCircle(
                group,
                map,
                zoom
              );


            layer.addLayer(
              circle
            );

          }
        );

      }


      layer.addTo(
        map
      );


      layerRef.current =
        layer;


      drawingRef.current =
        false;

    };


  // ==========================================================
  // INITIAL MAP
  // ==========================================================

  useEffect(() => {

    map.options.renderer =
      L.canvas({
        padding: 0.5,
      });


    const initialTimer =
      setTimeout(
        () => {

          drawMap();

        },
        100
      );


    // ========================================================
    // ZOOM START
    // ========================================================

    const handleZoomStart =
      () => {

        if (
          redrawTimer.current
        ) {

          clearTimeout(
            redrawTimer.current
          );

        }


        clearLayer();

      };


    // ========================================================
    // ZOOM END
    // ========================================================

    const handleZoomEnd =
      () => {

        if (
          redrawTimer.current
        ) {

          clearTimeout(
            redrawTimer.current
          );

        }


        redrawTimer.current =
          setTimeout(
            () => {

              drawMap();

            },
            120
          );

      };


    // ========================================================
    // PAN END
    // ========================================================

    const handleMoveEnd =
      () => {

        if (
          redrawTimer.current
        ) {

          clearTimeout(
            redrawTimer.current
          );

        }


        redrawTimer.current =
          setTimeout(
            () => {

              drawMap();

            },
            120
          );

      };


    map.on(
      "zoomstart",
      handleZoomStart
    );

    map.on(
      "zoomend",
      handleZoomEnd
    );

    map.on(
      "moveend",
      handleMoveEnd
    );


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {

      clearTimeout(
        initialTimer
      );


      if (
        redrawTimer.current
      ) {

        clearTimeout(
          redrawTimer.current
        );

      }


      map.off(
        "zoomstart",
        handleZoomStart
      );

      map.off(
        "zoomend",
        handleZoomEnd
      );

      map.off(
        "moveend",
        handleMoveEnd
      );


      clearLayer();

    };

  }, [map, accidents]);


  return null;
}


// ============================================================
// MAIN MAP
// ============================================================

function AccidentMap() {

  const [accidents, setAccidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  // ==========================================================
  // LOAD DATABASE RECORDS
  // ==========================================================

  const loadMapAccidents =
    async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getAccidents();


        const records =
          Array.isArray(data)
            ? data
            : data?.accidents ||
              data?.data ||
              [];


        setAccidents(
          records
        );


        setLastUpdated(
          new Date()
        );

      } catch (err) {

        console.error(
          "Accident Map Error:",
          err
        );


        setError(
          "Unable to load accident locations from the backend."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadMapAccidents();

  }, []);


  // ==========================================================
  // VALID RECORDS
  // ==========================================================

  const validAccidents =
    useMemo(
      () =>
        accidents.filter(
          (accident) => {

            const lat =
              Number(
                accident.latitude
              );

            const lng =
              Number(
                accident.longitude
              );


            return (
              Number.isFinite(lat) &&
              Number.isFinite(lng)
            );

          }
        ),
      [accidents]
    );


  // ==========================================================
  // REAL DATABASE SEVERITY COUNTS
  // ==========================================================

  const fatalCount =
    useMemo(
      () =>
        accidents.filter(
          (accident) =>
            String(
              accident.accident_severity ||
              ""
            ).toLowerCase() ===
            "fatal"
        ).length,
      [accidents]
    );


  const majorCount =
    useMemo(
      () =>
        accidents.filter(
          (accident) =>
            String(
              accident.accident_severity ||
              ""
            ).toLowerCase() ===
            "major"
        ).length,
      [accidents]
    );


  const minorCount =
    useMemo(
      () =>
        accidents.filter(
          (accident) =>
            String(
              accident.accident_severity ||
              ""
            ).toLowerCase() ===
            "minor"
        ).length,
      [accidents]
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <section
        className="
          rounded-3xl
          bg-white
          p-6
          shadow-sm
          ring-1
          ring-slate-200
        "
      >

        <div className="mb-5">

          <div className="mb-2 flex items-center gap-2">

            <div
              className="
                rounded-xl
                bg-blue-50
                p-2
                text-blue-600
              "
            >
              <span className="text-lg">
                📍
              </span>
            </div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Accident Risk Map
            </h2>

          </div>

          <p className="text-sm text-slate-500">
            Geographic distribution of real accident records.
          </p>

        </div>


        <div
          className="
            flex
            h-[500px]
            items-center
            justify-center
            rounded-2xl
            bg-slate-50
          "
        >

          <div className="text-center">

            <div
              className="
                mx-auto
                mb-4
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-blue-100
                border-t-blue-600
              "
            />

            <h3 className="font-bold text-slate-800">
              Loading Accident Map
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Fetching real accident locations...
            </p>

          </div>

        </div>

      </section>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <section
        className="
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-8
          text-center
          text-red-700
        "
      >

        <h3 className="font-bold">
          Map Error
        </h3>

        <p className="mt-1 text-sm">
          {error}
        </p>

        <button
          onClick={loadMapAccidents}
          className="
            mt-4
            rounded-xl
            bg-red-600
            px-4
            py-2
            text-sm
            font-bold
            text-white
            hover:bg-red-700
          "
        >
          Try Again
        </button>

      </section>

    );

  }


  // ==========================================================
  // MAIN RENDER
  // ==========================================================

  return (

    <section
      className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        ring-1
        ring-slate-200
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <div className="mb-2 flex items-center gap-2">

            <div
              className="
                rounded-xl
                bg-blue-50
                p-2
                text-blue-600
              "
            >
              <span className="text-lg">
                📍
              </span>
            </div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Accident Risk Map
            </h2>

          </div>

          <p className="text-sm text-slate-500">
            Geographic distribution of real accident records
            stored in the RoadSense AI database.
          </p>

        </div>


        <div className="flex flex-wrap gap-2">

          <div
            className="
              rounded-xl
              bg-blue-50
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-700
            "
          >
            {accidents.length.toLocaleString()}
            {" "}records
          </div>


          <button
            onClick={loadMapAccidents}
            disabled={loading}
            className="
              rounded-xl
              border
              border-blue-200
              bg-white
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-700
              hover:bg-blue-50
              disabled:opacity-50
            "
          >
            Refresh Map
          </button>

        </div>

      </div>


      {/* =====================================================
          ORIGINAL CARDS
      ===================================================== */}

      <div
        className="
          mb-5
          grid
          grid-cols-2
          gap-3
          md:grid-cols-4
        "
      >

        <div
          className="
            rounded-2xl
            bg-slate-50
            p-4
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            Mapped Records
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-slate-900
            "
          >
            {accidents.length.toLocaleString()}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-red-50
            p-4
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-red-500
            "
          >
            Fatal
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-red-700
            "
          >
            {fatalCount.toLocaleString()}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-orange-50
            p-4
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-orange-500
            "
          >
            Major
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-orange-700
            "
          >
            {majorCount.toLocaleString()}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-green-50
            p-4
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-green-500
            "
          >
            Minor
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-green-700
            "
          >
            {minorCount.toLocaleString()}
          </p>

        </div>

      </div>


      {/* =====================================================
          MAP
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
        "
      >

        {validAccidents.length > 0 ? (

          <MapContainer
            center={DEFAULT_CENTER}
            zoom={5}
            minZoom={4}
            maxZoom={18}
            scrollWheelZoom={true}
            zoomAnimation={true}
            fadeAnimation={false}
            markerZoomAnimation={false}
            preferCanvas={true}
            className="h-[550px] w-full"
          >

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            <AccidentMapLayer
              accidents={validAccidents}
            />

          </MapContainer>

        ) : (

          <div
            className="
              flex
              h-[500px]
              items-center
              justify-center
              bg-slate-50
            "
          >

            <div className="text-center">

              <p className="font-semibold text-slate-700">
                No accident locations available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                The database does not contain valid latitude
                and longitude values.
              </p>

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          gap-5
          text-sm
          text-slate-500
        "
      >

        <span className="font-semibold text-slate-700">
          Severity:
        </span>


        <span className="flex items-center gap-2">

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-red-500
            "
          />

          Fatal

        </span>


        <span className="flex items-center gap-2">

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-orange-500
            "
          />

          Major

        </span>


        <span className="flex items-center gap-2">

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-green-500
            "
          />

          Minor

        </span>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-2
          text-xs
          text-slate-400
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p>
          Geographic groups become more detailed as you zoom
          into individual cities and local accident locations.
        </p>


        {lastUpdated && (

          <p>
            Updated:{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>

        )}

      </div>


      {/* =====================================================
          MAP CSS
      ===================================================== */}

      <style>
        {`
          .roadsense-count-label {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: #ffffff !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            text-shadow:
              0 1px 2px rgba(0,0,0,0.65),
              0 0 3px rgba(0,0,0,0.45);
            pointer-events: none !important;
          }

          .roadsense-count-label::before {
            display: none !important;
          }

          /* ================================================
             HOVER DETAIL CARD
             ================================================ */

          .roadsense-hover-tooltip {
            background: rgba(255, 255, 255, 0.97) !important;
            border: 1px solid #dbeafe !important;
            border-radius: 12px !important;
            box-shadow:
              0 8px 25px rgba(15, 23, 42, 0.18) !important;
            color: #334155 !important;
            padding: 0 !important;
          }

          .roadsense-hover-tooltip::before {
            border-top-color: #ffffff !important;
          }

          .roadsense-hover-tooltip .leaflet-tooltip-content {
            margin: 0 !important;
          }

          .leaflet-popup-content-wrapper {
            border-radius: 14px;
          }

          .leaflet-popup-content {
            margin: 12px 14px;
          }
        `}
      </style>

    </section>

  );

}


export default AccidentMap;