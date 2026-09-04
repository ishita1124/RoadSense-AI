import {
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Brain,
  Search,
  MapPin,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">

              <ShieldCheck size={23} />

            </div>

            <div>

              <h1 className="text-lg font-bold text-blue-900">
                RoadSense AI
              </h1>

              <p className="text-[11px] text-slate-500">
                Intelligent Road Safety
              </p>

            </div>

          </Link>


          <div className="hidden items-center gap-2 md:flex">

            <a
              href="#features"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              How It Works
            </a>

            <Link
              to="/dashboard"
              className="ml-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Dashboard
              <ArrowRight size={15} />
            </Link>

          </div>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="relative">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />


          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-20 lg:grid-cols-2 lg:pb-28 lg:pt-28">


            {/* LEFT CONTENT */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">

                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

                AI-Powered Road Safety Platform

              </div>


              <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-6xl">

                Predict.

                <span className="text-blue-600">
                  {" "}Prevent.
                </span>

                <br />

                Protect.

              </h1>


              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">

                RoadSense AI combines accident analytics,
                machine learning and risk intelligence to
                understand road conditions and predict
                accident severity.

              </p>


              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Explore Dashboard
                  <ArrowRight size={18} />
                </Link>


                <a
                  href="/dashboard#prediction"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600"
                >
                  Try AI Prediction
                  <Brain size={18} />
                </a>

              </div>


              {/* TRUST POINTS */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-emerald-500"
                  />
                  Data-driven insights
                </div>

                <div className="flex items-center gap-2">
                  <Activity
                    size={16}
                    className="text-blue-500"
                  />
                  ML-powered prediction
                </div>

              </div>

            </div>


            {/* RIGHT VISUAL */}

            <div className="relative">

              <div className="relative mx-auto max-w-lg">

                {/* Main visual card */}

                <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/80 p-5 shadow-2xl shadow-blue-200/50 backdrop-blur">

                  {/* Fake map/road visual */}

                  <div className="relative h-[390px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100">

                    {/* Road */}

                    <div className="absolute left-1/2 top-[-10%] h-[120%] w-32 -translate-x-1/2 rotate-[12deg] bg-slate-700/90 shadow-xl">

                      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 border-l-2 border-dashed border-white/70" />

                    </div>


                    {/* Location points */}

                    <div className="absolute left-[22%] top-[25%] flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300">

                      <MapPin size={19} />

                    </div>


                    <div className="absolute right-[18%] top-[55%] flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-200">

                      <AlertIcon />

                    </div>


                    <div className="absolute left-[30%] bottom-[18%] flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">

                      <ShieldCheck size={19} />

                    </div>


                    {/* Floating analytics card */}

                    <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur">

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-blue-50 p-2 text-blue-600">

                          <Activity size={18} />

                        </div>

                        <div>

                          <p className="text-xs text-slate-500">
                            Risk Status
                          </p>

                          <p className="font-bold text-emerald-600">
                            Monitoring
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Floating prediction card */}

                    <div className="absolute bottom-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur">

                      <p className="text-xs font-medium text-slate-500">
                        AI Risk Score
                      </p>

                      <div className="mt-1 flex items-end gap-2">

                        <span className="text-3xl font-black text-blue-600">
                          43.8%
                        </span>

                        <span className="mb-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
                          Medium
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Bottom metrics */}

                  <div className="grid grid-cols-3 gap-3 pt-5">

                    <MiniMetric
                      value="20K+"
                      label="Records"
                    />

                    <MiniMetric
                      value="3"
                      label="Severity Levels"
                    />

                    <MiniMetric
                      value="AI"
                      label="Prediction"
                    />

                  </div>

                </div>


                {/* Decorative glow */}

                <div className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-48 w-48 rounded-full bg-blue-300/30 blur-3xl" />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="border-y border-slate-200/70 bg-white/60 py-20"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Platform Capabilities
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
                Smarter insights for safer roads
              </h2>

              <p className="mt-4 text-slate-500">
                Explore the tools RoadSense AI provides for
                understanding and predicting road accident risk.
              </p>

            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-3">


              <FeatureCard
                icon={BarChart3}
                title="Accident Analytics"
                description="Explore accident patterns across severity, cities, states, causes, weather, road types and time periods."
              />


              <FeatureCard
                icon={Brain}
                title="AI Severity Prediction"
                description="Submit road and environmental conditions and let the trained machine learning model estimate accident severity."
              />


              <FeatureCard
                icon={Search}
                title="Accident Explorer"
                description="Search and filter accident records to investigate individual incidents and identify meaningful patterns."
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="py-20"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">


              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  How It Works
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
                  From road data to actionable intelligence
                </h2>

                <p className="mt-4 max-w-xl leading-relaxed text-slate-500">
                  RoadSense AI turns historical accident data into
                  useful insights and uses machine learning to
                  evaluate the severity of new road situations.
                </p>


                <div className="mt-8 space-y-5">

                  <ProcessStep
                    number="01"
                    title="Analyze historical data"
                    description="Accident records are organized across geographic, environmental, traffic and temporal dimensions."
                  />

                  <ProcessStep
                    number="02"
                    title="Discover risk patterns"
                    description="Analytics reveal where, when and under which conditions accidents occur most frequently."
                  />

                  <ProcessStep
                    number="03"
                    title="Predict accident severity"
                    description="The trained ML model evaluates a new road scenario and estimates its likely severity and risk band."
                  />

                </div>

              </div>


              {/* Intelligence card */}

              <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-sky-500 p-7 text-white shadow-xl shadow-blue-200">

                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium text-blue-100">
                        RoadSense Intelligence
                      </p>

                      <h3 className="mt-1 text-2xl font-black">
                        Risk Analysis
                      </h3>

                    </div>

                    <div className="rounded-xl bg-white/15 p-3">
                      <ShieldCheck size={25} />
                    </div>

                  </div>


                  <div className="mt-8 space-y-4">

                    <RiskRow
                      label="Traffic Conditions"
                      value="High"
                    />

                    <RiskRow
                      label="Visibility"
                      value="Low"
                    />

                    <RiskRow
                      label="Road Environment"
                      value="Urban"
                    />

                    <RiskRow
                      label="Predicted Risk"
                      value="Medium"
                    />

                  </div>


                  <Link
                    to="/dashboard"
                    className="mt-8 flex items-center justify-between rounded-xl bg-white px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
                  >

                    Open Full Dashboard

                    <ChevronRight size={18} />

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="px-6 pb-20">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 to-sky-500 px-8 py-12 text-center text-white shadow-xl shadow-blue-200 md:px-12">

            <h2 className="text-3xl font-black md:text-4xl">
              Build safer roads with better intelligence.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-blue-50">
              Explore accident patterns, investigate records and
              test the RoadSense AI severity prediction model.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Explore Dashboard
                <ArrowRight size={18} />
              </Link>

              <a
                href="/dashboard#prediction"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
              >
                Try AI Prediction
                <Brain size={18} />
              </a>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white/80">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-center text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:text-left">

          <div>

            <p className="font-bold text-slate-700">
              RoadSense AI
            </p>

            <p className="mt-1">
              AI-Powered Road Accident Prediction & Analytics
            </p>

          </div>

          <p>
            Intelligent insights for safer roads.
          </p>

        </div>

      </footer>

    </div>
  );
}


// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

        <Icon size={23} />

      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-relaxed text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-sm font-bold text-blue-600">

        Explore

        <ArrowRight
          size={15}
          className="transition group-hover:translate-x-1"
        />

      </div>

    </div>

  );
}


// ============================================================
// PROCESS STEP
// ============================================================

function ProcessStep({
  number,
  title,
  description,
}) {

  return (

    <div className="flex gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">

        {number}

      </div>

      <div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

      </div>

    </div>

  );
}


// ============================================================
// RISK ROW
// ============================================================

function RiskRow({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">

      <span className="text-sm text-blue-50">
        {label}
      </span>

      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
        {value}
      </span>

    </div>

  );
}


// ============================================================
// MINI METRIC
// ============================================================

function MiniMetric({
  value,
  label,
}) {

  return (

    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">

      <p className="text-lg font-black text-blue-600">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-slate-500">
        {label}
      </p>

    </div>

  );
}


// ============================================================
// ALERT ICON
// ============================================================

function AlertIcon() {

  return (

    <div className="flex items-center justify-center">

      <Activity size={19} />

    </div>

  );
}


export default LandingPage;