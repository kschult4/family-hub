import { useState } from 'react';
import { Lightbulb, ToggleLeft, ToggleRight, Palette, Sun } from 'lucide-react';

export default function DeviceCard({ 
  device, 
  onToggle, 
  onLongPress 
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const isLight = device.entity_id?.includes('light');
  const isOn = device.state === 'on';
  const isUnavailable = device.state === 'unavailable';
  
  const brightness = device.attributes?.brightness || 255;
  const hasColor = device.attributes?.rgb_color;
  const friendlyName = device.attributes?.friendly_name || device.entity_id;

  const handlePress = () => {
    if (!isUnavailable) {
      onToggle?.(device.entity_id);
    }
  };

  const handleLongPress = () => {
    if (isLight && !isUnavailable) {
      onLongPress?.(device.entity_id);
    }
  };

  const getIcon = () => {
    if (isLight) {
      return isOn ? <Lightbulb className="w-6 h-6 fill-current" /> : <Lightbulb className="w-6 h-6" />;
    }
    return isOn ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />;
  };

  const getStatusColor = () => {
    if (isUnavailable) return 'text-gray-400 bg-gray-100';
    if (isOn) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer select-none ${
        isUnavailable 
          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
          : isOn 
            ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 active:scale-95' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md active:scale-95'
      } ${isPressed ? 'scale-95' : ''}`}
      onClick={handlePress}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      onTouchStart={(e) => {
        setIsPressed(true);
        const touchStartTime = Date.now();
        const longPressTimer = setTimeout(() => {
          if (Date.now() - touchStartTime >= 500) {
            handleLongPress();
          }
        }, 500);
        
        const cleanup = () => {
          clearTimeout(longPressTimer);
          setIsPressed(false);
        };
        
        e.target.addEventListener('touchend', cleanup, { once: true });
        e.target.addEventListener('touchmove', cleanup, { once: true });
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Device Icon and Status */}
      <div className={`flex items-center justify-between mb-2 ${getStatusColor().split(' ')[0]}`}>
        {getIcon()}
        <div className="flex items-center gap-1">
          {isLight && hasColor && isOn && (
            <Palette className="w-4 h-4" />
          )}
          {isLight && isOn && (
            <Sun className="w-4 h-4" style={{ opacity: brightness / 255 }} />
          )}
        </div>
      </div>
      
      {/* Device Name */}
      <h3 className="font-semibold text-sm text-gray-800 truncate mb-1">
        {friendlyName}
      </h3>
      
      {/* Status Text */}
      <p className={`text-xs ${
        isUnavailable 
          ? 'text-gray-400' 
          : isOn 
            ? 'text-yellow-700' 
            : 'text-gray-600'
      }`}>
        {isUnavailable ? 'Unavailable' : isOn ? 'On' : 'Off'}
      </p>
      
      {/* Brightness Indicator for Lights */}
      {isLight && isOn && !isUnavailable && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(brightness / 255) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {Math.round((brightness / 255) * 100)}%
            </span>
          </div>
        </div>
      )}
      
      {/* Long Press Hint for Lights */}
      {isLight && !isUnavailable && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60" />
        </div>
      )}
    </div>
  );
}