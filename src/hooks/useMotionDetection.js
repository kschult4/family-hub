import { useState, useEffect, useCallback } from 'react';
import { updateMockDeviceState } from '../config/mockHomeAssistantData';

export function useMotionDetection(cameras = [], useMockData = true) {
  const [camerasWithMotion, setCamerasWithMotion] = useState([]);

  useEffect(() => {
    if (!useMockData || !cameras.length) return;

    let interval;
    let initialTimeout;
    const activeCameraIds = new Set();

    const simulateMotion = () => {
      const availableCameras = cameras.filter(camera => 
        !activeCameraIds.has(camera.entity_id)
      );
      
      if (availableCameras.length === 0) return;

      const randomCamera = availableCameras[Math.floor(Math.random() * availableCameras.length)];
      const motionTime = new Date().toISOString();
      
      activeCameraIds.add(randomCamera.entity_id);

      updateMockDeviceState(randomCamera.entity_id, 'motion_detected', {
        last_motion: motionTime
      });

      const cameraWithMotion = {
        ...randomCamera,
        lastMotionTime: motionTime,
        lastSnapshot: `https://via.placeholder.com/640x360/1f2937/ffffff?text=${encodeURIComponent(randomCamera.attributes?.friendly_name || 'Camera')}`,
        liveStreamUrl: null 
      };

      setCamerasWithMotion(prev => [...prev, cameraWithMotion]);

      setTimeout(() => {
        setCamerasWithMotion(prev => 
          prev.filter(cam => cam.entity_id !== randomCamera.entity_id)
        );
        activeCameraIds.delete(randomCamera.entity_id);
        updateMockDeviceState(randomCamera.entity_id, 'idle', {
          last_motion: null
        });
      }, 8000);
    };

    // Disable automatic motion simulation for stable testing
    // initialTimeout = setTimeout(simulateMotion, 15000);
    // interval = setInterval(simulateMotion, 90000 + Math.random() * 60000);

    return () => {
      if (interval) clearInterval(interval);
      if (initialTimeout) clearTimeout(initialTimeout);
      activeCameraIds.clear();
    };
  }, [cameras.length, useMockData]);

  const clearAllMotion = useCallback(() => {
    setCamerasWithMotion([]);
  }, []);

  const triggerMotion = useCallback((camera) => {
    if (!camera) return;

    const motionTime = new Date().toISOString();
    
    updateMockDeviceState(camera.entity_id, 'motion_detected', {
      last_motion: motionTime
    });

    const cameraWithMotion = {
      ...camera,
      lastMotionTime: motionTime,
      lastSnapshot: `https://via.placeholder.com/640x360/1f2937/ffffff?text=${encodeURIComponent(camera.attributes?.friendly_name || 'Camera')}`,
      liveStreamUrl: null 
    };

    setCamerasWithMotion(prev => {
      // Remove existing camera if it exists, then add the new one
      const filtered = prev.filter(cam => cam.entity_id !== camera.entity_id);
      return [...filtered, cameraWithMotion];
    });

    setTimeout(() => {
      setCamerasWithMotion(prev => 
        prev.filter(cam => cam.entity_id !== camera.entity_id)
      );
      updateMockDeviceState(camera.entity_id, 'idle', {
        last_motion: null
      });
    }, 8000);
  }, []);

  return {
    camerasWithMotion,
    clearAllMotion,
    triggerMotion,
    hasActiveMotion: camerasWithMotion.length > 0
  };
}