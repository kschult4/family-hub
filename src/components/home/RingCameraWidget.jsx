import { useState, useEffect } from 'react';
import { Camera, Video, VideoOff, Maximize, X, Play, Volume2, VolumeX, RotateCcw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useHomeAssistantEntity } from '../../hooks/useHomeAssistantEntity';
import { haClient } from '../../services/homeAssistantClient';
import MotionCameraModal from './MotionCameraModal';

export default function RingCameraWidget({ 
  cameraEntityId,
  motionSensorId,
  cameraData = {}, 
  onViewLive,
  onToggleRecording,
  onRefreshFeed 
}) {
  // Use Home Assistant integration if cameraEntityId is provided
  const {
    entity: haCamera,
    loading: haLoading,
    error: haError,
    callService: haCameraService,
    isConnected: haConnected
  } = useHomeAssistantEntity(cameraEntityId, !!cameraEntityId);
  
  // Motion sensor integration
  const {
    entity: haMotionSensor,
    callService: haMotionService
  } = useHomeAssistantEntity(motionSensorId, !!motionSensorId);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMotionModal, setShowMotionModal] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);
  const [cameraSnapshot, setCameraSnapshot] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);

  // Use HA entity if available, otherwise fall back to legacy props
  const currentEntity = haCamera || cameraData;
  const {
    name = haCamera?.name || 'Ring Camera',
    state: cameraState = haCamera?.state || 'idle',
    isOnline = haCamera ? haConnected : (cameraData.isOnline ?? false),
    isRecording = cameraState === 'recording' || cameraData.isRecording,
    isStreaming = cameraState === 'streaming',
    lastSnapshot = cameraSnapshot || cameraData.lastSnapshot || null,
    lastMotion = cameraData.lastMotion,
    batteryLevel = cameraData.batteryLevel,
    liveStreamUrl = showLiveModal ? (streamUrl || cameraData.liveStreamUrl) : null,
    brandName = haCamera?.brandName,
    modelName = haCamera?.modelName,
    motionDetection = haCamera?.motionDetection
  } = currentEntity;
  
  // Monitor motion sensor state
  useEffect(() => {
    if (haMotionSensor?.state === 'on' && !motionDetected) {
      setMotionDetected(true);
      setShowMotionModal(true);
      
      // Auto-hide motion indicator after 5 seconds
      setTimeout(() => {
        setMotionDetected(false);
      }, 5000);
    }
  }, [haMotionSensor?.state, motionDetected]);
  
  // Get camera snapshot only when requested, not automatically
  const fetchSnapshot = async () => {
    if (haCamera && haConnected) {
      try {
        // Get camera snapshot URL from HA
        const snapshotUrl = `${haClient.baseUrl}/api/camera_proxy/${cameraEntityId}?t=${Date.now()}`;
        setCameraSnapshot(snapshotUrl);
      } catch (error) {
        console.error('Error fetching camera snapshot:', error);
      }
    }
  };
  
  // Get camera stream URL only when modal is open
  useEffect(() => {
    const getStreamUrl = async () => {
      if (haCamera && haConnected && showLiveModal) {
        try {
          // Use HA stream integration if available
          const streamResponse = await haClient.callService('camera', 'play_stream', {
            entity_id: cameraEntityId,
            media_player: 'browser'
          });
          if (streamResponse?.url) {
            setStreamUrl(streamResponse.url);
          }
        } catch (error) {
          console.error('Error getting stream URL:', error);
        }
      } else {
        // Clear stream URL when modal is closed
        setStreamUrl(null);
      }
    };
    
    getStreamUrl();
  }, [haCamera, haConnected, showLiveModal, cameraEntityId]);

  const handleViewLive = async () => {
    setShowLiveModal(true);
    
    if (haCamera) {
      try {
        // Start streaming if camera supports it
        await haCameraService('turn_on');
      } catch (error) {
        console.error('Error starting camera stream:', error);
      }
    }
    
    onViewLive?.();
  };
  
  const handleCloseLiveModal = async () => {
    setShowLiveModal(false);
    
    if (haCamera) {
      try {
        // Stop streaming when closing modal
        await haCameraService('turn_off');
      } catch (error) {
        console.error('Error stopping camera stream:', error);
      }
    }
  };

  const handleToggleRecording = async () => {
    if (haCamera) {
      try {
        // Toggle recording using HA service
        const service = isRecording ? 'turn_off' : 'turn_on';
        await haCameraService(service);
      } catch (error) {
        console.error('Error toggling camera recording:', error);
      }
    } else {
      onToggleRecording?.();
    }
  };

  const handleRefresh = async () => {
    if (haCamera) {
      await fetchSnapshot();
    }
    
    onRefreshFeed?.();
  };
  
  const handleMotionModalClose = () => {
    setShowMotionModal(false);
    setMotionDetected(false);
  };
  
  // Loading state for HA integration
  if (cameraEntityId && haLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 min-h-[160px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-gray-600 font-medium">Loading camera...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state for HA integration
  if (cameraEntityId && haError) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200 min-h-[160px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium">Error loading camera</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 min-h-[160px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">{name}</p>
            <p className="text-xs text-gray-500">Offline</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Motion Alert Modal */}
      <MotionCameraModal
        isVisible={showMotionModal}
        onClose={handleMotionModalClose}
        camerasWithMotion={motionDetected || haMotionSensor?.state === 'on' ? [{
          id: cameraEntityId || 'camera',
          name,
          snapshot: lastSnapshot,
          motionTime: new Date()
        }] : []}
        autoCloseDelay={60000}
      />
      
      <div className={`bg-white rounded-lg border-2 transition-colors min-h-[160px] overflow-hidden ${
        motionDetected || haMotionSensor?.state === 'on' 
          ? 'border-red-300 shadow-lg shadow-red-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-sm text-gray-800">{name}</span>
          </div>
          <div className="flex items-center gap-1">
            {isRecording && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-600">REC</span>
              </div>
            )}
            {batteryLevel !== null && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                batteryLevel > 20 
                  ? 'bg-green-100 text-green-700' 
                  : batteryLevel > 10 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {batteryLevel}%
              </span>
            )}
          </div>
        </div>

        {/* Camera Preview - Static snapshot only */}
        <div className="relative aspect-video bg-gray-900">
          {lastSnapshot ? (
            <img 
              src={lastSnapshot} 
              alt="Camera snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={handleViewLive}
              className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 active:scale-95"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              REC
            </div>
          )}

          {/* Motion Detection */}
          {(motionDetected || haMotionSensor?.state === 'on') && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
              🚨 Motion Detected
            </div>
          )}
          
          {lastMotion && !motionDetected && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Motion: {new Date(lastMotion).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleViewLive}
              className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
              title="View Live"
            >
              <Maximize className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleToggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>
            
            {motionSensorId && (
              <button
                onClick={() => setShowMotionModal(true)}
                className={`p-2 rounded-lg transition-colors ${
                  haMotionSensor?.state === 'on'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 animate-pulse' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Motion Detection"
              >
                {haMotionSensor?.state === 'on' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live View Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-4xl">
            {/* Close Button */}
            <button
              onClick={handleCloseLiveModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Live Stream */}
            <div className="w-full h-full flex items-center justify-center">
              {liveStreamUrl ? (
                <video
                  src={liveStreamUrl}
                  autoPlay
                  muted={isMuted}
                  className="max-w-full max-h-full"
                  controls={false}
                />
              ) : lastSnapshot ? (
                <img 
                  src={lastSnapshot} 
                  alt="Camera view"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-white">
                  <Camera className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No live stream available</p>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-6 py-3">
              <span className="text-white font-medium">{name}</span>
              
              {liveStreamUrl && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              )}
              
              <button
                onClick={handleToggleRecording}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'text-red-400 hover:bg-red-500/20' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {isRecording ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {isRecording && (
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}