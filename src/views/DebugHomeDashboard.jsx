// Step-by-step debugging version
import { useState, useCallback, useMemo } from 'react';

// Let's start by testing just the hooks
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import { useWidgetConfig } from '../hooks/useWidgetConfig';

function detectInterface() {
  if (typeof window === 'undefined') return 'pi';
  
  const isMobile = window.innerWidth < 768;
  const isStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
  
  return (isMobile && isStandalone) ? 'pwa' : 'pi';
}

export default function DebugHomeDashboard() {
  console.log('DebugHomeDashboard rendering...');
  
  try {
    const interfaceType = detectInterface();
    console.log('Interface type:', interfaceType);
    
    // Test the hooks one by one
    console.log('About to call useHomeAssistant...');
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
    
    console.log('useHomeAssistant result:', { devices: devices?.length, scenes: scenes?.length, loading, error, isConnected });
    
    console.log('About to call useWidgetConfig...');
    const { layout, saveLayout, resetLayout, addWidget, removeWidget } = useWidgetConfig(interfaceType);
    console.log('useWidgetConfig result:', { layout: layout?.length });
    
    const [modalDevice, setModalDevice] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Home Assistant devices...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-700 mb-4 text-sm">
              {error?.message || 'Unable to connect to Home Assistant'}
            </p>
            <button
              onClick={refreshStates}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-2 sm:p-4">
        <h1 className="text-xl font-bold mb-4">Debug Home Dashboard</h1>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            ✅ Hooks working! Interface: {interfaceType}, Devices: {devices?.length}, Scenes: {scenes?.length}, Layout: {layout?.length}
          </p>
        </div>

        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              ⚠️ Connection to Home Assistant lost. Attempting to reconnect...
            </p>
          </div>
        )}
        
        <div className="max-w-screen-xl mx-auto">
          {devices?.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <p className="text-xl text-gray-600 mb-2">No devices found</p>
                <p className="text-gray-500">Check your Home Assistant configuration</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">Found {devices?.length} devices and {scenes?.length} scenes</p>
              
              {/* Show first few devices as simple list */}
              <div className="space-y-2">
                {devices?.slice(0, 5).map(device => (
                  <div key={device.entity_id} className="p-3 border rounded-lg">
                    <h3 className="font-medium">{device.attributes?.friendly_name || device.entity_id}</h3>
                    <p className="text-sm text-gray-600">State: {device.state}</p>
                    <button 
                      onClick={() => toggleDevice(device.entity_id)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Toggle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error in DebugHomeDashboard:', error);
    return (
      <div className="p-4">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 mb-2">💥</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Component Crashed</h3>
          <p className="text-red-700 mb-4 text-sm">
            {error.message}
          </p>
          <pre className="text-xs text-left bg-red-100 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}