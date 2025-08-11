import { useState } from 'react';
import { ToggleLeft, ToggleRight, Power } from 'lucide-react';

export default function SwitchCard({ 
  device, 
  onToggle 
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const isOn = device.state === 'on';
  const isUnavailable = device.state === 'unavailable';
  
  const friendlyName = device.attributes?.friendly_name || device.entity_id;
  
  // Extract room name from entity_id or friendly_name
  const getRoomName = () => {
    // For switches like "Coffee Maker", try to infer room from context or use generic
    if (friendlyName.toLowerCase().includes('porch')) return 'Porch';
    if (friendlyName.toLowerCase().includes('kitchen') || friendlyName.toLowerCase().includes('coffee')) return 'Kitchen';
    if (friendlyName.toLowerCase().includes('living')) return 'Living Room';
    if (friendlyName.toLowerCase().includes('bedroom')) return 'Bedroom';
    
    // Extract from entity_id like "switch.porch_light" -> "Porch"
    const entityPart = device.entity_id.split('.')[1];
    if (entityPart.includes('_')) {
      const parts = entityPart.split('_');
      // Look for room indicators
      for (const part of parts) {
        if (['porch', 'kitchen', 'living', 'bedroom', 'garage', 'basement'].includes(part)) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        }
      }
    }
    
    return 'General';
  };
  
  // Get device name (the friendly name itself for switches)
  const getDeviceName = () => {
    return friendlyName;
  };

  const handleClick = () => {
    if (!isUnavailable) {
      onToggle?.(device.entity_id);
    }
  };

  const handleMouseDown = () => {
    if (!isUnavailable) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const getCardStyles = () => {
    if (isUnavailable) {
      return 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed';
    }
    if (isOn) {
      return 'border-blue-300 bg-blue-50 shadow-sm';
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm';
  };

  const getIconColor = () => {
    if (isUnavailable) return 'text-gray-400';
    if (isOn) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none h-full flex flex-col ${getCardStyles()} ${
        isPressed ? 'scale-95' : 'hover:scale-105 active:scale-95'
      }`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      {/* Top Row: Switch Icon and Power Button */}
      <div className="flex items-center justify-between mb-3">
        {isOn ? <ToggleRight className={`w-6 h-6 ${getIconColor()}`} /> : <ToggleLeft className={`w-6 h-6 ${getIconColor()}`} />}
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
        {getDeviceName()}
      </h3>
      
      {/* Room Name */}
      <p className="text-xs text-gray-600 truncate">
        {getRoomName()}
      </p>
    </div>
  );
}