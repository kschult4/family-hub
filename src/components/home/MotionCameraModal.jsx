import { useState, useEffect } from 'react';
import { X, Camera, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export default function MotionCameraModal({ 
  camerasWithMotion = [], 
  onClose, 
  isVisible = false,
  autoCloseDelay = 60000 
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(autoCloseDelay / 1000);

  useEffect(() => {
    if (!isVisible) return;

    setRemainingTime(autoCloseDelay / 1000);

    const autoCloseTimer = setTimeout(() => {
      onClose?.();
    }, autoCloseDelay);

    const countdownTimer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(autoCloseTimer);
      clearInterval(countdownTimer);
    };
  }, [isVisible, autoCloseDelay, onClose]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  if (!isVisible || camerasWithMotion.length === 0) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getVideoPlayerLayout = () => {
    const count = camerasWithMotion.length;
    if (count === 1) return 'w-full max-w-4xl';
    if (count === 2) return 'w-1/2 max-w-2xl';
    return 'w-1/3 max-w-xl';
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
    >
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-7xl w-full mx-4'} transition-all duration-300`}>
        
        {/* Header Controls */}
        <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Motion Alert
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              Auto-close in {remainingTime}s
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Feed(s) */}
        <div className={`flex items-center justify-center gap-4 ${isFullscreen ? 'h-full pt-20 pb-16' : 'py-16'}`}>
          {camerasWithMotion.map((camera, index) => (
            <div 
              key={camera.entity_id} 
              className={`${getVideoPlayerLayout()} aspect-video relative bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600`}
            >
              {/* Camera Label */}
              <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {camera.name || camera.attributes?.friendly_name || `Camera ${index + 1}`}
                {camera.source && (
                  <span className="ml-2 text-xs bg-white/20 px-1 rounded">
                    {camera.source === 'mqtt' ? 'MQTT' : 'HA'}
                  </span>
                )}
              </div>

              {/* Motion Detection Badge */}
              <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                MOTION
              </div>

              {/* Video/Image Content */}
              <div className="w-full h-full flex items-center justify-center">
                {camera.liveStreamUrl ? (
                  <video
                    src={camera.liveStreamUrl}
                    autoPlay
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    controls={false}
                    playsInline
                  />
                ) : camera.snapshot || camera.lastSnapshot ? (
                  <img 
                    src={camera.snapshot || camera.lastSnapshot} 
                    alt={`${camera.name || camera.attributes?.friendly_name} snapshot`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No feed available</p>
                    {camera.source === 'mqtt' && (
                      <p className="text-xs mt-1">Ring MQTT Alert</p>
                    )}
                  </div>
                )}
              </div>

              {/* Motion Time Indicator */}
              {(camera.lastMotionTime || camera.motionTime) && (
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                  Motion: {new Date(camera.lastMotionTime || camera.motionTime).toLocaleTimeString()}
                  {camera.location && (
                    <span className="ml-2 text-gray-300">• {camera.location}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span>{camerasWithMotion.length} camera{camerasWithMotion.length > 1 ? 's' : ''} detected motion</span>
            <span className="text-gray-300">•</span>
            <span>Press ESC or click outside to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}