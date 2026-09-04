import { useEffect, useState } from "react";

function StatCard({ title, value, subtitle, icon: Icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric value while preserving percentage support
  const numericValue =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/,/g, "").replace("%", "")) || 0;

  const isPercentage =
    typeof value === "string" && value.includes("%");

  useEffect(() => {
    let animationFrame;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        numericValue * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    };

    setDisplayValue(0);

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [numericValue]);

  const formattedValue = isPercentage
    ? `${displayValue.toFixed(1)}%`
    : Math.round(displayValue).toLocaleString();

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-lg
        hover:shadow-blue-100/40
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3
            className="
              mt-2
              text-3xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            {formattedValue}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {Icon && (
          <div
            className="
              rounded-xl
              bg-blue-50
              p-3
              text-blue-600
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:bg-blue-100
            "
          >
            <Icon size={22} />
          </div>
        )}

      </div>
    </div>
  );
}

export default StatCard;