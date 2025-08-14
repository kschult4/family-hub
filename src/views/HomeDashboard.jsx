import { useState, useCallback, useMemo } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import { useWidgetConfig } from '../hooks/useWidgetConfig';

import WidgetGrid from '../components/home/WidgetGrid';
import WidgetToolbar from '../components/home/WidgetToolbar';
import WidgetWrapper from '../components/home/WidgetWrapper';
import DeviceCard from '../components/home/DeviceCard';
import SceneCard from '../components/home/SceneCard';
import DeviceModal from '../components/home/DeviceModal';
import { DevicesSelectorModal } from '../components/home/DevicesSelectorModal';
import { ScenesSelectorModal } from '../components/home/ScenesSelectorModal';
import SpotifyWidget from '../components/home/SpotifyWidget';
import SonosMediaPlayerCard from '../components/home/SonosMediaPlayerCard';
import RingAlarmWidget from '../components/home/RingAlarmWidget';
import RingCameraWidget from '../components/home/RingCameraWidget';
import ThermostatWidget from '../components/home/ThermostatWidget';

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

export default function HomeDashboard() {
  console.log('🏠 HomeDashboard rendering...');
  
  // Temporary simple render to test
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Home Dashboard (Test)</h1>
      <p>This is the HomeDashboard component rendering correctly!</p>
    </div>
  );
  
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
  
  const { layout, saveLayout, resetLayout, addWidget, removeWidget, updateWidgetDevices, updateWidgetScenes } = useWidgetConfig(interfaceType);
  
  console.log('HomeDashboard state:', { devices: devices.length, scenes: scenes.length, loading, error, layout: layout.length });
  console.log('🔍 Available devices:', devices.map(d => ({ 
    entity_id: d.entity_id, 
    state: d.state, 
    friendly_name: d.attributes?.friendly_name 
  })));
  
  const [modalDevice, setModalDevice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [devicesSelectorModal, setDevicesSelectorModal] = useState({ isOpen: false, widget: null });
  const [scenesSelectorModal, setScenesSelectorModal] = useState({ isOpen: false, widget: null });

  const handleDeviceToggle = useCallback(async (entityId) => {
    try {
      await toggleDevice(entityId);
    } catch (err) {
      console.error('Failed to toggle device:', err);
    }
  }, [toggleDevice]);

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

  const handleSceneActivate = useCallback(async (entityId) => {
    try {
      await activateScene(entityId);
    } catch (err) {
      console.error('Failed to activate scene:', err);
    }
  }, [activateScene]);

  const handleLongPress = useCallback((entityId) => {
    if (isEditMode) return;
    
    const device = devices.find(d => d.entity_id === entityId);
    if (device && device.entity_id?.includes('light')) {
      setModalDevice(device);
    }
  }, [devices, isEditMode]);

  const getDevicesByType = useCallback((domain) => {
    return devices.filter(device => device.entity_id.startsWith(`${domain}.`));
  }, [devices]);

  const getSpecialDevices = useMemo(() => {
    const mediaPlayers = devices.filter(device => device.entity_id.startsWith('media_player.'));
    const alarmPanels = devices.filter(device => device.entity_id.startsWith('alarm_control_panel.'));
    const cameras = devices.filter(device => device.entity_id.startsWith('camera.'));
    const thermostats = devices.filter(device => device.entity_id.startsWith('climate.'));
    
    return {
      sonosDevices: mediaPlayers.filter(d => d.attributes?.device_class === 'speaker'),
      ringAlarm: alarmPanels.find(d => d.attributes?.friendly_name?.toLowerCase().includes('ring')),
      ringCameras: cameras.filter(d => d.attributes?.friendly_name?.toLowerCase().includes('ring')),
      thermostats: thermostats
    };
  }, [devices]);

  const createWidgetComponent = useCallback((widgetConfig) => {
    const { type, id } = widgetConfig;
    
    switch (type) {
      case 'lights': {
        const allLights = getDevicesByType('light');
        const selectedLights = widgetConfig.selectedDevices || allLights.slice(0, 6);
        const lightsToShow = selectedLights.length > 0 
          ? selectedLights.map(selectedLight => 
              allLights.find(light => light.entity_id === selectedLight.entity_id || light.entity_id === selectedLight.id) || selectedLight
            ).filter(Boolean)
          : allLights.slice(0, 6);
          
        return lightsToShow.map(light => (
          <DeviceCard
            key={`${id}-${light.entity_id}`}
            device={light}
            onToggle={handleDeviceToggle}
            onLongPress={handleLongPress}
          />
        ));
      }
      
      case 'switches': {
        const allSwitches = getDevicesByType('switch');
        const selectedSwitches = widgetConfig.selectedDevices || allSwitches.slice(0, 6);
        const switchesToShow = selectedSwitches.length > 0 
          ? selectedSwitches.map(selectedSwitch => 
              allSwitches.find(switchDevice => switchDevice.entity_id === selectedSwitch.entity_id || switchDevice.entity_id === selectedSwitch.id) || selectedSwitch
            ).filter(Boolean)
          : allSwitches.slice(0, 6);
          
        return switchesToShow.map(switchDevice => (
          <DeviceCard
            key={`${id}-${switchDevice.entity_id}`}
            device={switchDevice}
            onToggle={handleDeviceToggle}
            onLongPress={handleLongPress}
          />
        ));
      }
      
      case 'scenes': {
        const selectedScenes = widgetConfig.selectedScenes || scenes.slice(0, 6);
        const scenesToShow = selectedScenes.length > 0 
          ? selectedScenes.map(selectedScene => 
              scenes.find(scene => scene.entity_id === selectedScene.entity_id || scene.entity_id === selectedScene.id) || selectedScene
            ).filter(Boolean)
          : scenes.slice(0, 6);
          
        return scenesToShow.map(scene => (
          <SceneCard
            key={`${id}-${scene.entity_id}`}
            scene={scene}
            onActivate={handleSceneActivate}
          />
        ));
      }
      
      case 'media': {
        const specialDevices = getSpecialDevices();
        if (specialDevices.sonosDevices && specialDevices.sonosDevices.length > 0) {
          return (
            <SonosMediaPlayerCard
              key={`${id}-sonos`}
              onError={(error) => console.error('Sonos error:', error)}
            />
          );
        }
        return <div key={`${id}-no-media`} className="p-4 text-center text-gray-500">No media player found</div>;
      }
      
      case 'security': {
        const specialDevices = getSpecialDevices();
        const widgets = [];
        
        if (specialDevices.ringAlarm) {
          const alarmData = {
            status: specialDevices.ringAlarm.state || 'disarmed',
            isConnected: specialDevices.ringAlarm.state !== 'unavailable',
            lastChanged: specialDevices.ringAlarm.last_changed || null,
            batteryStatus: specialDevices.ringAlarm.attributes?.battery_status || {},
            sensorStatuses: specialDevices.ringAlarm.attributes?.sensor_statuses || []
          };
          
          widgets.push(
            <RingAlarmWidget
              key={`${id}-alarm`}
              alarmData={alarmData}
              onArmHome={() => callService('alarm_control_panel', 'alarm_arm_home', { entity_id: specialDevices.ringAlarm.entity_id })}
              onArmAway={() => callService('alarm_control_panel', 'alarm_arm_away', { entity_id: specialDevices.ringAlarm.entity_id })}
              onDisarm={() => callService('alarm_control_panel', 'alarm_disarm', { entity_id: specialDevices.ringAlarm.entity_id })}
            />
          );
        }
        
        specialDevices.ringCameras.forEach(camera => {
          const cameraData = {
            name: camera.attributes?.friendly_name || camera.entity_id,
            isOnline: camera.state !== 'unavailable',
            isRecording: camera.state === 'recording',
            lastSnapshot: camera.attributes?.entity_picture || null,
            lastMotion: camera.attributes?.last_motion || null,
            batteryLevel: camera.attributes?.battery_level || null,
            liveStreamUrl: camera.attributes?.stream_source || null
          };
          
          widgets.push(
            <RingCameraWidget
              key={`${id}-${camera.entity_id}`}
              cameraData={cameraData}
              onViewLive={() => console.log('View live camera:', camera.entity_id)}
              onToggleRecording={() => callService('camera', 'record', { entity_id: camera.entity_id })}
              onRefreshFeed={() => refreshStates()}
            />
          );
        });
        
        return widgets.length > 0 ? widgets : 
          <div key={`${id}-no-security`} className="p-4 text-center text-gray-500">No security devices found</div>;
      }
      
      case 'climate': {
        const specialDevices = getSpecialDevices();
        return specialDevices.thermostats.map(thermostat => {
          const thermostatData = {
            currentTemp: thermostat.attributes?.current_temperature || 70,
            targetTemp: thermostat.attributes?.temperature || 70,
            mode: thermostat.state || 'off',
            location: thermostat.attributes?.friendly_name?.toLowerCase().includes('upstairs') ? 'upstairs' : 'downstairs',
            isOnline: thermostat.state !== 'unavailable',
            humidity: thermostat.attributes?.current_humidity || null,
            isHeating: thermostat.attributes?.hvac_action === 'heating',
            isCooling: thermostat.attributes?.hvac_action === 'cooling',
            fanRunning: thermostat.attributes?.fan_state === 'on',
            schedule: thermostat.attributes?.preset_mode === 'schedule'
          };
          
          return (
            <ThermostatWidget
              key={`${id}-${thermostat.entity_id}`}
              thermostatData={thermostatData}
              onSetTemperature={(temp) => callService('climate', 'set_temperature', { 
                entity_id: thermostat.entity_id, 
                temperature: temp 
              })}
              onSetMode={(mode) => callService('climate', 'set_hvac_mode', { 
                entity_id: thermostat.entity_id, 
                hvac_mode: mode 
              })}
            />
          );
        });
      }
      
      default:
        return <div key={`${id}-unknown`} className="p-4 text-center text-gray-500">Unknown widget type</div>;
    }
  }, [
    getDevicesByType, 
    scenes, 
    getSpecialDevices, 
    handleDeviceToggle, 
    handleLongPress, 
    handleSceneActivate, 
    callService,
    refreshStates
  ]);

  const widgets = useMemo(() => {
    return layout.map(widgetConfig => {
      const components = createWidgetComponent(widgetConfig);
      return {
        id: widgetConfig.id,
        type: widgetConfig.type,
        config: widgetConfig,
        components: Array.isArray(components) ? components : [components]
      };
    }).filter(widget => widget.components && widget.components.length > 0);
  }, [layout, createWidgetComponent]);

  const flatWidgets = useMemo(() => {
    return widgets.flatMap(widget => 
      widget.components.map((component, index) => ({
        id: `${widget.id}-${index}`,
        type: widget.type,
        config: widget.config,
        component: (
          <WidgetWrapper
            widget={{ id: `${widget.id}-${index}`, type: widget.type }}
            isEditMode={isEditMode}
            onEditWidget={handleEditWidget}
            onRemoveWidget={handleRemoveWidget}
          >
            {component}
          </WidgetWrapper>
        )
      }))
    );
  }, [widgets, isEditMode, handleEditWidget, handleRemoveWidget]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const newWidgets = Array.from(flatWidgets);
    const [reorderedItem] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedItem);
    
    console.log('Widget reordered:', result);
  }, [flatWidgets]);

  const handleAddWidget = useCallback((widgetType) => {
    // Map toolbar widget types to layout widget types
    const widgetTypeMap = {
      'light': 'lights',
      'switch': 'switches', 
      'scene': 'scenes',
      'spotify': 'media',
      'ring-alarm': 'security',
      'ring-camera': 'security',
      'thermostat': 'climate'
    };
    
    const mappedType = widgetTypeMap[widgetType] || widgetType;
    addWidget(mappedType);
  }, [addWidget]);

  const handleSaveLayout = useCallback(() => {
    saveLayout(layout);
  }, [saveLayout, layout]);

  const handleResetLayout = useCallback(() => {
    resetLayout();
  }, [resetLayout]);

  const handleWidgetPress = useCallback((widget) => {
    if (!isEditMode) {
      console.log('Widget pressed:', widget.id);
    }
  }, [isEditMode]);

  const handleWidgetLongPress = useCallback((widget) => {
    if (isEditMode) {
      console.log('Remove widget:', widget.id);
    } else {
      console.log('Widget long press:', widget.id);
    }
  }, [isEditMode]);

  const handleEditWidget = useCallback((widget) => {
    const widgetConfig = layout.find(w => w.id === widget.id.split('-')[0]);
    if (!widgetConfig) return;

    if (widgetConfig.type === 'scenes') {
      setScenesSelectorModal({ isOpen: true, widget: widgetConfig });
    } else if (['lights', 'switches'].includes(widgetConfig.type)) {
      setDevicesSelectorModal({ isOpen: true, widget: widgetConfig });
    }
  }, [layout]);

  const handleRemoveWidget = useCallback((widget) => {
    const widgetId = widget.id.split('-')[0];
    removeWidget(widgetId);
  }, [removeWidget]);

  const handleDevicesChange = useCallback((selectedDevices) => {
    if (devicesSelectorModal.widget) {
      updateWidgetDevices(devicesSelectorModal.widget.id, selectedDevices);
    }
    setDevicesSelectorModal({ isOpen: false, widget: null });
  }, [devicesSelectorModal.widget, updateWidgetDevices]);

  const handleScenesChange = useCallback((selectedScenes) => {
    if (scenesSelectorModal.widget) {
      updateWidgetScenes(scenesSelectorModal.widget.id, selectedScenes);
    }
    setScenesSelectorModal({ isOpen: false, widget: null });
  }, [scenesSelectorModal.widget, updateWidgetScenes]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refreshStates} />;
  }

  const isMobile = interfaceType === 'pwa';

  return (
    <div className={`p-2 sm:p-4 ${isMobile ? 'pb-6' : ''}`}>
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Connection to Home Assistant lost. Attempting to reconnect...
          </p>
        </div>
      )}
      
      <WidgetToolbar
        onAddWidget={handleAddWidget}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
        onEditMode={setIsEditMode}
        isEditMode={isEditMode}
      />
      
      <div className="max-w-screen-xl mx-auto">
        {flatWidgets.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <p className="text-xl text-gray-600 mb-2">No widgets configured</p>
              <p className="text-gray-500">Click "Add Widget" to get started with your home dashboard!</p>
            </div>
          </div>
        ) : (
          <WidgetGrid
            widgets={flatWidgets}
            onDragEnd={handleDragEnd}
            onWidgetPress={handleWidgetPress}
            onWidgetLongPress={handleWidgetLongPress}
          />
        )}
      </div>

      <DeviceModal
        device={modalDevice}
        isOpen={!!modalDevice}
        onClose={() => setModalDevice(null)}
        onToggle={handleDeviceToggle}
        onBrightnessChange={(entityId, brightness) => handleDeviceUpdate(entityId, { brightness })}
        onColorChange={(entityId, color) => handleDeviceUpdate(entityId, { rgb_color: color })}
      />

      <DevicesSelectorModal
        isOpen={devicesSelectorModal.isOpen}
        onClose={() => setDevicesSelectorModal({ isOpen: false, widget: null })}
        selectedDevices={devicesSelectorModal.widget?.selectedDevices || []}
        onDevicesChange={handleDevicesChange}
      />

      <ScenesSelectorModal
        isOpen={scenesSelectorModal.isOpen}
        onClose={() => setScenesSelectorModal({ isOpen: false, widget: null })}
        selectedScenes={scenesSelectorModal.widget?.selectedScenes || []}
        onScenesChange={handleScenesChange}
      />
    </div>
  );
}