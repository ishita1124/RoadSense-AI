import {
  ShieldCheck,
  Activity,
  BarChart3,
  BrainCircuit,
  Database,
  Home,
} from "lucide-react";

import { Link, NavLink } from "react-router-dom";

function Navbar() {

  const navLinkClass = ({ isActive }) =>
    `group relative flex items-center gap-1.5 text-sm font-semibold transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  return (

    <nav className="
      sticky
      top-0
      z-50
      w-full
      border-b
      border-slate-200/80
      bg-white/90
      backdrop-blur-xl
      shadow-[0_4px_20px_rgba(30,80,140,0.05)]
    ">

      <div className="
        mx-auto
        flex
        h-[70px]
        max-w-7xl
        items-center
        justify-between
        px-5
        sm:px-6
        lg:px-8
      ">

        {/* =====================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <div className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-blue-600
            to-cyan-400
            text-white
            shadow-lg
            shadow-blue-500/20
          ">

            <ShieldCheck size={23} />

          </div>


          <div className="leading-tight">

            <div className="
              text-xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-blue-700
              via-cyan-500
              to-blue-600
              bg-clip-text
              text-transparent
            ">

              RoadSense AI

            </div>

            <div className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-slate-500
            ">

              Intelligent Road Safety

            </div>

          </div>

        </Link>


        {/* =====================================
            NAVIGATION
        ====================================== */}

        <div className="
          hidden
          items-center
          gap-7
          md:flex
        ">

          <NavLink
            to="/"
            className={navLinkClass}
          >

            <Home size={15} />

            Home

          </NavLink>


          <NavLink
            to="/prediction"
            className={navLinkClass}
          >

            <BrainCircuit size={15} />

            Prediction

          </NavLink>


          <NavLink
            to="/analytics"
            className={navLinkClass}
          >

            <BarChart3 size={15} />

            Analytics

          </NavLink>


          <NavLink
            to="/explorer"
            className={navLinkClass}
          >

            <Database size={15} />

            Explorer

          </NavLink>


          <NavLink
            to="/dashboard"
            className={navLinkClass}
          >

            Dashboard

          </NavLink>


          {/* AI STATUS */}

          <div className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-100
            bg-gradient-to-r
            from-blue-50
            to-cyan-50
            px-3.5
            py-2
            text-xs
            font-bold
            text-blue-700
          ">

            <Activity
              size={14}
              className="text-blue-600"
            />

            AI Model Active

          </div>

        </div>

      </div>

    </nav>

  );
}

export default Navbar;