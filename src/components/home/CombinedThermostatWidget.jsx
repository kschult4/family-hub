import { useState } from 'react';
import { Thermometer, Plus, Minus, Home, Building, Fan, Droplets, Calendar, Zap, Flame, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';

export default function CombinedThermostatWidget({ 
  thermostats = [], 
  onSetTemperature, 
  onSetMode 
}) {
  // Default to first thermostat or create default if none
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (thermostats.length === 0) {
    return (
      <div className="rounded-lg p-4 border-2 border-[#b75634] bg-orange-50 h-full flex flex-col">
        <div className="text-center text-gray-500 flex-1 flex flex-col justify-center">
          <Thermometer className="w-8 h-8 mx-auto mb-2" />
          <p>No thermostats available</p>
        </div>
      </div>
    );
  }

  const currentThermostat = thermostats[activeIndex] || thermostats[0];
  const thermostatData = {
    currentTemp: currentThermostat.attributes?.current_temperature || 70,
    targetTemp: currentThermostat.attributes?.temperature || 70,
    mode: currentThermostat.state || 'off',
    location: currentThermostat.attributes?.friendly_name?.toLowerCase().includes('upstairs') ? 'upstairs' : 'downstairs',
    isOnline: currentThermostat.state !== 'unavailable',
    humidity: currentThermostat.attributes?.current_humidity || null,
    isHeating: currentThermostat.attributes?.hvac_action === 'heating',
    isCooling: currentThermostat.attributes?.hvac_action === 'cooling',
    fanRunning: currentThermostat.attributes?.fan_state === 'on',
    schedule: currentThermostat.attributes?.preset_mode === 'schedule'
  };

  const getModeColor = (mode) => {
    // Use consistent orange color scheme
    return 'border-[#b75634] bg-orange-50';
  };

  const getLocationIcon = (location) => {
    return location === 'upstairs' ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />;
  };

  const handleTempChange = (delta) => {
    const newTemp = Math.max(55, Math.min(85, thermostatData.targetTemp + delta));
    onSetTemperature?.(currentThermostat.entity_id, newTemp);
  };

  const handleModeChange = (newMode) => {
    onSetMode?.(currentThermostat.entity_id, newMode);
  };

  return (
    <div className={`rounded-lg p-3 border-2 h-full flex flex-col overflow-hidden ${getModeColor(thermostatData.mode)}`}>
      {/* Header with location toggle */}
      <div className="flex items-center justify-between mb-2">
        <Thermometer className="w-8 h-8" />
        
        {/* Location Toggle Button */}
        {thermostats.length > 1 && (
          <button
            onClick={() => setActiveIndex(activeIndex === 0 ? 1 : 0)}
            className="px-3 py-1 bg-white/70 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-white"
          >
            {thermostats[activeIndex]?.attributes?.friendly_name?.toLowerCase().includes('upstairs') ? 'Upstairs' : 'Downstairs'}
          </button>
        )}
      </div>

      {/* Temperature Display and Controls */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between flex-1 px-2 -mt-5">
          <button
            onClick={() => handleTempChange(-1)}
            className="p-3 text-blue-600 transition-colors hover:text-blue-700 active:scale-95"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-[#b75634]">{Math.round(thermostatData.targetTemp)}</span>
              <span className="text-2xl text-[#b75634]">°F</span>
            </div>
          </div>
          
          <button
            onClick={() => handleTempChange(1)}
            className="p-3 text-red-600 transition-colors hover:text-red-700 active:scale-95"
          >
            <ChevronUp className="w-8 h-8" />
          </button>
        </div>

        {/* Mode Controls - Compact Tabs */}
        <div className="grid grid-cols-4 gap-0.5 pb-2">
          {['off', 'heat', 'cool', 'auto'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`py-1.5 px-1 rounded-sm text-xs font-medium transition-all flex items-center justify-center ${
                thermostatData.mode === mode
                  ? 'bg-white shadow-sm font-bold border border-gray-300'
                  : 'bg-white/50 border border-transparent'
              }`}
            >
              {mode === 'off' ? 'Off' : 
               mode === 'heat' ? <Flame className="w-3 h-3" /> : 
               mode === 'cool' ? <Snowflake className="w-3 h-3" /> : 
               'Auto'}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      {!thermostatData.isOnline && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">Offline</span>
        </div>
      )}
    </div>
  );
}