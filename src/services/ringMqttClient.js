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
      console.log('🔌 Connecting to Ring MQTT broker:', this.brokerUrl);
      
      // Use WebSocket MQTT client (we'll need to add mqtt dependency)
      // For now, simulate connection to avoid adding new dependencies
      this.simulateConnection();
      
    } catch (error) {
      console.error('❌ Failed to connect to Ring MQTT broker:', error);
      this.scheduleReconnect();
    }
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
      
      console.log('🎯 Simulating Ring alarm event check...');
      console.log('📊 Current subscribers:', this.subscribers.size);
      
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
        
        console.log('🚨 Ring alarm event (motion detected):', alarmData);
        console.log('📢 Notifying alarm subscribers...');
        this.handleMotionEvent(alarmData);
      } else {
        console.log('✅ No alarm events this time');
      }
      
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

// Auto-connect when the service is imported
ringMqttClient.connect();

export default ringMqttClient;