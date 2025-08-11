import { useState } from 'react';
import { Lightbulb, Power } from 'lucide-react';

export default function LightCard({ 
  device, 
  onToggle, 
  onLongPress 
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  
  const isOn = device.state === 'on';
  const isUnavailable = device.state === 'unavailable';
  
  const friendlyName = device.attributes?.friendly_name || device.entity_id;
  
  // Extract room name from entity_id or friendly_name
  const getRoomName = () => {
    if (friendlyName.includes('Light')) {
      return friendlyName.replace(' Light', '');
    }
    // Extract from entity_id like "light.living_room" -> "Living Room"
    const roomPart = device.entity_id.split('.')[1];
    return roomPart.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  // Extract device name (remove room from friendly name)
  const getDeviceName = () => {
    const roomName = getRoomName();
    return friendlyName.replace(roomName, '').trim();
  };

  const handleClick = () => {
    if (!isUnavailable) {
      onToggle?.(device.entity_id);
    }
  };

  const handleLongPressStart = () => {
    if (isUnavailable) return;
    
    setIsPressed(true);
    const timer = setTimeout(() => {
      onLongPress?.(device.entity_id);
      setIsPressed(false);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsPressed(false);
  };

  const getCardStyles = () => {
    if (isUnavailable) {
      return 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed';
    }
    if (isOn) {
      return 'border-yellow-300 bg-yellow-50 shadow-sm';
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm';
  };

  const getIconColor = () => {
    if (isUnavailable) return 'text-gray-400';
    if (isOn) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none h-full flex flex-col ${getCardStyles()} ${
        isPressed ? 'scale-95' : 'hover:scale-105 active:scale-95'
      }`}
      onClick={handleClick}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onTouchCancel={handleLongPressEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!isUnavailable) {
          onLongPress?.(device.entity_id);
        }
      }}
    >
      {/* Top Row: Icon and Power Button */}
      <div className="flex items-center justify-between mb-3">
        <Lightbulb 
          className={`w-6 h-6 ${getIconColor()} ${isOn ? 'fill-current' : ''}`}
        />
        <div 
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isUnavailable 
              ? 'bg-gray-200 text-gray-400' 
              : isOn 
                ? 'bg-green-500 text-white shadow-sm' 
                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
          }`}
        >
          <Power className="w-3 h-3" />
        </div>
      </div>
      
      {/* Device Name */}
      <h3 className="font-semibold text-sm text-gray-800 truncate mb-2">
        {getDeviceName() || 'Light'}
      </h3>
      
      {/* Room Name */}
      <p className="text-xs text-gray-600 truncate">
        {getRoomName()}
      </p>
      
      {/* Long Press Indicator */}
      {!isUnavailable && (
        <div className="absolute bottom-2 left-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
            isPressed ? 'bg-blue-500 scale-150' : 'bg-blue-400 opacity-60'
          }`} />
        </div>
      )}
    </div>
  );
}