import mqtt from 'mqtt';

class RingMqttClient {
  constructor() {
    this.client = null;
    this.subscribers = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.lastMotionEvents = new Map();
    
    // Get MQTT broker URL from environment or use default
    this.brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://192.168.1.224:1884';
    
    // MQTT client options
    this.options = {
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      keepalive: 60,
      clientId: 'family-hub-' + Math.random().toString(16).substr(2, 8)
    };
  }

  connect() {
    try {
      console.log('🔌 Connecting to Ring MQTT broker:', this.brokerUrl);
      console.log('🔧 MQTT options:', this.options);
      
      // Create MQTT client connection
      this.client = mqtt.connect(this.brokerUrl, this.options);
      
      // Set up event handlers
      this.client.on('connect', () => {
        console.log('✅ Connected to Ring MQTT broker');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.subscribeToRingTopics();
      });
      
      this.client.on('message', (topic, message) => {
        this.handleMqttMessage(topic, message);
      });
      
      this.client.on('error', (error) => {
        console.error('❌ MQTT connection error:', error);
        this.isConnected = false;
        this.scheduleReconnect();
      });
      
      this.client.on('close', () => {
        console.log('🔌 MQTT connection closed');
        this.isConnected = false;
      });
      
      this.client.on('reconnect', () => {
        console.log('🔄 MQTT reconnecting...');
      });
      
    } catch (error) {
      console.error('❌ Failed to connect to Ring MQTT broker:', error);
      this.scheduleReconnect();
    }
  }

  subscribeToRingTopics() {
    if (!this.client || !this.isConnected) {
      console.warn('⚠️ Cannot subscribe: MQTT client not connected');
      return;
    }
    
    // Subscribe to Ring alarm and security topics
    const alarmTopics = [
      'ring/+/alarm/+/status',
      'ring/+/camera/+/motion/state', 
      'ring/+/alarm/+/motion/state',
      'ring/+/alarm/+/sensor/+/state',
      'ring/alarm/status',  // Simplified topic structure
      'ring/alarm/command', // Command topic
      'ring/+/motion/state' // Motion sensors
    ];
    
    console.log('📡 Subscribing to Ring alarm topics:', alarmTopics);
    
    alarmTopics.forEach(topic => {
      this.client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`✅ Subscribed to ${topic}`);
        }
      });
    });
  }

  // Handle real MQTT messages
  handleMqttMessage(topic, message) {
    try {
      console.log('📨 MQTT message received:', { topic, message: message.toString() });
      
      let messageData;
      try {
        messageData = JSON.parse(message.toString());
      } catch (e) {
        // Handle non-JSON messages (simple string values)
        messageData = { 
          topic, 
          state: message.toString(),
          timestamp: new Date().toISOString()
        };
      }
      
      // Add topic to message data if not present
      if (!messageData.topic) {
        messageData.topic = topic;
      }
      
      // Notify all subscribers
      this.subscribers.forEach(callback => {
        try {
          callback(messageData);
        } catch (error) {
          console.error('Error notifying MQTT subscriber:', error);
        }
      });
      
    } catch (error) {
      console.error('❌ Error handling MQTT message:', error);
    }
  }

  // Simulate Ring alarm events for testing (keep for fallback)
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

  // Send alarm command via MQTT
  async sendAlarmCommand(command) {
    if (!this.client || !this.isConnected) {
      console.error('❌ Cannot send alarm command: not connected to MQTT broker');
      return false;
    }

    console.log('📤 Sending Ring alarm command via MQTT:', command);
    
    try {
      // Publish to Ring alarm command topic
      const commandTopic = 'ring/alarm/command';
      const payload = {
        command: command,
        timestamp: new Date().toISOString(),
        source: 'family-hub'
      };

      console.log('📡 Publishing to topic:', commandTopic, 'Payload:', payload);
      
      // Publish the command to MQTT
      return new Promise((resolve, reject) => {
        this.client.publish(commandTopic, JSON.stringify(payload), { qos: 1 }, (err) => {
          if (err) {
            console.error('❌ Failed to publish alarm command:', err);
            reject(err);
          } else {
            console.log('✅ Alarm command published successfully');
            resolve(true);
          }
        });
      });
      
    } catch (error) {
      console.error('❌ Failed to send alarm command:', error);
      return false;
    }
  }

  // Simulate alarm command response for testing
  simulateAlarmCommand(command) {
    console.log('🎭 Simulating Ring alarm command response for:', command);
    
    // Simulate delay like real system
    setTimeout(() => {
      let newStatus;
      switch (command) {
        case 'arm_home':
          newStatus = 'home';
          break;
        case 'arm_away':
          newStatus = 'away';
          break;
        case 'disarm':
          newStatus = 'disarmed';
          break;
        default:
          newStatus = 'disarmed';
      }

      // Simulate status change event from Ring system
      const statusData = {
        topic: 'ring/home/alarm/status',
        state: newStatus,
        timestamp: new Date().toISOString(),
        source: 'ring_alarm_system'
      };

      console.log('🔄 Simulating Ring alarm status update:', statusData);
      
      // Notify subscribers of status change
      this.subscribers.forEach(callback => {
        try {
          callback(statusData);
        } catch (error) {
          console.error('Error notifying status change subscriber:', error);
        }
      });
    }, 1500); // 1.5 second delay to simulate real system
  }

  disconnect() {
    if (this.client) {
      this.client.end(false, () => {
        console.log('🔌 Disconnected from Ring MQTT broker');
      });
      this.client = null;
    }
    this.isConnected = false;
  }
}

// Create singleton instance
export const ringMqttClient = new RingMqttClient();

// Auto-connect when the service is imported
ringMqttClient.connect();

export default ringMqttClient;