import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'Neural Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'Deep Core AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Neon Drift',
    artist: 'Void Walker',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-[#0f0f13] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-magenta-500/10 blur-[80px] rounded-full group-hover:bg-magenta-500/20 transition-colors" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 relative z-10">
        <div className="relative shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-24 h-24 rounded-xl object-cover shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <motion.h3 
            key={`${currentTrack.id}-title`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-bold truncate text-lg tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
             key={`${currentTrack.id}-artist`}
             initial={{ y: 5, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm font-mono uppercase tracking-widest"
          >
            {currentTrack.artist}
          </motion.p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-slate-400">
              <button 
                onClick={prevTrack} 
                className="hover:text-cyan-400 transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={20} fill="currentColor" fillOpacity={0} />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-12 h-12 bg-white flex items-center justify-center rounded-full text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} className="ml-1" fill="black" />}
              </button>
              <button 
                onClick={nextTrack} 
                className="hover:text-cyan-400 transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={20} fill="currentColor" fillOpacity={0} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Volume2 size={16} />
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
          <span>AI CALIBRATING...</span>
          <span className="flex items-center gap-1">
            <Music2 size={10} /> {Math.floor(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
