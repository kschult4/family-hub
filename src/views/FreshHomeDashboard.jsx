import { useState } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import LightCard from '../components/home/LightCard';
import SwitchCard from '../components/home/SwitchCard';
import LightConfigModal from '../components/home/LightConfigModal';
import SceneCard from '../components/home/SceneCard';
import SpotifyWidget from '../components/home/SpotifyWidget';
import RingAlarmWidget from '../components/home/RingAlarmWidget';
import CombinedThermostatWidget from '../components/home/CombinedThermostatWidget';

export default function FreshHomeDashboard() {
  const { devices, scenes, loading, error, toggleDevice, updateDevice, activateScene, callService, isConnected } = useHomeAssistant();
  const [selectedLight, setSelectedLight] = useState(null);
  const [showLightConfig, setShowLightConfig] = useState(false);

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

  // Special devices
  const spotifyDevice = devices?.find(d => d.entity_id === 'media_player.spotify');
  const ringAlarm = devices?.find(d => d.entity_id === 'alarm_control_panel.ring_alarm');
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
            <h2 className="text-lg font-semibold mb-3 text-gray-800">🎬 Scenes ({scenes_list.length})</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2">
              {scenes_list.map(scene => (
                <SceneCard
                  key={scene.entity_id}
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
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              ⚡ Devices ({lights.length + switches.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[minmax(auto,1fr)]">
              {/* Regular Device Cards - COLUMNS 1-2 ONLY */}
              <div className="col-span-2 grid grid-cols-2 gap-4 auto-rows-[minmax(100px,auto)]">
                {/* Light Cards */}
                {lights.map(light => (
                  <LightCard
                    key={light.entity_id}
                    device={light}
                    onToggle={toggleDevice}
                    onLongPress={handleLightLongPress}
                  />
                ))}
                
                {/* Switch Cards */}
                {switches.map(switchDevice => (
                  <SwitchCard
                    key={switchDevice.entity_id}
                    device={switchDevice}
                    onToggle={toggleDevice}
                  />
                ))}
              </div>
              
              {/* Special Widgets - COLUMNS 3-4 ONLY */}
              <div className="col-span-2 sm:col-start-3 sm:col-end-5 grid grid-cols-2 gap-4 auto-rows-[minmax(auto,1fr)]">
                {/* Ring Alarm - Spans 2 rows */}
                {ringAlarm && (
                  <div className="col-span-2 row-span-2">
                    <RingAlarmWidget
                      alarmData={{
                        status: ringAlarm.state || 'disarmed',
                        isConnected: ringAlarm.state !== 'unavailable',
                        lastChanged: ringAlarm.last_changed || null,
                        batteryStatus: {
                          'Front Door Sensor': 85,
                          'Motion Detector': 72,
                          'Keypad': 95
                        },
                        sensorStatuses: [
                          { name: 'Front Door', status: 'ok' },
                          { name: 'Back Door', status: 'ok' },
                          { name: 'Living Room Motion', status: 'ok' }
                        ]
                      }}
                      onArmHome={() => callService && callService('alarm_control_panel', 'alarm_arm_home', { entity_id: ringAlarm.entity_id })}
                      onArmAway={() => callService && callService('alarm_control_panel', 'alarm_arm_away', { entity_id: ringAlarm.entity_id })}
                      onDisarm={() => callService && callService('alarm_control_panel', 'alarm_disarm', { entity_id: ringAlarm.entity_id })}
                    />
                  </div>
                )}
                
                {/* Thermostat - Spans 2 rows */}
                {thermostats.length > 0 && (
                  <div className="col-span-2 row-span-2">
                    <CombinedThermostatWidget
                      thermostats={thermostats}
                      onSetTemperature={(thermostatId, temp) => callService && callService('climate', 'set_temperature', { 
                        entity_id: thermostatId, 
                        temperature: temp 
                      })}
                      onSetMode={(thermostatId, mode) => callService && callService('climate', 'set_hvac_mode', { 
                        entity_id: thermostatId, 
                        hvac_mode: mode 
                      })}
                    />
                  </div>
                )}

                {/* Spotify - Spans 3 rows */}
                {spotifyDevice && (
                  <div className="col-span-2 row-span-3">
                    <SpotifyWidget
                      spotifyData={{
                        isPlaying: spotifyDevice.state === 'playing',
                        currentTrack: spotifyDevice.attributes?.media_title || null,
                        artist: spotifyDevice.attributes?.media_artist || null,
                        album: {
                          name: spotifyDevice.attributes?.media_album || null,
                          imageUrl: '/family-hub/album-placeholder.jpg'
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
    </div>
  );
}