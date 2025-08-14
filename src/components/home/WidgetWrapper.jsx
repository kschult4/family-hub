import { Edit3 } from 'lucide-react';

export default function WidgetWrapper({ 
  children, 
  widget, 
  isEditMode, 
  onEditWidget,
  onRemoveWidget 
}) {
  const getWidgetTitle = (widgetType) => {
    switch (widgetType) {
      case 'lights': return 'Lights';
      case 'switches': return 'Switches';
      case 'scenes': return 'Scenes';
      case 'media': return 'Media';
      case 'security': return 'Security';
      case 'climate': return 'Climate';
      default: return 'Widget';
    }
  };

  const canBeEdited = (widgetType) => {
    return ['lights', 'switches', 'scenes'].includes(widgetType);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditWidget?.(widget);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemoveWidget?.(widget);
  };

  return (
    <div className="relative group">
      {/* Widget Header - only show in edit mode */}
      {isEditMode && (
        <div className="absolute -top-2 left-0 right-0 z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-t-lg border border-gray-200 px-3 py-1">
          <span className="text-xs font-medium text-gray-600 truncate">
            {getWidgetTitle(widget.type)}
          </span>
          <div className="flex items-center gap-1">
            {canBeEdited(widget.type) && (
              <button
                onClick={handleEditClick}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit widget"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={handleRemoveClick}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove widget"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Widget Content */}
      <div className={`${isEditMode ? 'mt-6' : ''}`}>
        {children}
      </div>
    </div>
  );
}