import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Heart } from 'lucide-react';

export default function SpotifyWidget({ 
  spotifyData = {}, 
  onPlay, 
  onPause, 
  onNext, 
  onPrevious,
  onVolumeChange,
  onToggleLike 
}) {
  const [volume, setVolume] = useState(spotifyData.volume || 50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const {
    isPlaying = false,
    currentTrack = null,
    album = null,
    artist = null,
    isConnected = false,
    isLiked = false,
    duration = 0,
    position = 0
  } = spotifyData;

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
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

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200 h-full flex flex-col">
      {/* Album Art and Track Info */}
      <div className="flex gap-3 mb-3">
        <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
          {album?.imageUrl ? (
            <img 
              src={album.imageUrl} 
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 truncate">
            {currentTrack || 'No track playing'}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {artist || 'Unknown artist'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {album?.name || 'Unknown album'}
          </p>
        </div>
        {currentTrack && (
          <button
            onClick={onToggleLike}
            className="p-1 hover:bg-green-200 rounded-full transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {currentTrack && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>{formatTime(position)}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={onPrevious}
          disabled={!currentTrack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!currentTrack}
          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
        </button>
        
        <button
          onClick={onNext}
          disabled={!currentTrack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="p-1 hover:bg-green-200 rounded-full transition-colors"
        >
          <Volume2 className="w-4 h-4 text-gray-600" />
        </button>
        
        {showVolumeSlider ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
              }}
            />
            <span className="text-xs text-gray-500 w-8 text-right">{volume}%</span>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
            <span className="text-xs text-gray-500">{volume}%</span>
          </div>
        )}
      </div>

      {/* Spotify Logo */}
      <div className="absolute top-2 right-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Music className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
}