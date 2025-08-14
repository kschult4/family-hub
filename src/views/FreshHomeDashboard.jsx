import { useState, useEffect } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import LightCard from '../components/home/LightCard';
import SwitchCard from '../components/home/SwitchCard';
import LightConfigModal from '../components/home/LightConfigModal';
import { DevicesSelectorModal } from '../components/home/DevicesSelectorModal';
import { ScenesSelectorModal } from '../components/home/ScenesSelectorModal';
import SceneCard from '../components/home/SceneCard';
import SpotifyWidget from '../components/home/SpotifyWidget';
import SonosMediaPlayerCard from '../components/home/SonosMediaPlayerCard';
import RingAlarmWidget from '../components/home/RingAlarmWidget';
import ThermostatWidget from '../components/home/ThermostatWidget';
import SectionHeader from '../components/SectionHeader';
import { Edit3 } from 'lucide-react';

export default function FreshHomeDashboard() {
  console.log('🏠 FreshHomeDashboard component is rendering');
  const { devices, scenes, loading, error, toggleDevice, updateDevice, activateScene, callService, isConnected } = useHomeAssistant();
  console.log('🏠 Loading:', loading, 'Error:', error, 'Devices:', devices?.length, 'Scenes:', scenes?.length);
  const [selectedLight, setSelectedLight] = useState(null);
  const [showLightConfig, setShowLightConfig] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [showScenesModal, setShowScenesModal] = useState(false);
  
  // Get all available devices first
  const allLights = devices?.filter(d => d.entity_id.startsWith('light.')) || [];
  const allSwitches = devices?.filter(d => d.entity_id.startsWith('switch.')) || [];
  const allScenes = scenes || [];
  
  // State for managing which items are selected for display
  const [selectedScenes, setSelectedScenes] = useState(() => {
    const saved = localStorage.getItem('selectedScenes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedDevices, setSelectedDevices] = useState(() => {
    const saved = localStorage.getItem('selectedDevices');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [hasInitialized, setHasInitialized] = useState(false);

  // Save selections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedScenes', JSON.stringify([...selectedScenes]));
  }, [selectedScenes]);

  useEffect(() => {
    localStorage.setItem('selectedDevices', JSON.stringify([...selectedDevices]));
  }, [selectedDevices]);

  // Initialize selections when data first loads
  useEffect(() => {
    console.log('🔧 Initialization check:', { hasInitialized, loading, allScenes: allScenes.length, allLights: allLights.length, allSwitches: allSwitches.length });
    if (!hasInitialized && !loading && (allScenes.length > 0 || allLights.length > 0 || allSwitches.length > 0)) {
      // Check if we have saved selections
      const savedScenes = localStorage.getItem('selectedScenes');
      const savedDevices = localStorage.getItem('selectedDevices');
      console.log('🔧 Saved data:', { savedScenes, savedDevices });
      console.log('🔧 Saved data types:', { savedScenesType: typeof savedScenes, savedDevicesType: typeof savedDevices });
      console.log('🔧 Should select scenes?', !savedScenes && allScenes.length > 0, { savedScenes, scenesCount: allScenes.length });
      console.log('🔧 Should select devices?', !savedDevices && (allLights.length > 0 || allSwitches.length > 0), { savedDevices, lightsCount: allLights.length, switchesCount: allSwitches.length });
      
      // Only auto-select if no saved selections exist
      if (!savedScenes && allScenes.length > 0) {
        console.log('🔧 No saved scenes, selecting all scenes:', allScenes.map(s => s.entity_id));
        setSelectedScenes(new Set(allScenes.map(s => s.entity_id)));
      }
      
      if (!savedDevices && (allLights.length > 0 || allSwitches.length > 0)) {
        const deviceIds = [...allLights, ...allSwitches].map(d => d.entity_id);
        console.log('🔧 No saved devices, selecting all devices:', deviceIds);
        setSelectedDevices(new Set(deviceIds));
      }
      
      setHasInitialized(true);
      console.log('🔧 Initialization completed');
    }
  }, [allScenes, allLights, allSwitches, loading, hasInitialized]);

  // Auto-add new devices/scenes when they become available (after initialization)
  // DISABLED: This was causing devices to be re-added after user unchecked them
  // useEffect(() => {
  //   if (hasInitialized && allScenes.length > 0) {
  //     const currentIds = new Set([...selectedScenes]);
  //     const newScenes = allScenes.filter(scene => !currentIds.has(scene.entity_id));
  //     if (newScenes.length > 0) {
  //       setSelectedScenes(prev => new Set([...prev, ...newScenes.map(s => s.entity_id)]));
  //     }
  //   }
  // }, [allScenes, selectedScenes, hasInitialized]);

  // useEffect(() => {
  //   if (hasInitialized && (allLights.length > 0 || allSwitches.length > 0)) {
  //     const currentIds = new Set([...selectedDevices]);
  //     const newDevices = [...allLights, ...allSwitches].filter(device => !currentIds.has(device.entity_id));
  //     if (newDevices.length > 0) {
  //       setSelectedDevices(prev => new Set([...prev, ...newDevices.map(d => d.entity_id)]));
  //     }
  //   }
  // }, [allLights, allSwitches, selectedDevices, hasInitialized]);

  // Modal handlers
  const handleDevicesChange = (newSelectedDevices) => {
    console.log('🔧 handleDevicesChange called with:', newSelectedDevices);
    const deviceIds = newSelectedDevices.map(d => d.entity_id || d.id);
    console.log('🔧 Device IDs to select:', deviceIds);
    setSelectedDevices(new Set(deviceIds));
    setShowDevicesModal(false);
  };

  const handleScenesChange = (newSelectedScenes) => {
    console.log('🎬 handleScenesChange called with:', newSelectedScenes);
    const sceneIds = newSelectedScenes.map(s => s.entity_id || s.id);
    console.log('🎬 Scene IDs to select:', sceneIds);
    setSelectedScenes(new Set(sceneIds));
    setShowScenesModal(false);
  };

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
        </div>
      </div>
    );
  }

  // Filter to only show selected items
  const lights = allLights.filter(light => selectedDevices.has(light.entity_id));
  const switches = allSwitches.filter(switchDevice => selectedDevices.has(switchDevice.entity_id));
  const scenes_list = allScenes.filter(scene => selectedScenes.has(scene.entity_id));

  // Debug logging
  console.log('🔍 FreshHomeDashboard - Available devices:', devices?.map(d => ({
    entity_id: d.entity_id,
    state: d.state,
    friendly_name: d.attributes?.friendly_name
  })));
  console.log('🔍 FreshHomeDashboard - Available scenes:', scenes?.map(s => s.entity_id));
  console.log('🔍 FreshHomeDashboard - Selected scenes:', [...selectedScenes]);
  console.log('🔍 FreshHomeDashboard - Selected devices:', [...selectedDevices]);
  console.log('🔍 FreshHomeDashboard - Visible scenes:', scenes_list.length, 'Total scenes:', allScenes.length);
  console.log('🔍 FreshHomeDashboard - Visible devices:', lights.length + switches.length, 'Total devices:', allLights.length + allSwitches.length);
  
  // DEBUG: Check if entity IDs match
  console.log('🔍 DEBUG - Available scene IDs:', allScenes.map(s => s.entity_id));
  console.log('🔍 DEBUG - Available light IDs:', allLights.map(d => d.entity_id)); 
  console.log('🔍 DEBUG - Available switch IDs:', allSwitches.map(d => d.entity_id));
  console.log('🔍 DEBUG - Selected scene IDs:', [...selectedScenes]);
  console.log('🔍 DEBUG - Selected device IDs:', [...selectedDevices]);
  console.log('🔍 DEBUG - Selected scene IDs that exist:', [...selectedScenes].filter(id => allScenes.some(s => s.entity_id === id)));
  console.log('🔍 DEBUG - Selected device IDs that exist:', [...selectedDevices].filter(id => [...allLights, ...allSwitches].some(d => d.entity_id === id)));

  // Special devices - be more flexible with entity matching
  const mediaPlayers = devices?.filter(d => d.entity_id.startsWith('media_player.')) || [];
  const sonosDevices = mediaPlayers.filter(d => 
    d.attributes?.device_class === 'speaker' || 
    d.entity_id.toLowerCase().includes('sonos') ||
    d.attributes?.friendly_name?.toLowerCase().includes('sonos')
  );
  const spotifyDevice = mediaPlayers.find(d => 
    d.entity_id.includes('spotify') || 
    d.attributes?.friendly_name?.toLowerCase().includes('spotify')
  );
  
  const alarmPanels = devices?.filter(d => d.entity_id.startsWith('alarm_control_panel.')) || [];
  const ringAlarm = alarmPanels.find(d => 
    d.entity_id.includes('ring') || 
    d.attributes?.friendly_name?.toLowerCase().includes('ring')
  );
  
  const thermostats = devices?.filter(d => d.entity_id.startsWith('climate.')) || [];
  
  console.log('🔍 FreshHomeDashboard - Special devices found:', {
    spotifyDevice: spotifyDevice?.entity_id || null,
    sonosDevices: sonosDevices.map(d => d.entity_id),
    ringAlarm: ringAlarm?.entity_id || null,
    thermostats: thermostats.map(d => d.entity_id),
    allMediaPlayers: mediaPlayers.map(d => ({ entity_id: d.entity_id, friendly_name: d.attributes?.friendly_name })),
    allAlarmPanels: alarmPanels.map(d => ({ entity_id: d.entity_id, friendly_name: d.attributes?.friendly_name }))
  });

  const handleLightLongPress = (entityId) => {
    const light = devices?.find(d => d.entity_id === entityId);
    if (light) {
      setSelectedLight(light);
      setShowLightConfig(true);
    }
  };

  const handleUpdateLight = (entityId, updates) => {
    if (updateDevice) {
      updateDevice(entityId, updates);
    }
  };

  const handleCloseLightConfig = () => {
    setShowLightConfig(false);
    setSelectedLight(null);
  };

  return (
    <div className="p-2 sm:p-4 overflow-y-auto scrollbar-hide">
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Connection to Home Assistant lost. Attempting to reconnect...
          </p>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto">

        {/* Scenes Section - Top Priority */}
        {scenes_list.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-3">
              <SectionHeader title="Scenes" className="mb-0" />
              <button 
                onClick={() => setShowScenesModal(true)}
                className="p-1 text-gray-800 hover:text-gray-600 transition-colors ml-5"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-2">
              {scenes_list.map(scene => (
                <SceneCard
                  key={scene.entity_id}
                  sceneId={scene.entity_id}
                  scene={scene}
                  onActivate={activateScene}
                />
              ))}
            </div>
          </div>
        )}


        {/* Unified Device Grid - All devices and widgets on same grid */}
        {(lights.length > 0 || switches.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-3">
              <SectionHeader title="Devices" className="mb-0" />
              <button 
                onClick={() => setShowDevicesModal(true)}
                className="p-1 text-gray-800 hover:text-gray-600 transition-colors ml-5"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[120px]">
              {/* Regular Device Cards - COLUMNS 1-2 ONLY */}
              <div className="col-span-2 grid grid-cols-2 gap-4 auto-rows-[120px]">
                {/* Light Cards */}
                {lights.map(light => (
                  <LightCard
                    key={light.entity_id}
                    lightId={light.entity_id}
                    device={light}
                    onToggle={toggleDevice}
                    onLongPress={handleLightLongPress}
                  />
                ))}
                
                {/* Switch Cards */}
                {switches.map(switchDevice => (
                  <SwitchCard
                    key={switchDevice.entity_id}
                    switchId={switchDevice.entity_id}
                    device={switchDevice}
                    onToggle={toggleDevice}
                  />
                ))}
              </div>
              
              {/* Special Widgets - COLUMNS 3-4 ONLY */}
              <div className="col-span-2 sm:col-start-3 sm:col-end-5 grid grid-cols-2 gap-4 auto-rows-[120px]">
                {/* Ring Alarm - Half width (1 column) - TOP */}
                {ringAlarm && (
                  <div className="col-span-1 row-span-2">
                    <RingAlarmWidget
                      alarmPanelId={ringAlarm.entity_id}
                      alarmData={{
                        status: ringAlarm.state || 'disarmed',
                        isConnected: ringAlarm.state !== 'unavailable',
                        lastChanged: ringAlarm.last_changed || null,
                        batteryStatus: ringAlarm.attributes?.battery_status || {},
                        sensorStatuses: ringAlarm.attributes?.sensor_statuses || []
                      }}
                      onArmHome={() => callService('alarm_control_panel', 'alarm_arm_home', { entity_id: ringAlarm.entity_id })}
                      onArmAway={() => callService('alarm_control_panel', 'alarm_arm_away', { entity_id: ringAlarm.entity_id })}
                      onDisarm={() => callService('alarm_control_panel', 'alarm_disarm', { entity_id: ringAlarm.entity_id })}
                    />
                  </div>
                )}
                
                {/* Thermostat - Half width (1 column) - TOP */}
                {thermostats.length > 0 && (
                  <div className="col-span-1 row-span-2">
                    <ThermostatWidget
                      thermostatData={{
                        currentTemp: thermostats[0].attributes?.current_temperature || 70,
                        targetTemp: thermostats[0].attributes?.temperature || 70,
                        mode: thermostats[0].state || 'off',
                        location: thermostats[0].attributes?.friendly_name?.toLowerCase().includes('upstairs') ? 'upstairs' : 'downstairs',
                        isOnline: thermostats[0].state !== 'unavailable',
                        humidity: thermostats[0].attributes?.current_humidity || null,
                        isHeating: thermostats[0].attributes?.hvac_action === 'heating',
                        isCooling: thermostats[0].attributes?.hvac_action === 'cooling',
                        fanRunning: thermostats[0].attributes?.fan_state === 'on',
                        schedule: thermostats[0].attributes?.preset_mode === 'schedule'
                      }}
                      onSetTemperature={(temp) => callService('climate', 'set_temperature', { 
                        entity_id: thermostats[0].entity_id, 
                        temperature: temp 
                      })}
                      onSetMode={(mode) => callService('climate', 'set_hvac_mode', { 
                        entity_id: thermostats[0].entity_id, 
                        hvac_mode: mode 
                      })}
                    />
                  </div>
                )}
                
                {/* Media Players - Sonos or Spotify - Spans full width, multiple rows - BOTTOM */}
                {(sonosDevices.length > 0 || spotifyDevice) && (
                  <div className="col-span-2 row-span-3">
                    {sonosDevices.length > 0 ? (
                      <SonosMediaPlayerCard
                        key="sonos-widget"
                        onError={(error) => console.error('Sonos error:', error)}
                      />
                    ) : spotifyDevice && (
                      <SpotifyWidget
                        spotifyData={{
                          isPlaying: spotifyDevice.state === 'playing',
                          currentTrack: spotifyDevice.attributes?.media_title || null,
                          artist: spotifyDevice.attributes?.media_artist || null,
                          album: {
                            name: spotifyDevice.attributes?.media_album || null,
                            imageUrl: null
                          },
                          isConnected: spotifyDevice.state !== 'unavailable',
                          isLiked: false,
                          duration: 355000, // Mock duration
                          position: 125000, // Mock position
                          volume: Math.round((spotifyDevice.attributes?.volume_level || 0.6) * 100)
                        }}
                        onPlay={() => callService && callService('media_player', 'media_play', { entity_id: spotifyDevice.entity_id })}
                        onPause={() => callService && callService('media_player', 'media_pause', { entity_id: spotifyDevice.entity_id })}
                        onNext={() => callService && callService('media_player', 'media_next_track', { entity_id: spotifyDevice.entity_id })}
                        onPrevious={() => callService && callService('media_player', 'media_previous_track', { entity_id: spotifyDevice.entity_id })}
                        onVolumeChange={(vol) => callService && callService('media_player', 'volume_set', { 
                          entity_id: spotifyDevice.entity_id, 
                          volume_level: vol / 100 
                        })}
                        onToggleLike={() => console.log('Toggle like')}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {devices?.length === 0 && (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <p className="text-xl text-gray-600 mb-2">No devices configured</p>
              <p className="text-gray-500">Connect to Home Assistant to see your devices</p>
            </div>
          </div>
        )}
      </div>

      {/* Light Configuration Modal */}
      <LightConfigModal
        device={selectedLight}
        isVisible={showLightConfig}
        onClose={handleCloseLightConfig}
        onUpdateLight={handleUpdateLight}
      />


      <DevicesSelectorModal
        isOpen={showDevicesModal}
        onClose={() => setShowDevicesModal(false)}
        selectedDevices={[...allLights, ...allSwitches].filter(d => selectedDevices.has(d.entity_id)).map(d => ({ 
          ...d, 
          id: d.entity_id,
          type: d.entity_id.split('.')[0],
          name: d.attributes?.friendly_name || d.entity_id.replace(/^[^.]+\./, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))}
        onDevicesChange={handleDevicesChange}
        availableDevices={[...allLights, ...allSwitches].map(d => ({ 
          ...d, 
          id: d.entity_id,
          type: d.entity_id.split('.')[0],
          name: d.attributes?.friendly_name || d.entity_id.replace(/^[^.]+\./, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))}
      />

      <ScenesSelectorModal
        isOpen={showScenesModal}
        onClose={() => setShowScenesModal(false)}
        selectedScenes={allScenes.filter(s => selectedScenes.has(s.entity_id)).map(s => ({ ...s, id: s.entity_id }))}
        onScenesChange={handleScenesChange}
        availableScenes={allScenes.map(s => ({ ...s, id: s.entity_id, name: s.attributes?.friendly_name || s.entity_id }))}
      />
    </div>
  );
}