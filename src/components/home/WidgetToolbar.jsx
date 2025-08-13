import { useState } from 'react';
import { Plus, Save, RotateCcw, Settings, X, Lightbulb, Zap, Music, Shield, Camera, Thermometer } from 'lucide-react';

export default function WidgetToolbar({ 
  onAddWidget, 
  onSaveLayout, 
  onResetLayout,
  onEditMode,
  isEditMode = false 
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const widgetTypes = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Control lights' 
    },
    { 
      id: 'switch', 
      name: 'Switch', 
      icon: <Zap className="w-5 h-5" />,
      description: 'Toggle switches' 
    },
    { 
      id: 'scene', 
      name: 'Scene', 
      icon: <Settings className="w-5 h-5" />,
      description: 'Activate scenes' 
    },
    { 
      id: 'spotify', 
      name: 'Spotify', 
      icon: <Music className="w-5 h-5" />,
      description: 'Music controls' 
    },
    { 
      id: 'ring-alarm', 
      name: 'Ring Alarm', 
      icon: <Shield className="w-5 h-5" />,
      description: 'Security system' 
    },
    { 
      id: 'ring-camera', 
      name: 'Ring Camera', 
      icon: <Camera className="w-5 h-5" />,
      description: 'Camera feeds' 
    },
    { 
      id: 'thermostat', 
      name: 'Thermostat', 
      icon: <Thermometer className="w-5 h-5" />,
      description: 'Temperature control' 
    }
  ];

  const handleAddWidget = (widgetType) => {
    onAddWidget?.(widgetType);
    setShowAddMenu(false);
  };

  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      await onSaveLayout?.();
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save layout:', error);
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Main Toolbar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-3 max-w-screen-xl mx-auto">
          {/* Left Side - Add Widget */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Widget</span>
            </button>
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-800">Smart Home</h1>
            {isEditMode && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                Edit Mode
              </span>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditMode?.(!isEditMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isEditMode 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
            >
              {isEditMode ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onResetLayout}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 active:scale-95"
              title="Reset Layout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleSaveLayout}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                isSaving 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isSaving ? 'Saved!' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Widget Menu */}
      {showAddMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add Widget</h2>
              <button
                onClick={() => setShowAddMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Widget Types */}
            <div className="p-4">
              <div className="grid gap-3">
                {widgetTypes.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => handleAddWidget(widget.id)}
                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left w-full group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors">
                      {widget.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 group-hover:text-blue-800 transition-colors">
                        {widget.name}
                      </h3>
                      <p className="text-sm text-gray-500">{widget.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}