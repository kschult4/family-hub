import { useState, useCallback } from 'react';
import WidgetGrid from '../components/home/WidgetGrid';
import WidgetToolbar from '../components/home/WidgetToolbar';
import DeviceCard from '../components/home/DeviceCard';
import SceneCard from '../components/home/SceneCard';
import DeviceModal from '../components/home/DeviceModal';
import SpotifyWidget from '../components/home/SpotifyWidget';
import RingAlarmWidget from '../components/home/RingAlarmWidget';
import RingCameraWidget from '../components/home/RingCameraWidget';
import ThermostatWidget from '../components/home/ThermostatWidget';

export default function HomeMockPage() {
  const [widgets, setWidgets] = useState([
    {
      id: 'living-room-light',
      type: 'device',
      component: (
        <DeviceCard
          device={{
            entity_id: 'light.living_room',
            state: 'on',
            attributes: {
              friendly_name: 'Living Room Light',
              brightness: 180,
              rgb_color: [255, 255, 200]
            }
          }}
          onToggle={(entityId) => console.log('Toggle:', entityId)}
          onLongPress={(entityId) => setModalDevice({
            entity_id: entityId,
            state: 'on',
            attributes: {
              friendly_name: 'Living Room Light',
              brightness: 180,
              rgb_color: [255, 255, 200]
            }
          })}
        />
      )
    },
    {
      id: 'bedroom-switch',
      type: 'device',
      component: (
        <DeviceCard
          device={{
            entity_id: 'switch.bedroom_fan',
            state: 'off',
            attributes: {
              friendly_name: 'Bedroom Fan'
            }
          }}
          onToggle={(entityId) => console.log('Toggle:', entityId)}
          onLongPress={(entityId) => console.log('Long press:', entityId)}
        />
      )
    },
    {
      id: 'movie-scene',
      type: 'scene',
      component: (
        <SceneCard
          scene={{
            entity_id: 'scene.movie_night',
            state: 'scening',
            attributes: {
              friendly_name: 'Movie Night'
            }
          }}
          onActivate={(entityId) => console.log('Activate scene:', entityId)}
        />
      )
    },
    {
      id: 'spotify-widget',
      type: 'spotify',
      component: (
        <SpotifyWidget
          spotifyData={{
            isPlaying: true,
            currentTrack: 'Bohemian Rhapsody',
            artist: 'Queen',
            album: {
              name: 'A Night at the Opera',
              imageUrl: '/family-hub/album-placeholder.jpg'
            },
            isConnected: true,
            isLiked: false,
            duration: 355000,
            position: 125000,
            volume: 65
          }}
          onPlay={() => console.log('Play')}
          onPause={() => console.log('Pause')}
          onNext={() => console.log('Next')}
          onPrevious={() => console.log('Previous')}
          onVolumeChange={(vol) => console.log('Volume:', vol)}
          onToggleLike={() => console.log('Toggle like')}
        />
      )
    },
    {
      id: 'ring-alarm',
      type: 'ring-alarm',
      component: (
        <RingAlarmWidget
          alarmData={{
            status: 'disarmed',
            isConnected: true,
            lastChanged: new Date().toISOString(),
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
          onArmHome={() => console.log('Arm home')}
          onArmAway={() => console.log('Arm away')}
          onDisarm={() => console.log('Disarm')}
        />
      )
    },
    {
      id: 'front-camera',
      type: 'ring-camera',
      component: (
        <RingCameraWidget
          cameraData={{
            name: 'Front Door Camera',
            isOnline: true,
            isRecording: false,
            lastSnapshot: '/family-hub/camera-placeholder.jpg',
            lastMotion: new Date(Date.now() - 300000).toISOString(),
            batteryLevel: 78,
            liveStreamUrl: null
          }}
          onViewLive={() => console.log('View live')}
          onToggleRecording={() => console.log('Toggle recording')}
          onRefreshFeed={() => console.log('Refresh feed')}
        />
      )
    },
    {
      id: 'downstairs-thermostat',
      type: 'thermostat',
      component: (
        <ThermostatWidget
          thermostatData={{
            currentTemp: 72,
            targetTemp: 70,
            mode: 'auto',
            location: 'downstairs',
            isOnline: true,
            humidity: 45,
            isHeating: false,
            isCooling: false,
            fanRunning: false,
            schedule: true
          }}
          onSetTemperature={(location, temp) => console.log('Set temp:', location, temp)}
          onSetMode={(location, mode) => console.log('Set mode:', location, mode)}
          onToggleLocation={(location) => console.log('Toggle location:', location)}
        />
      )
    },
    {
      id: 'kitchen-light',
      type: 'device',
      component: (
        <DeviceCard
          device={{
            entity_id: 'light.kitchen',
            state: 'unavailable',
            attributes: {
              friendly_name: 'Kitchen Light'
            }
          }}
          onToggle={(entityId) => console.log('Toggle:', entityId)}
          onLongPress={(entityId) => console.log('Long press:', entityId)}
        />
      )
    }
  ]);

  const [modalDevice, setModalDevice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedItem] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedItem);

    setWidgets(newWidgets);
  }, [widgets]);

  const handleAddWidget = useCallback((widgetType) => {
    const widgetId = `${widgetType}-${Date.now()}`;
    let newWidget;

    switch (widgetType) {
      case 'light':
        newWidget = {
          id: widgetId,
          type: 'device',
          component: (
            <DeviceCard
              key={widgetId}
              device={{
                entity_id: `light.${widgetId}`,
                state: 'on',
                attributes: {
                  friendly_name: 'New Light',
                  brightness: 255
                }
              }}
              onToggle={(entityId) => console.log('Toggle:', entityId)}
              onLongPress={(entityId) => console.log('Long press:', entityId)}
            />
          )
        };
        break;
      case 'switch':
        newWidget = {
          id: widgetId,
          type: 'device',
          component: (
            <DeviceCard
              key={widgetId}
              device={{
                entity_id: `switch.${widgetId}`,
                state: 'off',
                attributes: {
                  friendly_name: 'New Switch'
                }
              }}
              onToggle={(entityId) => console.log('Toggle:', entityId)}
              onLongPress={(entityId) => console.log('Long press:', entityId)}
            />
          )
        };
        break;
      case 'scene':
        newWidget = {
          id: widgetId,
          type: 'scene',
          component: (
            <SceneCard
              key={widgetId}
              scene={{
                entity_id: `scene.${widgetId}`,
                state: 'scening',
                attributes: {
                  friendly_name: 'New Scene'
                }
              }}
              onActivate={(entityId) => console.log('Activate scene:', entityId)}
            />
          )
        };
        break;
      case 'spotify':
        newWidget = {
          id: widgetId,
          type: 'spotify',
          component: (
            <SpotifyWidget
              key={widgetId}
              spotifyData={{
                isPlaying: false,
                currentTrack: null,
                isConnected: false
              }}
              onPlay={() => console.log('Play')}
              onPause={() => console.log('Pause')}
              onNext={() => console.log('Next')}
              onPrevious={() => console.log('Previous')}
            />
          )
        };
        break;
      case 'ring-alarm':
        newWidget = {
          id: widgetId,
          type: 'ring-alarm',
          component: (
            <RingAlarmWidget
              key={widgetId}
              alarmData={{
                status: 'disarmed',
                isConnected: true
              }}
              onArmHome={() => console.log('Arm home')}
              onArmAway={() => console.log('Arm away')}
              onDisarm={() => console.log('Disarm')}
            />
          )
        };
        break;
      case 'ring-camera':
        newWidget = {
          id: widgetId,
          type: 'ring-camera',
          component: (
            <RingCameraWidget
              key={widgetId}
              cameraData={{
                name: 'New Camera',
                isOnline: true,
                isRecording: false
              }}
              onViewLive={() => console.log('View live')}
              onToggleRecording={() => console.log('Toggle recording')}
            />
          )
        };
        break;
      case 'thermostat':
        newWidget = {
          id: widgetId,
          type: 'thermostat',
          component: (
            <ThermostatWidget
              key={widgetId}
              thermostatData={{
                currentTemp: 70,
                targetTemp: 70,
                mode: 'auto',
                location: 'upstairs',
                isOnline: true
              }}
              onSetTemperature={(location, temp) => console.log('Set temp:', location, temp)}
              onSetMode={(location, mode) => console.log('Set mode:', location, mode)}
            />
          )
        };
        break;
      default:
        return;
    }

    setWidgets([...widgets, newWidget]);
  }, [widgets]);

  const handleSaveLayout = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Layout saved:', widgets.map(w => ({ id: w.id, type: w.type })));
  }, [widgets]);

  const handleResetLayout = useCallback(() => {
    setWidgets([]);
    console.log('Layout reset');
  }, []);

  const handleWidgetPress = useCallback((widget) => {
    if (!isEditMode) {
      console.log('Widget pressed:', widget.id);
    }
  }, [isEditMode]);

  const handleWidgetLongPress = useCallback((widget) => {
    if (isEditMode) {
      // Remove widget in edit mode
      setWidgets(prev => prev.filter(w => w.id !== widget.id));
    } else {
      console.log('Widget long press:', widget.id);
    }
  }, [isEditMode]);

  return (
    <div className="min-h-screen bg-gray-100">
      <WidgetToolbar
        onAddWidget={handleAddWidget}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
        onEditMode={setIsEditMode}
        isEditMode={isEditMode}
      />
      
      <div className="max-w-screen-xl mx-auto">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <p className="text-xl text-gray-600 mb-2">No widgets added yet</p>
              <p className="text-gray-500">Click "Add Widget" to get started!</p>
            </div>
          </div>
        ) : (
          <WidgetGrid
            widgets={widgets}
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
        onToggle={(entityId) => console.log('Modal toggle:', entityId)}
        onBrightnessChange={(entityId, brightness) => console.log('Brightness:', entityId, brightness)}
        onColorChange={(entityId, color) => console.log('Color:', entityId, color)}
      />

      {/* Demo Instructions */}
      <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Demo Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Add widgets using the toolbar</li>
          <li>• Drag widgets to rearrange</li>
          <li>• Long press lights for controls</li>
          <li>• Toggle edit mode for management</li>
          <li>• All actions logged to console</li>
        </ul>
      </div>
    </div>
  );
}