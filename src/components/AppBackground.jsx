export default function AppBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🎨 Background radial gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_#FDF6E7,_#FBEED4)]" />

      {/* 🧵 Pattern grid: 3x3 tiles of your original SVG */}
      <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <img
            key={i}
            src="/PatternBG.svg"
            alt=""
            className="w-full h-full object-cover"
            draggable="false"
          />
        ))}
      </div>

      {/* 💫 Glint animation layer */}
      <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
        <div className="glint-mask" />
      </div>

      {/* 🌿 App content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
