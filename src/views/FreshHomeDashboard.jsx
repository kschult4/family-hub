import { useState } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import LightCard from '../components/home/LightCard';
import SwitchCard from '../components/home/SwitchCard';
import LightConfigModal from '../components/home/LightConfigModal';
import SceneCard from '../components/home/SceneCard';
import SpotifyWidget from '../components/home/SpotifyWidget';
import SonosMediaPlayerCard from '../components/home/SonosMediaPlayerCard';
import RingAlarmWidget from '../components/home/RingAlarmWidget';
import ThermostatWidget from '../components/home/ThermostatWidget';
import SectionHeader from '../components/SectionHeader';
import { Edit3 } from 'lucide-react';

export default function FreshHomeDashboard() {
  const { devices, scenes, loading, error, toggleDevice, updateDevice, activateScene, callService, isConnected } = useHomeAssistant();
  const [selectedLight, setSelectedLight] = useState(null);
  const [showLightConfig, setShowLightConfig] = useState(false);
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

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

  const lights = devices?.filter(d => d.entity_id.startsWith('light.')) || [];
  const switches = devices?.filter(d => d.entity_id.startsWith('switch.')) || [];
  const scenes_list = scenes || [];

  // Debug logging
  console.log('🔍 FreshHomeDashboard - Available devices:', devices?.map(d => ({
    entity_id: d.entity_id,
    state: d.state,
    friendly_name: d.attributes?.friendly_name
  })));
  console.log('🔍 FreshHomeDashboard - Available scenes:', scenes?.map(s => s.entity_id));

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
                onClick={() => setShowSceneModal(true)}
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
                onClick={() => setShowDeviceModal(true)}
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

      {/* Scene Selection Modal */}
      {showSceneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">Add Scene</h2>
              <button
                onClick={() => setShowSceneModal(false)}
                className="p-2 text-gray-400 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">Select scenes to display on your dashboard:</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Example available scenes - replace with actual data */}
                {['Morning Routine', 'Movie Night', 'Bedtime', 'Party Mode', 'Work Focus'].map((sceneName) => (
                  <label key={sceneName} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{sceneName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowSceneModal(false)}
                className="px-4 py-2 text-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSceneModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Selection Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">Add Device</h2>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="p-2 text-gray-400 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">Select devices to display on your dashboard:</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Example available devices - replace with actual data */}
                {['Kitchen Light', 'Living Room Lamp', 'Porch Light', 'Garage Door', 'Coffee Maker', 'Smart Plug'].map((deviceName) => (
                  <label key={deviceName} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{deviceName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDeviceModal(false)}
                className="px-4 py-2 text-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}