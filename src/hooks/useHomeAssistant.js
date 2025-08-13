import { useState, useEffect, useRef, useCallback } from 'react';
import { haApi } from '../services/homeAssistant';
import { createWebSocketConnection } from '../services/haWebSocket';
import { mockStates, updateMockDeviceState } from '../config/mockHomeAssistantData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_HA || 'true';

export function useHomeAssistant(config = {}) {
  const {
    baseUrl = import.meta.env.VITE_HA_BASE_URL || 'http://localhost:8123',
    token = import.meta.env.VITE_HA_TOKEN || '',
    useMockData = USE_MOCK_DATA === 'true'
  } = config;

  const [devices, setDevices] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const filterDevices = useCallback((states) => {
    return states.filter(state => 
      ['light', 'switch', 'climate', 'media_player', 'alarm_control_panel', 'camera'].includes(
        state.entity_id.split('.')[0]
      )
    );
  }, []);

  const filterScenes = useCallback((states) => {
    return states.filter(state => 
      state.entity_id.startsWith('scene.')
    );
  }, []);

  const loadStates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        const allDevices = filterDevices(mockStates);
        const allScenes = filterScenes(mockStates);
        
        setDevices(allDevices);
        setScenes(allScenes);
        setLoading(false);
        return;
      }

      const states = await haApi.getStates(baseUrl, token);
      const allDevices = filterDevices(states);
      const allScenes = filterScenes(states);
      
      setDevices(allDevices);
      setScenes(allScenes);
      setLoading(false);
    } catch (err) {
      console.error('Error loading Home Assistant states:', err);
      setError(err);
      setLoading(false);
    }
  }, [baseUrl, token, useMockData, filterDevices, filterScenes]);

  const setupWebSocket = useCallback(async () => {
    if (useMockData || !baseUrl || !token) return;

    try {
      wsRef.current = createWebSocketConnection(baseUrl, token);
      
      const unsubscribe = wsRef.current.subscribe((entityId, newState) => {
        if (!newState) return;

        const domain = entityId.split('.')[0];
        
        if (['light', 'switch', 'climate', 'media_player', 'alarm_control_panel', 'camera'].includes(domain)) {
          setDevices(prevDevices => 
            prevDevices.map(device => 
              device.entity_id === entityId 
                ? { ...newState }
                : device
            )
          );
        } else if (domain === 'scene') {
          setScenes(prevScenes => 
            prevScenes.map(scene => 
              scene.entity_id === entityId 
                ? { ...newState }
                : scene
            )
          );
        }
      });

      await wsRef.current.connect();
      
      return unsubscribe;
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  useEffect(() => {
    let wsUnsubscribe;

    const initialize = async () => {
      await loadStates();
      wsUnsubscribe = await setupWebSocket();
    };

    initialize();

    return () => {
      if (wsUnsubscribe) {
        wsUnsubscribe();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [loadStates, setupWebSocket]);

  const toggleDevice = useCallback(async (entityId) => {
    try {
      if (useMockData) {
        const device = mockStates.find(d => d.entity_id === entityId);
        if (device) {
          const newState = device.state === 'on' ? 'off' : 'on';
          const updatedDevice = updateMockDeviceState(entityId, newState);
          
          setDevices(prevDevices => 
            prevDevices.map(d => 
              d.entity_id === entityId ? updatedDevice : d
            )
          );
        }
        return;
      }

      await haApi.toggleDevice(baseUrl, token, entityId);
    } catch (err) {
      console.error('Error toggling device:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  const updateDevice = useCallback(async (entityId, attributes) => {
    try {
      if (useMockData) {
        const updatedDevice = updateMockDeviceState(entityId, 'on', attributes);
        if (updatedDevice) {
          setDevices(prevDevices => 
            prevDevices.map(d => 
              d.entity_id === entityId ? updatedDevice : d
            )
          );
        }
        return;
      }

      await haApi.setDeviceAttributes(baseUrl, token, entityId, attributes);
    } catch (err) {
      console.error('Error updating device:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  const activateScene = useCallback(async (entityId) => {
    try {
      if (useMockData) {
        console.log(`Mock: Activating scene ${entityId}`);
        return;
      }

      await haApi.activateScene(baseUrl, token, entityId);
    } catch (err) {
      console.error('Error activating scene:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  const turnOffDevice = useCallback(async (entityId) => {
    try {
      if (useMockData) {
        const updatedDevice = updateMockDeviceState(entityId, 'off');
        if (updatedDevice) {
          setDevices(prevDevices => 
            prevDevices.map(d => 
              d.entity_id === entityId ? updatedDevice : d
            )
          );
        }
        return;
      }

      await haApi.turnOffDevice(baseUrl, token, entityId);
    } catch (err) {
      console.error('Error turning off device:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  const callService = useCallback(async (domain, service, data = {}) => {
    try {
      if (useMockData) {
        console.log(`Mock: Calling service ${domain}.${service}`, data);
        return;
      }

      await haApi.callService(baseUrl, token, domain, service, data);
    } catch (err) {
      console.error('Error calling service:', err);
      setError(err);
    }
  }, [baseUrl, token, useMockData]);

  const refreshStates = useCallback(() => {
    loadStates();
  }, [loadStates]);

  return {
    devices,
    scenes,
    loading,
    error,
    toggleDevice,
    updateDevice,
    activateScene,
    turnOffDevice,
    callService,
    refreshStates,
    isConnected: useMockData || (wsRef.current?.getConnectionState() ?? false)
  };
}