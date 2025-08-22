import { useState, useEffect } from "react";
import LazyImage, { ImageSkeleton } from "./LazyImage";

export default function MoonPhaseWidget() {
  const [moonPhase, setMoonPhase] = useState(null);

  useEffect(() => {
    const calculateMoonPhase = () => {
      const today = new Date();
      const knownNewMoon = new Date("2025-01-17");
      const lunarCycleLength = 29.53058867;
      const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
      const cyclePosition = ((daysSinceNewMoon % lunarCycleLength) + lunarCycleLength) % lunarCycleLength;

      if (cyclePosition < 1.84566) return { name: "New Moon", icon: "newmoon.svg" };
      else if (cyclePosition < 5.53699) return { name: "Waxing Crescent", icon: "waxingcrescent.svg" };
      else if (cyclePosition < 9.22831) return { name: "First Quarter", icon: "firstquarter.svg" };
      else if (cyclePosition < 12.91963) return { name: "Waxing Gibbous", icon: "waxinggibbous.svg" };
      else if (cyclePosition < 16.61096) return { name: "Full Moon", icon: "fullmoon.svg" };
      else if (cyclePosition < 20.30228) return { name: "Waning Gibbous", icon: "waninggibbous.svg" };
      else if (cyclePosition < 23.99361) return { name: "Last Quarter", icon: "lastquarter.svg" };
      else return { name: "Waning Crescent", icon: "waningcrescent.svg" };
    };

    setMoonPhase(calculateMoonPhase());
  }, []);

  if (!moonPhase) return <div className="w-12" />;

  return (
    <div className="flex items-center gap-2 text-3xl font-bold text-[#5A3210]">
      <LazyImage
        src={`/family-hub/moon/${moonPhase.icon}`}
        alt={moonPhase.name}
        title={moonPhase.name}
        className="w-10 h-10 object-contain"
        style={{ filter: 'brightness(0) saturate(100%) invert(23%) sepia(63%) saturate(1027%) hue-rotate(20deg) brightness(94%) contrast(95%)' }}
        placeholder={<ImageSkeleton className="w-10 h-10" />}
      />
    </div>
  );
}
