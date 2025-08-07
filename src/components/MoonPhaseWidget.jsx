import { useState, useEffect } from "react";

export default function MoonPhaseWidget() {
  const [moonPhase, setMoonPhase] = useState(null);

  useEffect(() => {
    const calculateMoonPhase = () => {
      const today = new Date();
      
      // Known new moon date (Jan 17, 2025)
      const knownNewMoon = new Date('2025-01-17');
      const lunarCycleLength = 29.53058867; // Average lunar cycle in days
      
      // Calculate days since known new moon
      const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
      
      // Calculate current position in lunar cycle
      const cyclePosition = ((daysSinceNewMoon % lunarCycleLength) + lunarCycleLength) % lunarCycleLength;
      
      // Determine moon phase based on cycle position
      if (cyclePosition < 1.84566) return { name: 'New Moon', emoji: '🌑' };
      else if (cyclePosition < 5.53699) return { name: 'Waxing Crescent', emoji: '🌒' };
      else if (cyclePosition < 9.22831) return { name: 'First Quarter', emoji: '🌓' };
      else if (cyclePosition < 12.91963) return { name: 'Waxing Gibbous', emoji: '🌔' };
      else if (cyclePosition < 16.61096) return { name: 'Full Moon', emoji: '🌕' };
      else if (cyclePosition < 20.30228) return { name: 'Waning Gibbous', emoji: '🌖' };
      else if (cyclePosition < 23.99361) return { name: 'Last Quarter', emoji: '🌗' };
      else return { name: 'Waning Crescent', emoji: '🌘' };
    };

    setMoonPhase(calculateMoonPhase());
  }, []);

  if (!moonPhase) return <div className="w-12" />;

  return (
    <div className="flex items-center gap-2 text-3xl font-bold text-[#5A3210]">
      <span className="text-4xl">{moonPhase.emoji}</span>
    </div>
  );
}