import { useState } from 'react';
import { Thermometer, Plus, Minus, Home, Building, Fan, Droplets, Calendar, Zap, Flame, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';

export default function ThermostatWidget({ 
  thermostatData = {}, 
  onSetTemperature,
  onSetMode,
  onToggleLocation 
}) {
  const [targetTemp, setTargetTemp] = useState(thermostatData.targetTemp || 70);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const {
    currentTemp = 72,
    targetTemp: dataTargetTemp = 70,
    mode = 'auto', // 'heat', 'cool', 'auto', 'off', 'fan'
    location = 'downstairs', // 'upstairs', 'downstairs'
    isOnline = true,
    humidity = null,
    isHeating = false,
    isCooling = false,
    fanRunning = false,
    schedule = null
  } = thermostatData;

  const adjustTemperature = async (adjustment) => {
    if (isAdjusting) return;
    
    const newTemp = Math.max(50, Math.min(90, targetTemp + adjustment));
    setTargetTemp(newTemp);
    setIsAdjusting(true);
    
    try {
      await onSetTemperature?.(location, newTemp);
      setTimeout(() => setIsAdjusting(false), 1000);
    } catch (error) {
      console.error('Failed to set temperature:', error);
      setIsAdjusting(false);
    }
  };

  const toggleLocation = () => {
    const newLocation = location === 'upstairs' ? 'downstairs' : 'upstairs';
    onToggleLocation?.(newLocation);
  };

  const getLocationIcon = (location) => {
    return location === 'upstairs' ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />;
  };

  const handleModeChange = (newMode) => {
    onSetMode?.(location, newMode);
  };

  return (
    <div className="rounded-lg p-3 border-2 border-[#b75634] bg-orange-50 h-full flex flex-col overflow-hidden">
      {/* Header with location toggle */}
      <div className="flex items-center justify-between mb-2">
        <Thermometer className="w-8 h-8" />
        
        {/* Location Toggle Button */}
        <button
          onClick={toggleLocation}
          className="px-3 py-1 bg-white/70 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-white flex items-center gap-1"
        >
          {getLocationIcon(location)}
          {location.charAt(0).toUpperCase() + location.slice(1)}
        </button>
      </div>

      {/* Temperature Display and Controls */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between flex-1 px-2 -mt-5">
          <button
            onClick={() => adjustTemperature(-1)}
            className="p-3 text-blue-600 transition-colors hover:text-blue-700 active:scale-95"
            disabled={isAdjusting || mode === 'off'}
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-[#b75634]">{Math.round(targetTemp)}</span>
              <span className="text-2xl text-[#b75634]">°F</span>
            </div>
          </div>
          
          <button
            onClick={() => adjustTemperature(1)}
            className="p-3 text-red-600 transition-colors hover:text-red-700 active:scale-95"
            disabled={isAdjusting || mode === 'off'}
          >
            <ChevronUp className="w-8 h-8" />
          </button>
        </div>

        {/* Mode Controls - Compact Tabs */}
        <div className="grid grid-cols-4 gap-0.5 pb-2">
          {['off', 'heat', 'cool', 'auto'].map((modeOption) => (
            <button
              key={modeOption}
              onClick={() => handleModeChange(modeOption)}
              className={`py-1.5 px-1 rounded-sm text-xs font-medium transition-all flex items-center justify-center ${
                mode === modeOption
                  ? 'bg-white shadow-sm font-bold border border-gray-300'
                  : 'bg-white/50 border border-transparent'
              }`}
            >
              {modeOption === 'off' ? 'Off' : 
               modeOption === 'heat' ? <Flame className="w-3 h-3" /> : 
               modeOption === 'cool' ? <Snowflake className="w-3 h-3" /> : 
               'Auto'}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      {!isOnline && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">Offline</span>
        </div>
      )}
    </div>
  );
}