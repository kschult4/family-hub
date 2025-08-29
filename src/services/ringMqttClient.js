class RingMqttClient {
  constructor() {
    this.ws = null;
    this.subscribers = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.lastMotionEvents = new Map();
    
    // Get MQTT broker URL from environment or use default
    this.brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://192.168.1.100:1883';
  }

  connect() {
    try {
      // Try to establish a WebSocket connection to the MQTT broker
      this.attemptWebSocketConnection();
      
    } catch (error) {
      this.fallbackToSimulation();
    }
  }

  attemptWebSocketConnection() {
    try {
      // Try to create a WebSocket connection to test if MQTT WebSocket support is available
      const testWs = new WebSocket(this.brokerUrl);
      
      testWs.onopen = () => {
        console.log('✅ WebSocket connection established to Ring MQTT broker');
        testWs.close(); // Close test connection
        this.establishMqttConnection();
      };
      
      testWs.onerror = (error) => {
        // Silently handle Ring MQTT connection failure - suppress console errors
        this.fallbackToSimulation();
      };
      
      testWs.onclose = (event) => {
        if (event.code !== 1000) { // 1000 = normal closure
          // Silently handle Ring MQTT connection close
          this.fallbackToSimulation();
        }
      };
      
      // Set a timeout for the connection attempt
      setTimeout(() => {
        if (testWs.readyState === WebSocket.CONNECTING) {
          // Silently fall back to simulation mode
          testWs.close();
          this.fallbackToSimulation();
        }
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error creating WebSocket connection:', error);
      this.fallbackToSimulation();
    }
  }

  establishMqttConnection() {
    // This would be where we implement the actual MQTT over WebSocket connection
    // For now, we'll simulate since we don't have mqtt.js dependency
    console.log('📡 Would establish MQTT connection here...');
    console.log('💡 Note: Need to install mqtt.js for real MQTT WebSocket support');
    this.simulateConnection();
  }

  fallbackToSimulation() {
    console.log('🎭 Ring MQTT broker not available - using simulation mode for demo');
    this.simulateConnection();
  }

  // Simulate MQTT connection for demo purposes
  // In production, you'd use a proper WebSocket MQTT client like mqtt.js
  simulateConnection() {
    console.log('✅ Connected to Ring MQTT broker (simulated)');
    console.log('📊 Subscribers count:', this.subscribers.size);
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Subscribe to Ring motion topics
    this.subscribeToRingTopics();
    
    // Simulate periodic motion events for testing
    this.simulateMotionEvents();
  }

  subscribeToRingTopics() {
    // Subscribe to Ring alarm and security topics
    const alarmTopics = [
      'ring/+/alarm/+/status',
      'ring/+/camera/+/motion/state',
      'ring/+/alarm/+/motion/state',
      'ring/+/alarm/+/sensor/+/state'
    ];
    
    console.log('📡 Subscribing to Ring alarm topics:', alarmTopics);
    
    // In a real implementation, you'd subscribe using the MQTT client
    // this.client.subscribe(alarmTopics);
  }

  // Simulate Ring alarm events for testing
  simulateMotionEvents() {
    console.log('🎭 Starting Ring alarm event simulation...');
    
    // Simulate alarm events every 15-30 seconds for testing
    const simulateEvent = () => {
      if (!this.isConnected) {
        console.log('❌ Not connected, skipping simulation');
        return;
      }
      
      // Periodic simulation check (reduced logging)
      
      const devices = [
        { id: 'front_door_camera', name: 'Front Door Camera', type: 'camera', location: 'Home' },
        { id: 'back_yard_camera', name: 'Back Yard Camera', type: 'camera', location: 'Home' },
        { id: 'motion_sensor_living', name: 'Living Room Motion', type: 'sensor', location: 'Home' },
        { id: 'contact_sensor_door', name: 'Front Door Contact', type: 'sensor', location: 'Home' }
      ];
      
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      const eventType = Math.random() > 0.7 ? 'motion' : 'none'; // 30% chance of motion for testing
      
      if (eventType === 'motion') {
        const alarmData = {
          timestamp: new Date().toISOString(),
          state: 'ON',
          device: randomDevice.name,
          device_id: randomDevice.id,
          device_type: randomDevice.type,
          location: randomDevice.location,
          topic: `ring/home/${randomDevice.type}/${randomDevice.id}/motion/state`
        };
        
        // Motion detected - only log significant events
        console.log('🚨 Ring motion detected:', randomDevice.name);
        this.handleMotionEvent(alarmData);
      }
      // No logging for "no events" to reduce spam
      
      // Schedule next event - less frequent for alarm testing
      setTimeout(simulateEvent, Math.random() * 15000 + 15000); // 15-30 seconds
    };
    
    // Start simulation after 5 seconds
    console.log('⏰ First alarm simulation in 5 seconds...');
    setTimeout(simulateEvent, 5000);
  }

  handleMotionEvent(motionData) {
    // Store the motion event
    this.lastMotionEvents.set(motionData.device_id, {
      ...motionData,
      timestamp: new Date(motionData.timestamp)
    });
    
    // Notify all subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(motionData);
      } catch (error) {
        console.error('Error notifying motion subscriber:', error);
      }
    });
    
    // Auto-clear motion after 5 seconds (simulate motion ending)
    if (motionData.state === 'ON') {
      setTimeout(() => {
        const endMotionData = {
          ...motionData,
          state: 'OFF',
          timestamp: new Date().toISOString()
        };
        
        this.subscribers.forEach(callback => {
          try {
            callback(endMotionData);
          } catch (error) {
            console.error('Error notifying motion end subscriber:', error);
          }
        });
      }, 5000);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getLastMotionEvents() {
    return Array.from(this.lastMotionEvents.values())
      .filter(event => {
        // Only return recent events (within last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return event.timestamp > fiveMinutesAgo;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts + 1} in ${delay}ms`);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Send alarm command via MQTT
  async sendAlarmCommand(command) {
    console.log('🛡️ Sending Ring alarm command:', command);
    
    if (!this.isConnected) {
      console.warn('⚠️ Not connected to Ring MQTT broker - cannot send command');
      return false;
    }
    
    try {
      const commandPayload = {
        command: command,
        timestamp: new Date().toISOString(),
        source: 'family-hub'
      };
      
      // In a real implementation, this would publish to the MQTT broker
      // For simulation, we'll just log the command
      console.log('📤 Publishing alarm command to ring/alarm/command:', commandPayload);
      
      // Simulate successful command
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send Ring alarm command:', error);
      return false;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    console.log('🔌 Disconnected from Ring MQTT broker');
  }
}

// Create singleton instance
export const ringMqttClient = new RingMqttClient();

// MQTT client disabled - no longer using MQTT for IoT devices
// ringMqttClient.connect();

export default ringMqttClient;