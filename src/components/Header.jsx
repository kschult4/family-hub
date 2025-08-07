import WeatherWidget from "./WeatherWidget";
import MoonPhaseWidget from "./MoonPhaseWidget";
import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fullDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <header className="w-full bg-transparent shadow-none px-6 py-6 mb-6 flex justify-between items-center">
      {/* Left: Moon Phase */}
      <MoonPhaseWidget />

      {/* Center: Date + Time */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-xl font-medium text-[#5A3210] font-serif">
          {fullDate}
        </div>
        <div className="text-5xl font-bold text-[#5A3210] mt-1">
          {time}
        </div>
      </div>

      {/* Right: Weather */}
      <WeatherWidget />
    </header>
  );
}
