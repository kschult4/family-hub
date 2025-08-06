import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function WeatherWidget() {
  const [temp, setTemp] = useState(null);
  const [code, setCode] = useState(null);

  // Your real lat/lon
  const latitude = 37.471561;
  const longitude = -77.776657;

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`
    )
      .then(res => res.json())
      .then(data => {
        if (data?.current) {
          const celsius = data.current.temperature_2m;
          const fahrenheit = (celsius * 9) / 5 + 32;
          setTemp(Math.round(fahrenheit));
          setCode(data.current.weathercode);
        }
      })
      .catch((err) => {
        console.error("Weather fetch failed:", err);
      });
  }, []);

  // Map weather codes to icon names
  const iconMap = {
    0: "meteocons:day-clear",
    1: "meteocons:day-cloudy",
    2: "meteocons:cloudy",
    3: "meteocons:cloudy",
    45: "meteocons:cloud-fog",
    61: "meteocons:rain",
    71: "meteocons:snow",
    // Add more codes as needed
  };

  const icon = iconMap[code] || "meteocons:cloud";

  return (
    <div className="flex items-center gap-2 text-xl font-semibold text-text">
      {icon && <Icon icon={icon} width="28" />}
      {temp !== null ? <span>{temp}°F</span> : <span>--°F</span>}
    </div>
  );
}
