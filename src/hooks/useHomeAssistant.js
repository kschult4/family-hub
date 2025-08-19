import { useState, useEffect, useRef, useCallback } from 'react';
import { haApi } from '../services/homeAssistant';
import { createWebSocketConnection } from '../services/haWebSocket';
import { mockStates, updateMockDeviceState } from '../config/mockHomeAssistantData';

const baseUrl = import.meta.env.VITE_HA_BASE_URL;
const token   = import.meta.env.VITE_HA_TOKEN;

console.log('[HA] baseUrl:', baseUrl);
console.log('[HA] token prefix:', token ? token.slice(0, 6) + '…' : 'USING_PROXY');

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_HA === 'true';

console.log('[HA] VITE_USE_MOCK_HA env var:', import.meta.env.VITE_USE_MOCK_HA);
console.log('[HA] USE_MOCK_DATA calculated:', USE_MOCK_DATA);

export function useHomeAssistant(config = {}) {
  const {
    baseUrl = import.meta.env.VITE_HA_BASE_URL || 'http://localhost:8123',
    token = import.meta.env.VITE_HA_TOKEN || '',
    useMockData = USE_MOCK_DATA
  } = config;
  
  // Force mock data when HA is unreachable
  const forceMockData = useMockData || USE_MOCK_DATA;

  const [devices, setDevices] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
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
      
      console.log('loadStates called with:', { baseUrl, token: token ? 'PRESENT' : 'MISSING', useMockData, forceMockData });

      if (forceMockData) {
        console.log('🔍 useHomeAssistant: Using mock data, total mock states:', mockStates.length);
        const allDevices = filterDevices(mockStates);
        const allScenes = filterScenes(mockStates);
        
        console.log('🔍 Filtered devices:', allDevices.map(d => d.entity_id));
        console.log('🔍 Filtered scenes:', allScenes.map(s => s.entity_id));
        
        setDevices(allDevices);
        setScenes(allScenes);
        setIsConnected(true);
        setLoading(false);
        return;
      }

      // Validate connection parameters (token not required when using proxy)
      if (!baseUrl) {
        throw new Error('Missing Home Assistant URL. Check your .env file.');
      }

      console.log('🔌 Attempting to connect to Home Assistant...');
      const states = await haApi.getStates(baseUrl, token);
      
      if (!Array.isArray(states)) {
        throw new Error('Invalid response from Home Assistant API');
      }
      
      const allDevices = filterDevices(states);
      const allScenes = filterScenes(states);
      
      console.log('✅ Successfully loaded', states.length, 'entities from Home Assistant');
      console.log('📱 Found', allDevices.length, 'devices and', allScenes.length, 'scenes');
      
      setDevices(allDevices);
      setScenes(allScenes);
      setIsConnected(true);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading Home Assistant states:', err);
      setError(err);
      setIsConnected(false);
      setLoading(false);
      
      // Fallback to empty arrays to prevent UI crashes
      setDevices([]);
      setScenes([]);
    }
  }, [baseUrl, token, forceMockData, filterDevices, filterScenes]);

  const setupWebSocket = useCallback(async () => {
    // Skip WebSocket for proxy setup (when baseUrl starts with /api/ha)
    if (forceMockData || !baseUrl || !token || baseUrl.startsWith('/api/ha')) return;

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
      // Don't set error here - continue with REST API polling
      return null;
    }
  }, [baseUrl, token, forceMockData]);

  useEffect(() => {
    let wsUnsubscribe;
    let pollingInterval;

    const initialize = async () => {
      await loadStates();
      
      if (!useMockData) {
        wsUnsubscribe = await setupWebSocket();
        
        // If WebSocket fails, use REST API polling (skip for proxy setup)
        if (!wsUnsubscribe && !baseUrl.startsWith('/api/ha')) {
          console.log('WebSocket failed, falling back to REST API polling');
          pollingInterval = setInterval(async () => {
            try {
              await loadStates();
            } catch (err) {
              console.error('Polling error:', err);
            }
          }, 5000); // Poll every 5 seconds
        }
      }
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
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [loadStates, setupWebSocket, useMockData]);

  const toggleDevice = useCallback(async (entityId) => {
    console.log(`🔧 toggleDevice called:`, { entityId, forceMockData, baseUrl, token: token ? 'PRESENT' : 'MISSING' });
    try {
      if (forceMockData) {
        console.log(`🎭 Mock: Toggling device ${entityId}`);
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

      console.log(`🌐 Real API: Toggling device ${entityId}`);
      await haApi.toggleDevice(baseUrl, token, entityId);
      console.log(`✅ Toggle successful: ${entityId}`);
    } catch (err) {
      console.error('Error toggling device:', err);
      setError(err);
    }
  }, [baseUrl, token, forceMockData]);

  const updateDevice = useCallback(async (entityId, attributes) => {
    try {
      if (forceMockData) {
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
  }, [baseUrl, token, forceMockData]);

  const activateScene = useCallback(async (entityId) => {
    try {
      if (forceMockData) {
        console.log(`Mock: Activating scene ${entityId}`);
        return;
      }

      await haApi.activateScene(baseUrl, token, entityId);
    } catch (err) {
      console.error('Error activating scene:', err);
      setError(err);
    }
  }, [baseUrl, token, forceMockData]);

  const turnOffDevice = useCallback(async (entityId) => {
    try {
      if (forceMockData) {
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
  }, [baseUrl, token, forceMockData]);

  const callService = useCallback(async (domain, service, data = {}) => {
    console.log(`🔧 callService called: ${domain}.${service}`, { data, forceMockData, baseUrl, token: token ? 'PRESENT' : 'MISSING' });
    try {
      if (forceMockData) {
        console.log(`🎭 Mock: Calling service ${domain}.${service}`, data);
        return;
      }

      console.log(`🌐 Real API: Calling service ${domain}.${service}`, data);
      await haApi.callService(baseUrl, token, domain, service, data);
      console.log(`✅ Service call successful: ${domain}.${service}`);
    } catch (err) {
      console.error('❌ Error calling service:', err);
      setError(err);
    }
  }, [baseUrl, token, forceMockData]);

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
    isConnected
  };
}