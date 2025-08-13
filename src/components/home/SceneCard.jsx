import { useState, useEffect } from 'react';
import { Zap, Play, CheckCircle } from 'lucide-react';
import { useHomeAssistantEntity } from '../../hooks/useHomeAssistantEntity';

// Add CSS animation for the ripple effect
const animationStyle = `
  @keyframes rippleFill {
    0% {
      clip-path: circle(0px at 88% 85%);
    }
    100% {
      clip-path: circle(200px at 88% 85%);
    }
  }

  .animate-ripple {
    background-color: rgb(105, 165, 209);
    animation: rippleFill 300ms ease-out forwards,
      fadeOut 300ms ease-in 2s forwards;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

// Inject the animation styles
if (typeof document !== 'undefined') {
  // Remove existing styles
  const existing = document.getElementById('scene-card-animations-v2');
  if (existing) existing.remove();
  
  const style = document.createElement('style');
  style.id = 'scene-card-animations-v2';
  style.textContent = animationStyle;
  document.head.appendChild(style);
}

export default function SceneCard({ 
  sceneId,
  scene, 
  onActivate 
}) {
  // Use Home Assistant integration if sceneId is provided
  const { entity, loading, error, activate } = useHomeAssistantEntity(sceneId, !!sceneId);
  
  const [isActivating, setIsActivating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  // Use entity from HA client if available, otherwise fall back to passed scene prop
  const sceneData = entity || scene;
  const friendlyName = sceneData?.name || sceneData?.attributes?.friendly_name || sceneData?.entity_id || 'Unknown Scene';
  const isUnavailable = sceneData?.state === 'unavailable' || loading;
  const hasError = !!error;

  const handleActivate = async () => {
    if (isUnavailable || isActivating || hasError) return;
    
    setIsActivating(true);
    setRippleActive(true);
    setIsActive(true);
    
    try {
      // Use HA client if sceneId is provided, otherwise use legacy onActivate callback
      if (sceneId && activate) {
        await activate();
      } else if (onActivate && sceneData) {
        await onActivate(sceneData.entity_id || sceneData.id);
      }
      
      // Stop ripple after 300ms + 2s pause
      setTimeout(() => {
        setRippleActive(false);
      }, 2300); // 300ms (animation) + 2000ms (pause)

      // Fully reset after fade-out
      setTimeout(() => {
        setIsActive(false);
        setIsActivating(false);
      }, 2600); // complete reset
    } catch (error) {
      console.error('Failed to activate scene:', error);
      setRippleActive(false);
      setIsActive(false);
      setIsActivating(false);
    }
  };

  const getStatusIcon = () => {
    if (isActivating && !rippleActive) return <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
    return <Zap className="w-6 h-6" />;
  };

  const getStatusColor = () => {
    if (hasError) return 'text-red-400 bg-red-100 border-red-200';
    if (isUnavailable) return 'text-gray-400 bg-gray-100 border-gray-200';
    return 'text-black';
  };

  // Show loading state for HA client
  if (sceneId && loading) {
    return (
      <div className="relative p-4 rounded-lg border h-[120px] bg-gray-100 border-gray-200 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  // Show error state for HA client
  if (sceneId && hasError) {
    return (
      <div className="relative p-4 rounded-lg border h-[120px] bg-red-50 border-red-200">
        <div className="flex items-center mb-3">
          <div className="text-red-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        <h3 className="font-semibold text-xl truncate mb-2 text-red-800">
          Scene Error
        </h3>
        <p className="text-xs text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer select-none h-[120px] overflow-hidden ${
        isUnavailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'active:scale-95'
      } ${getStatusColor()} ${isPressed ? 'scale-95' : ''}`}
      style={{
        backgroundColor: isUnavailable 
          ? undefined
          : '#f8f9fa',
        borderColor: isUnavailable 
          ? undefined
          : 'rgb(105, 165, 209)'
      }}
      onClick={handleActivate}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Ripple Animation Overlay */}
      {rippleActive && (
        <span 
          className="absolute inset-0 z-0" 
          style={{
            backgroundColor: 'rgb(105, 165, 209)',
            clipPath: 'circle(0px at 88% 85%)',
            animation: 'rippleFillNew 300ms ease-out forwards, fadeOutNew 300ms ease-in 2s forwards'
          }}
        />
      )}

      <style jsx>{`
        @keyframes rippleFillNew {
          0% {
            clip-path: circle(0px at 88% 85%);
          }
          100% {
            clip-path: circle(150% at 88% 85%);
          }
        }

        @keyframes fadeOutNew {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>

      {/* Content wrapper to ensure it stays above animation */}
      <div className="relative z-10">
      {/* Scene Icon and Status */}
      <div className="flex items-center mb-3">
        <div className={isUnavailable ? undefined : 'text-black'}>
          {getStatusIcon()}
        </div>
      </div>
      
      {/* Scene Name */}
      <h3 className={`font-semibold text-xl truncate mb-2 ${
        isUnavailable 
          ? 'text-gray-800'
          : 'text-black'
      }`}>
        {friendlyName}
      </h3>
      
      {/* Status Text */}
      <p className={`text-xs ${
        hasError
          ? 'text-red-400'
          : isUnavailable 
            ? 'text-gray-400' 
            : isActivating 
              ? 'text-blue-700' 
              : 'text-black opacity-75'
      }`}>
        {hasError
          ? 'Error loading scene'
          : isUnavailable 
            ? (loading ? 'Loading...' : 'Unavailable')
            : isActivating 
              ? 'Activating...' 
              : 'Tap to activate'
        }
      </p>
      
      {/* Activation Button Visual Hint */}
      <div className="absolute bottom-2 right-2 z-20">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isUnavailable 
            ? 'bg-gray-200' 
            : ''
        }`}
        style={{
          backgroundColor: isUnavailable 
            ? undefined 
            : 'rgb(105, 165, 209)'
        }}>
          <Play className={`w-5 h-5 ml-0.5 ${isUnavailable ? 'text-current' : 'text-black'}`} />
        </div>
      </div>
      </div>
    </div>
  );
}