import { useState, useEffect } from 'react';
import { X, Lightbulb, Sun, Palette } from 'lucide-react';
import { useHomeAssistantEntity } from '../../hooks/useHomeAssistantEntity';

export default function LightConfigModal({
  lightId,
  device,
  isVisible = false,
  onClose,
  onUpdateLight
}) {
  // Use Home Assistant integration if lightId is provided
  const { entity, loading, error, turnOn, setBrightness: haSetBrightness, setColor: haSetColor } = useHomeAssistantEntity(lightId, !!lightId && isVisible);
  
  const [brightness, setBrightness] = useState(255);
  const [brightnessPercent, setBrightnessPercent] = useState(100);
  const [color, setColor] = useState('#ffffff');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use entity from HA client if available, otherwise fall back to passed device prop
  const lightData = entity || device;
  const friendlyName = lightData?.name || lightData?.attributes?.friendly_name || lightData?.entity_id || lightData?.id || 'Light';
  const isOn = lightData?.isOn ?? (lightData?.state === 'on');
  const entityId = lightData?.id || lightData?.entity_id;
  
  // Convert RGB array to hex
  const rgbToHex = (rgb) => {
    if (!rgb || !Array.isArray(rgb) || rgb.length !== 3) return '#ffffff';
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Convert hex to RGB array
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [255, 255, 255];
  };

  useEffect(() => {
    if (lightData && isVisible) {
      // Handle brightness from both HA client normalized data and raw attributes
      const deviceBrightness = lightData.brightness || lightData.attributes?.brightness || 255;
      const deviceBrightnessPercent = lightData.brightnessPercent || Math.round((deviceBrightness / 255) * 100);
      
      setBrightness(deviceBrightness);
      setBrightnessPercent(deviceBrightnessPercent);
      
      // Handle color from both HA client and raw attributes
      const deviceRgbColor = lightData.rgbColor || lightData.attributes?.rgb_color;
      setColor(rgbToHex(deviceRgbColor));
      
      setHasChanges(false);
    }
  }, [lightData, isVisible]);

  const handleBrightnessChange = (newBrightness) => {
    setBrightness(newBrightness);
    setBrightnessPercent(Math.round((newBrightness / 255) * 100));
    setHasChanges(true);
  };

  const handleBrightnessPercentChange = (newPercent) => {
    const newBrightness = Math.round((newPercent / 100) * 255);
    setBrightness(newBrightness);
    setBrightnessPercent(newPercent);
    setHasChanges(true);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    
    setIsSaving(true);
    
    try {
      if (lightId && (haSetBrightness || haSetColor)) {
        // Use Home Assistant client methods
        if (haSetBrightness) {
          await haSetBrightness(brightnessPercent);
        }
        if (haSetColor) {
          await haSetColor(hexToRgb(color));
        }
      } else if (onUpdateLight && entityId) {
        // Use legacy callback
        const updates = {
          brightness: parseInt(brightness),
          rgb_color: hexToRgb(color)
        };
        await onUpdateLight(entityId, updates);
      }
      
      setHasChanges(false);
      onClose?.();
    } catch (error) {
      console.error('Error saving light configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (lightData) {
      const deviceBrightness = lightData.brightness || lightData.attributes?.brightness || 255;
      const deviceBrightnessPercent = lightData.brightnessPercent || Math.round((deviceBrightness / 255) * 100);
      const deviceRgbColor = lightData.rgbColor || lightData.attributes?.rgb_color;
      
      setBrightness(deviceBrightness);
      setBrightnessPercent(deviceBrightnessPercent);
      setColor(rgbToHex(deviceRgbColor));
    }
    setHasChanges(false);
    setIsSaving(false);
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Show loading state for HA client
  if (lightId && loading && isVisible) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading light configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for HA client
  if (lightId && error && isVisible) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <X className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Light</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible || !lightData) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOn ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <Lightbulb className={`w-6 h-6 ${isOn ? 'text-yellow-600 fill-current' : 'text-gray-500'}`} />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-900">{friendlyName}</h2>
              <p className="text-sm text-gray-600">Light Configuration</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Light Status */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
              isOn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isOn ? 'Currently On' : 'Currently Off'}
            </div>
          </div>

          {/* Brightness Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Brightness</h3>
              <span className="text-sm text-gray-600 ml-auto">{brightnessPercent}%</span>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="255"
                value={brightness}
                onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(brightness/255)*100}%, #e5e7eb ${(brightness/255)*100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>
          </div>

          {/* Color Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Color</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="grid grid-cols-6 gap-2">
                {['#ffffff', '#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'].map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => handleColorChange(presetColor)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      color.toLowerCase() === presetColor ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              hasChanges && !isSaving
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving 
              ? 'Saving...' 
              : hasChanges 
                ? 'Save Changes' 
                : 'No Changes'
            }
          </button>
        </div>
      </div>
    </div>
  );
}