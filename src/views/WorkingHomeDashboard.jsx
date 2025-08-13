import { useState, useCallback, useMemo } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import { useWidgetConfig } from '../hooks/useWidgetConfig';

// Let's gradually add back the components
import DeviceCard from '../components/home/DeviceCard';
import SceneCard from '../components/home/SceneCard';
// import DeviceModal from '../components/home/DeviceModal';
// import WidgetToolbar from '../components/home/WidgetToolbar';

function detectInterface() {
  if (typeof window === 'undefined') return 'pi';
  
  const isMobile = window.innerWidth < 768;
  const isStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
  
  return (isMobile && isStandalone) ? 'pwa' : 'pi';
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Home Assistant devices...</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
        <p className="text-red-700 mb-4 text-sm">
          {error?.message || 'Unable to connect to Home Assistant'}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default function WorkingHomeDashboard() {
  console.log('WorkingHomeDashboard rendering...');
  
  const interfaceType = detectInterface();
  
  const { 
    devices, 
    scenes, 
    loading, 
    error, 
    toggleDevice, 
    updateDevice, 
    activateScene,
    callService,
    refreshStates,
    isConnected
  } = useHomeAssistant();
  
  const { layout, saveLayout, resetLayout, addWidget, removeWidget } = useWidgetConfig(interfaceType);
  
  console.log('WorkingHomeDashboard state:', { 
    devices: devices?.length, 
    scenes: scenes?.length, 
    loading, 
    error, 
    layout: layout?.length,
    interfaceType 
  });
  
  const [modalDevice, setModalDevice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDeviceToggle = useCallback(async (entityId) => {
    try {
      console.log('Toggling device:', entityId);
      await toggleDevice(entityId);
    } catch (err) {
      console.error('Failed to toggle device:', err);
    }
  }, [toggleDevice]);

  const handleSceneActivate = useCallback(async (entityId) => {
    try {
      console.log('Activating scene:', entityId);
      await activateScene(entityId);
    } catch (err) {
      console.error('Failed to activate scene:', err);
    }
  }, [activateScene]);

  const handleDeviceUpdate = useCallback(async (entityId, attributes) => {
    try {
      await updateDevice(entityId, attributes);
      
      if (modalDevice?.entity_id === entityId) {
        const updatedDevice = devices.find(d => d.entity_id === entityId);
        if (updatedDevice) {
          setModalDevice(updatedDevice);
        }
      }
    } catch (err) {
      console.error('Failed to update device:', err);
    }
  }, [updateDevice, devices, modalDevice]);

  const handleLongPress = useCallback((entityId) => {
    console.log('Long press on device:', entityId);
    const device = devices.find(d => d.entity_id === entityId);
    if (device && device.entity_id?.includes('light')) {
      setModalDevice(device);
    }
  }, [devices]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refreshStates} />;
  }

  const lights = devices?.filter(device => device.entity_id.startsWith('light.')) || [];
  const switches = devices?.filter(device => device.entity_id.startsWith('switch.')) || [];
  
  const handleAddWidget = useCallback((widgetType) => {
    console.log('Add widget:', widgetType);
    // For now, just log - we can add widget creation later
  }, []);

  const handleSaveLayout = useCallback(() => {
    console.log('Save layout');
    // For now, just log
  }, []);

  const handleResetLayout = useCallback(() => {
    console.log('Reset layout');
    // For now, just log
  }, []);

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-800 text-sm">
          ✅ Home Dashboard! Devices: {devices?.length}, Scenes: {scenes?.length} | Try long-pressing lights for controls
        </p>
      </div>

      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Connection to Home Assistant lost. Attempting to reconnect...
          </p>
        </div>
      )}

      {/* <WidgetToolbar
        onAddWidget={handleAddWidget}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
        onEditMode={setIsEditMode}
        isEditMode={isEditMode}
      /> */}
      
      <div className="max-w-screen-xl mx-auto">
        {/* Lights Section */}
        {lights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Lights ({lights.length})</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {lights.map(light => (
                <DeviceCard
                  key={light.entity_id}
                  device={light}
                  onToggle={handleDeviceToggle}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          </div>
        )}

        {/* Switches Section */}
        {switches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Switches ({switches.length})</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {switches.map(switchDevice => (
                <DeviceCard
                  key={switchDevice.entity_id}
                  device={switchDevice}
                  onToggle={handleDeviceToggle}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scenes Section */}
        {scenes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Scenes ({scenes.length})</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {scenes.map(scene => (
                <SceneCard
                  key={scene.entity_id}
                  scene={scene}
                  onActivate={handleSceneActivate}
                />
              ))}
            </div>
          </div>
        )}

        {devices?.length === 0 && (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <p className="text-xl text-gray-600 mb-2">No devices found</p>
              <p className="text-gray-500">Check your Home Assistant configuration</p>
            </div>
          </div>
        )}
      </div>

      {/* DeviceModal causes crash - need to debug */}
      {modalDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{modalDevice.attributes?.friendly_name}</h2>
              <button 
                onClick={() => setModalDevice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              State: {modalDevice.state} | Entity: {modalDevice.entity_id}
            </p>
            <button
              onClick={() => {
                handleDeviceToggle(modalDevice.entity_id);
                setModalDevice(null);
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Toggle Device
            </button>
          </div>
        </div>
      )}
    </div>
  );
}