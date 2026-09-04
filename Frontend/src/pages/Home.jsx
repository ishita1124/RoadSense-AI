import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUp,
  BrainCircuit,
  BarChart3,
  Database,
  ShieldCheck,
  MapPin,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function Home() {

  // ==========================================================
  // SCROLL TO TOP BUTTON
  // ==========================================================

  const [showScrollTop, setShowScrollTop] = useState(false);


  useEffect(() => {

    const handleScroll = () => {

      setShowScrollTop(window.scrollY > 300);

    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-sky-50
        via-white
        to-blue-100
        text-slate-900
      "
    >

      <Navbar />


      {/* ======================================================
          HERO
      ====================================================== */}

      <main>

        <section
          className="
            relative
            overflow-hidden
            border-b
            border-blue-100/70
            bg-gradient-to-br
            from-sky-50
            via-white
            to-blue-100
          "
        >

          {/* Background */}

          <div
            className="
              pointer-events-none
              absolute
              -right-40
              -top-40
              h-96
              w-96
              rounded-full
              bg-blue-300/15
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -left-40
              bottom-0
              h-80
              w-80
              rounded-full
              bg-cyan-200/15
              blur-3xl
            "
          />


          <div
            className="
              relative
              mx-auto
              grid
              min-h-[calc(100vh-70px)]
              max-w-7xl
              items-center
              gap-8
              px-5
              py-8
              sm:px-6
              lg:grid-cols-[1.05fr_0.95fr]
              lg:px-8
              lg:py-10
            "
          >

            {/* =================================================
                HERO LEFT
            ================================================= */}

            <div className="max-w-2xl">

              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-100
                  bg-white/90
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-700
                  shadow-sm
                "
              >

                <Activity size={14} />

                AI-Powered Road Safety Platform

              </div>


              <h1
                className="
                  text-4xl
                  font-black
                  leading-[1.05]
                  tracking-tight
                  text-slate-900
                  sm:text-5xl
                  lg:text-[58px]
                "
              >

                Predict.

                <span className="text-blue-600">
                  {" "}Prevent.
                </span>

                <br />

                Protect.

              </h1>


              <p
                className="
                  mt-5
                  max-w-xl
                  text-base
                  leading-7
                  text-slate-600
                  sm:text-lg
                "
              >

                RoadSense AI analyzes road, traffic and
                environmental conditions to predict accident
                severity and identify high-risk situations
                using machine learning.

              </p>


              {/* =================================================
                  CTA
              ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-3
                "
              >

                <Link
                  to="/prediction"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-blue-500
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-500/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                  "
                >

                  Try AI Prediction

                  <ArrowRight size={17} />

                </Link>


                <Link
                  to="/analytics"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-blue-200
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-blue-700
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-blue-50
                  "
                >

                  Explore Analytics

                </Link>

              </div>


              {/* =================================================
                  TRUST INDICATORS
              ================================================= */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-x-6
                  gap-y-3
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >

                <span className="flex items-center gap-2">

                  <ShieldCheck
                    size={15}
                    className="text-blue-600"
                  />

                  Machine Learning Powered

                </span>


                <span className="flex items-center gap-2">

                  <Database
                    size={15}
                    className="text-cyan-600"
                  />

                  Data-Driven Analytics

                </span>

              </div>

            </div>


            {/* =================================================
                HERO RIGHT
            ================================================= */}

            <div
              className="
                relative
                flex
                min-h-[320px]
                items-center
                justify-center
                lg:min-h-[400px]
              "
            >

              <div
                className="
                  absolute
                  h-[270px]
                  w-[270px]
                  rounded-full
                  bg-gradient-to-br
                  from-blue-100
                  via-white
                  to-cyan-100
                  shadow-[0_30px_80px_rgba(37,99,235,0.10)]
                  sm:h-[340px]
                  sm:w-[340px]
                "
              />


              {/* ROAD */}

              <div
                className="
                  relative
                  h-[235px]
                  w-[160px]
                  rotate-[32deg]
                  rounded-[80px]
                  bg-gradient-to-b
                  from-slate-700
                  to-slate-500
                  shadow-2xl
                  sm:h-[300px]
                  sm:w-[195px]
                "
              >

                <div
                  className="
                    absolute
                    left-1/2
                    top-5
                    h-[205px]
                    -translate-x-1/2
                    border-l-4
                    border-dashed
                    border-yellow-300
                    sm:h-[265px]
                  "
                />

              </div>


              {/* AI CARD */}

              <div
                className="
                  absolute
                  right-[5%]
                  top-[8%]
                  flex
                  w-48
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-blue-100
                  bg-white/95
                  p-4
                  shadow-xl
                  backdrop-blur
                  sm:right-[2%]
                  sm:w-56
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >

                  <BrainCircuit size={24} />

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-blue-600
                    "
                  >

                    AI Engine

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    Risk assessment active

                  </p>

                </div>

              </div>


              {/* RISK CARD */}

              <div
                className="
                  absolute
                  bottom-[7%]
                  left-[4%]
                  w-52
                  rounded-2xl
                  border
                  border-blue-100
                  bg-white/95
                  p-4
                  shadow-xl
                  backdrop-blur
                  sm:left-[1%]
                "
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-semibold text-slate-500">

                    Road Risk

                  </span>

                  <span
                    className="
                      rounded-full
                      bg-green-50
                      px-2
                      py-1
                      text-[10px]
                      font-bold
                      text-green-600
                    "
                  >

                    LIVE

                  </span>

                </div>


                <div
                  className="
                    mt-3
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  "
                >

                  <div
                    className="
                      h-full
                      w-[62%]
                      rounded-full
                      bg-gradient-to-r
                      from-blue-500
                      to-cyan-400
                    "
                  />

                </div>


                <p className="mt-2 text-xs text-slate-500">

                  Continuous accident-risk analysis

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            CAPABILITIES
        ====================================================== */}

        <section
          id="capabilities"
          className="
            mx-auto
            max-w-7xl
            scroll-mt-24
            px-5
            py-14
            sm:px-6
            lg:px-8
          "
        >

          <div className="text-center">

            <div
              className="
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
              "
            >

              <ShieldCheck size={14} />

              Capabilities

            </div>


            <h2
              className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                text-slate-900
              "
            >

              One Platform. Three Powerful Tools.

            </h2>


            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >

              Explore the core RoadSense AI capabilities
              designed for prediction, analysis and
              real accident-data exploration.

            </p>

          </div>


          <div
            className="
              mt-9
              grid
              gap-5
              md:grid-cols-3
            "
          >

            {/* CARD 1 */}

            <CapabilityCard
              icon={<BrainCircuit size={25} />}
              number="01"
              title="AI Accident Prediction"
              description="
                Analyze road, traffic and environmental
                conditions and receive an AI-powered
                accident severity and risk assessment.
              "
              button="Explore Now"
              to="/prediction"
              iconClass="bg-blue-50 text-blue-600"
              delay="0"
            />


            {/* CARD 2 */}

            <CapabilityCard
              icon={<BarChart3 size={25} />}
              number="02"
              title="Road Safety Analytics"
              description="
                Discover accident patterns across cities,
                states, causes, weather, road types and
                time periods through interactive analytics.
              "
              button="Explore Now"
              to="/analytics"
              iconClass="bg-cyan-50 text-cyan-600"
              delay="100"
            />


            {/* CARD 3 */}

            <CapabilityCard
              icon={<Database size={25} />}
              number="03"
              title="Accident Data Explorer"
              description="
                Browse real accident records, inspect
                severity and risk information, and explore
                database records through filters.
              "
              button="Explore Now"
              to="/explorer"
              iconClass="bg-indigo-50 text-indigo-600"
              delay="200"
            />

          </div>

        </section>


        {/* ======================================================
            ABOUT
        ====================================================== */}

        <section
          id="about"
          className="
            border-y
            border-blue-100
            bg-white/70
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-7xl
              items-center
              gap-10
              px-5
              py-14
              sm:px-6
              lg:grid-cols-2
              lg:px-8
            "
          >

            {/* ABOUT CONTENT */}

            <div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-sky-50
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-600
                "
              >

                About RoadSense AI

              </div>


              <h2
                className="
                  mt-4
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-900
                "
              >

                Turning accident data into

                <span className="text-blue-600">

                  {" "}safer decisions.

                </span>

              </h2>


              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-7
                  text-slate-600
                "
              >

                RoadSense AI combines machine learning
                prediction with accident analytics to help
                understand how road, traffic and environmental
                conditions influence accident severity.

              </p>


              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >

                <AboutPoint
                  icon={<BrainCircuit size={18} />}
                  title="AI Prediction"
                  text="Machine-learning based severity assessment."
                  delay="0"
                />

                <AboutPoint
                  icon={<BarChart3 size={18} />}
                  title="Live Analytics"
                  text="Database-driven road safety insights."
                  delay="100"
                />

                <AboutPoint
                  icon={<MapPin size={18} />}
                  title="Geographic View"
                  text="Explore accident locations and risk."
                  delay="150"
                />

                <AboutPoint
                  icon={<Database size={18} />}
                  title="Real Records"
                  text="Work with stored accident information."
                  delay="200"
                />

              </div>

            </div>


            {/* ABOUT VISUAL */}

            <div
              className="
                relative
                mx-auto
                flex
                h-[300px]
                w-full
                max-w-md
                items-center
                justify-center
                rounded-3xl
                border
                border-blue-100
                bg-gradient-to-br
                from-sky-50
                via-white
                to-blue-100
                shadow-xl
                shadow-blue-100/40
              "
            >

              <div
                className="
                  absolute
                  h-44
                  w-44
                  rounded-full
                  bg-blue-200/20
                  blur-2xl
                "
              />


              <div
                className="
                  relative
                  flex
                  h-32
                  w-32
                  items-center
                  justify-center
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-600
                  to-cyan-400
                  text-white
                  shadow-2xl
                  shadow-blue-500/20
                "
              >

                <BrainCircuit size={62} />

              </div>


              <div
                className="
                  absolute
                  right-6
                  top-7
                  rounded-xl
                  border
                  border-blue-100
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-blue-700
                  shadow-lg
                "
              >

                Predict

              </div>


              <div
                className="
                  absolute
                  bottom-7
                  left-6
                  rounded-xl
                  border
                  border-blue-100
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-blue-700
                  shadow-lg
                "
              >

                Analyze

              </div>


              <div
                className="
                  absolute
                  bottom-8
                  right-7
                  rounded-xl
                  border
                  border-blue-100
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-blue-700
                  shadow-lg
                "
              >

                Protect

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />


      {/* ======================================================
          SCROLL TO TOP
      ====================================================== */}

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`
          fixed
          bottom-7
          right-7
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          text-blue-600
          shadow-lg
          shadow-slate-300/30
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-300
          hover:bg-blue-50
          hover:shadow-xl
          ${
            showScrollTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }
        `}
      >

        <ArrowUp size={19} />

      </button>

    </div>

  );
}


/* =========================================================
   CAPABILITY CARD
========================================================= */

function CapabilityCard({
  icon,
  number,
  title,
  description,
  button,
  to,
  iconClass,
  delay,
}) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {

          setVisible(true);

          observer.disconnect();

        }

      },
      {
        threshold: 0.15,
      }
    );


    const element = document.getElementById(
      `capability-${number}`
    );


    if (element) {
      observer.observe(element);
    }


    return () => observer.disconnect();

  }, [number]);


  return (

    <div
      id={`capability-${number}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`
        group
        flex
        min-h-[300px]
        flex-col
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-700
        ease-out
        hover:-translate-y-1.5
        hover:border-blue-200
        hover:shadow-xl
        hover:shadow-blue-100/40
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }
      `}
    >

      <div className="flex items-center justify-between">

        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            ${iconClass}
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >

          {icon}

        </div>


        <span
          className="
            text-xs
            font-black
            tracking-widest
            text-slate-300
          "
        >

          {number}

        </span>

      </div>


      <h3
        className="
          mt-6
          text-xl
          font-black
          text-slate-900
        "
      >

        {title}

      </h3>


      <p
        className="
          mt-3
          text-sm
          leading-6
          text-slate-500
        "
      >

        {description}

      </p>


      <Link
        to={to}
        className="
          mt-auto
          flex
          items-center
          gap-1.5
          pt-6
          text-sm
          font-bold
          text-blue-600
          transition-all
          duration-300
          group-hover:gap-2.5
          group-hover:text-blue-700
        "
      >

        {button}

        <ChevronRight size={16} />

      </Link>

    </div>

  );
}


/* =========================================================
   ABOUT POINT
========================================================= */

function AboutPoint({
  icon,
  title,
  text,
  delay,
}) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {

          setVisible(true);

          observer.disconnect();

        }

      },
      {
        threshold: 0.2,
      }
    );


    const element = document.getElementById(
      `about-${title.replace(/\s+/g, "-").toLowerCase()}`
    );


    if (element) {
      observer.observe(element);
    }


    return () => observer.disconnect();

  }, [title]);


  return (

    <div
      id={`about-${title.replace(/\s+/g, "-").toLowerCase()}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`
        flex
        gap-3
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-700
        ease-out
        hover:-translate-y-1
        hover:border-blue-100
        hover:shadow-md
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }
      `}
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >

        {icon}

      </div>


      <div>

        <h4
          className="
            text-sm
            font-bold
            text-slate-800
          "
        >

          {title}

        </h4>


        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
          "
        >

          {text}

        </p>

      </div>

    </div>

  );
}


export default Home;