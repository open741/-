import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Star, RefreshCw } from 'lucide-react';

// Audio Context
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

const playSuccessSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const startTime = audioCtx!.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, startTime + 0.2);
    
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  });
};

export default function FireflyGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const levelRef = useRef(1);
  const [showWin, setShowWin] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [fireflyVisible, setFireflyVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const fireflyDomRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>(0);
  
  const tRef = useRef(0);
  const pointerRef = useRef({ x: -1000, y: -1000, isDown: false });
  const fireflyPosRef = useRef({ x: 0, y: 0 });
  const fireflyRotationRef = useRef(0);
  const isTrackingRef = useRef(false);

  // Audio refs
  const nextNoteTimeRef = useRef(0);
  const noteIndexRef = useRef(0);

  const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

  const scheduleMusic = () => {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const ctx = audioCtx;
    
    // Ensure we start playing immediately if we just caught it
    if (nextNoteTimeRef.current < ctx.currentTime) {
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
    }

    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      // Random walk in pentatonic scale to sound like a whimsical music box
      const step = Math.random() > 0.5 ? 1 : -1;
      noteIndexRef.current = Math.max(0, Math.min(PENTATONIC.length - 1, noteIndexRef.current + step));
      const freq = PENTATONIC[noteIndexRef.current];
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; // Soft sine wave
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Music box envelope
      gain.gain.setValueAtTime(0, nextNoteTimeRef.current);
      gain.gain.linearRampToValueAtTime(0.4, nextNoteTimeRef.current + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, nextNoteTimeRef.current + 0.8);
      
      osc.start(nextNoteTimeRef.current);
      osc.stop(nextNoteTimeRef.current + 1);
      
      nextNoteTimeRef.current += 0.2; // 5 notes per second
    }
  };

  const getPathPos = (lvl: number, t: number, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const margin = 100;
    
    if (lvl === 1) {
      // Level 1: Slow straight line
      const duration = 10;
      const progress = Math.min(t / duration, 1);
      const x = margin + progress * (width - margin * 2);
      const y = cy + Math.sin(t * 2) * 30; // slight vertical bobbing
      return { x, y, progress, isVisible: true };
    } else if (lvl === 2) {
      // Level 2: Figure-8 (Lemniscate-like)
      const duration = 15;
      const progress = Math.min(t / duration, 1);
      const A = (width - margin * 2) / 2;
      const B = (height - margin * 2) / 2;
      
      const x = cx + A * Math.sin(progress * Math.PI * 2);
      const y = cy + B * Math.sin(progress * Math.PI * 4);
      return { x, y, progress, isVisible: true };
    } else {
      // Level 3: Wave Pattern (No longer disappearing)
      const duration = 20;
      const progress = Math.min(t / duration, 1);
      const A = (width - margin * 2) / 2;
      const B = (height - margin * 2) / 2;
      
      const x = cx + A * Math.sin(progress * Math.PI * 2);
      const y = cy + B * Math.cos(progress * Math.PI * 6); // Wave pattern
      
      return { x, y, progress, isVisible: true };
    }
  };

  const startGame = () => {
    initAudio();
    setLevel(1);
    levelRef.current = 1;
    setIsPlaying(true);
    setShowWin(false);
    tRef.current = 0;
    isTrackingRef.current = false;
    setIsTracking(false);
    
    // Position it initially
    if (containerRef.current && fireflyDomRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const pos = getPathPos(1, 0, width, height);
      fireflyPosRef.current = { x: pos.x, y: pos.y };
      fireflyDomRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }

    reqRef.current = requestAnimationFrame(updateLoop);
  };

  const nextLevel = () => {
    if (levelRef.current < 3) {
      levelRef.current += 1;
      setLevel(levelRef.current);
      tRef.current = 0;
      isTrackingRef.current = false;
      setIsTracking(false);
      // We don't need to manually requestAnimationFrame here because 
      // the existing loop will just pick up the new levelRef value on the next frame!
    } else {
      setShowWin(true);
      setIsPlaying(false);
      playSuccessSound();
    }
  };

  const updateLoop = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const { x: px, y: py, isDown } = pointerRef.current;
    const { x: fx, y: fy } = fireflyPosRef.current;
    
    // Check tracking distance
    const dist = Math.hypot(px - fx, py - fy);
    const tracking = isDown && dist < 120; // 120px generous forgiving radius
    
    if (tracking !== isTrackingRef.current) {
      isTrackingRef.current = tracking;
      setIsTracking(tracking);
      
      if (!tracking) {
        // Reset audio schedule so it stops immediately
        nextNoteTimeRef.current = 0;
      }
    }
    
    if (tracking) {
      tRef.current += 0.016; // Advance time by roughly 1 frame
      scheduleMusic();
    }
    
    const pos = getPathPos(levelRef.current, tRef.current, width, height);
    
    if (tracking) {
      // Calculate rotation based on future path position
      const nextPos = getPathPos(levelRef.current, tRef.current + 0.05, width, height);
      const angle = Math.atan2(nextPos.y - pos.y, nextPos.x - pos.x) * (180 / Math.PI);
      fireflyRotationRef.current = angle + 90; // +90 because our SVG points UP
    }
    
    fireflyPosRef.current = { x: pos.x, y: pos.y };
    setFireflyVisible(pos.isVisible);
    
    if (fireflyDomRef.current) {
      fireflyDomRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${fireflyRotationRef.current}deg)`;
    }
    
    if (pos.progress >= 0.99) {
      // Level won
      setIsTracking(false);
      isTrackingRef.current = false;
      nextLevel();
      // Continue loop so the next level starts immediately
      reqRef.current = requestAnimationFrame(updateLoop);
    } else {
      reqRef.current = requestAnimationFrame(updateLoop);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    initAudio(); // Required for iOS Safari
    pointerRef.current.isDown = true;
    handlePointerMove(e);
  };

  useEffect(() => {
    const handleUp = () => {
      pointerRef.current.isDown = false;
    };
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    
    return () => {
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <div 
      className="w-full h-full bg-slate-900 relative flex items-center justify-center overflow-hidden rounded-xl touch-none select-none" 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Forest Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#064e3b] to-[#022c22] opacity-80 pointer-events-none" />
      
      {/* Forest Silhouettes */}
      <svg className="absolute bottom-0 w-full h-48 opacity-30 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polygon points="0,100 15,30 30,100" fill="#020617" />
        <polygon points="20,100 45,10 70,100" fill="#020617" />
        <polygon points="60,100 85,40 110,100" fill="#020617" />
      </svg>

      {/* Dim Overlay when NOT tracking */}
      {isPlaying && (
        <div 
          className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 ease-in-out ${isTracking ? 'opacity-0' : 'opacity-60'}`} 
        />
      )}

      {/* Firefly */}
      {isPlaying && !showWin && (
        <div 
          ref={fireflyDomRef}
          className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 flex items-center justify-center pointer-events-none"
          style={{ 
            transition: 'opacity 0.3s ease',
            opacity: fireflyVisible ? 1 : 0 
          }}
        >
          {/* Massive outer aura for tracking visual */}
          <div className={`absolute w-40 h-40 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${isTracking ? 'bg-yellow-400/60' : 'bg-yellow-400/10'}`} />
          
          <div className={`relative w-20 h-20 flex items-center justify-center transition-all duration-300 ${isTracking ? 'scale-110' : 'scale-90'}`}>
            {/* Glowing tail (Abdomen) shifted downwards */}
            <div className={`absolute top-[45%] w-10 h-12 rounded-full transition-all duration-300 z-0 ${isTracking ? 'bg-[#fde047] shadow-[0_0_30px_15px_rgba(253,224,71,1)] animate-pulse' : 'bg-yellow-100 shadow-[0_0_15px_5px_rgba(253,224,71,0.5)]'}`} />
            
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute z-10 drop-shadow-lg">
              {/* Wings */}
              <g className={isTracking ? "animate-[pulse_0.5s_ease-in-out_infinite]" : ""}>
                <ellipse cx="30" cy="45" rx="20" ry="40" fill="rgba(255,255,255,0.8)" transform="rotate(-40 30 45)" />
                <ellipse cx="70" cy="45" rx="20" ry="40" fill="rgba(255,255,255,0.8)" transform="rotate(40 70 45)" />
              </g>
              {/* Body */}
              <rect x="42" y="30" width="16" height="35" rx="8" fill="#27272a" />
              {/* Head */}
              <circle cx="50" cy="25" r="14" fill="#18181b" />
              {/* Eyes */}
              <circle cx="45" cy="22" r="3" fill="#a1a1aa" />
              <circle cx="55" cy="22" r="3" fill="#a1a1aa" />
              {/* Antennae */}
              <path d="M 45 15 Q 30 -5 20 15" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
              <path d="M 55 15 Q 70 -5 80 15" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* HUD */}
      {isPlaying && !showWin && (
        <div className="absolute top-6 left-6 font-bold text-emerald-400/80 bg-black/40 px-4 py-2 rounded-full pointer-events-none z-50 border border-emerald-900/50 backdrop-blur-sm">
          第 {level} 关：{level === 1 ? '直线飞行' : level === 2 ? '8字盘旋' : '复杂波浪'}
        </div>
      )}

      {!isTracking && isPlaying && !showWin && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-emerald-200/50 font-bold text-xl tracking-widest animate-pulse pointer-events-none">
          按住萤火虫
        </div>
      )}

      {/* Start Screen */}
      {!isPlaying && !showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-slate-900/90 p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center transform hover:scale-105 transition-transform border border-emerald-900/50">
            <div className="w-24 h-24 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <PlayCircle className="w-16 h-16 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-emerald-50 mb-4 tracking-wider">追逐萤火虫</h1>
            <p className="text-base text-emerald-200/70 mb-8 font-medium">
              手指一直按住萤火虫，让它发光并为你唱歌吧！<br/>锻炼视觉追踪和手眼协调能力。
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xl font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all"
            >
              开始追逐
            </button>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-slate-900/90 p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center border border-yellow-900/50 animate-bounce-short">
            <div className="w-24 h-24 bg-yellow-900/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="text-3xl font-black text-yellow-50 mb-4 tracking-wider">森林探险家！</h1>
            <p className="text-base text-yellow-200/70 mb-8 font-medium">
              你成功追到了所有萤火虫，眼睛真亮！
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xl font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              再玩一次
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
