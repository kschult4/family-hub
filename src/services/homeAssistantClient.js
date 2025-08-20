import { haApi } from './homeAssistant';
import { createWebSocketConnection } from './haWebSocket';

/**
 * Entity state normalizers - convert raw HA entities into clean UI objects
 */
export const entityNormalizers = {
  light: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'light',
    state: entity.state,
    isOn: entity.state === 'on',
    brightness: entity.attributes.brightness || 0,
    brightnessPercent: Math.round(((entity.attributes.brightness || 0) / 255) * 100),
    colorMode: entity.attributes.color_mode,
    rgbColor: entity.attributes.rgb_color,
    hsColor: entity.attributes.hs_color,
    colorTemp: entity.attributes.color_temp,
    supportedFeatures: entity.attributes.supported_features || 0,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  switch: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'switch',
    state: entity.state,
    isOn: entity.state === 'on',
    icon: entity.attributes.icon,
    deviceClass: entity.attributes.device_class,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  climate: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'climate',
    state: entity.state,
    currentTemp: entity.attributes.current_temperature,
    targetTemp: entity.attributes.temperature,
    targetTempHigh: entity.attributes.target_temp_high,
    targetTempLow: entity.attributes.target_temp_low,
    hvacMode: entity.attributes.hvac_mode,
    hvacModes: entity.attributes.hvac_modes || [],
    hvacAction: entity.attributes.hvac_action,
    fanMode: entity.attributes.fan_mode,
    fanModes: entity.attributes.fan_modes || [],
    presetMode: entity.attributes.preset_mode,
    presetModes: entity.attributes.preset_modes || [],
    humidity: entity.attributes.current_humidity,
    targetHumidity: entity.attributes.humidity,
    minTemp: entity.attributes.min_temp,
    maxTemp: entity.attributes.max_temp,
    tempStep: entity.attributes.target_temp_step,
    supportedFeatures: entity.attributes.supported_features || 0,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  media_player: (entity) => {
    const normalized = {
      id: entity.entity_id,
      name: entity.attributes.friendly_name || entity.entity_id,
      type: 'media_player',
      state: entity.state,
      isPlaying: entity.state === 'playing',
      isPaused: entity.state === 'paused',
      isIdle: entity.state === 'idle',
      isOff: entity.state === 'off',
      volumeLevel: entity.attributes.volume_level,
      isMuted: entity.attributes.is_volume_muted,
      mediaTitle: entity.attributes.media_title,
      mediaArtist: entity.attributes.media_artist,
      mediaAlbum: entity.attributes.media_album,
      mediaArtwork: entity.attributes.entity_picture,
      mediaDuration: entity.attributes.media_duration,
      mediaPosition: entity.attributes.media_position,
      mediaPositionUpdatedAt: entity.attributes.media_position_updated_at,
      shuffle: entity.attributes.shuffle,
      repeat: entity.attributes.repeat,
      supportedFeatures: entity.attributes.supported_features || 0,
      groupMembers: entity.attributes.group_members || [],
      icon: entity.attributes.icon,
      lastChanged: entity.last_changed,
      lastUpdated: entity.last_updated,
      raw: entity
    };
    
    
    return normalized;
  },

  alarm_control_panel: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'alarm_control_panel',
    state: entity.state,
    isArmed: ['armed_home', 'armed_away', 'armed_night', 'armed_vacation'].includes(entity.state),
    isDisarmed: entity.state === 'disarmed',
    isPending: entity.state === 'pending',
    isTriggered: entity.state === 'triggered',
    supportedFeatures: entity.attributes.supported_features || 0,
    codeArmRequired: entity.attributes.code_arm_required,
    codeFormat: entity.attributes.code_format,
    changedBy: entity.attributes.changed_by,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  camera: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'camera',
    state: entity.state,
    isIdle: entity.state === 'idle',
    isStreaming: entity.state === 'streaming',
    isRecording: entity.state === 'recording',
    entityPicture: entity.attributes.entity_picture,
    supportedFeatures: entity.attributes.supported_features || 0,
    frontendStreamType: entity.attributes.frontend_stream_type,
    brandName: entity.attributes.brand,
    modelName: entity.attributes.model_name,
    motionDetection: entity.attributes.motion_detection,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  scene: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: 'scene',
    state: entity.state,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  }),

  // Default normalizer for unknown entity types
  default: (entity) => ({
    id: entity.entity_id,
    name: entity.attributes.friendly_name || entity.entity_id,
    type: entity.entity_id.split('.')[0],
    state: entity.state,
    attributes: entity.attributes,
    icon: entity.attributes.icon,
    lastChanged: entity.last_changed,
    lastUpdated: entity.last_updated,
    raw: entity
  })
};

/**
 * Normalize an entity based on its domain
 */
export function normalizeEntity(entity) {
  const domain = entity.entity_id.split('.')[0];
  const normalizer = entityNormalizers[domain] || entityNormalizers.default;
  return normalizer(entity);
}

/**
 * Service call builders for common operations
 */
export const serviceBuilders = {
  light: {
    turnOn: (entityId, options = {}) => ({
      domain: 'light',
      service: 'turn_on',
      data: {
        entity_id: entityId,
        ...options
      }
    }),
    
    turnOff: (entityId) => ({
      domain: 'light',
      service: 'turn_off',
      data: { entity_id: entityId }
    }),
    
    setBrightness: (entityId, brightness) => ({
      domain: 'light',
      service: 'turn_on',
      data: {
        entity_id: entityId,
        brightness: Math.round((brightness / 100) * 255)
      }
    }),
    
    setColor: (entityId, rgbColor) => ({
      domain: 'light',
      service: 'turn_on',
      data: {
        entity_id: entityId,
        rgb_color: rgbColor
      }
    })
  },

  climate: {
    setTemperature: (entityId, temperature) => ({
      domain: 'climate',
      service: 'set_temperature',
      data: {
        entity_id: entityId,
        temperature
      }
    }),
    
    setHvacMode: (entityId, hvacMode) => ({
      domain: 'climate',
      service: 'set_hvac_mode',
      data: {
        entity_id: entityId,
        hvac_mode: hvacMode
      }
    }),
    
    setFanMode: (entityId, fanMode) => ({
      domain: 'climate',
      service: 'set_fan_mode',
      data: {
        entity_id: entityId,
        fan_mode: fanMode
      }
    }),
    
    setPreset: (entityId, presetMode) => ({
      domain: 'climate',
      service: 'set_preset_mode',
      data: {
        entity_id: entityId,
        preset_mode: presetMode
      }
    })
  },

  media_player: {
    playMedia: (entityId, mediaContentId, mediaContentType) => ({
      domain: 'media_player',
      service: 'play_media',
      data: {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: mediaContentType
      }
    }),
    
    volumeSet: (entityId, volumeLevel) => ({
      domain: 'media_player',
      service: 'volume_set',
      data: {
        entity_id: entityId,
        volume_level: volumeLevel
      }
    }),
    
    mediaNext: (entityId) => ({
      domain: 'media_player',
      service: 'media_next_track',
      data: { entity_id: entityId }
    }),
    
    mediaPrevious: (entityId) => ({
      domain: 'media_player',
      service: 'media_previous_track',
      data: { entity_id: entityId }
    }),
    
    mediaPlayPause: (entityId) => ({
      domain: 'media_player',
      service: 'media_play_pause',
      data: { entity_id: entityId }
    }),
    
    joinGroup: (entityId, groupMembers) => ({
      domain: 'media_player',
      service: 'join',
      data: {
        entity_id: entityId,
        group_members: groupMembers
      }
    }),
    
    unjoinGroup: (entityId) => ({
      domain: 'media_player',
      service: 'unjoin',
      data: { entity_id: entityId }
    })
  },

  alarm_control_panel: {
    disarm: (entityId, code) => ({
      domain: 'alarm_control_panel',
      service: 'alarm_disarm',
      data: {
        entity_id: entityId,
        ...(code && { code })
      }
    }),
    
    armHome: (entityId, code) => ({
      domain: 'alarm_control_panel',
      service: 'alarm_arm_home',
      data: {
        entity_id: entityId,
        ...(code && { code })
      }
    }),
    
    armAway: (entityId, code) => ({
      domain: 'alarm_control_panel',
      service: 'alarm_arm_away',
      data: {
        entity_id: entityId,
        ...(code && { code })
      }
    }),
    
    armNight: (entityId, code) => ({
      domain: 'alarm_control_panel',
      service: 'alarm_arm_night',
      data: {
        entity_id: entityId,
        ...(code && { code })
      }
    })
  }
};

/**
 * Home Assistant Client - Main interface for HA operations
 */
export class HomeAssistantClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_HA_BASE_URL || 'http://localhost:8123';
    this.token = config.token || import.meta.env.VITE_HA_TOKEN || '';
    this.useMockData = config.useMockData ?? (import.meta.env.VITE_USE_MOCK_HA === 'true');
    
    this.ws = null;
    this.subscribers = new Map();
    this.entityCache = new Map();
    this.isConnected = false;
    
    // Bind methods to preserve 'this' context
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  /**
   * Initialize connection - REST API only for now
   */
  async connect() {
    if (this.useMockData || !this.baseUrl || !this.token) {
      this.isConnected = true;
      return;
    }

    // Test REST API connection first
    try {
      console.log('🔌 Testing Home Assistant REST API connection...');
      const testResponse = await fetch(`${this.baseUrl}/api/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!testResponse.ok) {
        throw new Error(`HTTP ${testResponse.status}: ${testResponse.statusText}`);
      }
      
      const testData = await testResponse.json();
      console.log('✅ Home Assistant REST API connected:', testData.message);
      
      // Use REST API only for now (skip WebSocket)
      this.ws = null;
      this.isConnected = true;
      
      // Start polling for any existing subscribers
      this.startPolling();
      
      return () => {}; // Return empty unsubscribe function
      
    } catch (error) {
      console.error('❌ Failed to connect to Home Assistant REST API:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Start polling for entity updates when WebSocket is unavailable
   */
  startPolling() {
    // Only start polling if we have subscribers and no WebSocket
    if (this.ws || this.subscribers.size === 0) return;
    
    this.pollingInterval = setInterval(async () => {
      try {
        // Get fresh states for all subscribed entities
        const subscribedEntityIds = Array.from(this.subscribers.keys()).filter(id => id !== '*');
        
        if (subscribedEntityIds.length > 0) {
          const allStates = await this.getStates();
          
          // Notify subscribers of any changes
          subscribedEntityIds.forEach(entityId => {
            const entity = allStates.find(e => e.id === entityId);
            const entitySubscribers = this.subscribers.get(entityId);
            
            if (entity && entitySubscribers) {
              entitySubscribers.forEach(callback => {
                try {
                  callback(entity);
                } catch (error) {
                  console.error('Error in polling subscriber callback:', error);
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Error during polling:', error);
        // Stop polling on repeated failures to prevent resource exhaustion
        if (error.message.includes('Failed to fetch') || error.message.includes('INSUFFICIENT_RESOURCES')) {
          console.log('Stopping polling due to network errors');
          this.stopPolling();
        }
      }
    }, 5000); // Poll every 5 seconds
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Disconnect WebSocket and stop polling
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopPolling();
    this.isConnected = false;
    this.subscribers.clear();
  }

  /**
   * Subscribe to entity state changes
   * @param {string} entityId - Entity ID to watch, or '*' for all entities
   * @param {function} callback - Callback function to receive updates
   * @returns {function} Unsubscribe function
   */
  subscribe(entityId, callback) {
    if (!this.subscribers.has(entityId)) {
      this.subscribers.set(entityId, new Set());
    }
    
    this.subscribers.get(entityId).add(callback);
    
    // Start polling if no WebSocket and this is the first subscriber
    if (!this.ws && this.isConnected) {
      this.startPolling();
    }
    
    // Return unsubscribe function
    return () => {
      const entitySubscribers = this.subscribers.get(entityId);
      if (entitySubscribers) {
        entitySubscribers.delete(callback);
        if (entitySubscribers.size === 0) {
          this.subscribers.delete(entityId);
        }
      }
      
      // Stop polling if no more subscribers
      if (this.subscribers.size === 0) {
        this.stopPolling();
      }
    };
  }

  /**
   * Unsubscribe from entity state changes
   */
  unsubscribe(entityId, callback) {
    const entitySubscribers = this.subscribers.get(entityId);
    if (entitySubscribers) {
      entitySubscribers.delete(callback);
      if (entitySubscribers.size === 0) {
        this.subscribers.delete(entityId);
      }
    }
  }

  /**
   * Get all entity states
   */
  async getStates() {
    if (this.useMockData) {
      // Return mock data if in mock mode
      const { mockStates } = await import('../config/mockHomeAssistantData');
      const normalizedStates = mockStates.map(normalizeEntity);
      
      // Update cache with mock data
      normalizedStates.forEach(entity => {
        this.entityCache.set(entity.id, entity);
      });
      
      return normalizedStates;
    }

    const rawStates = await haApi.getStates(this.baseUrl, this.token);
    const normalizedStates = rawStates.map(normalizeEntity);
    
    // Update cache
    normalizedStates.forEach(entity => {
      this.entityCache.set(entity.id, entity);
    });
    
    return normalizedStates;
  }

  /**
   * Get states for specific entity types
   */
  async getEntitiesByType(entityType) {
    const allStates = await this.getStates();
    return allStates.filter(entity => entity.type === entityType);
  }

  /**
   * Get single entity state
   */
  async getEntityState(entityId) {
    // Check cache first
    if (this.entityCache.has(entityId)) {
      return this.entityCache.get(entityId);
    }

    const allStates = await this.getStates();
    return allStates.find(entity => entity.id === entityId);
  }

  /**
   * Call a Home Assistant service
   */
  async callService(domain, service, data = {}) {
    if (this.useMockData) {
      console.log(`Mock: Calling service ${domain}.${service}`, data);
      return;
    }

    return await haApi.callService(this.baseUrl, this.token, domain, service, data);
  }

  /**
   * Execute a service call using service builder
   */
  async executeServiceCall(serviceCall) {
    return await this.callService(serviceCall.domain, serviceCall.service, serviceCall.data);
  }

  /**
   * Convenience methods for common operations
   */
  
  // Light operations
  async turnOnLight(entityId, options = {}) {
    const serviceCall = serviceBuilders.light.turnOn(entityId, options);
    return await this.executeServiceCall(serviceCall);
  }

  async turnOffLight(entityId) {
    const serviceCall = serviceBuilders.light.turnOff(entityId);
    return await this.executeServiceCall(serviceCall);
  }

  async setLightBrightness(entityId, brightness) {
    const serviceCall = serviceBuilders.light.setBrightness(entityId, brightness);
    return await this.executeServiceCall(serviceCall);
  }

  async setLightColor(entityId, rgbColor) {
    const serviceCall = serviceBuilders.light.setColor(entityId, rgbColor);
    return await this.executeServiceCall(serviceCall);
  }

  // Climate operations
  async setTemperature(entityId, temperature) {
    const serviceCall = serviceBuilders.climate.setTemperature(entityId, temperature);
    return await this.executeServiceCall(serviceCall);
  }

  async setHvacMode(entityId, hvacMode) {
    const serviceCall = serviceBuilders.climate.setHvacMode(entityId, hvacMode);
    return await this.executeServiceCall(serviceCall);
  }

  // Media player operations
  async playMedia(entityId, mediaContentId, mediaContentType) {
    const serviceCall = serviceBuilders.media_player.playMedia(entityId, mediaContentId, mediaContentType);
    return await this.executeServiceCall(serviceCall);
  }

  async setVolume(entityId, volumeLevel) {
    const serviceCall = serviceBuilders.media_player.volumeSet(entityId, volumeLevel);
    return await this.executeServiceCall(serviceCall);
  }

  async mediaPlayPause(entityId) {
    const serviceCall = serviceBuilders.media_player.mediaPlayPause(entityId);
    return await this.executeServiceCall(serviceCall);
  }

  // Alarm operations
  async disarmAlarm(entityId, code) {
    const serviceCall = serviceBuilders.alarm_control_panel.disarm(entityId, code);
    return await this.executeServiceCall(serviceCall);
  }

  async armAlarmHome(entityId, code) {
    const serviceCall = serviceBuilders.alarm_control_panel.armHome(entityId, code);
    return await this.executeServiceCall(serviceCall);
  }

  async armAlarmAway(entityId, code) {
    const serviceCall = serviceBuilders.alarm_control_panel.armAway(entityId, code);
    return await this.executeServiceCall(serviceCall);
  }

  // Toggle any device
  async toggleDevice(entityId) {
    if (this.useMockData) {
      // Handle mock toggle
      const { updateMockDeviceState, mockStates } = await import('../config/mockHomeAssistantData');
      const device = mockStates.find(d => d.entity_id === entityId);
      if (device) {
        const newState = device.state === 'on' ? 'off' : 'on';
        updateMockDeviceState(entityId, newState);
      }
      return;
    }

    return await haApi.toggleDevice(this.baseUrl, this.token, entityId);
  }

  // Scene activation
  async activateScene(entityId) {
    if (this.useMockData) {
      console.log(`Mock: Activating scene ${entityId}`);
      return;
    }

    return await haApi.activateScene(this.baseUrl, this.token, entityId);
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      useMockData: this.useMockData,
      baseUrl: this.baseUrl,
      hasToken: !!this.token
    };
  }
}

// Export singleton instance
export const haClient = new HomeAssistantClient();