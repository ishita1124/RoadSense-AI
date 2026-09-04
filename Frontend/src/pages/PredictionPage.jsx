import {
  ArrowLeft,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PredictionForm from "../components/PredictionForm";

function PredictionPage() {

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

              <BrainCircuit size={14} />

              AI Risk Analysis

            </div>


            <h1 className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-slate-900
              sm:text-4xl
            ">

              AI Accident Prediction

            </h1>


            <p className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            ">

              Enter road, traffic and environmental
              conditions to receive an AI-powered accident
              severity and risk assessment.

            </p>

          </div>

        </div>


        {/* PREDICTION */}

        <div className="
          rounded-3xl
          border
          border-blue-100
          bg-white/60
          p-1
          shadow-xl
          shadow-blue-100/30
        ">

          <PredictionForm />

        </div>


        {/* TRUST */}

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

          <span>

            RoadSense AI uses its trained machine-learning
            model to evaluate the provided road conditions.

          </span>

        </div>

      </main>


      <Footer />

    </div>

  );
}

export default PredictionPage;