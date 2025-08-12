import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Power } from 'lucide-react';

export default function LightCard({ 
  device, 
  onToggle, 
  onLongPress 
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
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
        // If we were turning on, ripple stays active to maintain yellow background
      }, 600);
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
    if (isOn || rippleActive) {
      return 'border-[#efb643] bg-yellow-50 shadow-sm';
    }
    return 'border-[#efb643] bg-[#f8f9fa]';
  };

  const getIconColor = () => {
    if (isUnavailable) return 'text-gray-400';
    if (isOn) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div
      ref={cardRef}
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer select-none h-full flex flex-col overflow-hidden ${getCardStyles()} ${
        isPressed ? 'scale-95' : 'active:scale-95'
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
      {/* Ripple Animation Overlay */}
      {rippleActive && (
        <span 
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#fef3cd',
            clipPath: !isToggling 
              ? 'circle(150% at 50% 50%)' 
              : undefined,
            animation: isToggling ? 
              `${isTurningOn ? 'lightTurnOn' : 'lightTurnOff'} 600ms ease-in-out forwards` 
              : undefined,
            '--button-x': `${buttonCenter.x}%`,
            '--button-y': `${buttonCenter.y}%`
          }}
        />
      )}


      {/* Content wrapper to ensure it stays above animation */}
      <div className="relative z-10">
      {/* Top Row: Icon */}
      <div className="flex items-center mb-3">
        <Lightbulb 
          className={`w-6 h-6 ${getIconColor()} ${isOn ? 'fill-current' : ''}`}
        />
      </div>
      
      {/* Device Name */}
      <h3 className="font-semibold text-base text-gray-800 truncate mb-1">
        {getDeviceName() || 'Light'}
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
              : 'bg-[#efb643] text-white shadow-sm'
          }`}
        >
          <Power className="w-4 h-4" />
        </div>
      </div>
      </div>
      
    </div>
  );
}