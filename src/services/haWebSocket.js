class HomeAssistantWebSocket {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.ws = null;
    this.messageId = 1;
    this.subscribers = new Map();
    this.entitySubscribers = new Map(); // Entity-specific subscribers
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.connectionPromise = null;
    this.pingInterval = null;
    this.lastPong = Date.now();
  }

  connect() {
    // Return existing promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const wsUrl = this.baseUrl.replace(/^https?:\/\//, 'ws://').replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
        this.ws = new WebSocket(`${wsUrl}/api/websocket`);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.startPingInterval();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message, resolve, reject);
        };

        this.ws.onclose = (event) => {
          this.isConnected = false;
          this.connectionPromise = null;
          this.stopPingInterval();
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (!this.isConnected) {
            this.connectionPromise = null;
            reject(new Error('Failed to connect to Home Assistant WebSocket'));
          }
        };
      } catch (error) {
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  handleMessage(message, resolve, reject) {
    switch (message.type) {
      case 'auth_required':
        this.sendAuth();
        break;
      
      case 'auth_ok':
        this.isConnected = true;
        this.subscribeToStateChanges();
        resolve();
        break;
      
      case 'auth_invalid':
        this.connectionPromise = null;
        reject(new Error('Invalid Home Assistant token'));
        break;
      
      case 'event':
        this.handleStateChangeEvent(message);
        break;
      
      case 'result':
        if (message.success && message.id === 2) {
          console.log('Successfully subscribed to state changes');
        }
        break;
      
      case 'pong':
        this.lastPong = Date.now();
        break;
      
      default:
        console.debug('Unhandled WebSocket message type:', message.type);
        break;
    }
  }

  sendAuth() {
    this.send({
      type: 'auth',
      access_token: this.token,
    });
  }

  subscribeToStateChanges() {
    this.send({
      id: 2,
      type: 'subscribe_events',
      event_type: 'state_changed',
    });
  }

  handleStateChangeEvent(message) {
    if (message.event && message.event.event_type === 'state_changed') {
      const { entity_id, new_state } = message.event.data;
      
      // Call global subscribers
      this.subscribers.forEach((callback) => {
        try {
          callback(entity_id, new_state);
        } catch (error) {
          console.error('Error in global state change callback:', error);
        }
      });

      // Call entity-specific subscribers
      const entityCallbacks = this.entitySubscribers.get(entity_id);
      if (entityCallbacks) {
        entityCallbacks.forEach((callback) => {
          try {
            callback(entity_id, new_state);
          } catch (error) {
            console.error('Error in entity-specific state change callback:', error);
          }
        });
      }
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect().catch(() => {
        console.error('Reconnection failed');
      });
    }, delay);
  }

  subscribe(callback) {
    const id = this.messageId++;
    this.subscribers.set(id, callback);
    return () => {
      this.subscribers.delete(id);
    };
  }

  subscribeToEntity(entityId, callback) {
    if (!this.entitySubscribers.has(entityId)) {
      this.entitySubscribers.set(entityId, new Set());
    }
    
    const entityCallbacks = this.entitySubscribers.get(entityId);
    entityCallbacks.add(callback);
    
    return () => {
      entityCallbacks.delete(callback);
      if (entityCallbacks.size === 0) {
        this.entitySubscribers.delete(entityId);
      }
    };
  }

  unsubscribeFromEntity(entityId, callback) {
    const entityCallbacks = this.entitySubscribers.get(entityId);
    if (entityCallbacks) {
      entityCallbacks.delete(callback);
      if (entityCallbacks.size === 0) {
        this.entitySubscribers.delete(entityId);
      }
    }
  }

  startPingInterval() {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
        
        // Check if we haven't received a pong in too long
        const timeSinceLastPong = Date.now() - this.lastPong;
        if (timeSinceLastPong > 30000) { // 30 seconds
          console.warn('WebSocket ping timeout, attempting reconnect');
          this.ws.close();
        }
      }
    }, 10000); // Send ping every 10 seconds
  }

  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  close() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this.subscribers.clear();
    this.entitySubscribers.clear();
    this.isConnected = false;
    this.connectionPromise = null;
  }

  getConnectionState() {
    return this.isConnected;
  }

  getConnectionHealth() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      lastPong: this.lastPong,
      subscriberCount: this.subscribers.size,
      entitySubscriberCount: this.entitySubscribers.size,
      wsState: this.ws ? this.ws.readyState : null
    };
  }
}

export function createWebSocketConnection(baseUrl, token) {
  return new HomeAssistantWebSocket(baseUrl, token);
}