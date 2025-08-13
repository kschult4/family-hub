import { useState } from 'react';
import { Thermometer, Plus, Minus, Snowflake, Sun, Wind, Home, ArrowUp } from 'lucide-react';

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

  const getModeIcon = () => {
    switch (mode) {
      case 'heat':
        return <Sun className="w-5 h-5 text-orange-600" />;
      case 'cool':
        return <Snowflake className="w-5 h-5 text-blue-600" />;
      case 'fan':
        return <Wind className="w-5 h-5 text-gray-600" />;
      case 'off':
        return <Thermometer className="w-5 h-5 text-gray-400" />;
      default:
        return <Thermometer className="w-5 h-5 text-green-600" />;
    }
  };

  const getModeColor = () => {
    if (!isOnline) return 'bg-gray-50 border-gray-200';
    switch (mode) {
      case 'heat':
        return 'bg-orange-50 border-orange-200';
      case 'cool':
        return 'bg-blue-50 border-blue-200';
      case 'fan':
        return 'bg-gray-50 border-gray-200';
      case 'off':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getStatusIndicator = () => {
    if (isHeating) return { icon: <Sun className="w-3 h-3" />, color: 'text-orange-600', text: 'Heating' };
    if (isCooling) return { icon: <Snowflake className="w-3 h-3" />, color: 'text-blue-600', text: 'Cooling' };
    if (fanRunning) return { icon: <Wind className="w-3 h-3" />, color: 'text-gray-600', text: 'Fan' };
    return { icon: null, color: 'text-gray-500', text: 'Idle' };
  };

  if (!isOnline) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 min-h-[180px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Thermometer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Thermostat</p>
            <p className="text-xs text-gray-500">Offline</p>
          </div>
        </div>
      </div>
    );
  }

  const statusIndicator = getStatusIndicator();

  return (
    <div className={`rounded-lg p-4 border-2 min-h-[180px] ${getModeColor()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getModeIcon()}
          <span className="font-semibold text-sm text-gray-800">Thermostat</span>
        </div>
        <button
          onClick={toggleLocation}
          className="flex items-center gap-1 px-2 py-1 bg-white/50 hover:bg-white/70 rounded-full text-xs font-medium transition-colors"
        >
          {location === 'upstairs' ? <ArrowUp className="w-3 h-3" /> : <Home className="w-3 h-3" />}
          {location}
        </button>
      </div>

      {/* Temperature Display */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{currentTemp}°</p>
            <p className="text-xs text-gray-600">Current</p>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{targetTemp}°</p>
            <p className="text-xs text-gray-600">Target</p>
          </div>
        </div>
        
        {/* Status */}
        <div className={`flex items-center justify-center gap-1 mt-2 ${statusIndicator.color}`}>
          {statusIndicator.icon}
          <span className="text-xs font-medium">{statusIndicator.text}</span>
        </div>
      </div>

      {/* Temperature Controls */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={() => adjustTemperature(-1)}
          disabled={isAdjusting || mode === 'off'}
          className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="text-center px-4">
          {isAdjusting ? (
            <div className="w-6 h-6 mx-auto animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <span className="text-lg font-bold text-gray-800">{targetTemp}°</span>
          )}
        </div>
        
        <button
          onClick={() => adjustTemperature(1)}
          disabled={isAdjusting || mode === 'off'}
          className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {['heat', 'cool', 'auto', 'off'].map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => onSetMode?.(location, modeOption)}
            className={`py-2 px-1 rounded text-xs font-medium transition-all duration-200 ${
              mode === modeOption 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'bg-white/30 text-gray-700 hover:bg-white/50'
            }`}
          >
            {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="flex justify-between items-center text-xs text-gray-600">
        <div className="flex items-center gap-3">
          {humidity && (
            <span>💧 {humidity}%</span>
          )}
          {schedule && (
            <span>📅 Schedule</span>
          )}
        </div>
        <div className="text-right">
          <span>Mode: {mode}</span>
        </div>
      </div>
    </div>
  );
}