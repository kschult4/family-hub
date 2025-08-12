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
      
      {/* Content overlay */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        
        {/* Top Section: Volume - Takes up 1/3 */}
        <div className="flex-1 flex justify-end items-start">
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