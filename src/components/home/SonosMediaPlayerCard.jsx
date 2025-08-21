import { useState, useEffect, useCallback, useRef, memo } from 'react';
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

function SonosMediaPlayerCard({ 
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
  
  // Refs for managing updates
  const updateTimeoutRef = useRef(null);
  const periodicRefreshRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  // Fetch media players on mount - NO real-time updates to prevent flickering
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchMediaPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const entities = await haClient.getEntitiesByType('media_player');
        
        const sonosDevices = entities.filter(entity => 
          entity.raw?.attributes?.device_class === 'speaker' ||
          entity.id.toLowerCase().includes('sonos') ||
          entity.name.toLowerCase().includes('sonos') ||
          entity.raw?.attributes?.friendly_name?.toLowerCase().includes('sonos')
        );
        
        if (!isMounted) return; // Don't update state if unmounted
        
        // Only log once on initial load
        console.log('🎵 Sonos Widget - Found devices:', sonosDevices.map(s => ({
          id: s.id,
          name: s.name,
          state: s.state,
          isPlaying: s.isPlaying,
          mediaTitle: s.mediaTitle,
          mediaArtist: s.mediaArtist,
          mediaAlbum: s.mediaAlbum,
          mediaArtwork: s.mediaArtwork,
          rawEntityPicture: s.raw?.attributes?.entity_picture,
          hasArtwork: !!s.mediaArtwork
        })));
        
        setMediaPlayers(sonosDevices);
        
        // Find current group leader (device with group_members)
        const leader = sonosDevices.find(device => 
          device.groupMembers && device.groupMembers.length > 0
        );
        
        let selectedLeader = null;
        if (leader) {
          selectedLeader = leader;
          setSelectedGroupLeader(leader);
        } else if (sonosDevices.length > 0) {
          // Default to first playing device or just first device
          const playingDevice = sonosDevices.find(d => d.isPlaying) || sonosDevices[0];
          selectedLeader = playingDevice;
          setSelectedGroupLeader(playingDevice);
        }
        
        if (selectedLeader) {
          updateGroupsAndAvailable(sonosDevices, selectedLeader);
        }
      } catch (err) {
        if (!isMounted) return; // Don't update state if unmounted
        setError(err.message);
        onError?.(err);
        console.error('Error fetching media players:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const setupConnection = async () => {
      try {
        await haClient.connect();
        if (isMounted) {
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error connecting to Home Assistant:', err);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    const setupScopedUpdates = async () => {
      try {
        await haClient.connect();
        
        // Smart subscription - only Sonos media players with intelligent filtering
        const unsubscribe = haClient.subscribe('*', (entity) => {
          if (!isMounted) return;
          
          // Only process Sonos media players
          if (entity.type === 'media_player' && 
              (entity.id.toLowerCase().includes('sonos') ||
               entity.name.toLowerCase().includes('sonos'))) {
            
            const now = Date.now();
            
            // Smart debouncing - longer delay for frequent updates, shorter for important changes
            const isImportantChange = (prev, current) => {
              if (!prev) return true;
              return (
                prev.state !== current.state ||
                prev.mediaTitle !== current.mediaTitle ||
                prev.mediaArtist !== current.mediaArtist ||
                prev.mediaArtwork !== current.mediaArtwork ||
                Math.abs((prev.volumeLevel || 0) - (current.volumeLevel || 0)) > 0.05
              );
            };
            
            // Rate limiting - prevent updates more than once every 500ms
            if (now - lastUpdateRef.current < 500) {
              return;
            }
            
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = setTimeout(() => {
              if (!isMounted) return;
              
              lastUpdateRef.current = now;
              
              setMediaPlayers(prev => {
                const existingDevice = prev.find(d => d.id === entity.id);
                
                // Skip updates during transition states
                if (entity.state === 'unavailable') return prev;
                
                // Only update if meaningful properties changed
                if (!existingDevice || isImportantChange(existingDevice, entity)) {
                  return prev.map(device => 
                    device.id === entity.id ? entity : device
                  );
                }
                
                return prev; // No meaningful change
              });
              
              // Update selected leader with smart change detection
              setSelectedGroupLeader(prev => {
                if (prev?.id === entity.id && entity.state !== 'unavailable') {
                  if (isImportantChange(prev, entity)) {
                    return entity;
                  }
                }
                return prev;
              });
            }, 300); // Faster response for better UX
          }
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Error setting up scoped updates:', err);
        return () => {};
      }
    };

    fetchMediaPlayers();
    setupConnection(); // Connect to show "Live" status
    
    // Enable optimized real-time updates
    const unsubscribePromise = setupScopedUpdates();
    
    return () => {
      isMounted = false; // Mark as unmounted to prevent state updates
      clearTimeout(updateTimeoutRef.current);
      clearInterval(progressIntervalRef.current);
      // Cleanup WebSocket subscription
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, []); // Empty dependency array - only run once

  // Real-time playback progress tracking
  useEffect(() => {
    if (selectedGroupLeader?.isPlaying && selectedGroupLeader?.mediaDuration) {
      // Update progress every second while playing
      progressIntervalRef.current = setInterval(() => {
        setSelectedGroupLeader(prev => {
          if (prev?.isPlaying && prev?.mediaPosition < prev?.mediaDuration) {
            return {
              ...prev,
              mediaPosition: Math.min(prev.mediaPosition + 1, prev.mediaDuration)
            };
          }
          return prev;
        });
      }, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [selectedGroupLeader?.isPlaying, selectedGroupLeader?.mediaDuration, selectedGroupLeader?.id]);

  // Simple helper functions - no hooks to avoid re-renders
  const getPlaybackProgress = () => {
    if (!selectedGroupLeader?.mediaDuration || !selectedGroupLeader?.mediaPosition) {
      return 0;
    }
    return (selectedGroupLeader.mediaPosition / selectedGroupLeader.mediaDuration) * 100;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getImageUrl = (artworkUrl) => {
    if (!artworkUrl) return null;
    
    // If it's already a full URL, return as-is
    if (artworkUrl.startsWith('http://') || artworkUrl.startsWith('https://')) {
      return artworkUrl;
    }
    
    // If it's a relative URL, prepend the Home Assistant base URL
    const baseUrl = import.meta.env.VITE_HA_BASE_URL || 'http://192.168.1.224:8123';
    return `${baseUrl}${artworkUrl}`;
  };

  const updateGroupsAndAvailable = useCallback((devices, leader) => {
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
    
    // Only update if there's actually a change
    setGroupedDevices(prev => {
      if (prev.length !== grouped.length || 
          !prev.every(device => grouped.find(g => g.id === device.id))) {
        return grouped;
      }
      return prev;
    });
    
    setAvailableDevices(prev => {
      if (prev.length !== available.length || 
          !prev.every(device => available.find(a => a.id === device.id))) {
        return available;
      }
      return prev;
    });
  }, []);

  const handleGroupLeaderChange = (newLeader) => {
    setSelectedGroupLeader(newLeader);
    updateGroupsAndAvailable(mediaPlayers, newLeader);
  };

  const handlePlayPause = async () => {
    if (!selectedGroupLeader) {
      console.log('🎵 No selectedGroupLeader for play/pause');
      return;
    }
    
    try {
      // Store the current state for revert if needed
      const currentLeaderId = selectedGroupLeader.id;
      const originalState = selectedGroupLeader.isPlaying;
      
      // Optimistically update the UI immediately for better UX
      const newPlayingState = !selectedGroupLeader.isPlaying;
      const newState = newPlayingState ? 'playing' : 'paused';
      
      const optimisticUpdate = (prev) => {
        if (prev?.id === currentLeaderId) {
          return {
            ...prev,
            isPlaying: newPlayingState,
            state: newState
          };
        }
        return prev;
      };
      
      setSelectedGroupLeader(optimisticUpdate);
      setMediaPlayers(prev => prev.map(device => 
        device.id === currentLeaderId 
          ? { ...device, isPlaying: newPlayingState, state: newState }
          : device
      ));
      
      // Call the service
      await haClient.mediaPlayPause(currentLeaderId);
      
      // Clear any error state on success
      setError(null);
      
    } catch (err) {
      console.error('🎵 Error toggling playback:', err);
      setError(err.message);
      
      // Revert optimistic update on error
      const revertUpdate = (prev) => {
        if (prev?.id === selectedGroupLeader.id) {
          return {
            ...prev,
            isPlaying: originalState,
            state: originalState ? 'playing' : 'paused'
          };
        }
        return prev;
      };
      
      setSelectedGroupLeader(revertUpdate);
      setMediaPlayers(prev => prev.map(device => 
        device.id === selectedGroupLeader.id 
          ? { ...device, isPlaying: originalState, state: originalState ? 'playing' : 'paused' }
          : device
      ));
    }
  };

  const handleNext = async () => {
    if (!selectedGroupLeader) return;
    
    try {
      // Optimistic update - reset progress to 0 
      setSelectedGroupLeader(prev => ({
        ...prev,
        mediaPosition: 0
      }));
      
      await haClient.callService('media_player', 'media_next_track', {
        entity_id: selectedGroupLeader.id
      });
      
      setError(null);
    } catch (err) {
      console.error('🎵 Error skipping to next track:', err);
      setError(err.message);
    }
  };

  const handlePrevious = async () => {
    if (!selectedGroupLeader) return;
    
    try {
      // Optimistic update - reset progress to 0
      setSelectedGroupLeader(prev => ({
        ...prev,
        mediaPosition: 0
      }));
      
      await haClient.callService('media_player', 'media_previous_track', {
        entity_id: selectedGroupLeader.id
      });
      
      setError(null);
    } catch (err) {
      console.error('🎵 Error skipping to previous track:', err);
      setError(err.message);
    }
  };

  const handleVolumeChange = async (deviceId, volume) => {
    try {
      const volumeLevel = volume / 100;
      
      // Optimistic update - immediately update volume in UI
      const updateVolume = (device) => 
        device.id === deviceId ? { ...device, volumeLevel } : device;
      
      setMediaPlayers(prev => prev.map(updateVolume));
      setSelectedGroupLeader(prev => 
        prev?.id === deviceId ? { ...prev, volumeLevel } : prev
      );
      
      // Call the service
      await haClient.setVolume(deviceId, volumeLevel);
      setError(null);
      
    } catch (err) {
      console.error('🎵 Error setting volume:', err);
      setError(err.message);
      
      // Note: Real-time updates will correct the volume if the call failed
      // No need to revert manually since WebSocket will provide actual state
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

  if (!selectedGroupLeader || mediaPlayers.length === 0 || selectedGroupLeader.state === 'unavailable') {
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
        {selectedGroupLeader.mediaArtwork ? (
          <div className="relative group">
            {/* Main album art with multiple effects */}
            <div className="relative">
              <img
                src={getImageUrl(selectedGroupLeader.mediaArtwork)}
                alt="Album art"
                className="w-16 h-16 rounded-2xl object-cover shadow-2xl relative z-10"
                onError={(e) => {
                  console.log('🎵 Album art failed to load:', selectedGroupLeader.mediaArtwork);
                  console.log('🎵 Processed URL:', getImageUrl(selectedGroupLeader.mediaArtwork));
                }}
              />
              {/* Vinyl record effect behind */}
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-black shadow-xl transform -rotate-12 opacity-40 -z-10"></div>
              {/* Glowing background based on album colors */}
              <div 
                className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1DB954]/20 to-transparent blur-sm -z-20 group-hover:from-[#1DB954]/40 transition-all duration-500"
              ></div>
              {/* Playing indicator overlay */}
              {selectedGroupLeader.isPlaying && (
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
            {selectedGroupLeader.mediaTitle || 'No media playing'}
          </h4>
          <p className="text-xs text-slate-300 truncate mt-1">
            {selectedGroupLeader.mediaArtist || 'Unknown Artist'}
          </p>
          {selectedGroupLeader.mediaAlbum && (
            <p className="text-xs text-slate-400 truncate">
              {selectedGroupLeader.mediaAlbum}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {selectedGroupLeader.mediaDuration && (
        <div className="mb-4">
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] h-1.5 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${getPlaybackProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>{formatDuration(selectedGroupLeader.mediaPosition)}</span>
            <span>{formatDuration(selectedGroupLeader.mediaDuration)}</span>
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
          {selectedGroupLeader.isPlaying ? (
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

// Wrap with React.memo to prevent unnecessary re-renders from parent
export default memo(SonosMediaPlayerCard);