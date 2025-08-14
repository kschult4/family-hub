import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Users,
  Plus,
  Minus,
  ChevronDown,
  Music
} from 'lucide-react';
import { haClient } from '../../services/homeAssistantClient';

export default function SonosMediaPlayerCard({ 
  onError 
}) {
  const [mediaPlayers, setMediaPlayers] = useState([]);
  const [selectedGroupLeader, setSelectedGroupLeader] = useState(null);
  const [groupedDevices, setGroupedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch media players on mount and set up real-time updates
  useEffect(() => {
    const fetchMediaPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const entities = await haClient.getEntitiesByType('media_player');
        const sonosDevices = entities.filter(entity => 
          entity.raw?.attributes?.device_class === 'speaker'
        );
        
        setMediaPlayers(sonosDevices);
        
        // Find current group leader (device with group_members)
        const leader = sonosDevices.find(device => 
          device.groupMembers && device.groupMembers.length > 0
        );
        
        if (leader) {
          setSelectedGroupLeader(leader);
        } else if (sonosDevices.length > 0) {
          // Default to first playing device or just first device
          const playingDevice = sonosDevices.find(d => d.isPlaying) || sonosDevices[0];
          setSelectedGroupLeader(playingDevice);
        }
        
        updateGroupsAndAvailable(sonosDevices, leader || sonosDevices[0]);
      } catch (err) {
        setError(err.message);
        onError?.(err);
        console.error('Error fetching media players:', err);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeUpdates = async () => {
      try {
        await haClient.connect();
        setIsConnected(true);
        
        // Subscribe to all media player updates
        const unsubscribe = haClient.subscribe('*', (entity) => {
          if (entity.type === 'media_player' && 
              (entity.name.toLowerCase().includes('sonos') || 
               entity.id.toLowerCase().includes('sonos'))) {
            
            setMediaPlayers(prev => {
              const updated = prev.map(device => 
                device.id === entity.id ? entity : device
              );
              
              // Update groups when devices change
              const currentLeader = updated.find(d => d.id === selectedGroupLeader?.id);
              if (currentLeader) {
                updateGroupsAndAvailable(updated, currentLeader);
              }
              
              return updated;
            });
          }
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Error setting up real-time updates:', err);
        setIsConnected(false);
      }
    };

    fetchMediaPlayers();
    const unsubscribePromise = setupRealtimeUpdates();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [onError, selectedGroupLeader?.id]);

  const updateGroupsAndAvailable = (devices, leader) => {
    if (!leader) return;
    
    // Devices currently in the leader's group
    const grouped = devices.filter(device => 
      device.id === leader.id || (leader.groupMembers && leader.groupMembers.includes(device.id))
    );
    
    // Devices available to join the group
    const available = devices.filter(device => 
      !grouped.find(g => g.id === device.id) && 
      device.state !== 'unavailable'
    );
    
    setGroupedDevices(grouped);
    setAvailableDevices(available);
  };

  const handleGroupLeaderChange = (newLeader) => {
    setSelectedGroupLeader(newLeader);
    updateGroupsAndAvailable(mediaPlayers, newLeader);
  };

  const handlePlayPause = async () => {
    if (!selectedGroupLeader) return;
    
    try {
      await haClient.mediaPlayPause(selectedGroupLeader.id);
    } catch (err) {
      setError(err.message);
      console.error('Error toggling playback:', err);
    }
  };

  const handleNext = async () => {
    if (!selectedGroupLeader) return;
    
    try {
      await haClient.callService('media_player', 'media_next_track', {
        entity_id: selectedGroupLeader.id
      });
    } catch (err) {
      setError(err.message);
      console.error('Error skipping to next track:', err);
    }
  };

  const handlePrevious = async () => {
    if (!selectedGroupLeader) return;
    
    try {
      await haClient.callService('media_player', 'media_previous_track', {
        entity_id: selectedGroupLeader.id
      });
    } catch (err) {
      setError(err.message);
      console.error('Error skipping to previous track:', err);
    }
  };

  const handleVolumeChange = async (deviceId, volume) => {
    try {
      await haClient.setVolume(deviceId, volume / 100);
    } catch (err) {
      setError(err.message);
      console.error('Error setting volume:', err);
    }
  };

  const handleJoinGroup = async (deviceId) => {
    if (!selectedGroupLeader) return;
    
    try {
      const currentGroupMembers = groupedDevices.map(d => d.id);
      await haClient.callService('media_player', 'join', {
        entity_id: selectedGroupLeader.id,
        group_members: [...currentGroupMembers, deviceId]
      });
      
      // Update local state optimistically
      const joiningDevice = availableDevices.find(d => d.id === deviceId);
      if (joiningDevice) {
        setGroupedDevices(prev => [...prev, joiningDevice]);
        setAvailableDevices(prev => prev.filter(d => d.id !== deviceId));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error joining group:', err);
    }
  };

  const handleLeaveGroup = async (deviceId) => {
    if (deviceId === selectedGroupLeader?.id) return; // Can't remove the leader
    
    try {
      await haClient.callService('media_player', 'unjoin', {
        entity_id: deviceId
      });
      
      // Update local state optimistically
      const leavingDevice = groupedDevices.find(d => d.id === deviceId);
      if (leavingDevice) {
        setGroupedDevices(prev => prev.filter(d => d.id !== deviceId));
        setAvailableDevices(prev => [...prev, leavingDevice]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error leaving group:', err);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlaybackProgress = () => {
    if (!selectedGroupLeader?.mediaDuration || !selectedGroupLeader?.mediaPosition) {
      return 0;
    }
    return (selectedGroupLeader.mediaPosition / selectedGroupLeader.mediaDuration) * 100;
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-full flex flex-col overflow-hidden shadow-lg border border-slate-700/50 animate-pulse">
        <div className="h-6 bg-slate-700 rounded-xl w-1/2 mb-4"></div>
        <div className="h-16 bg-slate-700 rounded-2xl mb-4"></div>
        <div className="h-8 bg-slate-700 rounded-xl w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-4 bg-gradient-to-br from-red-900 via-red-800 to-red-900 h-full flex flex-col overflow-hidden shadow-lg border border-red-700/50">
        <div className="text-red-300 text-center flex-1 flex flex-col justify-center">
          <Music className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <p className="font-semibold mb-2">Sonos Error</p>
          <p className="text-sm text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedGroupLeader || mediaPlayers.length === 0) {
    return (
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-full flex flex-col overflow-hidden shadow-lg border border-slate-700/50">
        <div className="text-slate-400 text-center flex-1 flex flex-col justify-center">
          <Music className="w-12 h-12 mx-auto mb-3" />
          <p className="font-semibold mb-2 text-slate-300">No Sonos Devices</p>
          <p className="text-sm">No Sonos media players found</p>
        </div>
      </div>
    );
  }

  const currentTrack = selectedGroupLeader;
  const isPlaying = currentTrack.isPlaying;
  const progress = getPlaybackProgress();

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-full flex flex-col overflow-hidden shadow-lg border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">Sonos</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#1DB954] shadow-lg shadow-green-500/50' : 'bg-red-500'}`}></div>
          <span className="text-xs text-slate-400">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Group Leader Selector */}
      <div className="mb-4">
        <div className="relative">
          <select
            value={selectedGroupLeader?.id || ''}
            onChange={(e) => {
              const leader = mediaPlayers.find(d => d.id === e.target.value);
              if (leader) handleGroupLeaderChange(leader);
            }}
            className="w-full bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] appearance-none transition-all"
          >
            {mediaPlayers.map((device) => (
              <option key={device.id} value={device.id} className="bg-slate-800 text-white">
                {device.name} {device.groupMembers?.length > 0 ? '(Leader)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Now Playing */}
      <div className="flex items-center space-x-4 mb-4">
        {currentTrack.mediaArtwork ? (
          <div className="relative group">
            {/* Main album art with multiple effects */}
            <div className="relative">
              <img
                src={currentTrack.mediaArtwork}
                alt="Album art"
                className="w-16 h-16 rounded-2xl object-cover shadow-2xl relative z-10"
              />
              {/* Vinyl record effect behind */}
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-black shadow-xl transform -rotate-12 opacity-40 -z-10"></div>
              {/* Glowing background based on album colors */}
              <div 
                className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1DB954]/20 to-transparent blur-sm -z-20 group-hover:from-[#1DB954]/40 transition-all duration-500"
              ></div>
              {/* Playing indicator overlay */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse"></div>
                </div>
              )}
              {/* Reflection effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-2xl relative z-10 border border-slate-600/30">
                <Music className="w-6 h-6 text-slate-400" />
              </div>
              {/* Vinyl record effect */}
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-xl transform -rotate-12 opacity-40 -z-10"></div>
              {/* Subtle glow */}
              <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600/20 to-transparent blur-sm -z-20"></div>
              {/* Reflection */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate text-sm leading-tight">
            {currentTrack.mediaTitle || 'No media playing'}
          </h4>
          <p className="text-xs text-slate-300 truncate mt-1">
            {currentTrack.mediaArtist || 'Unknown Artist'}
          </p>
          {currentTrack.mediaAlbum && (
            <p className="text-xs text-slate-400 truncate">
              {currentTrack.mediaAlbum}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {currentTrack.mediaDuration && (
        <div className="mb-4">
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] h-1.5 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>{formatDuration(currentTrack.mediaPosition)}</span>
            <span>{formatDuration(currentTrack.mediaDuration)}</span>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/50 hover:scale-105 transition-all duration-200 group"
        >
          <SkipBack className="w-5 h-5 text-slate-300 group-hover:text-white" />
        </button>
        
        <button
          onClick={handlePlayPause}
          className="p-4 rounded-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:from-[#1ed760] hover:to-[#1DB954] text-white transition-all duration-200 hover:scale-110 shadow-lg shadow-green-500/25"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/50 hover:scale-105 transition-all duration-200 group"
        >
          <SkipForward className="w-5 h-5 text-slate-300 group-hover:text-white" />
        </button>
      </div>

      {/* Group Management */}
      <div className="border-t border-slate-700/50 pt-3 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-medium text-white flex items-center">
            <Users className="w-4 h-4 mr-2 text-slate-300" />
            Groups
          </h5>
          <button
            onClick={() => setShowGroupManager(!showGroupManager)}
            className="text-xs text-[#1DB954] hover:text-[#1ed760] font-medium transition-colors"
          >
            {showGroupManager ? 'Hide' : 'Show'}
          </button>
        </div>

        {showGroupManager && (
          <div className="space-y-4">
            {/* Currently Grouped Devices */}
            <div>
              <h6 className="text-sm font-medium text-gray-700 mb-2">
                Currently Grouped ({groupedDevices.length})
              </h6>
              <div className="space-y-2">
                {groupedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">
                            {device.name}
                            {device.id === selectedGroupLeader?.id && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Leader
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          {device.isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round((device.volumeLevel || 0) * 100)}
                            onChange={(e) => handleVolumeChange(device.id, parseInt(e.target.value))}
                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="ml-2 text-xs text-gray-600 w-8 text-right">
                            {Math.round((device.volumeLevel || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    {device.id !== selectedGroupLeader?.id && (
                      <button
                        onClick={() => handleLeaveGroup(device.id)}
                        className="ml-3 p-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Available to Add */}
            {availableDevices.length > 0 && (
              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-2">
                  Available to Add ({availableDevices.length})
                </h6>
                <div className="space-y-2">
                  {availableDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{device.name}</span>
                          <div className="flex items-center mt-2">
                            {device.isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={Math.round((device.volumeLevel || 0) * 100)}
                              onChange={(e) => handleVolumeChange(device.id, parseInt(e.target.value))}
                              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-2 text-xs text-gray-600 w-8 text-right">
                              {Math.round((device.volumeLevel || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(device.id)}
                        className="ml-3 p-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}