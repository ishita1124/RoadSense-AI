import {
  FaGithub,
  FaLinkedin,
  FaShieldAlt,
  FaHeart,
  FaRoad,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="relative w-full border-t border-sky-100 bg-white text-slate-700"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fcff 55%, #eef7ff 100%)",
      }}
    >

      {/* ============================================
          FOOTER CONTENT
      ============================================ */}

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ==========================================
              BRAND
          ========================================== */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >

              <div className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400
                text-white
                shadow-lg shadow-blue-500/20
                transition duration-300
                group-hover:-translate-y-1
              ">
                <FaRoad className="text-lg" />
              </div>

              <div className="text-2xl font-black">

                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                  RoadSense
                </span>{" "}

                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  AI
                </span>

              </div>

            </Link>


            <p className="
              mt-5
              max-w-lg
              text-sm
              leading-7
              text-slate-500
            ">

              An AI-powered road safety platform that analyzes
              accident patterns, predicts accident risk, and
              identifies high-risk locations to support safer
              roads and smarter cities.

            </p>


            {/* SOCIAL BUTTONS */}

            <div className="mt-6 flex items-center gap-3">

              <a
                href="https://github.com/ishita1124/RoadSense-AI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  border border-sky-200
                  bg-white
                  text-slate-500
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-blue-400
                  hover:bg-blue-50
                  hover:text-blue-600
                  hover:shadow-md
                "
              >
                <FaGithub className="text-lg" />
              </a>


              <a
                href="https://www.linkedin.com/in/ishita-bansal-18b86928b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BXzelyIEeRuy%2Fvdrb496nOg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  border border-sky-200
                  bg-white
                  text-slate-500
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-blue-400
                  hover:bg-blue-50
                  hover:text-blue-600
                  hover:shadow-md
                "
              >
                <FaLinkedin className="text-lg" />
              </a>

            </div>

          </div>


          {/* ==========================================
              QUICK LINKS
          ========================================== */}

          <div>

            <h3 className="
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-slate-800
            ">
              Quick Links
            </h3>


            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/"
                  className="text-slate-500 transition hover:translate-x-1 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/prediction"
                  className="text-slate-500 transition hover:translate-x-1 hover:text-blue-600"
                >
                  Risk Prediction
                </Link>
              </li>

              <li>
                <Link
                  to="/analytics"
                  className="text-slate-500 transition hover:translate-x-1 hover:text-blue-600"
                >
                  Analytics
                </Link>
              </li>

              <li>
                <Link
                  to="/explorer"
                  className="text-slate-500 transition hover:translate-x-1 hover:text-blue-600"
                >
                  Accident Records
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-500 transition hover:translate-x-1 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>

            </ul>

          </div>


          {/* ==========================================
              PLATFORM
          ========================================== */}

          <div>

            <h3 className="
              mb-5
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-slate-800
            ">
              Platform
            </h3>


            <div className="
              rounded-2xl
              border border-sky-100
              bg-white
              p-5
              shadow-[0_8px_30px_rgba(37,99,235,0.08)]
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_15px_35px_rgba(37,99,235,0.12)]
            ">

              <div className="flex items-center gap-3">

                <div className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                ">
                  <FaShieldAlt />
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    AI-Powered Safety
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Data-driven road insights
                  </p>

                </div>

              </div>


              <p className="
                mt-4
                text-xs
                leading-6
                text-slate-500
              ">
                Machine-learning based accident risk prediction
                and data analysis for smarter road safety decisions.
              </p>

            </div>

          </div>

        </div>


        {/* ============================================
            BOTTOM BAR
        ============================================ */}

        <div className="
          mt-10
          border-t border-sky-100
          pt-7
          flex flex-col
          items-center
          justify-between
          gap-3
          text-center
          sm:flex-row
          sm:text-left
        ">

          <p className="text-xs text-slate-400">

            © {new Date().getFullYear()}{" "}

            <span className="font-bold text-blue-600">
              RoadSense AI
            </span>

            {" "}• AI-Powered Road Safety Platform

          </p>


          <p className="
            flex
            items-center
            gap-1.5
            text-xs
            text-slate-400
          ">

            Built with

            <FaHeart className="text-red-500" />

            for safer roads and smarter cities

          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;