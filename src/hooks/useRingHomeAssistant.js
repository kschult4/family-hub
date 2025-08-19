import { useState, useEffect, useCallback } from 'react';
import { useHomeAssistant } from './useHomeAssistant';
import { ringMqttClient } from '../services/ringMqttClient';

export function useRingHomeAssistant() {
  const { devices, callService, isConnected } = useHomeAssistant();
  const [alarmStatus, setAlarmStatus] = useState('disarmed');
  const [lastMotionEvent, setLastMotionEvent] = useState(null);
  const [motionSensors, setMotionSensors] = useState([]);

  // Subscribe to MQTT alarm status updates
  useEffect(() => {
    console.log('🔔 Setting up Ring MQTT alarm status subscription');
    
    const unsubscribe = ringMqttClient.subscribe((message) => {
      console.log('📨 Ring MQTT message received:', message);
      
      // Handle alarm status updates
      if (message.topic && message.topic.includes('alarm/status')) {
        console.log('🛡️ Ring alarm status update via MQTT:', message.state);
        
        // Convert Ring alarm states to our format
        let newStatus = 'disarmed';
        switch (message.state?.toLowerCase()) {
          case 'home':
          case 'armed_home':
            newStatus = 'armed_home';
            break;
          case 'away': 
          case 'armed_away':
            newStatus = 'armed_away';
            break;
          case 'disarmed':
          default:
            newStatus = 'disarmed';
            break;
        }
        
        console.log(`🔄 Updating alarm status: ${message.state} -> ${newStatus}`);
        setAlarmStatus(newStatus);
      }
    });

    return () => {
      console.log('🔔 Cleaning up Ring MQTT subscription');
      unsubscribe();
    };
  }, []);

  // Extract Ring entities from Home Assistant devices
  const ringEntities = devices?.filter(device => 
    // Check multiple possible ways Ring devices are identified
    device.attributes?.attribution?.includes('Ring') ||
    device.entity_id.toLowerCase().includes('ring') ||
    device.attributes?.friendly_name?.toLowerCase().includes('ring') ||
    device.attributes?.manufacturer?.toLowerCase().includes('ring') ||
    device.attributes?.brand?.toLowerCase().includes('ring')
  ) || [];

  const motionEvents = ringEntities.filter(device => 
    device.entity_id.includes('motion') && device.attributes?.device_class === 'motion'
  );

  const ringCameras = ringEntities.filter(device => 
    device.entity_id.startsWith('camera.') && device.entity_id.includes('live_view')
  );

  const ringLights = ringEntities.filter(device => 
    device.entity_id.startsWith('light.') && 
    (device.entity_id.includes('front') || device.entity_id.includes('back') || device.entity_id.includes('garage'))
  );

  // Check for recent motion events (within last 5 minutes)
  useEffect(() => {
    if (!motionEvents.length) return;

    const activeMotions = [];
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    motionEvents.forEach(event => {
      const lastChanged = new Date(event.last_changed || event.last_updated);
      const isRecent = lastChanged > fiveMinutesAgo;
      const hasMotion = event.state !== 'unknown' && event.state !== 'unavailable';

      if (isRecent && hasMotion) {
        const sensorName = event.attributes?.friendly_name || 
                          event.entity_id.replace('event.', '').replace('_motion', '');
        
        activeMotions.push({
          entity_id: event.entity_id,
          name: sensorName,
          lastTriggered: lastChanged,
          location: sensorName.charAt(0).toUpperCase() + sensorName.slice(1)
        });

        // Set most recent as last motion event
        if (!lastMotionEvent || lastChanged > new Date(lastMotionEvent.timestamp)) {
          setLastMotionEvent({
            type: 'motion_detected',
            device: sensorName,
            location: sensorName.charAt(0).toUpperCase() + sensorName.slice(1),
            timestamp: lastChanged,
            entity_id: event.entity_id
          });
        }
      }
    });

    setMotionSensors(activeMotions);
  }, [motionEvents, lastMotionEvent]);

  // Send alarm command via Home Assistant MQTT service as fallback
  const sendAlarmCommand = useCallback(async (command) => {
    console.log('🛡️ Ring alarm command:', command);
    console.log('🔗 Direct MQTT client connected:', ringMqttClient.isConnected);
    
    try {
      // First try direct MQTT if connected
      if (ringMqttClient.isConnected) {
        console.log('📤 Using direct MQTT connection...');
        const success = await ringMqttClient.sendAlarmCommand(command);
        if (success) {
          const newStatus = command === 'arm_home' ? 'armed_home' : 
                           command === 'arm_away' ? 'armed_away' : 'disarmed';
          setAlarmStatus(newStatus);
          console.log(`✅ Ring alarm direct MQTT command sent: ${command}`);
          return true;
        }
      }
      
      // Fallback: Use Home Assistant MQTT service
      console.log('📤 Using Home Assistant MQTT service as fallback...');
      console.log('🔍 Available callService function:', typeof callService);
      console.log('🔍 Home Assistant connected:', isConnected);
      
      const mqttPayload = {
        command: command,
        timestamp: new Date().toISOString(),
        source: 'family-hub'
      };
      
      // Use Home Assistant's MQTT publish service
      await callService('mqtt', 'publish', {
        topic: 'ring/alarm/command',
        payload: JSON.stringify(mqttPayload)
      });
      
      // Update local status optimistically
      const newStatus = command === 'arm_home' ? 'armed_home' : 
                       command === 'arm_away' ? 'armed_away' : 'disarmed';
      
      setAlarmStatus(newStatus);
      console.log(`✅ Ring alarm command sent via HA MQTT service: ${command} -> ${newStatus}`);
      return true;
      
    } catch (error) {
      console.error('❌ Ring alarm command failed:', error);
      return false;
    }
  }, [callService]);

  // Convenience functions
  const armHome = useCallback(() => sendAlarmCommand('arm_home'), [sendAlarmCommand]);
  const armAway = useCallback(() => sendAlarmCommand('arm_away'), [sendAlarmCommand]);
  const disarm = useCallback(() => sendAlarmCommand('disarm'), [sendAlarmCommand]);

  // Get active motion count
  const hasActiveMotion = useCallback(() => {
    return motionSensors.length > 0;
  }, [motionSensors]);

  // Get alarm summary
  const getAlarmSummary = useCallback(() => {
    return {
      status: alarmStatus,
      isConnected: isConnected,
      activeMotions: motionSensors.length,
      lastEvent: lastMotionEvent,
      motionSensors,
      hasActiveMotion: hasActiveMotion(),
      ringCameras: ringCameras.length,
      ringLights: ringLights.length,
      totalRingDevices: ringEntities.length
    };
  }, [alarmStatus, isConnected, motionSensors, lastMotionEvent, hasActiveMotion, ringCameras, ringLights, ringEntities]);

  // Debug logging
  useEffect(() => {
    console.warn('🚨🚨🚨 RING INTEGRATION STATUS 🚨🚨🚨');
    console.warn('Total HA Devices:', devices?.length || 0);
    console.warn('Ring Devices Found:', ringEntities.length);
    console.warn('Ring Entity IDs:', ringEntities.map(e => e.entity_id));
    console.warn('Ring Cameras Found:', ringCameras.length);
    console.warn('Ring Lights Found:', ringLights.length);
    console.warn('Motion Events Found:', motionEvents.length);
    console.warn('Sample Ring Attributions:', devices?.filter(d => d.attributes?.attribution?.includes('Ring')).map(d => d.attributes.attribution) || []);
    console.warn('All entities containing "ring":', devices?.filter(d => d.entity_id.toLowerCase().includes('ring')).map(d => ({ entity_id: d.entity_id, friendly_name: d.attributes?.friendly_name })) || []);
    console.warn('Is Connected:', isConnected);
    console.warn('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
  }, [devices, ringEntities, isConnected, ringCameras, ringLights, motionEvents]);

  return {
    alarmStatus,
    isConnected,
    lastMotionEvent,
    motionSensors,
    hasActiveMotion,
    getAlarmSummary,
    // Alarm control functions
    sendAlarmCommand,
    armHome,
    armAway,
    disarm,
    // Ring device info
    ringEntities,
    ringCameras,
    ringLights,
    motionEvents
  };
}