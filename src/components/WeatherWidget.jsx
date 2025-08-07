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

  // Map weather codes to emoji icons
  const emojiIconMap = {
    0: "☀️",     // Clear day
    1: "⛅",     // Partly cloudy
    2: "☁️",     // Cloudy
    3: "☁️",     // Overcast
    45: "🌫️",    // Fog
    48: "🌫️",    // Depositing rime fog
    51: "🌦️",    // Light drizzle
    53: "🌦️",    // Moderate drizzle
    55: "🌧️",    // Dense drizzle
    56: "🧊",    // Light freezing drizzle
    57: "🧊",    // Dense freezing drizzle
    61: "🌧️",    // Slight rain
    63: "🌧️",    // Moderate rain
    65: "🌧️",    // Heavy rain
    66: "🧊",    // Light freezing rain
    67: "🧊",    // Heavy freezing rain
    71: "❄️",    // Slight snow fall
    73: "❄️",    // Moderate snow fall
    75: "❄️",    // Heavy snow fall
    77: "❄️",    // Snow grains
    80: "🌦️",    // Slight rain showers
    81: "🌧️",    // Moderate rain showers
    82: "⛈️",    // Violent rain showers
    85: "❄️",    // Slight snow showers
    86: "❄️",    // Heavy snow showers
    95: "⛈️",    // Thunderstorm
    96: "⛈️",    // Thunderstorm with slight hail
    99: "⛈️",    // Thunderstorm with heavy hail
  };

  const emojiIcon = emojiIconMap[code] || "☁️";

  return (
    <div className="flex items-center gap-3 text-3xl font-bold text-[#5A3210]">
      {/* Use emoji icons directly for reliability */}
      <span className="text-4xl">{emojiIcon}</span>
      {temp !== null ? <span>{temp}°F</span> : <span>--°F</span>}
    </div>
  );
}
