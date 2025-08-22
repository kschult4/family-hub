import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { database } from '../config/firebase';
import { useOnlineStatus, OfflineStorage, OfflineQueue } from './useOfflineSync';

export function useFirebaseSync(path, defaultValue = []) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultValueRef = useRef(defaultValue);
  const isArrayData = Array.isArray(defaultValue);
  const isOnline = useOnlineStatus();
  const offlineKey = `family-hub-${path}`;

  useEffect(() => {
    // Try to load cached data first
    const cachedData = OfflineStorage.get(offlineKey);
    if (cachedData && !isOnline) {
      setData(cachedData);
      setLoading(false);
    }

    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const value = snapshot.val();
        
        if (value) {
          // Handle different data types based on defaultValue
          if (isArrayData) {
            // Optimize array conversion - cache entries and use faster approach
            const arrayData = Array.isArray(value) ? value : 
              Object.entries(value).map(([firebaseKey, item]) => ({
                ...item,
                firebaseId: firebaseKey,
                id: item.id || firebaseKey
              }));
            setData(arrayData);
            // Cache for offline use
            OfflineStorage.set(offlineKey, arrayData);
          } else {
            // For objects, use direct assignment for better performance
            setData({ ...value });
            // Cache for offline use
            OfflineStorage.set(offlineKey, value);
          }
        } else {
          setData(defaultValueRef.current);
        }
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Firebase sync error:', err);
        setError(err);
        setLoading(false);
      }
    }, (err) => {
      console.error('Firebase listener error:', err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]); // Remove defaultValue dependency to prevent unnecessary re-renders

  const updateData = useCallback(async (newData) => {
    if (!isOnline) {
      // Queue for later and update local state
      OfflineQueue.add({
        type: 'set',
        path,
        data: newData
      });
      setData(newData);
      OfflineStorage.set(offlineKey, newData);
      return;
    }

    try {
      const dataRef = ref(database, path);
      await set(dataRef, newData);
    } catch (err) {
      console.error('Firebase update error:', err);
      setError(err);
    }
  }, [path, isOnline, offlineKey]);

  const addItem = useCallback(async (item) => {
    if (!isOnline) {
      // Queue for later and update local state
      const tempId = Math.random().toString(36).substr(2, 9);
      const newItem = { ...item, id: tempId, offline: true };
      
      OfflineQueue.add({
        type: 'add',
        path,
        data: item
      });
      
      setData(currentData => {
        const newData = [...currentData, newItem];
        OfflineStorage.set(offlineKey, newData);
        return newData;
      });
      return;
    }

    try {
      const dataRef = ref(database, path);
      await push(dataRef, item);
    } catch (err) {
      console.error('Firebase add error:', err);
      setError(err);
    }
  }, [path, isOnline, offlineKey]);

  const updateItem = useCallback(async (id, updates) => {
    if (!isOnline) {
      // Queue for later and update local state
      OfflineQueue.add({
        type: 'update',
        path,
        data: { id, updates }
      });
      
      setData(currentData => {
        const newData = currentData.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        OfflineStorage.set(offlineKey, newData);
        return newData;
      });
      return;
    }

    try {
      // Find the item to get its Firebase key
      const item = data.find(item => item.id === id);
      const firebaseKey = item?.firebaseId || id;
      
      const itemRef = ref(database, `${path}/${firebaseKey}`);
      await update(itemRef, updates);
    } catch (err) {
      console.error('Firebase item update error:', err);
      setError(err);
    }
  }, [path, data, isOnline, offlineKey]);

  const removeItem = useCallback(async (id) => {
    if (!isOnline) {
      // Queue for later and update local state
      OfflineQueue.add({
        type: 'remove',
        path,
        data: { id }
      });
      
      setData(currentData => {
        const newData = currentData.filter(item => item.id !== id);
        OfflineStorage.set(offlineKey, newData);
        return newData;
      });
      return;
    }

    try {
      // Find the item to get its Firebase key
      const item = data.find(item => item.id === id);
      const firebaseKey = item?.firebaseId || id;
      
      const itemRef = ref(database, `${path}/${firebaseKey}`);
      await remove(itemRef);
    } catch (err) {
      console.error('Firebase remove error:', err);
      setError(err);
    }
  }, [path, data, isOnline, offlineKey]);

  return {
    data,
    loading,
    error,
    updateData,
    addItem,
    updateItem,
    removeItem,
    isOnline
  };
}