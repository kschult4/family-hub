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
  const { devices, scenes, loading, error, toggleDevice, updateDevice, activateScene, callService, isConnected, refreshStates } = useHomeAssistant();
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
    // TEMPORARY: Clear localStorage to force re-initialization
    localStorage.removeItem('selectedScenes');
    localStorage.removeItem('selectedDevices');
    console.log('🗑️ Cleared localStorage to force device re-selection');
    return new Set();
  });
  const [selectedDevices, setSelectedDevices] = useState(() => {
    return new Set();
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
    // Calculate filtered arrays for debugging (same logic as later in component)
    const filteredLights = allLights.filter(light => selectedDevices.has(light.entity_id));
    const filteredSwitches = allSwitches.filter(switchDevice => selectedDevices.has(switchDevice.entity_id));
    const filteredScenes = allScenes.filter(scene => selectedScenes.has(scene.entity_id));
    const currentMediaPlayers = devices?.filter(d => d.entity_id.startsWith('media_player.')) || [];
    const currentSonosDevices = currentMediaPlayers.filter(d => 
      d.attributes?.device_class === 'speaker' || 
      d.entity_id.toLowerCase().includes('sonos') ||
      d.attributes?.friendly_name?.toLowerCase().includes('sonos')
    );
    
    console.log('🏠 HomeDashboard Debug:', { 
      hasInitialized, 
      loading, 
      error: error?.message,
      scenesCount: allScenes.length, 
      lightsCount: allLights.length, 
      switchesCount: allSwitches.length,
      devicesCount: devices?.length || 0,
      isConnected,
      selectedScenesCount: selectedScenes.size,
      selectedDevicesCount: selectedDevices.size,
      filteredLights: filteredLights.length,
      filteredSwitches: filteredSwitches.length,
      filteredScenes: filteredScenes.length,
      mediaPlayersCount: currentMediaPlayers.length,
      sonosDevicesCount: currentSonosDevices.length,
      // Debug the selection matching
      selectedDevicesArray: Array.from(selectedDevices).slice(0, 5),
      firstFewLights: allLights.slice(0, 3).map(l => l.entity_id),
      firstFewSwitches: allSwitches.slice(0, 3).map(s => s.entity_id)
    });
    
    if (!hasInitialized && !loading && (allScenes.length > 0 || allLights.length > 0 || allSwitches.length > 0)) {
      console.log('🔧 Initializing device selections...');
      
      // Check if we have saved selections
      const savedScenes = localStorage.getItem('selectedScenes');
      const savedDevices = localStorage.getItem('selectedDevices');
      
      // Parse saved selections
      const parsedScenes = savedScenes ? JSON.parse(savedScenes) : [];
      const parsedDevices = savedDevices ? JSON.parse(savedDevices) : [];
      
      console.log('💾 Saved selections:', { savedScenes: parsedScenes, savedDevices: parsedDevices });
      
      // Use saved selections if available, otherwise auto-select all
      if (savedScenes && parsedScenes.length > 0) {
        console.log('📋 Using saved scenes:', parsedScenes.length);
        setSelectedScenes(new Set(parsedScenes));
      } else if (allScenes.length > 0) {
        const sceneIds = allScenes.map(s => s.entity_id);
        console.log('🎬 Auto-selecting all scenes:', sceneIds);
        setSelectedScenes(new Set(sceneIds));
      }
      
      if (savedDevices && parsedDevices.length > 0) {
        console.log('📋 Using saved devices:', parsedDevices.length);
        setSelectedDevices(new Set(parsedDevices));
      } else if (allLights.length > 0 || allSwitches.length > 0) {
        const deviceIds = [...allLights, ...allSwitches].map(d => d.entity_id);
        console.log('💡 Auto-selecting all devices:', deviceIds.length, deviceIds.slice(0, 5));
        setSelectedDevices(new Set(deviceIds));
      }
      
      console.log('✅ Device selection initialization complete');
      setHasInitialized(true);
    }
  }, [allScenes, allLights, allSwitches, loading, hasInitialized]);

  // Modal handlers
  const handleDevicesChange = (newSelectedDevices) => {
    const deviceIds = newSelectedDevices.map(d => d.entity_id || d.id);
    setSelectedDevices(new Set(deviceIds));
    setShowDevicesModal(false);
  };

  const handleScenesChange = (newSelectedScenes) => {
    const sceneIds = newSelectedScenes.map(s => s.entity_id || s.id);
    setSelectedScenes(new Set(sceneIds));
    setShowScenesModal(false);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refreshStates} />;
  }

  // Filter to only show selected items
  const lights = allLights.filter(light => selectedDevices.has(light.entity_id));
  const switches = allSwitches.filter(switchDevice => selectedDevices.has(switchDevice.entity_id));
  const scenes_list = allScenes.filter(scene => selectedScenes.has(scene.entity_id));


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
    <div className="p-2 sm:p-4">
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
        {(lights.length > 0 || switches.length > 0 || ringAlarm || thermostats.length > 0 || sonosDevices.length > 0 || spotifyDevice) && (
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
                {/* Ring Alarm - Half width (1 column) - TOP LEFT */}
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
                
                {/* Thermostat - Half width (1 column) - TOP RIGHT */}
                {thermostats.length > 0 && (
                  <div className="col-span-1 row-span-2">
                    <ThermostatWidget
                      isActive={false}
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
                
                {/* Media Players - Sonos or Spotify - Full width (2 columns) - BOTTOM */}
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