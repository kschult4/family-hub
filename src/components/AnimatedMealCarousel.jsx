import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DAYS = [
  { name: "Monday", meal: "Lemon Herb Chicken with Rice" },
  { name: "Tuesday", meal: "Spaghetti Bolognese" },
  { name: "Wednesday", meal: "Grilled Salmon & Quinoa" },
  { name: "Thursday", meal: "Tacos with Black Beans" },
  { name: "Friday", meal: "Homemade Pizza Night" },
  { name: "Saturday", meal: "Burgers & Sweet Potato Fries" },
  { name: "Sunday", meal: "Roast Chicken & Veggies" },
];

function getTodayIdx() {
  const jsDay = new Date().getDay(); // 0 = Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

function MealCard({ day, state }) {
  let base = "rounded-xl transition-all duration-300 ease-in-out text-center shadow select-none flex flex-col justify-center items-center";
  let style = {};
  const photoUrl = "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  if (state === "today") {
    style = {
      width: "840px",
      height: "320px",
      opacity: 1,
      zIndex: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      background: `url(${photoUrl}) center/cover no-repeat`,
      position: "relative",
      color: "#fff",
    };
  } else if (state === "side") {
    style = {
      width: "680px",
      height: "260px",
      opacity: 0.6,
      zIndex: 5,
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      background: `url(${photoUrl}) center/cover no-repeat`,
      position: "relative",
      color: "#fff",
    };
  }
  return (
    <motion.div style={style} className={base}>
      {/* Left-to-right black gradient overlay for readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "inherit",
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      {/* Bottom dark gradient overlay for text readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.7) 100%)",
        borderRadius: "inherit",
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div style={{ position: "relative", zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', justifyContent: 'center', paddingLeft: '40px', paddingRight: '40px', width: '100%' }}>
        <div
          className="font-bold"
          style={{
            fontSize: '1.1rem',
            color: '#48AF55',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            marginBottom: '0.5rem',
            lineHeight: 1.1,
            wordBreak: 'break-word',
            width: '100%',
            textAlign: 'left',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {day.name}
        </div>
        <div
          className="font-thin"
          style={{
            fontSize: '3.5rem',
            color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            lineHeight: 1.1,
            wordBreak: 'break-word',
            width: '100%',
            textAlign: 'left',
            fontWeight: 100,
          }}
        >
          {day.meal}
        </div>
      </div>
    </motion.div>
  );
}

export default function AnimatedMealCarousel() {
  const [focusedIdx, setFocusedIdx] = useState(getTodayIdx());
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const timeoutRef = useRef();

  // Midnight auto-advance
  useEffect(() => {
    function getMsToMidnight() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      return next - now;
    }
    function scheduleMidnight() {
      timeoutRef.current = setTimeout(() => {
        setFocusedIdx(idx => (idx + 1) % DAYS.length);
        scheduleMidnight();
      }, getMsToMidnight());
    }
    scheduleMidnight();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Animation variants
  const variants = {
    enter: dir => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: dir => ({ x: dir < 0 ? 600 : -600, opacity: 0 }),
  };

  // Fade for side cards
  function getSideFade(idx) {
    const dist = Math.abs(idx - focusedIdx);
    if (dist === 1) return 0.6;
    if (dist === 2) return 0.3;
    return 0;
  }

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-x-hidden">
      {/* Left arrow */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow p-2"
        onClick={() => {
          setDirection(-1);
          setFocusedIdx(idx => (idx - 1 + DAYS.length) % DAYS.length);
        }}
        aria-label="Previous day"
      >
        <FaChevronLeft size={28} />
      </button>
      {/* Right arrow */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow p-2"
        onClick={() => {
          setDirection(1);
          setFocusedIdx(idx => (idx + 1) % DAYS.length);
        }}
        aria-label="Next day"
      >
        <FaChevronRight size={28} />
      </button>
      {/* Today button */}
      <button
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-blue-500 text-white px-4 py-2 rounded shadow"
        onClick={() => {
          setDirection(0);
          setFocusedIdx(getTodayIdx());
        }}
      >
        Today
      </button>
      {/* Cards aligned horizontally */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="mx-auto relative w-[1400px] h-[320px]">
          {/* Yesterday's card (left) */}
          {focusedIdx > 0 && (
            <motion.div
              key={focusedIdx - 1}
              initial={{ x: -350, opacity: 0.6 }}
              animate={{ x: -350, opacity: 0.6 }}
              exit={{ x: -1200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ zIndex: 5, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
            >
              <MealCard day={DAYS[focusedIdx - 1]} state="side" />
            </motion.div>
          )}
          {/* Today's card (center) */}
          <motion.div
            key={focusedIdx}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            style={{ zIndex: 10, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto' }}
          >
            <MealCard day={DAYS[focusedIdx]} state="today" />
          </motion.div>
          {/* Tomorrow's card (right) */}
          {focusedIdx < DAYS.length - 1 && (
            <motion.div
              key={focusedIdx + 1}
              initial={{ x: 350, opacity: 0.6 }}
              animate={{ x: 350, opacity: 0.6 }}
              exit={{ x: 1200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ zIndex: 5, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
            >
              <MealCard day={DAYS[focusedIdx + 1]} state="side" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
