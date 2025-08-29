import { useState, useEffect, useCallback } from 'react';
import { ringMqttClient } from '../services/ringMqttClient';

export function useRingAlarmMqtt() {
  const [alarmStatus, setAlarmStatus] = useState('disarmed');
  const [isConnected, setIsConnected] = useState(false);
  const [lastAlarmEvent, setLastAlarmEvent] = useState(null);
  const [sensorStatuses, setSensorStatuses] = useState([]);

  useEffect(() => {
    console.log('🔧 Ring MQTT disabled - no longer using MQTT for IoT devices');
    
    // MQTT integration disabled - return mock/empty state
    setIsConnected(false);
    setAlarmStatus('disarmed');

    // No actual MQTT connection or subscription
    return () => {
      console.log('🔌 Ring MQTT cleanup (disabled)');
    };
  }, []);

  const handleAlarmEvent = useCallback((data) => {
    console.log('🔍 Processing Ring alarm event:', data);
    
    const timestamp = new Date();
    
    // Handle motion events that should trigger alarm responses
    if (data.topic?.includes('/motion/state')) {
      if (data.state === 'ON') {
        setLastAlarmEvent({
          type: 'motion_detected',
          device: data.device,
          device_id: data.device_id,
          location: data.location,
          timestamp: timestamp,
          topic: data.topic
        });
        
        // Add to sensor statuses
        setSensorStatuses(prev => {
          const existing = prev.find(s => s.device_id === data.device_id);
          if (existing) {
            return prev.map(s => 
              s.device_id === data.device_id 
                ? { ...s, status: 'triggered', lastTriggered: timestamp }
                : s
            );
          } else {
            return [...prev, {
              device_id: data.device_id,
              name: data.device,
              type: 'motion',
              status: 'triggered',
              lastTriggered: timestamp
            }];
          }
        });
        
        console.log('🚨 Motion detected - updating alarm sensors');
      } else if (data.state === 'OFF') {
        // Clear motion status
        setSensorStatuses(prev => 
          prev.map(s => 
            s.device_id === data.device_id 
              ? { ...s, status: 'normal', lastCleared: timestamp }
              : s
          )
        );
        
        console.log('✅ Motion cleared - updating alarm sensors');
      }
    }
    
    // Handle alarm arm/disarm events if Ring supports them via MQTT
    if (data.topic?.includes('/alarm/status')) {
      console.log('🛡️ Ring alarm status change:', data.state);
      
      // Map MQTT states to widget states (Away/Home → Armed, Disarmed → Disarmed)
      let mappedStatus = data.state.toLowerCase();
      if (mappedStatus === 'away' || mappedStatus === 'home') {
        mappedStatus = 'armed_home'; // Treat both Away and Home as "Armed"
        console.log(`🔄 Mapped MQTT "${data.state}" → "armed_home" for widget display`);
      }
      
      setAlarmStatus(mappedStatus);
      setLastAlarmEvent({
        type: 'status_change',
        status: mappedStatus,
        originalMqttStatus: data.state.toLowerCase(),
        timestamp: timestamp,
        topic: data.topic
      });
    }
  }, []);

  // Function to get current motion sensors
  const getActiveMotionSensors = useCallback(() => {
    return sensorStatuses.filter(sensor => 
      sensor.status === 'triggered' && 
      sensor.type === 'motion' &&
      // Only consider recent events (within last 5 minutes)
      new Date() - sensor.lastTriggered < 5 * 60 * 1000
    );
  }, [sensorStatuses]);

  // Function to check if any motion is active
  const hasActiveMotion = useCallback(() => {
    return getActiveMotionSensors().length > 0;
  }, [getActiveMotionSensors]);

  // Function to get alarm summary for display
  const getAlarmSummary = useCallback(() => {
    const activeMotions = getActiveMotionSensors();
    return {
      status: alarmStatus,
      isConnected,
      activeMotions: activeMotions.length,
      lastEvent: lastAlarmEvent,
      sensorStatuses,
      hasActiveMotion: hasActiveMotion()
    };
  }, [alarmStatus, isConnected, lastAlarmEvent, sensorStatuses, getActiveMotionSensors, hasActiveMotion]);

  return {
    alarmStatus,
    isConnected,
    lastAlarmEvent,
    sensorStatuses,
    getActiveMotionSensors,
    hasActiveMotion,
    getAlarmSummary
  };
}