import React, { useState, useEffect, useRef } from 'react';

interface Song {
  name: string;
  audioSrc: string;
  imageSrc: string;
}

export default function IPOD() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load songs from audio directory
  useEffect(() => {
    const loadSongs = async () => {
      try {
        // For now, we'll create a sample structure. In a real app, you'd scan the audio directory
        const sampleSongs: Song[] = [
          {
            name: 'Sample Track 1',
            audioSrc: '/audio/sample1.mp3',
            imageSrc: '/audio/sample1.jpg'
          },
          {
            name: 'Sample Track 2',
            audioSrc: '/audio/sample2.mp3',
            imageSrc: '/audio/sample2.png'
          },
          {
            name: 'Sample Track 3',
            audioSrc: '/audio/sample3.mp3',
            imageSrc: '/audio/sample3.jpg'
          }
        ];

        setSongs(sampleSongs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading songs:', error);
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Auto-play next song
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songs.length]);

  // Update audio source when song changes
  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].audioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex, songs, isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentSong = songs[currentSongIndex];

  if (isLoading) {
    return (
      <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-6">
        <div className="text-yellow-400 text-center">Loading IPOD...</div>
      </div>
    );
  }

  return (
    <div className="border border-yellow-400/30 bg-black/80 backdrop-blur-sm p-6">
      <h2 className="text-xl text-red-400 mb-6">IPOD.EXE</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Song Display */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 border-2 border-yellow-400/30 bg-black/50 flex items-center justify-center">
              {currentSong ? (
                <img
                  src={currentSong.imageSrc}
                  alt={currentSong.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default image if preview doesn't exist
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkMxMSAxNy4xIDEwLjEgMTggOSA5QzEwLjEgMTggMTEgMTcuMSAxMSAxNlY0QzExIDIuOSAxMS45IDIgMTIgMloiIGZpbGw9IiNmZmZmMDAiLz4KPHBhdGggZD0iTTkgNkgxNVY4SDlaIiBmaWxsPSIjZmZmZjAwIi8+Cjwvc3ZnPgo=';
                  }}
                />
              ) : (
                <div className="text-yellow-400/50 text-4xl">♪</div>
              )}
            </div>
            <h3 className="text-yellow-400 text-lg font-bold">
              {currentSong?.name || 'No Song Selected'}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-yellow-400/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={prevSong}
              className="bg-yellow-400/20 border border-yellow-400/50 p-3 text-yellow-400 hover:bg-yellow-400/30 transition-all rounded"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="bg-yellow-400/20 border border-yellow-400/50 p-4 text-yellow-400 hover:bg-yellow-400/30 transition-all rounded text-xl"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={nextSong}
              className="bg-yellow-400/20 border border-yellow-400/50 p-3 text-yellow-400 hover:bg-yellow-400/30 transition-all rounded"
            >
              ⏭
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="text-xs text-yellow-400/60">VOLUME</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Playlist */}
        <div>
          <h3 className="text-yellow-400 mb-4 text-sm">PLAYLIST</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {songs.map((song, index) => (
              <button
                key={index}
                onClick={() => setCurrentSongIndex(index)}
                className={`w-full text-left p-3 border transition-all text-xs ${
                  index === currentSongIndex
                    ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                    : 'bg-black/50 border-yellow-400/30 text-yellow-400/70 hover:bg-yellow-400/10 hover:border-yellow-400/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex-shrink-0 border border-yellow-400/30 bg-black/50 flex items-center justify-center">
                    <img
                      src={song.imageSrc}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkMxMSAxNy4xIDEwLjEgMTggOSA5QzEwLjEgMTggMTEgMTcuMSAxMSAxNlY0QzExIDIuOSAxMS45IDIgMTIgMloiIGZpbGw9IiNmZmZmMDAiLz4KPHBhdGggZD0iTTkgNkgxNVY4SDlaIiBmaWxsPSIjZmZmZjAwIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{song.name}</div>
                    {index === currentSongIndex && isPlaying && (
                      <div className="text-cyan-400 text-xs animate-pulse">NOW PLAYING</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #ffff00;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
          }

          .slider::-moz-range-thumb {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #ffff00;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
          }
        `
      }} />
    </div>
  );
}
