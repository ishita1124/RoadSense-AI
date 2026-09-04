import { useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  RotateCcw,
  Database,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getAccidents } from "../services/api";


// ========================================
// CONSTANTS
// ========================================

const PAGE_SIZE = 20;

const API_BASE_URL = "http://127.0.0.1:8000";


// ========================================
// EMPTY FILTERS
// ========================================

const EMPTY_FILTERS = {
  city: "",
  state: "",
  severity: "",
  risk_band: "",
  cause: "",
  weather: "",
  road_type: "",
};


// ========================================
// COMPONENT
// ========================================

function AccidentExplorer() {

  const [accidents, setAccidents] = useState([]);

  // REAL DATABASE COUNT
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState(
    EMPTY_FILTERS
  );

  const [page, setPage] = useState(1);


  // ========================================
  // BUILD QUERY PARAMETERS
  // ========================================

  const buildParams = (activeFilters) => {

    const params = new URLSearchParams();

    Object.entries(activeFilters).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== "" &&
          String(value).trim().toLowerCase() !== "all"
        ) {

          params.append(
            key,
            String(value).trim()
          );

        }

      }
    );

    return params;

  };


  // ========================================
  // LOAD CURRENT PAGE + REAL DATABASE COUNT
  // ========================================

  const loadAccidents = async (
    customFilters = filters,
    requestedPage = page
  ) => {

    try {

      setLoading(true);
      setError("");


      // ------------------------------------
      // CURRENT PAGE DATA ONLY
      // ------------------------------------

      const offset =
        (requestedPage - 1) * PAGE_SIZE;


      const data = await getAccidents({

        ...customFilters,

        // Only fetch records required
        // for the current page.
        limit: PAGE_SIZE,

        offset: offset,

      });


      const records =
        Array.isArray(data)
          ? data
          : data?.accidents ||
            data?.data ||
            [];


      setAccidents(records);


      // ------------------------------------
      // REAL DATABASE COUNT
      // ------------------------------------

      const params =
        buildParams(customFilters);


      const countUrl =
        params.toString()
          ? `${API_BASE_URL}/api/accidents/counts?${params.toString()}`
          : `${API_BASE_URL}/api/accidents/counts`;


      const countResponse =
        await fetch(countUrl);


      if (!countResponse.ok) {

        throw new Error(
          "Unable to fetch total accident count."
        );

      }


      const countData =
        await countResponse.json();


      const realCount =
        Number(
          countData?.total_accidents ?? 0
        );


      setTotalRecords(realCount);

      setPage(requestedPage);


    } catch (err) {

      console.error(
        "Accident Explorer Error:",
        err
      );

      setError(
        "Unable to load accident records from the backend."
      );

      setAccidents([]);

      setTotalRecords(0);

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadAccidents(
      EMPTY_FILTERS,
      1
    );

  }, []);


  // ========================================
  // FILTER CHANGE
  // ========================================

  const handleFilterChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFilters((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // ========================================
  // APPLY FILTERS
  // ========================================

  const handleApplyFilters = () => {

    loadAccidents(
      filters,
      1
    );

  };


  // ========================================
  // RESET FILTERS
  // ========================================

  const handleReset = () => {

    setFilters(
      EMPTY_FILTERS
    );

    loadAccidents(
      EMPTY_FILTERS,
      1
    );

  };


  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {

    loadAccidents(
      filters,
      page
    );

  };


  // ========================================
  // PAGINATION
  // ========================================

  const totalPages =
    Math.ceil(
      totalRecords / PAGE_SIZE
    );


  const startRecord =
    totalRecords === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;


  const endRecord =
    Math.min(
      page * PAGE_SIZE,
      totalRecords
    );


  const goToPreviousPage = () => {

    const previousPage =
      Math.max(
        page - 1,
        1
      );


    if (previousPage !== page) {

      loadAccidents(
        filters,
        previousPage
      );

    }

  };


  const goToNextPage = () => {

    const nextPage =
      Math.min(
        page + 1,
        totalPages
      );


    if (nextPage !== page) {

      loadAccidents(
        filters,
        nextPage
      );

    }

  };


  // ========================================
  // BADGES
  // ========================================

  const getSeverityClass = (
    severity
  ) => {

    const value =
      String(
        severity || ""
      ).toLowerCase();


    if (value === "fatal") {

      return "bg-red-100 text-red-700";

    }


    if (value === "major") {

      return "bg-orange-100 text-orange-700";

    }


    return "bg-green-100 text-green-700";

  };


  const getRiskClass = (
    risk
  ) => {

    const value =
      String(
        risk || ""
      ).toLowerCase();


    if (
      value.includes("very high")
    ) {

      return "bg-red-100 text-red-700";

    }


    if (
      value.includes("high")
    ) {

      return "bg-orange-100 text-orange-700";

    }


    if (
      value.includes("medium")
    ) {

      return "bg-yellow-100 text-yellow-700";

    }


    return "bg-green-100 text-green-700";

  };


  const formatLabel = (
    value
  ) => {

    if (!value) return "—";


    return String(value)
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );

  };


  // ========================================
  // RENDER
  // ========================================

  return (

    <section
      id="explorer"
      className="mb-12"
    >

      {/* ==================================
          HEADER
      ================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <div className="rounded-xl bg-blue-100 p-2 text-blue-600">

              <Database size={20} />

            </div>

            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">

              Data Explorer

            </span>

          </div>


          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">

            Accident Records

          </h2>


          <p className="mt-1 max-w-2xl text-slate-500">

            Explore and filter accident records stored in
            the RoadSense AI database.

          </p>

        </div>


        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ==================================
          FILTER PANEL
      ================================== */}

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

        <div className="mb-5 flex items-center gap-2">

          <Filter
            size={19}
            className="text-blue-600"
          />

          <h3 className="font-bold text-slate-900">

            Filter Accident Records

          </h3>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


          {/* CITY */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              City

            </label>

            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Cities
              </option>

              <option value="Pune">
                Pune
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

              <option value="Delhi">
                Delhi
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

              <option value="Hyderabad">
                Hyderabad
              </option>

              <option value="Chennai">
                Chennai
              </option>

              <option value="Kolkata">
                Kolkata
              </option>

              <option value="Chandigarh">
                Chandigarh
              </option>

            </select>

          </div>


          {/* STATE */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              State

            </label>

            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All States
              </option>

              <option value="Maharashtra">
                Maharashtra
              </option>

              <option value="Delhi">
                Delhi
              </option>

              <option value="Karnataka">
                Karnataka
              </option>

              <option value="Telangana">
                Telangana
              </option>

              <option value="Tamil Nadu">
                Tamil Nadu
              </option>

              <option value="West Bengal">
                West Bengal
              </option>

              <option value="Punjab">
                Punjab
              </option>

            </select>

          </div>


          {/* SEVERITY */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              Severity

            </label>

            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Severities
              </option>

              <option value="fatal">
                Fatal
              </option>

              <option value="major">
                Major
              </option>

              <option value="minor">
                Minor
              </option>

            </select>

          </div>


          {/* RISK */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              Risk Band

            </label>

            <select
              name="risk_band"
              value={filters.risk_band}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Risk Bands
              </option>

              <option value="Very High">
                Very High
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>


          {/* CAUSE */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              Cause

            </label>

            <select
              name="cause"
              value={filters.cause}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Causes
              </option>

              <option value="distraction">
                Driver Distraction
              </option>

              <option value="speeding">
                Speeding
              </option>

              <option value="drunk_driving">
                Drunk Driving
              </option>

              <option value="weather">
                Weather Conditions
              </option>

              <option value="poor_road">
                Poor Road Conditions
              </option>

              <option value="mechanical_failure">
                Mechanical Failure
              </option>

            </select>

          </div>


          {/* WEATHER */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              Weather

            </label>

            <select
              name="weather"
              value={filters.weather}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Weather
              </option>

              <option value="clear">
                Clear
              </option>

              <option value="cloudy">
                Cloudy
              </option>

              <option value="rain">
                Rain
              </option>

              <option value="fog">
                Fog
              </option>

              <option value="storm">
                Storm
              </option>

            </select>

          </div>


          {/* ROAD TYPE */}

          <div>

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">

              Road Type
            </label>

            <select
              name="road_type"
              value={filters.road_type}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            >

              <option value="">
                All Road Types
              </option>

              <option value="urban">
                Urban
              </option>

              <option value="highway">
                Highway
              </option>

              <option value="rural">
                Rural
              </option>

              <option value="intersection">
                Intersection
              </option>

            </select>

          </div>


          {/* ACTIONS */}

          <div className="flex items-end gap-2">

            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >

              <Search size={16} />

              Apply Filters

            </button>


            <button
              onClick={handleReset}
              title="Reset filters"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
            >

              <RotateCcw size={17} />

            </button>

          </div>

        </div>

      </div>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

          <div className="flex items-center gap-3">

            <AlertTriangle size={22} />

            <div>

              <h3 className="font-bold">
                Unable to Load Records
              </h3>

              <p className="text-sm">
                {error}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ==================================
          REAL DATABASE COUNT
      ================================== */}

      {!error && (

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Database size={16} />

            <span>

              Total database records:{" "}

              <strong className="text-slate-800">

                {totalRecords.toLocaleString()}

              </strong>

            </span>

          </div>


          {filters.city ||
          filters.state ||
          filters.severity ||
          filters.risk_band ||
          filters.cause ||
          filters.weather ||
          filters.road_type ? (

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">

              Filters Applied

            </span>

          ) : null}

        </div>

      )}


      {/* ==================================
          TABLE
      ================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center">

            <div className="text-center">

              <RefreshCw
                size={30}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />

              <p className="font-semibold text-slate-700">

                Loading accident records...

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Fetching data from RoadSense AI database.

              </p>

            </div>

          </div>

        ) : accidents.length === 0 ? (

          <div className="flex min-h-[350px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">

                <Search size={25} />

              </div>

              <h3 className="font-bold text-slate-800">

                No Accident Records Found

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                Try changing or clearing your filters.

              </p>

            </div>

          </div>

        ) : (

          <>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      ID
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Severity
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cause
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Risk Score
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Risk Band
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {accidents.map(
                    (accident) => (

                      <tr
                        key={
                          accident.accident_id
                        }
                        className="border-b border-slate-100 transition hover:bg-blue-50/40"
                      >

                        {/* ID */}

                        <td className="px-5 py-4">

                          <span className="font-mono text-sm font-semibold text-slate-600">

                            #{accident.accident_id}

                          </span>

                        </td>


                        {/* LOCATION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <MapPin
                              size={16}
                              className="text-blue-500"
                            />

                            <div>

                              <p className="font-semibold text-slate-800">

                                {accident.city}

                              </p>

                              <p className="text-xs text-slate-500">

                                {accident.state}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4">

                          <p className="text-sm font-medium text-slate-700">

                            {accident.date || "—"}

                          </p>

                          <p className="text-xs text-slate-400">

                            {accident.time || "—"}

                          </p>

                        </td>


                        {/* SEVERITY */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${getSeverityClass(
                              accident.accident_severity
                            )}`}
                          >

                            {String(
                              accident.accident_severity || ""
                            ).toLowerCase() === "fatal" && (

                              <AlertTriangle
                                size={12}
                              />

                            )}

                            {formatLabel(
                              accident.accident_severity
                            )}

                          </span>

                        </td>


                        {/* CAUSE */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">

                            {formatLabel(
                              accident.cause
                            )}

                          </span>

                        </td>


                        {/* RISK SCORE */}

                        <td className="px-5 py-4">

                          <span className="font-semibold text-slate-800">

                            {Number(
                              accident.risk_score || 0
                            ).toFixed(2)}

                          </span>

                        </td>


                        {/* RISK BAND */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getRiskClass(
                              accident.risk_band
                            )}`}
                          >

                            <ShieldCheck
                              size={12}
                            />

                            {formatLabel(
                              accident.risk_band
                            )}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* ==================================
                PAGINATION
            ================================== */}

            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row">

              <p className="text-sm text-slate-500">

                Showing{" "}

                <strong className="text-slate-700">

                  {startRecord}

                </strong>{" "}

                –{" "}

                <strong className="text-slate-700">

                  {endRecord}

                </strong>{" "}

                of{" "}

                <strong className="text-slate-700">

                  {totalRecords.toLocaleString()}

                </strong>

              </p>


              <div className="flex items-center gap-2">

                <button
                  onClick={goToPreviousPage}
                  disabled={
                    page === 1 ||
                    loading
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <ChevronLeft size={16} />

                  Previous

                </button>


                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">

                  {page} / {totalPages || 1}

                </span>


                <button
                  onClick={goToNextPage}
                  disabled={
                    page >= totalPages ||
                    loading
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  Next

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>

          </>

        )}

      </div>

    </section>

  );

}

export default AccidentExplorer;