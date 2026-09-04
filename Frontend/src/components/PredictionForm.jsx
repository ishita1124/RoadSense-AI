import { useState } from "react";
import {
  MapPin,
  Cloud,
  Eye,
  Car,
  AlertTriangle,
  Send,
  Calendar,
  Clock,
  Route,
  Gauge,
  Thermometer,
  Users,
  TrafficCone,
  ShieldCheck,
  RotateCcw,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import { predictAccident } from "../services/api";

// ============================================================
// CITY DATA
// ============================================================

const cityData = {
  Pune: {
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
  },
  Mumbai: {
    state: "Maharashtra",
    latitude: 19.076,
    longitude: 72.8777,
  },
  Delhi: {
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
  },
  Bangalore: {
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  Hyderabad: {
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
  },
  Chennai: {
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  Kolkata: {
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
  },
  Chandigarh: {
    state: "Punjab",
    latitude: 30.7333,
    longitude: 76.7794,
  },
};

// ============================================================
// INITIAL FORM
// ============================================================

const initialForm = {
  city: "Pune",
  state: "Maharashtra",

  latitude: 18.5204,
  longitude: 73.8567,

  date: "2025-08-23",
  time: "20:00",

  road_type: "urban",
  lanes: 4,
  traffic_signal: 1,

  weather: "clear",
  visibility: "high",
  temperature: 24,

  traffic_density: "medium",
  cause: "distraction",

  vehicles_involved: 2,
  casualties: 0,

  festival: "No",
};

// ============================================================
// HELPERS
// ============================================================

const formatLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getSeverityClass = (severity) => {
  const value = String(severity || "").toLowerCase();

  if (value === "fatal") return "severity-fatal";
  if (value === "major") return "severity-major";

  return "severity-minor";
};

const getRiskClass = (risk) => {
  if (!risk) return "";

  return String(risk)
    .toLowerCase()
    .replace(/\s+/g, "-");
};

// ============================================================
// PREDICTION FORM
// ============================================================

function PredictionForm() {
  const [formData, setFormData] = useState(initialForm);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      const selectedCity = cityData[value];

      setFormData((previous) => ({
        ...previous,
        city: value,
        state: selectedCity.state,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      }));

      return;
    }

    const numericFields = [
      "lanes",
      "traffic_signal",
      "temperature",
      "vehicles_involved",
      "casualties",
    ];

    setFormData((previous) => ({
      ...previous,
      [name]: numericFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const dateObject = new Date(
        `${formData.date}T${formData.time}`
      );

      const hour = dateObject.getHours();

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const day_of_week = dayNames[dateObject.getDay()];

      const is_weekend =
        day_of_week === "Saturday" ||
        day_of_week === "Sunday"
          ? 1
          : 0;

      const is_peak_hour =
        (hour >= 8 && hour <= 10) ||
        (hour >= 17 && hour <= 20)
          ? 1
          : 0;

      let time_period = "morning";

      if (hour >= 5 && hour < 12) {
        time_period = "morning";
      } else if (hour >= 12 && hour < 17) {
        time_period = "afternoon";
      } else if (hour >= 17 && hour < 21) {
        time_period = "evening";
      } else {
        time_period = "night";
      }

      const dateParts = formData.date.split("-");

      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);

      const quarter = Math.ceil(month / 3);

      const predictionData = {
        city: formData.city,
        state: formData.state,

        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),

        hour,
        day_of_week,
        is_weekend,

        road_type: formData.road_type,
        lanes: Number(formData.lanes),
        traffic_signal: Number(formData.traffic_signal),

        weather: formData.weather,
        visibility: formData.visibility,
        temperature: Number(formData.temperature),

        traffic_density: formData.traffic_density,
        cause: formData.cause,

        vehicles_involved: Number(
          formData.vehicles_involved
        ),

        casualties: Number(formData.casualties),

        is_peak_hour,

        festival: formData.festival,

        year,
        month,
        quarter,
        day,

        time_period,
      };

      console.log(
        "Sending prediction data:",
        predictionData
      );

      const data = await predictAccident(
        predictionData
      );

      setResult(data);

      setTimeout(() => {
        document
          .getElementById("prediction-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 100);
    } catch (err) {
      console.error("Prediction Error:", err);

      setError(
        err?.message ||
          "Unable to connect to the prediction server."
      );
    } finally {
      setLoading(false);
    }
  };

  const confidence =
    Number(result?.prediction?.confidence || 0) * 100;

  return (
    <section
      id="prediction"
      className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-16 md:py-20"
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-12 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold tracking-wide text-blue-700">
            <BrainCircuit size={17} />
            AI RISK ANALYSIS
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Predict Road Accident{" "}
            <span className="text-blue-600">
              Severity
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Enter the road, traffic and environmental
            conditions. RoadSense AI will analyze the
            information using its trained machine learning
            model.
          </p>

        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-100/40 ring-1 ring-slate-200 md:p-8">

            {/* FORM HEADER */}

            <div className="mb-8 flex items-start justify-between gap-4">

              <div>

                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <ShieldCheck size={21} />
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Accident Conditions
                  </h3>
                </div>

                <p className="text-sm text-slate-500">
                  Provide the details of the situation
                  you want to analyze.
                </p>

              </div>

              <div className="hidden rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 p-3 text-white shadow-md sm:block">
                <BrainCircuit size={25} />
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-600">
                  <MapPin size={17} />
                  Location
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="form-group">
                    <label>City</label>

                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      {Object.keys(cityData).map(
                        (city) => (
                          <option
                            key={city}
                            value={city}
                          >
                            {city}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>State</label>

                    <input
                      value={formData.state}
                      readOnly
                    />
                  </div>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="block text-xs font-semibold text-slate-400">
                      Latitude
                    </span>

                    <strong className="text-sm text-slate-700">
                      {Number(
                        formData.latitude
                      ).toFixed(4)}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="block text-xs font-semibold text-slate-400">
                      Longitude
                    </span>

                    <strong className="text-sm text-slate-700">
                      {Number(
                        formData.longitude
                      ).toFixed(4)}
                    </strong>
                  </div>

                </div>

              </div>

              {/* =================================================
                  DATE & TIME
              ================================================= */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-600">
                  <Calendar size={17} />
                  Date & Time
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="form-group">
                    <label>Date</label>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Clock
                        size={14}
                        className="mr-1 inline"
                      />
                      Time
                    </label>

                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>

                </div>

              </div>

              {/* =================================================
                  ROAD CONDITIONS
              ================================================= */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-600">
                  <Route size={17} />
                  Road Conditions
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="form-group">
                    <label>Road Type</label>

                    <select
                      name="road_type"
                      value={formData.road_type}
                      onChange={handleChange}
                    >
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

                  <div className="form-group">
                    <label>
                      <Route
                        size={14}
                        className="mr-1 inline"
                      />
                      Number of Lanes
                    </label>

                    <input
                      type="number"
                      name="lanes"
                      min="1"
                      max="10"
                      value={formData.lanes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <TrafficCone
                        size={14}
                        className="mr-1 inline"
                      />
                      Traffic Signal
                    </label>

                    <select
                      name="traffic_signal"
                      value={
                        formData.traffic_signal
                      }
                      onChange={handleChange}
                    >
                      <option value="1">
                        Present
                      </option>

                      <option value="0">
                        Not Present
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <Gauge
                        size={14}
                        className="mr-1 inline"
                      />
                      Traffic Density
                    </label>

                    <select
                      name="traffic_density"
                      value={
                        formData.traffic_density
                      }
                      onChange={handleChange}
                    >
                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>
                    </select>
                  </div>

                </div>

              </div>

              {/* =================================================
                  WEATHER
              ================================================= */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-600">
                  <Cloud size={17} />
                  Weather & Visibility
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="form-group">
                    <label>Weather</label>

                    <select
                      name="weather"
                      value={formData.weather}
                      onChange={handleChange}
                    >
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

                  <div className="form-group">
                    <label>
                      <Eye
                        size={14}
                        className="mr-1 inline"
                      />
                      Visibility
                    </label>

                    <select
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange}
                    >
                      <option value="high">
                        High
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="low">
                        Low
                      </option>
                    </select>
                  </div>

                </div>

                <div className="form-group mt-4">
                  <label>
                    <Thermometer
                      size={14}
                      className="mr-1 inline"
                    />
                    Temperature (°C)
                  </label>

                  <input
                    type="number"
                    name="temperature"
                    min="-10"
                    max="60"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* =================================================
                  ACCIDENT DETAILS
              ================================================= */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-600">
                  <AlertTriangle size={17} />
                  Accident Details
                </div>

                <div className="form-group">
                  <label>Primary Cause</label>

                  <select
                    name="cause"
                    value={formData.cause}
                    onChange={handleChange}
                  >
                    <option value="distraction">
                      Driver Distraction
                    </option>

                    <option value="weather">
                      Weather Conditions
                    </option>

                    <option value="speeding">
                      Speeding
                    </option>

                    <option value="drunk_driving">
                      Drunk Driving
                    </option>

                    <option value="poor_road">
                      Poor Road Conditions
                    </option>

                    <option value="mechanical_failure">
                      Mechanical Failure
                    </option>
                  </select>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div className="form-group">
                    <label>
                      <Car
                        size={14}
                        className="mr-1 inline"
                      />
                      Vehicles Involved
                    </label>

                    <input
                      type="number"
                      name="vehicles_involved"
                      min="1"
                      max="50"
                      value={
                        formData.vehicles_involved
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Users
                        size={14}
                        className="mr-1 inline"
                      />
                      Casualties
                    </label>

                    <input
                      type="number"
                      name="casualties"
                      min="0"
                      max="100"
                      value={formData.casualties}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="form-group mt-4">
                  <label>
                    Festival / Special Event
                  </label>

                  <select
                    name="festival"
                    value={formData.festival}
                    onChange={handleChange}
                  >
                    <option value="No">
                      No
                    </option>

                    <option value="Yes">
                      Yes
                    </option>
                  </select>
                </div>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">

                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw size={17} />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />

                  {loading
                    ? "Analyzing..."
                    : "Predict Accident Severity"}
                </button>

              </div>

            </form>

            {/* ERROR */}

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

                <AlertTriangle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <h3 className="font-bold">
                    Prediction Failed
                  </h3>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* =================================================
              RESULT PANEL
          ================================================= */}

          <div
            id="prediction-result"
            className="rounded-3xl bg-white p-6 shadow-xl shadow-blue-100/40 ring-1 ring-slate-200 md:p-8"
          >

            {/* =================================================
                EMPTY
            ================================================= */}

            {!result && !loading && (
              <div className="flex min-h-[600px] flex-col items-center justify-center text-center">

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600">
                  <ShieldCheck size={38} />
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  AI Prediction Ready
                </h3>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                  Complete the accident conditions and
                  click{" "}
                  <strong className="text-slate-700">
                    Predict Accident Severity
                  </strong>{" "}
                  to receive an AI-powered risk assessment.
                </p>

                <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">

                  {[
                    "Severity Classification",
                    "Risk Band",
                    "AI Confidence",
                    "Probability Analysis",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-left text-xs font-semibold text-slate-600"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-blue-500"
                      />
                      {feature}
                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="flex min-h-[600px] flex-col items-center justify-center text-center">

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  Analyzing Road Conditions
                </h3>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                  RoadSense AI is processing the provided
                  conditions using the trained machine
                  learning model.
                </p>

              </div>
            )}

            {/* =================================================
                RESULT
            ================================================= */}

            {result && !loading && (
              <div>

                {/* RESULT HEADER */}

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-black tracking-widest text-blue-600">
                      AI ANALYSIS COMPLETE
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      Prediction Results
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    MODEL ACTIVE
                  </div>

                </div>

                {/* SEVERITY */}

                <div
                  className={`rounded-3xl p-6 ${getSeverityClass(
                    result.prediction?.severity
                  )}`}
                >

                  <p className="text-xs font-black uppercase tracking-wider opacity-70">
                    Predicted Accident Severity
                  </p>

                  <h2 className="mt-2 text-4xl font-black">
                    {formatLabel(
                      result.prediction?.severity
                    )}
                  </h2>

                </div>

                {/* RISK + CONFIDENCE */}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Risk Band
                    </span>

                    <strong
                      className={`mt-2 block text-2xl font-black ${getRiskClass(
                        result.prediction?.risk_band
                      )}`}
                    >
                      {formatLabel(
                        result.prediction?.risk_band
                      )}
                    </strong>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      AI Confidence
                    </span>

                    <strong className="mt-2 block text-2xl font-black text-slate-900">
                      {confidence.toFixed(1)}%
                    </strong>

                  </div>

                </div>

                {/* CONFIDENCE */}

                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-sm font-bold text-slate-700">
                      Prediction Confidence
                    </span>

                    <strong className="text-sm font-black text-blue-600">
                      {confidence.toFixed(1)}%
                    </strong>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-700"
                      style={{
                        width: `${confidence}%`,
                      }}
                    />

                  </div>

                </div>

                {/* PROBABILITIES */}

                {result.probabilities && (
                  <div className="mt-6">

                    <h3 className="mb-4 text-base font-black text-slate-900">
                      Severity Probability
                    </h3>

                    <div className="space-y-4">

                      {Object.entries(
                        result.probabilities
                      ).map(
                        ([severity, probability]) => {

                          const percentage =
                            Number(probability) *
                            100;

                          return (
                            <div
                              key={severity}
                            >

                              <div className="mb-2 flex items-center justify-between">

                                <span className="text-sm font-semibold text-slate-600">
                                  {formatLabel(
                                    severity
                                  )}
                                </span>

                                <strong className="text-sm font-black text-slate-800">
                                  {percentage.toFixed(
                                    1
                                  )}
                                  %
                                </strong>

                              </div>

                              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                                <div
                                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

                {/* INPUT SUMMARY */}

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                  <h3 className="mb-4 text-base font-black text-slate-900">
                    Analysis Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Location
                      </span>

                      <strong className="text-sm text-slate-700">
                        {result.input?.city ||
                          formData.city}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Weather
                      </span>

                      <strong className="text-sm text-slate-700">
                        {formatLabel(
                          result.input?.weather ||
                            formData.weather
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Visibility
                      </span>

                      <strong className="text-sm text-slate-700">
                        {formatLabel(
                          result.input?.visibility ||
                            formData.visibility
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Traffic
                      </span>

                      <strong className="text-sm text-slate-700">
                        {formatLabel(
                          result.input
                            ?.traffic_density ||
                            formData.traffic_density
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Cause
                      </span>

                      <strong className="text-sm text-slate-700">
                        {formatLabel(
                          result.input?.cause ||
                            formData.cause
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        Vehicles
                      </span>

                      <strong className="text-sm text-slate-700">
                        {result.input
                          ?.vehicles_involved ??
                          formData.vehicles_involved}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* NEW ANALYSIS */}

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setError("");

                    document
                      .getElementById("prediction")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw size={17} />
                  New Analysis
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          LOCAL FORM STYLING
      ===================================================== */}

      <style>{`
        .form-group label {
          display: block;
          margin-bottom: 7px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #475569;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: #ffffff;
          padding: 0.7rem 0.8rem;
          font-size: 0.875rem;
          color: #334155;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
        }

        .form-group input[readonly] {
          background: #f8fafc;
          color: #64748b;
        }

        .severity-fatal {
          background: #fee2e2;
          color: #b91c1c;
        }

        .severity-major {
          background: #fef3c7;
          color: #b45309;
        }

        .severity-minor {
          background: #dcfce7;
          color: #15803d;
        }

        .risk-very-high,
        .risk-high {
          color: #dc2626;
        }

        .risk-medium {
          color: #d97706;
        }

        .risk-low {
          color: #16a34a;
        }
      `}</style>
    </section>
  );
}

export default PredictionForm;