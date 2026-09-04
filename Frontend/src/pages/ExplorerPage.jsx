import {
  ArrowLeft,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import AccidentExplorer from "../components/AccidentExplorer";

function ExplorerPage() {

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


          <div className="mt-6">

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

              <Database size={14} />

              Data Explorer

            </div>


            <h1 className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-slate-900
              sm:text-4xl
            ">

              Accident Records

            </h1>


            <p className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            ">

              Explore and filter accident records stored
              in the RoadSense AI database.

            </p>

          </div>

        </div>


        {/* EXISTING EXPLORER */}

        <AccidentExplorer />


        {/* TRUST */}

        <div className="
          mt-2
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

          Records displayed here are fetched from the
          RoadSense AI backend database.

        </div>

      </main>


      <Footer />

    </div>

  );
}

export default ExplorerPage;