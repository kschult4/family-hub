import { useState, useEffect } from 'react';
import { X, Lightbulb, Sun, Palette, ToggleLeft, ToggleRight } from 'lucide-react';

export default function DeviceModal({ 
  device, 
  isOpen, 
  onClose, 
  onToggle,
  onBrightnessChange,
  onColorChange 
}) {
  const [brightness, setBrightness] = useState(255);
  const [selectedColor, setSelectedColor] = useState([255, 255, 255]);
  const [isDragging, setIsDragging] = useState(false);

  const isLight = device?.entity_id?.includes('light');
  const isOn = device?.state === 'on';
  const isUnavailable = device?.state === 'unavailable';
  const friendlyName = device?.attributes?.friendly_name || device?.entity_id;
  
  useEffect(() => {
    if (device?.attributes?.brightness) {
      setBrightness(device.attributes.brightness);
    }
    if (device?.attributes?.rgb_color) {
      setSelectedColor(device.attributes.rgb_color);
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const handleBrightnessChange = (value) => {
    const newBrightness = parseInt(value);
    setBrightness(newBrightness);
    onBrightnessChange?.(device.entity_id, newBrightness);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorChange?.(device.entity_id, color);
  };

  const colorPresets = [
    { name: 'Warm White', color: [255, 244, 229] },
    { name: 'Cool White', color: [255, 255, 255] },
    { name: 'Red', color: [255, 0, 0] },
    { name: 'Orange', color: [255, 165, 0] },
    { name: 'Yellow', color: [255, 255, 0] },
    { name: 'Green', color: [0, 255, 0] },
    { name: 'Blue', color: [0, 0, 255] },
    { name: 'Purple', color: [128, 0, 128] },
    { name: 'Pink', color: [255, 192, 203] },
    { name: 'Cyan', color: [0, 255, 255] }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isLight ? (
              <Lightbulb className={`w-6 h-6 ${isOn ? 'text-yellow-600 fill-current' : 'text-gray-400'}`} />
            ) : (
              isOn ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <h2 className="font-semibold text-gray-800">{friendlyName}</h2>
              <p className="text-sm text-gray-500">
                {isUnavailable ? 'Unavailable' : isOn ? 'On' : 'Off'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-6">
          {/* Power Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Power</span>
            </div>
            <button
              onClick={() => onToggle?.(device.entity_id)}
              disabled={isUnavailable}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                isUnavailable 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : isOn 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5 ${
                  isOn ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Brightness Control for Lights */}
          {isLight && !isUnavailable && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Brightness</span>
                <span className="text-sm text-gray-500">
                  {Math.round((brightness / 255) * 100)}%
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="255"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(e.target.value)}
                  disabled={!isOn}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isOn 
                      ? `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(brightness / 255) * 100}%, #e5e7eb ${(brightness / 255) * 100}%, #e5e7eb 100%)`
                      : '#e5e7eb'
                  }}
                />
              </div>
            </div>
          )}

          {/* Color Control for RGB Lights */}
          {isLight && !isUnavailable && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Color</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(preset.color)}
                    disabled={!isOn}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      !isOn 
                        ? 'opacity-50 cursor-not-allowed border-gray-300' 
                        : selectedColor?.toString() === preset.color.toString()
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: `rgb(${preset.color[0]}, ${preset.color[1]}, ${preset.color[2]})` 
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Current Status Display */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${
                  isUnavailable ? 'text-gray-400' : isOn ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {isUnavailable ? 'Unavailable' : isOn ? 'On' : 'Off'}
                </span>
              </div>
              {isLight && isOn && (
                <>
                  <div className="flex justify-between">
                    <span>Brightness:</span>
                    <span className="font-medium">{Math.round((brightness / 255) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: `rgb(${selectedColor[0]}, ${selectedColor[1]}, ${selectedColor[2]})` 
                        }}
                      />
                      <span className="font-medium text-xs">
                        rgb({selectedColor[0]}, {selectedColor[1]}, {selectedColor[2]})
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}