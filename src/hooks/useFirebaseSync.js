import { useState, useEffect } from 'react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { database } from '../config/firebase';

export function useFirebaseSync(path, defaultValue = []) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const value = snapshot.val();
        console.log(`Firebase onValue for ${path}:`, value);
        
        if (value) {
          // Handle different data types based on defaultValue
          if (Array.isArray(defaultValue)) {
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
            // Keep as object for non-array default values (like meals)
            // Force new object reference to trigger React re-render
            const newObjectData = { ...value };
            console.log(`Keeping as object for ${path}:`, newObjectData);
            console.log(`Setting data for ${path}, current data:`, data);
            setData(newObjectData);
            console.log(`Data should now be updated for ${path}`);
          }
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
  }, [path, defaultValue]);

  const updateData = async (newData) => {
    try {
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
    try {
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
    try {
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
    try {
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