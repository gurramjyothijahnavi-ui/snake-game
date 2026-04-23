/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Terminal, Music } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-magenta-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Terminal className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">RHYTHM SNAKE</h1>
            <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-[0.3em] uppercase">Phase 02 / v1.0</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium tracking-widest text-slate-400">
           <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white py-1">ARCHIVE</a>
           <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white py-1">NEURAL NET</a>
           <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white py-1 text-cyan-400 border-cyan-400">ARCADE</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
            <Github size={18} />
          </button>
          <button className="px-4 py-1.5 bg-white text-black text-xs font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-tight">
            CONNECT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Left Sidebar - Player Stats & Info */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 space-y-8 order-2 lg:order-1"
        >
          <div className="space-y-2">
            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target Vector</div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-slate-400 font-mono">NEURAL_SYNC</span>
                <span className="text-lg font-black text-white italic">{(currentScore / 10).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(currentScore / 2, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">System Log</div>
             <div className="text-xs font-mono text-slate-400 space-y-2 leading-relaxed">
                <p className="flex gap-2">
                  <span className="text-cyan-500 shrink-0">{'>>'}</span> 
                  Initialize rhythmic container... OK
                </p>
                <p className="flex gap-2">
                  <span className="text-magenta-500 shrink-0">{'>>'}</span> 
                  Calibrate neural audio engine... OK
                </p>
                <p className="flex gap-2">
                  <span className="text-slate-600 shrink-0">{'>>'}</span> 
                  Awaiting player input sequence...
                </p>
             </div>
          </div>
        </motion.div>

        {/* Center - Game Canvas */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2"
        >
          <SnakeGame onScoreUpdate={setCurrentScore} />
        </motion.div>

        {/* Right Sidebar - Music Player */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-8 order-3"
        >
          <div className="space-y-4">
             <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">Now Broadcast</div>
             <MusicPlayer />
          </div>

          <div className="p-6 bg-magenta-500/5 border border-magenta-500/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-magenta-500 opacity-20 group-hover:opacity-100 transition-opacity">
              <Music size={40} strokeWidth={1} />
            </div>
            <h4 className="text-magenta-400 font-bold mb-2">PRO TIP</h4>
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "The snake moves to the internal pulse of the neural net. Keep your rhythm to survive longer in the void."
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 px-6 mt-12 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
            <span>© 2026 RHYTHM_LABS</span>
            <span>SECURE_BOOT_v4</span>
            <span>DATA_X_ENCRYPT_ON</span>
          </div>
          
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
