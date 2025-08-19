import { useState, useEffect } from 'react';
import { haClient } from '../../services/homeAssistantClient';

export function ScenesSelectorModal({ isOpen, onClose, selectedScenes = [], onScenesChange, availableScenes = [] }) {
  const [selectedIds, setSelectedIds] = useState(new Set(selectedScenes.map(s => s.id)));
  const [loading] = useState(false);
  const [error] = useState(null);

  // Only reset selected IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(selectedScenes.map(s => s.id)));
    }
  }, [isOpen]);

  const handleSceneToggle = (sceneId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(sceneId)) {
      newSelectedIds.delete(sceneId);
    } else {
      newSelectedIds.add(sceneId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleAddSelected = () => {
    const newSelectedScenes = availableScenes.filter(scene => selectedIds.has(scene.id));
    onScenesChange(newSelectedScenes);
    onClose();
  };

  const handleCancel = () => {
    setSelectedIds(new Set(selectedScenes.map(s => s.id)));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Scenes</h2>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading scenes: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {availableScenes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No scenes available</p>
              ) : (
                <div className="space-y-2">
                  {availableScenes.map((scene) => (
                    <label
                      key={scene.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(scene.id)}
                        onChange={() => handleSceneToggle(scene.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          {scene.icon && (
                            <span className="text-lg mr-2">{scene.icon}</span>
                          )}
                          <span className="font-medium text-gray-900">{scene.name}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedIds.size === 0}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Update ({selectedIds.size})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}