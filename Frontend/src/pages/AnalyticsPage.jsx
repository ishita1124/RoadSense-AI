import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getAccidentsByCity,
  getAccidentsByState,
  getAccidentsByCause,
  getAccidentsByWeather,
  getAccidentsByRoadType,
  getAccidentsByTimePeriod,
} from "../services/api";


function AnalyticsPage() {

  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [causeData, setCauseData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [roadData, setRoadData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const formatData = (
    data,
    key
  ) => {

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => ({
      name: formatLabel(item[key]),
      value: Number(item.accident_count) || 0,
    }));

  };


  const loadAnalytics = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        cities,
        states,
        causes,
        weather,
        roads,
        times,
      ] = await Promise.all([

        getAccidentsByCity(),
        getAccidentsByState(),
        getAccidentsByCause(),
        getAccidentsByWeather(),
        getAccidentsByRoadType(),
        getAccidentsByTimePeriod(),

      ]);


      setCityData(
        formatData(cities, "city")
      );

      setStateData(
        formatData(states, "state")
      );

      setCauseData(
        formatData(causes, "cause")
      );

      setWeatherData(
        formatData(weather, "weather")
      );

      setRoadData(
        formatData(roads, "road_type")
      );

      setTimeData(
        formatData(times, "time_period")
      );

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load live analytics data."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadAnalytics();

  }, []);


  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-sky-50
      via-white
      to-blue-100
    ">

      <Navbar />


      <main className="
        mx-auto
        max-w-7xl
        px-5
        py-10
        sm:px-6
        lg:px-8
      ">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-800
            "
          >

            <ArrowLeft size={16} />

            Back to Home

          </Link>


          <div className="
            mt-6
            flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-end
          ">

            <div>

              <div className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-blue-50
                px-3
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-blue-600
              ">

                <BarChart3 size={14} />

                Data Intelligence

              </div>


              <h1 className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                text-slate-900
                sm:text-4xl
              ">

                Road Safety Analytics

              </h1>


              <p className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              ">

                Explore live accident patterns across
                locations, causes, weather, road types
                and time periods.

              </p>

            </div>


            <button
              onClick={loadAnalytics}
              disabled={loading}
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
                text-sm
                font-bold
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
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="
            mb-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-sm
            text-red-700
          ">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div className="
            flex
            min-h-[400px]
            items-center
            justify-center
            rounded-3xl
            border
            border-slate-200
            bg-white
          ">

            <div className="text-center">

              <RefreshCw
                size={30}
                className="
                  mx-auto
                  mb-3
                  animate-spin
                  text-blue-600
                "
              />

              <p className="
                font-bold
                text-slate-700
              ">

                Loading live analytics...

              </p>

              <p className="
                mt-1
                text-sm
                text-slate-500
              ">

                Fetching insights from RoadSense AI.

              </p>

            </div>

          </div>

        ) : (

          <div className="
            grid
            gap-5
            lg:grid-cols-2
          ">

            <AnalyticsCard
              title="Accidents by City"
              data={cityData}
            />

            <AnalyticsCard
              title="Accidents by State"
              data={stateData}
            />

            <AnalyticsCard
              title="Accidents by Cause"
              data={causeData}
            />

            <AnalyticsCard
              title="Accidents by Weather"
              data={weatherData}
            />

            <AnalyticsCard
              title="Accidents by Road Type"
              data={roadData}
            />

            <AnalyticsCard
              title="Accidents by Time Period"
              data={timeData}
            />

          </div>

        )}


        {/* FOOTNOTE */}

        <div className="
          mt-6
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-blue-100
          bg-white
          p-4
          text-sm
          text-slate-600
          shadow-sm
        ">

          <ShieldCheck
            size={20}
            className="text-blue-600"
          />

          Analytics are generated directly from the
          RoadSense AI accident database.

        </div>

      </main>


      <Footer />

    </div>

  );
}


/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
  title,
  data,
}) {

  return (

    <section className="
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
    ">

      <div className="
        mb-5
        flex
        items-center
        justify-between
      ">

        <h2 className="
          text-base
          font-black
          text-slate-900
        ">

          {title}

        </h2>


        <BarChart3
          size={19}
          className="text-blue-600"
        />

      </div>


      {data.length === 0 ? (

        <div className="
          flex
          h-64
          items-center
          justify-center
          text-sm
          text-slate-400
        ">

          No data available

        </div>

      ) : (

        <div className="h-[280px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 10,
                }}
                interval={0}
                angle={
                  data.length > 5
                    ? -25
                    : 0
                }
                textAnchor={
                  data.length > 5
                    ? "end"
                    : "middle"
                }
              />

              <YAxis
                tick={{
                  fontSize: 11,
                }}
              />

              <Tooltip />


              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

    </section>

  );
}


/* =========================================================
   HELPERS
========================================================= */

function formatLabel(value) {

  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

}


export default AnalyticsPage;