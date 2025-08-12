import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AlarmSoundingModal({ 
  isVisible = false, 
  onDisarm 
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleDisarm = () => {
    onDisarm?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with red-to-transparent gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.6) 40%, rgba(239, 68, 68, 0.3) 70%, transparent 100%)'
        }}
      />

      {/* Radar wipe animation container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)'
          }}
        >
          {/* Radar trail - multiple rotating elements with staggered delays for fade effect */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`trail-${i}`}
              className={`absolute top-1/2 left-1/2 origin-bottom w-1 bg-gradient-to-t from-red-400 to-transparent ${
                isAnimating ? 'animate-radar-trail' : ''
              }`}
              style={{ 
                height: '240px', // Extend further out
                transformOrigin: 'bottom center',
                transform: 'translate(-50%, -100%)',
                animationDelay: `${i * 0.167}s`, // 2s / 12 = 0.167s stagger
                opacity: 0.3 - (i * 0.025) // Fade each trail element
              }}
            />
          ))}
          
          {/* Main radar sweep line */}
          <div 
            className={`absolute top-1/2 left-1/2 origin-bottom w-1 bg-gradient-to-t from-red-500 via-red-400 to-transparent ${
              isAnimating ? 'animate-radar-sweep' : ''
            }`}
            style={{ 
              height: '240px', // Extend to 240px (48% of 500px container)
              transformOrigin: 'bottom center',
              transform: 'translate(-50%, -100%)',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)' // Add glow effect
            }}
          />
          
          {/* Radar rings */}
          {[1, 2, 3, 4, 5].map((ring) => (
            <div
              key={ring}
              className="absolute border border-red-400 rounded-full opacity-20"
              style={{
                width: `${ring * 20}%`,
                height: `${ring * 20}%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Alert Icon */}
        <div className="mb-6">
          <ShieldAlert className="w-20 h-20 text-white mx-auto animate-pulse" />
        </div>

        {/* Main Text */}
        <h1 className="text-6xl font-bold text-white mb-8 animate-pulse">
          ALARM SOUNDING
        </h1>

        {/* Disarm Button */}
        <button
          onClick={handleDisarm}
          className="px-12 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-2xl font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-red-400"
        >
          DISARM
        </button>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes radar-sweep {
          0% {
            transform: translate(-50%, -100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100%) rotate(360deg);
            opacity: 1;
          }
        }
        
        @keyframes radar-trail {
          0% {
            transform: translate(-50%, -100%) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          95% {
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -100%) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-radar-sweep {
          animation: radar-sweep 2s linear infinite;
        }
        
        .animate-radar-trail {
          animation: radar-trail 2s linear infinite;
        }
      `}</style>
    </div>
  );
}