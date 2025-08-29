import { useEffect, useState } from "react";
import LazyImage, { ImageSkeleton } from "./LazyImage";

export default function WeatherWidget() {
  const [temp, setTemp] = useState(null);
  const [code, setCode] = useState(null);

  const latitude = 37.471561;
  const longitude = -77.776657;

  useEffect(() => {
    // Use fallback data on GitHub Pages initially, then try to fetch real data
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      setTemp(72);
      setCode(1); // Partly cloudy
    }

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

  // Map weather codes to your SVG icon filenames
 const iconMap = {
  0: "clear.svg",
  1: "partlycloudy.svg",
  2: "cloudy.svg",
  3: "cloudy.svg",
  45: "fog.svg",
  48: "fog.svg",
  51: "rain.svg",
  53: "rain.svg",
  55: "rain.svg",
  56: "rain.svg",
  57: "rain.svg",
  61: "rain.svg",
  63: "rain.svg",
  65: "rain.svg",
  66: "rain.svg",
  67: "rain.svg",
  71: "snow.svg",
  73: "snow.svg",
  75: "snow.svg",
  77: "snow.svg",
  80: "rain.svg",
  81: "rain.svg",
  82: "thunderstorm.svg",
  85: "snow.svg",
  86: "snow.svg",
  95: "thunderstorm.svg",
  96: "thunderstorm.svg",
  99: "thunderstorm.svg",
};


  const iconFilename = iconMap[code] || "cloudy.svg";

  return (
    <div className="flex items-center gap-3 text-3xl font-bold text-[#5A3210]">
      <LazyImage
        src={`/weather/${iconFilename}`}
        alt={iconFilename.replace(".svg", "")}
        className="w-10 h-10 object-contain"
        style={{ filter: 'brightness(0) saturate(100%) invert(23%) sepia(63%) saturate(1027%) hue-rotate(20deg) brightness(94%) contrast(95%)' }}
        title={iconFilename.replace(".svg", "")}
        placeholder={<ImageSkeleton className="w-10 h-10" />}
      />
      {temp !== null ? <span>{temp}°F</span> : <span>--°F</span>}
    </div>
  );
}
