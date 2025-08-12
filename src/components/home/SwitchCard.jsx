import { useState, useEffect, useRef } from 'react';
import { ToggleLeft, ToggleRight, Power } from 'lucide-react';

export default function SwitchCard({ 
  device, 
  onToggle 
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isTurningOn, setIsTurningOn] = useState(false);
  const [buttonCenter, setButtonCenter] = useState({ x: 85, y: 85 });
  
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  
  const isOn = device.state === 'on';
  const isUnavailable = device.state === 'unavailable';
  
  // Sync ripple state with actual device state
  useEffect(() => {
    if (isOn) {
      setRippleActive(true);
    }
  }, [isOn]);
  
  // Calculate button center relative to card
  useEffect(() => {
    const calculateButtonCenter = () => {
      if (cardRef.current && buttonRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        // Calculate button center relative to card
        const buttonCenterX = buttonRect.left + buttonRect.width / 2 - cardRect.left;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2 - cardRect.top;
        
        // Convert to percentages
        const xPercent = (buttonCenterX / cardRect.width) * 100;
        const yPercent = (buttonCenterY / cardRect.height) * 100;
        
        setButtonCenter({ x: xPercent, y: yPercent });
      }
    };
    
    // Calculate on mount and on resize
    calculateButtonCenter();
    window.addEventListener('resize', calculateButtonCenter);
    
    return () => window.removeEventListener('resize', calculateButtonCenter);
  }, []);
  
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
    if (!isUnavailable && !isToggling) {
      setIsToggling(true);
      
      // Capture the current state before toggling
      const wasOn = isOn;
      setIsTurningOn(!wasOn);
      
      if (!wasOn) {
        // Turning on - start animation from power button center
        setRippleActive(true);
      }
      // If turning off, ripple is already active from being on
      
      onToggle?.(device.entity_id);
      
      // Animation runs for 600ms for smoother effect
      setTimeout(() => {
        setIsToggling(false);
        if (wasOn) {
          // We were turning off, hide the ripple after animation completes
          setRippleActive(false);
        }
        // If we were turning on, ripple stays active to maintain green background
      }, 600);
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
    if (isOn || rippleActive) {
      return 'border-[#8b5a9b] bg-purple-50 shadow-sm';
    }
    return 'border-[#8b5a9b] bg-[#f8f9fa]';
  };

  const getIconColor = () => {
    if (isUnavailable) return 'text-gray-400';
    if (isOn) return 'text-purple-600';
    return 'text-gray-500';
  };

  return (
    <div
      ref={cardRef}
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer select-none h-full flex flex-col overflow-hidden ${getCardStyles()} ${
        isPressed ? 'scale-95' : 'active:scale-95'
      }`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      {/* Ripple Animation Overlay */}
      {rippleActive && (
        <span 
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#e6d6ea',
            clipPath: !isToggling 
              ? 'circle(150% at 50% 50%)' 
              : undefined,
            animation: isToggling ? 
              `${isTurningOn ? 'switchTurnOn' : 'switchTurnOff'} 600ms ease-in-out forwards` 
              : undefined,
            '--button-x': `${buttonCenter.x}%`,
            '--button-y': `${buttonCenter.y}%`
          }}
        />
      )}

      {/* Content wrapper to ensure it stays above animation */}
      <div className="relative z-10">
      {/* Top Row: Switch Icon */}
      <div className="flex items-center mb-3">
        {isOn ? <ToggleRight className={`w-6 h-6 ${getIconColor()}`} /> : <ToggleLeft className={`w-6 h-6 ${getIconColor()}`} />}
      </div>
      
      {/* Device Name */}
      <h3 className="font-semibold text-base text-gray-800 truncate mb-1">
        {getDeviceName()}
      </h3>
      
      {/* Room Name */}
      <p className="text-sm text-gray-600 truncate">
        {getRoomName()}
      </p>
      
      {/* Power Button - Bottom Right */}
      <div className="absolute bottom-2 right-2">
        <div 
          ref={buttonRef}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isUnavailable 
              ? 'bg-gray-200 text-gray-400' 
              : 'bg-[#8b5a9b] text-white shadow-sm'
          }`}
        >
          <Power className="w-4 h-4" />
        </div>
      </div>
      </div>
      
    </div>
  );
}