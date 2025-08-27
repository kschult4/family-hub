import WeatherWidget from "./WeatherWidget";
import MoonPhaseWidget from "./MoonPhaseWidget";
import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useMediaQuery";


export default function Header() {
  const [now, setNow] = useState(new Date());
  const isMobile = useIsMobile();

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
    <header className={`w-full bg-transparent shadow-none px-2 sm:px-6 py-3 sm:py-6 mb-3 sm:mb-6 relative flex justify-between items-center ${isMobile ? 'mt-5' : 'mt-20'}`}>
      {/* Left: Moon Phase */}
      <MoonPhaseWidget />

      {/* Center: Date + Time - Absolutely centered */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
        <div className="text-sm sm:text-2xl font-medium text-[#5A3210] font-serif">
          {fullDate}
        </div>
        <div className="text-3xl sm:text-6xl font-bold text-[#5A3210] mt-1">
          {time}
        </div>
      </div>

      {/* Right: Weather */}
      <WeatherWidget />
    </header>
  );
}
