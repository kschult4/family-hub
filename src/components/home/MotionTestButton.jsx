import { useState } from 'react';
import { Camera, AlertTriangle } from 'lucide-react';

export default function MotionTestButton({ cameras, onTriggerMotion }) {
  const [isTriggering, setIsTriggering] = useState(false);

  const triggerRandomMotion = () => {
    if (!cameras || cameras.length === 0) return;
    
    setIsTriggering(true);
    
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
    const motionTime = new Date().toISOString();
    
    const cameraWithMotion = {
      ...randomCamera,
      lastMotionTime: motionTime,
      lastSnapshot: `https://via.placeholder.com/640x360/1f2937/ffffff?text=${encodeURIComponent(randomCamera.attributes?.friendly_name || 'Camera')}`,
      liveStreamUrl: null
    };
    
    onTriggerMotion?.(cameraWithMotion);
    
    setTimeout(() => {
      setIsTriggering(false);
    }, 1000);
  };

  const triggerMultipleMotion = () => {
    if (!cameras || cameras.length < 2) return;
    
    setIsTriggering(true);
    
    const shuffledCameras = [...cameras].sort(() => 0.5 - Math.random());
    const selectedCameras = shuffledCameras.slice(0, Math.min(2, shuffledCameras.length));
    const motionTime = new Date().toISOString();
    
    const camerasWithMotion = selectedCameras.map(camera => ({
      ...camera,
      lastMotionTime: motionTime,
      lastSnapshot: `https://via.placeholder.com/640x360/1f2937/ffffff?text=${encodeURIComponent(camera.attributes?.friendly_name || 'Camera')}`,
      liveStreamUrl: null
    }));
    
    camerasWithMotion.forEach(camera => {
      onTriggerMotion?.(camera);
    });
    
    setTimeout(() => {
      setIsTriggering(false);
    }, 1000);
  };

  if (!cameras || cameras.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={triggerRandomMotion}
        disabled={isTriggering}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        title="Trigger single camera motion (Test)"
      >
        {isTriggering ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Triggering...</span>
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            <span className="text-sm">Test Single</span>
          </>
        )}
      </button>
      
      {cameras.length > 1 && (
        <button
          onClick={triggerMultipleMotion}
          disabled={isTriggering}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
          title="Trigger multiple camera motion (Test)"
        >
          {isTriggering ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Triggering...</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Test Multi</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}