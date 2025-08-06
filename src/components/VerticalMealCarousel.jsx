import { useState } from "react";

const DAYS = [
  { name: "Monday", meal: "Lemon Herb Chicken with Rice", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Tuesday", meal: "Spaghetti Bolognese", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
  { name: "Wednesday", meal: "Grilled Salmon & Quinoa", img: "https://images.unsplash.com/photo-1464306076886-debede1a9b12?auto=format&fit=crop&w=400&q=80" },
  { name: "Thursday", meal: "Tacos with Black Beans", img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
  { name: "Friday", meal: "Homemade Pizza Night", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" },
  { name: "Saturday", meal: "Burgers & Sweet Potato Fries", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
  { name: "Sunday", meal: "Roast Chicken & Veggies", img: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80" },
];

function MealCard({ day, state }) {
  let base = "rounded-2xl shadow-lg transition-all duration-300 ease-in-out h-[400px] flex flex-col items-center justify-center bg-white overflow-hidden";
  let style = "";
  if (state === "today") {
    style = "scale-105 z-20 opacity-100 border-4 border-primary w-[1020px] max-w-[1200px] min-w-[960px]";
  } else if (state === "past") {
    style = "-translate-y-16 scale-95 opacity-60 z-10 w-[1020px]";
  } else if (state === "future") {
    style = "translate-y-16 scale-95 opacity-60 z-10 w-[1020px]";
  }
  return (
    <div className={`${base} ${style}`}>  
      <img src={day.img} alt={day.meal} className="w-full h-40 object-cover rounded-t-2xl" />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="text-lg font-bold text-[#5A3210] mb-2">{day.name}</div>
        <div className="text-xl font-serif text-gray-800">{day.meal}</div>
      </div>
    </div>
  );
}

function CardStackWrapper({ days, focusedIndex }) {
  return (
    <div className="flex flex-col items-center relative overflow-visible h-[600px] w-full" style={{ minWidth: 340 }}>
      {/* Render yesterday's card to the left of today's card */}
      {focusedIndex > 0 && (
        <div
          className="absolute left-1/2 top-1/2 z-0"
          style={{
            transform: "translate(-50%, -50%) translateX(-260px) scale(0.96)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        >
          <MealCard day={days[focusedIndex - 1]} state="yesterday" />
        </div>
      )}
      {/* Render tomorrow's card to the right of today's card */}
      {focusedIndex < days.length - 1 && (
        <div
          className="absolute left-1/2 top-1/2 z-0"
          style={{
            transform: "translate(-50%, -50%) translateX(260px) scale(0.96)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        >
          <MealCard day={days[focusedIndex + 1]} state="tomorrow" />
        </div>
      )}
      {/* Render today's card on top, fully centered */}
      <div
        className="absolute left-1/2 top-1/2 z-10"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <MealCard day={days[focusedIndex]} state="today" />
      </div>
    </div>
  );
}

function NavigationPanel({ onUp, onDown, onToday }) {
  return (
    <div className="flex flex-col gap-2 fixed right-6 top-1/2 transform -translate-y-1/2 z-30">
      <button onClick={onUp} className="bg-white rounded-full shadow p-2 text-xl">▲</button>
      <button onClick={onDown} className="bg-white rounded-full shadow p-2 text-xl">▼</button>
      <button onClick={onToday} className="bg-primary text-white rounded-full shadow p-2 text-sm font-bold">⬤ Today</button>
    </div>
  );
}

export default function VerticalMealCarousel() {
  const todayIdx = (() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  })();
  const [focusedIndex, setFocusedIndex] = useState(todayIdx);

  const handleUp = () => setFocusedIndex((i) => Math.max(0, i - 1));
  const handleDown = () => setFocusedIndex((i) => Math.min(DAYS.length - 1, i + 1));
  const goToToday = () => setFocusedIndex(todayIdx);

  return (
    <section className="relative flex justify-center items-center w-full">
      <CardStackWrapper days={DAYS} focusedIndex={focusedIndex} />
      <NavigationPanel onUp={handleUp} onDown={handleDown} onToday={goToToday} />
    </section>
  );
}
