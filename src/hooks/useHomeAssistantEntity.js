import { useState, useEffect, useCallback } from 'react';
import { haClient } from '../services/homeAssistantClient';
import { getMockDeviceById } from '../config/mockHomeAssistantData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_HA !== 'false';

/**
 * Hook for subscribing to and controlling a single Home Assistant entity
 * @param {string} entityId - The entity ID to subscribe to
 * @param {boolean} autoConnect - Whether to automatically connect on mount
 * @returns {object} Entity state and control methods
 */
export function useHomeAssistantEntity(entityId, autoConnect = true) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(USE_MOCK_DATA);

  // Initialize and fetch entity state
  const fetchEntityState = useCallback(async () => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 useHomeAssistantEntity: Fetching ${entityId}, USE_MOCK_DATA=${USE_MOCK_DATA}`);
      
      if (USE_MOCK_DATA) {
        // Use mock data
        const mockEntity = getMockDeviceById(entityId);
        if (mockEntity) {
          setEntity(mockEntity);
          setIsConnected(true);
          console.log(`✅ Successfully loaded mock entity: ${entityId}`);
        } else {
          const error = new Error(`Mock entity ${entityId} not found`);
          console.error(`❌ Mock entity ${entityId} not found in mock data`);
          setError(error);
        }
      } else {
        // Use real Home Assistant
        const entityState = await haClient.getEntityState(entityId);
        setEntity(entityState);
        setIsConnected(haClient.isConnected);
      }
    } catch (err) {
      setError(err);
      console.error(`Error fetching entity ${entityId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!entityId || !autoConnect) return;

    let unsubscribe;

    const setupSubscription = async () => {
      try {
        if (USE_MOCK_DATA) {
          // For mock data, just fetch the initial state
          await fetchEntityState();
        } else {
          // Connect to WebSocket if not already connected
          await haClient.connect();
          
          // Set connected state based on haClient status
          setIsConnected(haClient.isConnected);

          // Subscribe to entity changes (real HA only)
          unsubscribe = haClient.subscribe(entityId, (updatedEntity) => {
            setEntity(updatedEntity);
            setError(null);
          });

          // Fetch initial state
          await fetchEntityState();
        }
      } catch (err) {
        setError(err);
        setIsConnected(false);
        console.error(`Error setting up subscription for ${entityId}:`, err);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [entityId, autoConnect, fetchEntityState]);

  // Control methods
  const toggle = useCallback(async () => {
    if (!entityId) return;
    
    try {
      await haClient.toggleDevice(entityId);
    } catch (err) {
      setError(err);
      console.error(`Error toggling ${entityId}:`, err);
    }
  }, [entityId]);

  const turnOn = useCallback(async (options = {}) => {
    if (!entityId) return;
    
    try {
      const domain = entityId.split('.')[0];
      if (domain === 'light') {
        await haClient.turnOnLight(entityId, options);
      } else {
        await haClient.callService(domain, 'turn_on', {
          entity_id: entityId,
          ...options
        });
      }
    } catch (err) {
      setError(err);
      console.error(`Error turning on ${entityId}:`, err);
    }
  }, [entityId]);

  const turnOff = useCallback(async () => {
    if (!entityId) return;
    
    try {
      const domain = entityId.split('.')[0];
      if (domain === 'light') {
        await haClient.turnOffLight(entityId);
      } else {
        await haClient.callService(domain, 'turn_off', {
          entity_id: entityId
        });
      }
    } catch (err) {
      setError(err);
      console.error(`Error turning off ${entityId}:`, err);
    }
  }, [entityId]);

  // Light-specific methods
  const setBrightness = useCallback(async (brightness) => {
    if (!entityId || !entityId.startsWith('light.')) return;
    
    try {
      await haClient.setLightBrightness(entityId, brightness);
    } catch (err) {
      setError(err);
      console.error(`Error setting brightness for ${entityId}:`, err);
    }
  }, [entityId]);

  const setColor = useCallback(async (rgbColor) => {
    if (!entityId || !entityId.startsWith('light.')) return;
    
    try {
      await haClient.setLightColor(entityId, rgbColor);
    } catch (err) {
      setError(err);
      console.error(`Error setting color for ${entityId}:`, err);
    }
  }, [entityId]);

  // Climate-specific methods
  const setTemperature = useCallback(async (temperature) => {
    if (!entityId || !entityId.startsWith('climate.')) return;
    
    try {
      await haClient.setTemperature(entityId, temperature);
    } catch (err) {
      setError(err);
      console.error(`Error setting temperature for ${entityId}:`, err);
    }
  }, [entityId]);

  const setHvacMode = useCallback(async (hvacMode) => {
    if (!entityId || !entityId.startsWith('climate.')) return;
    
    try {
      await haClient.setHvacMode(entityId, hvacMode);
    } catch (err) {
      setError(err);
      console.error(`Error setting HVAC mode for ${entityId}:`, err);
    }
  }, [entityId]);

  // Media player methods
  const setVolume = useCallback(async (volumeLevel) => {
    if (!entityId || !entityId.startsWith('media_player.')) return;
    
    try {
      await haClient.setVolume(entityId, volumeLevel);
    } catch (err) {
      setError(err);
      console.error(`Error setting volume for ${entityId}:`, err);
    }
  }, [entityId]);

  const playPause = useCallback(async () => {
    if (!entityId || !entityId.startsWith('media_player.')) return;
    
    try {
      await haClient.mediaPlayPause(entityId);
    } catch (err) {
      setError(err);
      console.error(`Error play/pause for ${entityId}:`, err);
    }
  }, [entityId]);

  // Scene activation
  const activate = useCallback(async () => {
    if (!entityId || !entityId.startsWith('scene.')) return;
    
    try {
      await haClient.activateScene(entityId);
    } catch (err) {
      setError(err);
      console.error(`Error activating scene ${entityId}:`, err);
    }
  }, [entityId]);

  // Generic service call
  const callService = useCallback(async (service, data = {}) => {
    if (!entityId) return;
    
    try {
      const domain = entityId.split('.')[0];
      await haClient.callService(domain, service, {
        entity_id: entityId,
        ...data
      });
    } catch (err) {
      setError(err);
      console.error(`Error calling service ${service} for ${entityId}:`, err);
    }
  }, [entityId]);

  return {
    // State
    entity,
    loading,
    error,
    isConnected,
    
    // Generic controls
    toggle,
    turnOn,
    turnOff,
    callService,
    refresh: fetchEntityState,
    
    // Light controls
    setBrightness,
    setColor,
    
    // Climate controls
    setTemperature,
    setHvacMode,
    
    // Media player controls
    setVolume,
    playPause,
    
    // Scene controls
    activate,
    
    // Connection status
    connectionStatus: haClient.getConnectionStatus()
  };
}