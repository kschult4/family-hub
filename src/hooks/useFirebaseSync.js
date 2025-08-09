import { useState, useEffect } from 'react';

let firebaseImports = null;
let database = null;

export function useFirebaseSync(path, defaultValue = []) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Initialize Firebase on first use
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const { ref, onValue, set, push, remove, update } = await import('firebase/database');
        const { database: db } = await import('../config/firebase');
        firebaseImports = { ref, onValue, set, push, remove, update };
        database = db;
        setFirebaseReady(true);
      } catch (err) {
        console.log('Firebase not available, using local state:', err.message);
        setFirebaseReady(false);
        setLoading(false);
      }
    };

    if (!firebaseImports) {
      initFirebase();
    } else {
      setFirebaseReady(true);
    }
  }, []);

  // Return local state fallback if Firebase isn't ready
  const localFallback = {
    data,
    loading: false,
    error: null,
    updateData: (newData) => setData(newData),
    addItem: (item) => setData(prev => [item, ...prev]),
    updateItem: (id, updates) => setData(prev => prev.map(item => item.id === id ? {...item, ...updates} : item)),
    removeItem: (id) => setData(prev => prev.filter(item => item.id !== id))
  };

  if (!firebaseReady) {
    return localFallback;
  }

  useEffect(() => {
    if (!firebaseReady || !firebaseImports) return;

    const { ref, onValue } = firebaseImports;
    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const value = snapshot.val();
        console.log(`Firebase onValue for ${path}:`, value);
        
        if (value) {
          // Convert Firebase object to array if needed, preserving Firebase keys as IDs
          let arrayData;
          if (Array.isArray(value)) {
            arrayData = value;
          } else {
            // Convert object to array and preserve Firebase keys as IDs
            arrayData = Object.entries(value).map(([firebaseKey, item]) => ({
              ...item,
              firebaseId: firebaseKey, // Preserve Firebase key
              id: item.id || firebaseKey // Use original ID if exists, otherwise use Firebase key
            }));
          }
          console.log(`Converted to array for ${path}:`, arrayData);
          setData(arrayData);
        } else {
          console.log(`No data found for ${path}, using default:`, defaultValue);
          setData(defaultValue);
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
  }, [path, defaultValue, firebaseReady]);

  const updateData = async (newData) => {
    if (!firebaseReady || !firebaseImports) return;
    try {
      const { ref, set } = firebaseImports;
      console.log(`Updating data for ${path}:`, newData);
      const dataRef = ref(database, path);
      await set(dataRef, newData);
      console.log(`Data updated successfully for ${path}`);
    } catch (err) {
      console.error('Firebase update error:', err);
      setError(err);
    }
  };

  const addItem = async (item) => {
    if (!firebaseReady || !firebaseImports) return;
    try {
      const { ref, push } = firebaseImports;
      console.log(`Adding item to ${path}:`, item);
      const dataRef = ref(database, path);
      const result = await push(dataRef, item);
      console.log(`Item added successfully to ${path}, key:`, result.key);
    } catch (err) {
      console.error('Firebase add error:', err);
      setError(err);
    }
  };

  const updateItem = async (id, updates) => {
    if (!firebaseReady || !firebaseImports) return;
    try {
      const { ref, update } = firebaseImports;
      // Find the item to get its Firebase key
      const item = data.find(item => item.id === id);
      const firebaseKey = item?.firebaseId || id;
      console.log(`Updating item ${id} using Firebase key ${firebaseKey}:`, updates);
      
      const itemRef = ref(database, `${path}/${firebaseKey}`);
      await update(itemRef, updates);
      console.log(`Item updated successfully: ${firebaseKey}`);
    } catch (err) {
      console.error('Firebase item update error:', err);
      setError(err);
    }
  };

  const removeItem = async (id) => {
    if (!firebaseReady || !firebaseImports) return;
    try {
      const { ref, remove } = firebaseImports;
      // Find the item to get its Firebase key
      const item = data.find(item => item.id === id);
      const firebaseKey = item?.firebaseId || id;
      console.log(`Removing item ${id} using Firebase key ${firebaseKey}`);
      
      const itemRef = ref(database, `${path}/${firebaseKey}`);
      await remove(itemRef);
      console.log(`Item removed successfully: ${firebaseKey}`);
    } catch (err) {
      console.error('Firebase remove error:', err);
      setError(err);
    }
  };

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