import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Heart, ChevronDown, Home, Users, Check, Plus, PlayCircle, Minus, X, CheckCircle2 } from 'lucide-react';

export default function SpotifyWidget({ 
  spotifyData = {}, 
  onPlay, 
  onPause, 
  onNext, 
  onPrevious,
  onVolumeChange,
  onToggleLike,
  onDeviceChange,
  availableDevices = []
}) {
  const [volume, setVolume] = useState(spotifyData.volume || 50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [tempGroupSelection, setTempGroupSelection] = useState(new Set());
  const [tempRoomVolumes, setTempRoomVolumes] = useState({});
  const [showApplyFeedback, setShowApplyFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const deviceSelectorRef = useRef(null);

  const {
    isPlaying = false,
    currentTrack = null,
    album = null,
    artist = null,
    isConnected = false,
    isLiked = false,
    duration = 0,
    position = 0,
    activeDevice = null
  } = spotifyData;

  // Enhanced mock data with proper Sonos device/group coordinator concept
  const sonosDevices = availableDevices.length > 0 ? availableDevices : [
    { id: 'living_room_sonos', name: 'Living Room', type: 'One SL', isOnline: true, isInGroup: true, isGroupCoordinator: true, volume: 65, groupId: 'group_1' },
    { id: 'kitchen_sonos', name: 'Kitchen', type: 'Play:1', isOnline: true, isInGroup: true, isGroupCoordinator: false, volume: 50, groupId: 'group_1' },
    { id: 'bedroom_sonos', name: 'Bedroom', type: 'One', isOnline: true, isInGroup: true, isGroupCoordinator: true, volume: 30, groupId: 'group_2' },
    { id: 'bathroom_sonos', name: 'Bathroom', type: 'One SL', isOnline: true, isInGroup: true, isGroupCoordinator: false, volume: 40, groupId: 'group_2' },
    { id: 'office_sonos', name: 'Office', type: 'Play:5', isOnline: false, isInGroup: false, isGroupCoordinator: false, volume: 0, groupId: null },
    { id: 'dining_sonos', name: 'Dining Room', type: 'Play:3', isOnline: true, isInGroup: false, isGroupCoordinator: false, volume: 35, groupId: null },
    { id: 'patio_sonos', name: 'Patio', type: 'Move', isOnline: true, isInGroup: false, isGroupCoordinator: false, volume: 70, groupId: null }
  ];

  // Current playback metadata
  const currentPlayback = {
    source: 'Spotify',
    track: 'Bohemian Rhapsody',
    artist: 'Queen'
  };

  // Get all existing groups and individual devices
  const existingGroups = [...new Set(sonosDevices.filter(d => d.groupId).map(d => d.groupId))];
  const groups = existingGroups.map(groupId => {
    const devicesInGroup = sonosDevices.filter(d => d.groupId === groupId);
    const coordinator = devicesInGroup.find(d => d.isGroupCoordinator);
    return {
      id: groupId,
      name: `${coordinator?.name || 'Unknown'} + ${devicesInGroup.length - 1}`,
      coordinator: coordinator,
      members: devicesInGroup.filter(d => !d.isGroupCoordinator),
      allDevices: devicesInGroup
    };
  });
  
  const ungroupedDevices = sonosDevices.filter(device => !device.groupId && device.isOnline);
  
  // Initialize selectedGroupId with first group if it exists
  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups.length, selectedGroupId]);
  
  const currentGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;
  const groupCoordinator = currentGroup?.coordinator;
  
  // Create grouped and ungrouped lists based on temp selection for currently selected group
  const tempGroupedDevices = currentGroup ? sonosDevices.filter(device => tempGroupSelection.has(device.id)) : [];
  const tempAvailableDevices = sonosDevices.filter(device => !tempGroupSelection.has(device.id) && device.isOnline);

  // Initialize temp selection with current group when opening modal
  const initializeTempSelection = () => {
    const currentlyGrouped = currentGroup ? new Set(currentGroup.allDevices.map(device => device.id)) : new Set();
    setTempGroupSelection(currentlyGrouped);
    
    // Initialize temp volumes with current device volumes
    const volumes = {};
    sonosDevices.forEach(device => {
      volumes[device.id] = device.volume;
    });
    setTempRoomVolumes(volumes);
  };

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDeviceSelector(false);
      }
    };

    if (showDeviceSelector) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDeviceSelector]);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handleDeviceToggle = (deviceId) => {
    const newSelection = new Set(tempGroupSelection);
    if (newSelection.has(deviceId)) {
      newSelection.delete(deviceId);
    } else {
      newSelection.add(deviceId);
    }
    setTempGroupSelection(newSelection);
  };

  const handleDeviceVolumeChange = (deviceId, newVolume) => {
    setTempRoomVolumes(prev => ({
      ...prev,
      [deviceId]: newVolume
    }));
  };

  const handleApplyGrouping = () => {
    const selectedDevices = sonosDevices.filter(device => tempGroupSelection.has(device.id));
    const previousGroupSize = currentGroup?.allDevices.length || 0;
    const newGroupSize = selectedDevices.length;
    
    // Create feedback message
    let message = '';
    if (newGroupSize === 0) {
      message = 'All devices ungrouped';
    } else if (newGroupSize === 1) {
      message = `${selectedDevices[0].name} playing solo`;
    } else if (previousGroupSize !== newGroupSize) {
      const deviceNames = selectedDevices.slice(0, 2).map(d => d.name).join(' and ');
      const remaining = newGroupSize - 2;
      message = remaining > 0 
        ? `${deviceNames} and ${remaining} other${remaining > 1 ? 's' : ''} grouped`
        : `${deviceNames} grouped`;
    } else {
      message = 'Group updated';
    }
    
    setFeedbackMessage(message);
    setShowApplyFeedback(true);
    setShowDeviceSelector(false);
    
    // Hide feedback after 3 seconds
    setTimeout(() => setShowApplyFeedback(false), 3000);
    
    onDeviceChange?.(selectedDevices, tempRoomVolumes);
  };

  const handleShowGrouping = () => {
    initializeTempSelection();
    setShowDeviceSelector(true);
  };

  const getDeviceIcon = (device) => {
    if (device.type === 'group') {
      return <Users className="w-4 h-4" />;
    }
    return <Home className="w-4 h-4" />;
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200 h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Music className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Spotify</p>
            <p className="text-xs text-green-600">Not connected</p>
          </div>
        </div>
      </div>
    );
  }

  // Get background image - use placeholder for testing
  const backgroundImage = album?.imageUrl && album.imageUrl !== 'https://upload.wikimedia.org/wikipedia/commons/1/16/Blank_album.jpg' 
    ? album.imageUrl 
    : 'https://www.ultimatequeen.co.uk/queen/gallery/albums-1/a-night-at-the-opera-uklpfront.jpg';

  return (
    <div 
      className="rounded-lg h-full flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/75 rounded-lg"></div>
      
      {/* Apply Feedback Toast */}
      {showApplyFeedback && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">{feedbackMessage}</span>
        </div>
      )}
      
      {/* Content overlay */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        
        
        {/* Top Section: Device Selector and Volume - Takes up 1/3 */}
        <div className="flex-1 flex justify-between items-start">
          {/* Device Selector - Upper Left */}
          <div className="relative" ref={deviceSelectorRef}>
            <button
              onClick={handleShowGrouping}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/20 backdrop-blur-sm"
            >
              {currentGroup ? <Users className="w-4 h-4" /> : <Home className="w-4 h-4" />}
              <span className="text-sm text-white/90 font-medium drop-shadow max-w-24 truncate">
                {currentGroup ? currentGroup.name : ungroupedDevices[0]?.name || 'No Device'}
              </span>
              <ChevronDown className={`w-3 h-3 text-white/70 transition-transform ${
                showDeviceSelector ? 'rotate-180' : ''
              }`} />
            </button>
            
            {/* Room Grouping Modal */}
            {showDeviceSelector && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowDeviceSelector(false)}
              >
                <div 
                  className="bg-black/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-white/95 font-semibold text-lg">Device Grouping</h3>
                      <p className="text-white/70 text-sm mt-1">
                        {tempGroupSelection.size} device{tempGroupSelection.size !== 1 ? 's' : ''} selected
                        {groupCoordinator && ` • ${groupCoordinator.name} (${groupCoordinator.type}) is coordinating`}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeviceSelector(false)}
                      className="p-2 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                
                  {/* Group Selection Section */}
                  {(groups.length > 1 || ungroupedDevices.length > 0) && (
                    <div className="px-6 py-4 border-b border-white/10">
                      <h4 className="text-white/80 text-sm font-semibold mb-3">SELECT GROUP TO CONTROL</h4>
                      <div className="flex gap-2 flex-wrap">
                        {groups.map((group) => (
                          <button
                            key={group.id}
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setTimeout(() => initializeTempSelection(), 0);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              selectedGroupId === group.id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            {group.name}
                          </button>
                        ))}
                        {ungroupedDevices.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedGroupId(null);
                              setTimeout(() => initializeTempSelection(), 0);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              !selectedGroupId 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                            }`}
                          >
                            <Home className="w-4 h-4" />
                            Individual Devices
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto max-h-[60vh] p-6">
                    {/* Currently Grouped Section */}
                    {tempGroupedDevices.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-3">
                          <Users className="w-4 h-4" />
                          CURRENT GROUP
                        </h4>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tempGroupedDevices.map((device) => {
                            const currentVolume = tempRoomVolumes[device.id] || device.volume;
                            
                            return (
                              <div key={device.id} className="p-4 bg-white/8 rounded-xl border border-white/15 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                  {/* Ungroup Button */}
                                  <button
                                    onClick={() => handleDeviceToggle(device.id)}
                                    className="w-6 h-6 rounded-lg border-2 bg-green-500 border-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
                                  >
                                    <Check className="w-4 h-4 text-white" />
                                  </button>
                              
                                  {/* Device Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-white/95 font-semibold text-base">{device.name}</span>
                                      {device.isGroupCoordinator && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
                                          <PlayCircle className="w-4 h-4 text-blue-400" />
                                          <span className="text-blue-400 text-sm font-medium">Coordinator</span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-white/60 text-sm">{device.type}</p>
                                    {device.isGroupCoordinator && currentPlayback && (
                                      <p className="text-white/70 text-sm mt-1">
                                        {currentPlayback.source} • {currentPlayback.track}
                                      </p>
                                    )}
                                  </div>
                              
                                  {/* Remove from group */}
                                  <button
                                    onClick={() => handleDeviceToggle(device.id)}
                                    className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                    title="Remove from group"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                </div>
                            
                                {/* Volume Control */}
                                <div className="flex items-center gap-3 mt-2">
                                  <Volume2 className="w-4 h-4 text-white/50" />
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentVolume}
                                    onChange={(e) => handleDeviceVolumeChange(device.id, parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${currentVolume}%, rgba(255,255,255,0.2) ${currentVolume}%, rgba(255,255,255,0.2) 100%)`
                                    }}
                                  />
                                  <span className="text-sm text-white/70 w-12 text-right font-medium">{currentVolume}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  
                    {/* Available to Add Section */}
                    {tempAvailableDevices.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-white/80 text-sm font-semibold mb-4 flex items-center gap-3">
                          <Plus className="w-4 h-4" />
                          AVAILABLE TO ADD
                        </h4>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tempAvailableDevices.map((device) => {
                            const currentVolume = tempRoomVolumes[device.id] || device.volume;
                            
                            return (
                              <div key={device.id} className="p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-colors cursor-pointer" onClick={() => handleDeviceToggle(device.id)}>
                                <div className="flex items-center gap-3 mb-3">
                                  {/* Add to Group Checkbox */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeviceToggle(device.id);
                                    }}
                                    className="w-6 h-6 rounded-lg border-2 border-white/40 bg-transparent flex items-center justify-center hover:border-white/60 transition-colors"
                                  >
                                    {/* Empty checkbox */}
                                  </button>
                              
                                  {/* Device Info */}
                                  <div className="flex-1">
                                    <div className="text-white/95 font-semibold text-base">{device.name}</div>
                                    <p className="text-white/60 text-sm">{device.type}</p>
                                  </div>
                              
                                  {/* Add to group */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeviceToggle(device.id);
                                    }}
                                    className="p-2 text-white/50 hover:text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                                    title="Add to group"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                            
                                {/* Volume Control */}
                                <div className="flex items-center gap-3 mt-2">
                                  <Volume2 className="w-4 h-4 text-white/50" />
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentVolume}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleDeviceVolumeChange(device.id, parseInt(e.target.value));
                                    }}
                                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${currentVolume}%, rgba(255,255,255,0.2) ${currentVolume}%, rgba(255,255,255,0.2) 100%)`
                                    }}
                                  />
                                  <span className="text-sm text-white/70 w-12 text-right font-medium">{currentVolume}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  
                    {/* Offline Devices (if any) */}
                    {sonosDevices.filter(d => !d.isOnline).length > 0 && (
                      <div>
                        <h4 className="text-white/60 text-sm font-semibold mb-4 flex items-center gap-3">
                          <X className="w-4 h-4" />
                          OFFLINE
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sonosDevices.filter(d => !d.isOnline).map((device) => (
                            <div key={device.id} className="flex items-center gap-3 p-4 opacity-50 rounded-xl border border-white/10">
                              <div className="w-6 h-6 rounded-lg border-2 border-white/20 bg-transparent"></div>
                              <div className="flex-1">
                                <span className="text-white/70 text-base font-medium">{device.name}</span>
                                <p className="text-white/50 text-sm">{device.type}</p>
                              </div>
                              <span className="text-red-400 text-sm ml-auto">(Offline)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                
                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-white/20 flex gap-3">
                    <button
                      onClick={() => setTempGroupSelection(new Set(sonosDevices.filter(d => d.isOnline).map(d => d.id)))}
                      className="flex-1 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                    >
                      Group All
                    </button>
                    <button
                      onClick={() => setTempGroupSelection(new Set())}
                      className="flex-1 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                    >
                      Ungroup All
                    </button>
                    <button
                      onClick={handleApplyGrouping}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Volume Control - Upper Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-2 rounded-full transition-colors hover:bg-white/20 backdrop-blur-sm"
            >
              <Volume2 className="w-4 h-4 text-white/80 drop-shadow" />
            </button>
            
            {showVolumeSlider ? (
              <div className="flex items-center gap-2 w-20">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <span className="text-xs text-white/80 w-8 text-right font-medium drop-shadow">{volume}%</span>
              </div>
            ) : (
              <span className="text-xs text-white/80 font-medium drop-shadow">{volume}%</span>
            )}
          </div>
        </div>

        {/* Middle Section: Track Info - Takes up 1/3 */}
        <div className="flex-1 flex gap-4 items-center">
          {/* Smaller left space */}
          <div className="w-8"></div>
          
          {/* Track Info - Centered */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-2xl text-white truncate leading-tight mb-1 drop-shadow-lg">
              {currentTrack || 'No track playing'}
            </h3>
            <p className="text-lg text-white/90 truncate mb-0.5 drop-shadow">
              {artist || 'Unknown artist'}
            </p>
            <p className="text-sm text-white/70 truncate drop-shadow">
              {album?.name || 'Unknown album'}
            </p>
          </div>
        </div>

        {/* Bottom Section: Progress Bar and Controls - Takes up 1/3 */}
        <div className="flex-1 flex flex-col justify-end gap-3">
          {/* Progress Bar - Reduced Width */}
          {currentTrack && (
            <div className="px-8">
              <div className="flex items-center gap-3 text-xs text-white/80 mb-2">
                <span className="text-xs font-medium w-10 text-left drop-shadow">{formatTime(position)}</span>
                <div className="flex-1 bg-white/20 rounded-full h-2 backdrop-blur-sm">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-10 text-right drop-shadow">{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Centered Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onPrevious}
              disabled={!currentTrack}
              className="p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 backdrop-blur-sm"
            >
              <SkipBack className="w-6 h-6 text-white drop-shadow" />
            </button>
            
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!currentTrack}
              className="p-4 bg-white/90 text-gray-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white shadow-lg backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>
            
            <button
              onClick={onNext}
              disabled={!currentTrack}
              className="p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 backdrop-blur-sm"
            >
              <SkipForward className="w-6 h-6 text-white drop-shadow" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}