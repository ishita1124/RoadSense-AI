import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PredictionPage from "./pages/PredictionPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ExplorerPage from "./pages/ExplorerPage";


// ============================================================
// SCROLL TO TOP ON EVERY ROUTE CHANGE
// ============================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}


// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        {/* LANDING PAGE */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* FULL DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* RISK PREDICTION */}
        <Route
          path="/prediction"
          element={<PredictionPage />}
        />

        {/* ANALYTICS */}
        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        {/* ACCIDENT EXPLORER */}
        <Route
          path="/explorer"
          element={<ExplorerPage />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;