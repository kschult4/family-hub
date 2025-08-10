import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { database } from '../config/firebase';

export function useFirebaseSync(path, defaultValue = []) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultValueRef = useRef(defaultValue);
  const isArrayData = Array.isArray(defaultValue);

  useEffect(() => {
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
          } else {
            // For objects, use direct assignment for better performance
            setData({ ...value });
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
    try {
      const dataRef = ref(database, path);
      await set(dataRef, newData);
    } catch (err) {
      console.error('Firebase update error:', err);
      setError(err);
    }
  }, [path]);

  const addItem = useCallback(async (item) => {
    try {
      const dataRef = ref(database, path);
      await push(dataRef, item);
    } catch (err) {
      console.error('Firebase add error:', err);
      setError(err);
    }
  }, [path]);

  const updateItem = useCallback(async (id, updates) => {
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
  }, [path, data]);

  const removeItem = useCallback(async (id) => {
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
  }, [path, data]);

  return {
    data,
    loading,
    error,
    updateData,
    addItem,
    updateItem,
    removeItem
  };
}