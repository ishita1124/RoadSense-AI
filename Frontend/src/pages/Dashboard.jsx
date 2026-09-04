import { useEffect, useRef, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Car,
  ShieldCheck,
  MapPin,
  Cloud,
  Route,
  Clock,
  RefreshCw,
  BarChart3,
  Database,
  TrendingUp,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import PredictionForm from "../components/PredictionForm";
import AccidentExplorer from "../components/AccidentExplorer";
import AccidentMap from "../components/AccidentMap";

import {
  getSummary,
  getAccidentsByCity,
  getAccidentsByState,
  getAccidentsByCause,
  getAccidentsBySeverity,
  getAccidentsByWeather,
  getAccidentsByRoadType,
  getAccidentsByTimePeriod,
} from "../services/api";


// ======================================================
// CONSTANTS
// ======================================================

const CHART_COLORS = [
  "#2563eb",
  "#38bdf8",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#64748b",
];


// ======================================================
// HELPERS
// ======================================================

const formatLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};


const convertToChartData = (data) => {
  if (!data) return [];

  if (!Array.isArray(data)) {
    if (typeof data === "object") {
      return Object.entries(data).map(([name, value]) => ({
        name: formatLabel(name),
        value:
          typeof value === "number"
            ? value
            : Number(value) || 0,
      }));
    }

    return [];
  }

  return data.map((item) => {
    const keys = Object.keys(item);

    if (
      item.city !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.city),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.state !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.state),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.cause !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.cause),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.severity !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.severity),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.weather !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.weather),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.road_type !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.road_type),
        value: Number(item.accident_count) || 0,
      };
    }

    if (
      item.time_period !== undefined &&
      item.accident_count !== undefined
    ) {
      return {
        name: formatLabel(item.time_period),
        value: Number(item.accident_count) || 0,
      };
    }

    if (keys.length >= 2) {
      return {
        name: formatLabel(item[keys[0]]),
        value: Number(item[keys[1]]) || 0,
      };
    }

    return {
      name: "Unknown",
      value: 0,
    };
  });
};


// ======================================================
// TOOLTIP
// ======================================================

const CustomTooltip = ({ active, payload }) => {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">
        {payload[0].payload.name}
      </p>

      <p className="mt-1 text-sm text-blue-600">
        Accidents:{" "}
        <strong>
          {Number(
            payload[0].value || 0
          ).toLocaleString()}
        </strong>
      </p>
    </div>
  );
};


// ======================================================
// SCROLL REVEAL
// ======================================================

function ScrollReveal({
  children,
  className = "",
}) {
  const ref = useRef(null);

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);

            observer.unobserve(element);
          }
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -50px 0px",
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        ${className}
        transition-all
        duration-700
        ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }
      `}
    >
      {children}
    </div>
  );
}


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  const [summary, setSummary] =
    useState(null);

  const [cityData, setCityData] =
    useState([]);

  const [stateData, setStateData] =
    useState([]);

  const [causeData, setCauseData] =
    useState([]);

  const [severityData, setSeverityData] =
    useState([]);

  const [weatherData, setWeatherData] =
    useState([]);

  const [roadTypeData, setRoadTypeData] =
    useState([]);

  const [timeData, setTimeData] =
    useState([]);

  const [
    loadingAnalytics,
    setLoadingAnalytics,
  ] = useState(true);

  const [
    analyticsError,
    setAnalyticsError,
  ] = useState("");


  // ==================================================
  // LOAD ANALYTICS
  // ==================================================

  const loadAnalytics = async () => {

    try {

      setLoadingAnalytics(true);

      setAnalyticsError("");

      const [
        summaryResponse,
        cityResponse,
        stateResponse,
        causeResponse,
        severityResponse,
        weatherResponse,
        roadResponse,
        timeResponse,
      ] = await Promise.all([

        getSummary(),

        getAccidentsByCity(),

        getAccidentsByState(),

        getAccidentsByCause(),

        getAccidentsBySeverity(),

        getAccidentsByWeather(),

        getAccidentsByRoadType(),

        getAccidentsByTimePeriod(),

      ]);


      console.log(
        "RoadSense Analytics:",
        {
          summaryResponse,
          cityResponse,
          stateResponse,
          causeResponse,
          severityResponse,
          weatherResponse,
          roadResponse,
          timeResponse,
        }
      );


      setSummary(
        summaryResponse
      );

      setCityData(
        convertToChartData(
          cityResponse
        )
      );

      setStateData(
        convertToChartData(
          stateResponse
        )
      );

      setCauseData(
        convertToChartData(
          causeResponse
        )
      );

      setSeverityData(
        convertToChartData(
          severityResponse
        )
      );

      setWeatherData(
        convertToChartData(
          weatherResponse
        )
      );

      setRoadTypeData(
        convertToChartData(
          roadResponse
        )
      );

      setTimeData(
        convertToChartData(
          timeResponse
        )
      );

    } catch (error) {

      console.error(
        "Analytics loading failed:",
        error
      );

      setAnalyticsError(
        "Unable to load analytics data from the backend."
      );

    } finally {

      setLoadingAnalytics(false);

    }

  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    loadAnalytics();

  }, []);


  // ==================================================
  // SUMMARY
  // ==================================================

  const totalAccidents =
    summary?.total_accidents ??
    0;

  const fatalAccidents =
    summary?.fatal_accidents ??
    0;

  const majorAccidents =
    summary?.major_accidents ??
    0;

  const minorAccidents =
    summary?.minor_accidents ??
    0;

  const averageRisk =
    summary?.average_risk_score ??
    0;


  const fatalPercentage =
    totalAccidents
      ? (
          (fatalAccidents /
            totalAccidents) *
          100
        ).toFixed(1)
      : "0.0";


  const majorPercentage =
    totalAccidents
      ? (
          (majorAccidents /
            totalAccidents) *
          100
        ).toFixed(1)
      : "0.0";


  const minorPercentage =
    totalAccidents
      ? (
          (minorAccidents /
            totalAccidents) *
          100
        ).toFixed(1)
      : "0.0";


  // ==================================================
  // TOP CITIES
  // ==================================================

  const topCities =
    [...cityData]
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 8);


  // ==================================================
  // TOP STATES
  // ==================================================

  const topStates =
    [...stateData]
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 10);


  // ==================================================
  // SEVERITY TOTAL
  // ==================================================

  const severityTotal =
    severityData.reduce(
      (sum, item) =>
        sum +
        Number(
          item.value || 0
        ),
      0
    );


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div
      id="dashboard"
      className="
        min-h-screen
        bg-gradient-to-br
        from-sky-50
        via-white
        to-blue-100
      "
    >

      <Navbar />


      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* ==========================================
            HERO
        ========================================== */}

        <section className="mb-12">

          <div className="max-w-3xl">

            <div className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-blue-100
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-700
            ">

              <ShieldCheck size={16} />

              AI-Powered Road Safety Platform

            </div>


            <h1 className="
              text-4xl
              font-black
              tracking-tight
              text-slate-900
              md:text-5xl
            ">

              Predict.

              <span className="text-blue-600">
                {" "}Prevent.
              </span>

              <br />

              Protect.

            </h1>


            <p className="
              mt-4
              max-w-2xl
              text-lg
              leading-relaxed
              text-slate-600
            ">

              RoadSense AI analyzes road,
              traffic and environmental
              conditions to predict accident
              severity and identify high-risk
              situations.

            </p>

          </div>

        </section>


        {/* ==========================================
            ANALYTICS HEADER
        ========================================== */}

        <section
          id="analytics"
          className="mb-6"
        >

          <div className="
            flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-end
          ">

            <div>

              <div className="
                mb-2
                flex
                items-center
                gap-2
              ">

                <BarChart3
                  size={24}
                  className="text-blue-600"
                />

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-900
                ">

                  Accident Analytics

                </h2>

              </div>


              <p className="text-slate-500">

                Real-time insights from the
                RoadSense AI accident database.

              </p>

            </div>


            <button
              onClick={loadAnalytics}
              disabled={loadingAnalytics}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-blue-200
                bg-white
                px-4
                py-2.5
                font-semibold
                text-blue-700
                shadow-sm
                transition
                hover:bg-blue-50
                disabled:opacity-50
              "
            >

              <RefreshCw
                size={16}
                className={
                  loadingAnalytics
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Data

            </button>

          </div>

        </section>


        {/* ==========================================
            KPI CARDS
        ========================================== */}

        <section
          id="statistics"
          className="
            mb-10
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <StatCard
            title="Total Accidents"
            value={Number(
              totalAccidents
            ).toLocaleString()}
            subtitle="Database records"
            icon={Car}
          />


          <StatCard
            title="Fatal Accidents"
            value={Number(
              fatalAccidents
            ).toLocaleString()}
            subtitle={`${fatalPercentage}% of total`}
            icon={AlertTriangle}
          />


          <StatCard
            title="Major Accidents"
            value={Number(
              majorAccidents
            ).toLocaleString()}
            subtitle={`${majorPercentage}% of total`}
            icon={Activity}
          />


          <StatCard
            title="Average Risk"
            value={`${(
              Number(averageRisk) *
              100
            ).toFixed(1)}%`}
            subtitle="Dataset risk score"
            icon={ShieldCheck}
          />

        </section>


        {/* ==========================================
            QUICK INSIGHT
        ========================================== */}

        {!loadingAnalytics &&
          !analyticsError &&
          totalAccidents > 0 && (

          <section className="mb-10">

            <div className="
              rounded-3xl
              border
              border-blue-100
              bg-gradient-to-r
              from-blue-600
              to-sky-500
              p-6
              text-white
              shadow-lg
            ">

              <div className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
              ">

                <div className="
                  flex
                  items-start
                  gap-4
                ">

                  <div className="
                    rounded-2xl
                    bg-white/15
                    p-3
                  ">

                    <TrendingUp size={26} />

                  </div>


                  <div>

                    <p className="
                      text-sm
                      font-semibold
                      text-blue-100
                    ">

                      DATASET OVERVIEW

                    </p>


                    <h3 className="
                      mt-1
                      text-xl
                      font-bold
                    ">

                      Road accident intelligence at a glance

                    </h3>


                    <p className="
                      mt-1
                      max-w-2xl
                      text-sm
                      leading-relaxed
                      text-blue-50
                    ">

                      The database contains{" "}

                      <strong>
                        {Number(
                          totalAccidents
                        ).toLocaleString()}
                      </strong>

                      {" "}accident records,
                      with{" "}

                      <strong>
                        {fatalPercentage}%
                      </strong>

                      {" "}classified as fatal
                      and{" "}

                      <strong>
                        {majorPercentage}%
                      </strong>

                      {" "}classified as major.

                    </p>

                  </div>

                </div>


                <div className="flex gap-3">

                  <div className="
                    rounded-2xl
                    bg-white/10
                    px-4
                    py-3
                    text-center
                  ">

                    <p className="
                      text-2xl
                      font-black
                    ">

                      {minorPercentage}%

                    </p>


                    <p className="
                      text-xs
                      text-blue-100
                    ">

                      Minor

                    </p>

                  </div>


                  <div className="
                    rounded-2xl
                    bg-white/10
                    px-4
                    py-3
                    text-center
                  ">

                    <p className="
                      text-2xl
                      font-black
                    ">

                      {(
                        Number(
                          averageRisk
                        ) * 100
                      ).toFixed(1)}%

                    </p>


                    <p className="
                      text-xs
                      text-blue-100
                    ">

                      Avg Risk

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {analyticsError && (

          <div className="
            mb-8
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-red-700
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <AlertTriangle size={22} />

              <div>

                <h3 className="font-bold">
                  Analytics Connection Error
                </h3>

                <p className="text-sm">
                  {analyticsError}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            LOADING
        ========================================== */}

        {loadingAnalytics && (

          <div className="
            mb-10
            rounded-3xl
            bg-white
            p-12
            text-center
            shadow-sm
            ring-1
            ring-slate-200
          ">

            <RefreshCw
              size={30}
              className="
                mx-auto
                mb-4
                animate-spin
                text-blue-600
              "
            />


            <h3 className="
              font-bold
              text-slate-800
            ">

              Loading Analytics

            </h3>


            <p className="
              mt-1
              text-sm
              text-slate-500
            ">

              Fetching accident intelligence
              from the database...

            </p>

          </div>

        )}


        {/* ==========================================
            CHARTS
        ========================================== */}

        {!loadingAnalytics &&
          !analyticsError && (

          <>


            {/* ======================================
                SEVERITY + CITY
            ====================================== */}

            <section className="
              mb-6
              grid
              gap-6
              lg:grid-cols-2
            ">


              {/* ==================================
                  SEVERITY DONUT
              ================================== */}

              <ScrollReveal>

                <div className="
                  rounded-3xl
                  bg-white
                  p-6
                  shadow-sm
                  ring-1
                  ring-slate-200
                ">

                  <div className="
                    mb-5
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      rounded-xl
                      bg-red-50
                      p-2
                      text-red-600
                    ">

                      <AlertTriangle size={20} />

                    </div>


                    <div>

                      <h3 className="
                        font-bold
                        text-slate-900
                      ">

                        Accident Severity

                      </h3>


                      <p className="
                        text-sm
                        text-slate-500
                      ">

                        Distribution across severity levels

                      </p>

                    </div>

                  </div>


                  {severityData.length > 0 ? (

                    <div className="relative h-72">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <PieChart>

                          <Pie
                            data={severityData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={60}
                            paddingAngle={3}
                            isAnimationActive={true}
                            animationDuration={900}
                            animationBegin={100}
                            animationEasing="ease-out"
                          >

                            {severityData.map(
                              (
                                entry,
                                index
                              ) => (

                                <Cell
                                  key={`severity-${index}`}
                                  fill={
                                    entry.name.toLowerCase() ===
                                    "fatal"
                                      ? "#ef4444"
                                      : entry.name.toLowerCase() ===
                                        "major"
                                      ? "#f59e0b"
                                      : "#10b981"
                                  }
                                />

                              )
                            )}

                          </Pie>


                          <Tooltip
                            formatter={(
                              value
                            ) => [

                              Number(
                                value
                              ).toLocaleString(),

                              "Accidents",

                            ]}
                          />


                          <Legend />

                        </PieChart>

                      </ResponsiveContainer>


                      <div className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      ">

                        <div className="
                          mt-[-4px]
                          text-center
                        ">

                          <p className="
                            text-2xl
                            font-black
                            text-slate-800
                          ">

                            {severityTotal.toLocaleString()}

                          </p>


                          <p className="
                            text-xs
                            font-medium
                            text-slate-400
                          ">

                            Total

                          </p>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <EmptyChart />

                  )}

                </div>

              </ScrollReveal>


              {/* ==================================
                  CITY
              ================================== */}

              <div className="
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
              ">

                <div className="
                  mb-5
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    rounded-xl
                    bg-blue-50
                    p-2
                    text-blue-600
                  ">

                    <MapPin size={20} />

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      Top Accident Cities

                    </h3>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Cities with the highest recorded accidents

                    </p>

                  </div>

                </div>


                {topCities.length > 0 ? (

                  <div className="h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={topCities}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 0,
                          bottom: 25,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />


                        <XAxis
                          dataKey="name"
                          angle={-25}
                          textAnchor="end"
                          height={55}
                          tick={{
                            fontSize: 12,
                          }}
                        />


                        <YAxis
                          tick={{
                            fontSize: 12,
                          }}
                        />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Bar
                          dataKey="value"
                          fill="#2563eb"
                          name="Accidents"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                ) : (

                  <EmptyChart />

                )}

              </div>

            </section>


            {/* ======================================
                CAUSE + WEATHER
            ====================================== */}

            <section className="
              mb-6
              grid
              gap-6
              lg:grid-cols-2
            ">


              {/* CAUSE */}

              <div className="
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
              ">

                <div className="
                  mb-5
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    rounded-xl
                    bg-amber-50
                    p-2
                    text-amber-600
                  ">

                    <AlertTriangle size={20} />

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      Accidents by Cause

                    </h3>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Leading contributing factors

                    </p>

                  </div>

                </div>


                {causeData.length > 0 ? (

                  <div className="h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={causeData}
                        layout="vertical"
                        margin={{
                          left: 10,
                          right: 20,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />


                        <XAxis type="number" />


                        <YAxis
                          type="category"
                          dataKey="name"
                          width={125}
                          tick={{
                            fontSize: 11,
                          }}
                        />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Bar
                          dataKey="value"
                          fill="#f59e0b"
                          name="Accidents"
                          radius={[
                            0,
                            6,
                            6,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                ) : (

                  <EmptyChart />

                )}

              </div>


              {/* WEATHER */}

              <div className="
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
              ">

                <div className="
                  mb-5
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    rounded-xl
                    bg-sky-50
                    p-2
                    text-sky-600
                  ">

                    <Cloud size={20} />

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      Accidents by Weather

                    </h3>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Environmental conditions during accidents

                    </p>

                  </div>

                </div>


                {weatherData.length > 0 ? (

                  <div className="h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={weatherData}
                        margin={{
                          bottom: 15,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />


                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                          }}
                        />


                        <YAxis
                          tick={{
                            fontSize: 12,
                          }}
                        />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Bar
                          dataKey="value"
                          fill="#38bdf8"
                          name="Accidents"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                ) : (

                  <EmptyChart />

                )}

              </div>

            </section>


            {/* ======================================
                ROAD + TIME
            ====================================== */}

            <section className="
              mb-6
              grid
              gap-6
              lg:grid-cols-2
            ">


              {/* ROAD */}

              <div className="
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
              ">

                <div className="
                  mb-5
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    rounded-xl
                    bg-indigo-50
                    p-2
                    text-indigo-600
                  ">

                    <Route size={20} />

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      Accidents by Road Type

                    </h3>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Road environment distribution

                    </p>

                  </div>

                </div>


                {roadTypeData.length > 0 ? (

                  <div className="h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={roadTypeData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />


                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                          }}
                        />


                        <YAxis />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Bar
                          dataKey="value"
                          fill="#6366f1"
                          name="Accidents"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                ) : (

                  <EmptyChart />

                )}

              </div>


              {/* TIME */}

              <div className="
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                ring-1
                ring-slate-200
              ">

                <div className="
                  mb-5
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    rounded-xl
                    bg-violet-50
                    p-2
                    text-violet-600
                  ">

                    <Clock size={20} />

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      Accidents by Time Period

                    </h3>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      When accidents occur most frequently

                    </p>

                  </div>

                </div>


                {timeData.length > 0 ? (

                  <div className="h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={timeData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />


                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                          }}
                        />


                        <YAxis />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Bar
                          dataKey="value"
                          fill="#8b5cf6"
                          name="Accidents"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                ) : (

                  <EmptyChart />

                )}

              </div>

            </section>


            {/* ======================================
                STATE — SCROLL REVEAL + BAR ANIMATION
            ====================================== */}

            <ScrollReveal className="mb-12">

              <section>

                <div className="
                  rounded-3xl
                  bg-white
                  p-6
                  shadow-sm
                  ring-1
                  ring-slate-200
                ">

                  <div className="
                    mb-5
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      rounded-xl
                      bg-blue-50
                      p-2
                      text-blue-600
                    ">

                      <MapPin size={20} />

                    </div>


                    <div>

                      <h3 className="
                        font-bold
                        text-slate-900
                      ">

                        Accidents by State

                      </h3>


                      <p className="
                        text-sm
                        text-slate-500
                      ">

                        Regional accident distribution

                      </p>

                    </div>

                  </div>


                  {topStates.length > 0 ? (

                    <div className="h-80">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <BarChart
                          data={topStates}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 20,
                          }}
                        >

                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />


                          <XAxis
                            dataKey="name"
                            angle={-30}
                            textAnchor="end"
                            height={65}
                            tick={{
                              fontSize: 11,
                            }}
                          />


                          <YAxis />


                          <Tooltip
                            content={
                              <CustomTooltip />
                            }
                          />


                          <Bar
                            dataKey="value"
                            fill="#0ea5e9"
                            name="Accidents"
                            radius={[
                              6,
                              6,
                              0,
                              0,
                            ]}
                            isAnimationActive={true}
                            animationDuration={1000}
                            animationBegin={150}
                            animationEasing="ease-out"
                          />

                        </BarChart>

                      </ResponsiveContainer>

                    </div>

                  ) : (

                    <EmptyChart />

                  )}

                </div>

              </section>

            </ScrollReveal>

          </>

        )}


        {/* ==========================================
            ACCIDENT MAP
        ========================================== */}

        <section className="mb-12">

          <AccidentMap />

        </section>


        {/* ==========================================
            ACCIDENT EXPLORER
        ========================================== */}

        <AccidentExplorer />


        {/* ==========================================
            AI PREDICTION
        ========================================== */}

        <section
          id="prediction"
          className="mt-12"
        >

          <div className="mb-6">

            <div className="
              mb-2
              flex
              items-center
              gap-2
            ">

              <ShieldCheck
                size={24}
                className="text-blue-600"
              />


              <h2 className="
                text-2xl
                font-bold
                text-slate-900
              ">

                AI Accident Prediction

              </h2>

            </div>


            <p className="text-slate-500">

              Analyze a specific road situation
              using the trained RoadSense AI
              machine learning model.

            </p>

          </div>


          <PredictionForm />

        </section>

      </main>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="
        mt-16
        border-t
        border-slate-200
        bg-white/70
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-6
          py-6
          text-center
          text-sm
          text-slate-500
        ">

          RoadSense AI • AI-Powered Road Accident
          Prediction & Analytics

        </div>

      </footer>

    </div>

  );
}


// ======================================================
// EMPTY CHART
// ======================================================

function EmptyChart() {

  return (

    <div className="
      flex
      h-72
      items-center
      justify-center
    ">

      <div className="text-center">

        <div className="
          mx-auto
          mb-3
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-slate-100
          text-slate-400
        ">

          <Database size={22} />

        </div>


        <p className="
          font-semibold
          text-slate-600
        ">

          No data available

        </p>


        <p className="
          mt-1
          text-xs
          text-slate-400
        ">

          Analytics data could not be found.

        </p>

      </div>

    </div>

  );
}


export default Dashboard;