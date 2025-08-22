import { useState, useEffect } from 'react';

// Hook to track online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Enhanced local storage with compression and error handling
export class OfflineStorage {
  static compress(data) {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Failed to compress data:', error);
      return null;
    }
  }

  static decompress(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to decompress data:', error);
      return null;
    }
  }

  static set(key, data) {
    try {
      const compressed = this.compress(data);
      if (compressed) {
        localStorage.setItem(key, compressed);
        localStorage.setItem(`${key}_timestamp`, Date.now().toString());
      }
    } catch (error) {
      console.warn('Failed to store offline data:', error);
    }
  }

  static get(key, maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    try {
      const data = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (!data || !timestamp) return null;
      
      const age = Date.now() - parseInt(timestamp);
      if (age > maxAge) {
        this.remove(key);
        return null;
      }
      
      return this.decompress(data);
    } catch (error) {
      console.warn('Failed to retrieve offline data:', error);
      return null;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
    } catch (error) {
      console.warn('Failed to remove offline data:', error);
    }
  }

  static clear() {
    try {
      // Clear only our app's keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('family-hub-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear offline data:', error);
    }
  }
}

// Queue for pending operations when offline
export class OfflineQueue {
  static queueKey = 'family-hub-offline-queue';

  static add(operation) {
    try {
      const queue = this.getQueue();
      queue.push({
        ...operation,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      });
      OfflineStorage.set(this.queueKey, queue);
    } catch (error) {
      console.warn('Failed to queue offline operation:', error);
    }
  }

  static getQueue() {
    return OfflineStorage.get(this.queueKey) || [];
  }

  static removeFromQueue(operationId) {
    try {
      const queue = this.getQueue();
      const filteredQueue = queue.filter(op => op.id !== operationId);
      OfflineStorage.set(this.queueKey, filteredQueue);
    } catch (error) {
      console.warn('Failed to remove from offline queue:', error);
    }
  }

  static clearQueue() {
    OfflineStorage.remove(this.queueKey);
  }

  static async processQueue(firebaseOperations) {
    const queue = this.getQueue();
    const results = [];

    for (const operation of queue) {
      try {
        const { type, path, data, id } = operation;
        
        switch (type) {
          case 'add':
            await firebaseOperations.add(path, data);
            break;
          case 'update':
            await firebaseOperations.update(path, data);
            break;
          case 'remove':
            await firebaseOperations.remove(path, data.id);
            break;
          default:
            console.warn('Unknown operation type:', type);
        }
        
        this.removeFromQueue(id);
        results.push({ success: true, operation });
      } catch (error) {
        console.warn('Failed to sync operation:', operation, error);
        results.push({ success: false, operation, error });
      }
    }

    return results;
  }
}