import { useState } from 'react';
import { Thermometer, Plus, Minus, Home, Building, Fan, Droplets, Calendar, Zap, Flame, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';

export default function ThermostatWidget({ 
  thermostatData = {}, 
  onSetTemperature,
  onSetMode,
  onToggleLocation,
  isActive = true 
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
    if (isAdjusting || !isActive) return;
    
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
    if (!isActive) return;
    const newLocation = location === 'upstairs' ? 'downstairs' : 'upstairs';
    onToggleLocation?.(newLocation);
  };

  const getLocationIcon = (location) => {
    return location === 'upstairs' ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />;
  };

  const handleModeChange = (newMode) => {
    if (!isActive) return;
    onSetMode?.(location, newMode);
  };

  return (
    <div className={`rounded-lg p-3 border-2 h-full flex flex-col overflow-hidden transition-all ${
      isActive 
        ? 'border-[#b75634] bg-orange-50' 
        : 'border-gray-300 bg-gray-100 opacity-60'
    }`}>
      {/* Header with location toggle */}
      <div className="flex items-center justify-between mb-2">
        <Thermometer className={`w-8 h-8 ${isActive ? '' : 'text-gray-400'}`} />
        
        {/* Location Toggle Button */}
        <button
          onClick={toggleLocation}
          disabled={!isActive}
          className={`px-3 py-1 border rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            isActive 
              ? 'bg-white/70 border-gray-300 hover:bg-white' 
              : 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
          }`}
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
            className={`p-3 transition-colors active:scale-95 ${
              isActive 
                ? 'text-blue-600 hover:text-blue-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={isAdjusting || mode === 'off' || !isActive}
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-6xl font-bold ${
                isActive ? 'text-[#b75634]' : 'text-gray-400'
              }`}>{Math.round(targetTemp)}</span>
              <span className={`text-2xl ${
                isActive ? 'text-[#b75634]' : 'text-gray-400'
              }`}>°F</span>
            </div>
          </div>
          
          <button
            onClick={() => adjustTemperature(1)}
            className={`p-3 transition-colors active:scale-95 ${
              isActive 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={isAdjusting || mode === 'off' || !isActive}
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
              disabled={!isActive}
              className={`py-1.5 px-1 rounded-sm text-xs font-medium transition-all flex items-center justify-center ${
                isActive 
                  ? (mode === modeOption
                      ? 'bg-white shadow-sm font-bold border border-gray-300'
                      : 'bg-white/50 border border-transparent hover:bg-white/70')
                  : 'bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {modeOption === 'off' ? 'Off' : 
               modeOption === 'heat' ? <Flame className={`w-3 h-3 ${!isActive ? 'text-gray-400' : ''}`} /> : 
               modeOption === 'cool' ? <Snowflake className={`w-3 h-3 ${!isActive ? 'text-gray-400' : ''}`} /> : 
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