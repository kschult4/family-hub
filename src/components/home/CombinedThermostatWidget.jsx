import { useState } from 'react';
import { Thermometer, Plus, Minus, Home, Building, Fan, Droplets, Calendar, Zap } from 'lucide-react';

export default function CombinedThermostatWidget({ 
  thermostats = [], 
  onSetTemperature, 
  onSetMode 
}) {
  // Default to first thermostat or create default if none
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (thermostats.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 h-full flex flex-col">
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
    switch (mode?.toLowerCase()) {
      case 'heat':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'cool':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'auto':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'off':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
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
    <div className={`rounded-lg p-4 border-2 h-full flex flex-col ${getModeColor(thermostatData.mode)}`}>
      {/* Header with location toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          <span className="font-semibold">Thermostat</span>
        </div>
        
        {/* Location Toggle Buttons */}
        {thermostats.length > 1 && (
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            {thermostats.map((thermostat, index) => {
              const location = thermostat.attributes?.friendly_name?.toLowerCase().includes('upstairs') ? 'upstairs' : 'downstairs';
              const isActive = index === activeIndex;
              
              return (
                <button
                  key={thermostat.entity_id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {getLocationIcon(location)}
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Current Temperature Display */}
      <div className="text-center mb-4">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-3xl font-bold">{Math.round(thermostatData.currentTemp)}</span>
          <span className="text-lg text-gray-600">°F</span>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          {thermostatData.humidity && (
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {thermostatData.humidity}%
            </div>
          )}
          {thermostatData.fanRunning && (
            <div className="flex items-center gap-1">
              <Fan className="w-3 h-3" />
              Fan
            </div>
          )}
          {thermostatData.schedule && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Schedule
            </div>
          )}
        </div>

        {/* Heating/Cooling indicator */}
        {(thermostatData.isHeating || thermostatData.isCooling) && (
          <div className="mt-2 flex items-center justify-center gap-1">
            <Zap className={`w-4 h-4 ${thermostatData.isHeating ? 'text-red-500' : 'text-blue-500'}`} />
            <span className={`text-sm font-medium ${thermostatData.isHeating ? 'text-red-600' : 'text-blue-600'}`}>
              {thermostatData.isHeating ? 'Heating' : 'Cooling'}
            </span>
          </div>
        )}
      </div>

      {/* Temperature Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => handleTempChange(-1)}
          className="p-2 rounded-full bg-white/70 hover:bg-white border border-gray-300 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Target</div>
          <div className="text-xl font-bold">{Math.round(thermostatData.targetTemp)}°F</div>
        </div>
        
        <button
          onClick={() => handleTempChange(1)}
          className="p-2 rounded-full bg-white/70 hover:bg-white border border-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Controls */}
      <div className="grid grid-cols-4 gap-1">
        {['off', 'heat', 'cool', 'auto'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`py-2 px-1 rounded text-xs font-medium transition-all ${
              thermostatData.mode === mode
                ? 'bg-white shadow-sm font-bold border border-gray-300'
                : 'bg-white/50 hover:bg-white/80 border border-transparent'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Connection Status */}
      {!thermostatData.isOnline && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Offline</span>
        </div>
      )}
    </div>
  );
}