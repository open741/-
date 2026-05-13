import React, { useEffect, useRef, useState } from 'react';
import { PlayCircle, Award, RefreshCw, Star } from 'lucide-react';

// Web Audio API for pop sound
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

const playPopSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.15);
};

const playSuccessSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
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

type Bubble = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  popped: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type Cloud = {
  x: number;
  y: number;
  scale: number;
  speed: number;
};

type PointerInfo = {
  x: number;
  y: number;
  active: boolean;
};

const BUBBLE_COLORS = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
];

export default function BubblePopGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  
  // Game state refs (to avoid stale closures in requestAnimationFrame)
  const stateRef = useRef({
    bubbles: [] as Bubble[],
    particles: [] as Particle[],
    clouds: [] as Cloud[],
    pointer: { x: 0, y: 0, active: false } as PointerInfo,
    trail: [] as {x: number, y: number, life: number}[],
    score: 0,
    bubbleSpawnTimer: 0,
    lastTime: 0,
    bubbleIdCounter: 0,
    levelGoal: 10, // score needed to advance
    isPlaying: false
  });

  // Initialize Clouds
  useEffect(() => {
    const initClouds = () => {
      const clouds = [];
      for (let i = 0; i < 5; i++) {
        clouds.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * 300,
          scale: 0.5 + Math.random() * 1.5,
          speed: 0.2 + Math.random() * 0.5
        });
      }
      stateRef.current.clouds = clouds;
    };
    initClouds();
  }, []);

  const startGame = () => {
    initAudio();
    setScore(0);
    setIsPlaying(true);
    setShowLevelUp(false);
    
    stateRef.current.score = 0;
    stateRef.current.bubbles = [];
    stateRef.current.particles = [];
    stateRef.current.bubbleSpawnTimer = 0;
    stateRef.current.lastTime = 0;
    stateRef.current.levelGoal = 10;
    stateRef.current.isPlaying = true;
    
    requestAnimationFrame(gameLoop);
  };

  const spawnBubble = (canvasWidth: number, canvasHeight: number) => {
    const isRightSide = Math.random() > 0.5;
    const radius = 60 + Math.random() * 50;
    
    // Y position: anywhere in the middle 60% of screen to be reachable
    const y = canvasHeight * 0.2 + Math.random() * (canvasHeight * 0.6);
    
    let x, vx;
    if (isRightSide) {
      x = canvasWidth + radius;
      vx = -1 - Math.random() * 1.5; // slow
    } else {
      x = -radius;
      vx = 1 + Math.random() * 1.5; // slow
    }

    stateRef.current.bubbles.push({
      id: stateRef.current.bubbleIdCounter++,
      x, y, vx, vy: (Math.random() - 0.5) * 0.5, // slight vertical drift
      radius,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      popped: false
    });
  };

  const createExplosion = (x: number, y: number, color: string, isBig: boolean = false) => {
    const count = isBig ? 40 : 20;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      stateRef.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.5 + Math.random() * 0.5,
        color,
        size: 5 + Math.random() * 15
      });
    }
  };

  const handleLevelUp = () => {
    setIsPlaying(false);
    setShowLevelUp(true);
    stateRef.current.isPlaying = false;
    playSuccessSound();
  };

  const gameLoop = (timestamp: number) => {
    if (!stateRef.current.lastTime) stateRef.current.lastTime = timestamp;
    const deltaTime = timestamp - stateRef.current.lastTime;
    stateRef.current.lastTime = timestamp;
    
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) {
      if (stateRef.current.isPlaying) requestAnimationFrame(gameLoop);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    if (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }

    const { width, height } = canvas;
    const state = stateRef.current;

    // Clear background (Sky blue)
    ctx.fillStyle = '#64B5F6';
    ctx.fillRect(0, 0, width, height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    state.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > width + 200 * cloud.scale) {
        cloud.x = -200 * cloud.scale;
        cloud.y = Math.random() * (height / 2);
      }
      
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, 50 * cloud.scale, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cloud.x + 50 * cloud.scale, cloud.y - 40 * cloud.scale, 60 * cloud.scale, Math.PI * 1, Math.PI * 1.85);
      ctx.arc(cloud.x + 110 * cloud.scale, cloud.y - 20 * cloud.scale, 50 * cloud.scale, Math.PI * 1.37, Math.PI * 1.91);
      ctx.arc(cloud.x + 160 * cloud.scale, cloud.y, 40 * cloud.scale, Math.PI * 1.5, Math.PI * 0.5);
      ctx.fill();
    });

    // Spawn bubbles
    if (state.isPlaying) {
      state.bubbleSpawnTimer -= deltaTime;
      if (state.bubbleSpawnTimer <= 0) {
        spawnBubble(width, height);
        state.bubbleSpawnTimer = 1500 + Math.random() * 1500; // spawn every 1.5s - 3.0s
      }
    }

    // Update & Draw Bubbles
    for (let i = state.bubbles.length - 1; i >= 0; i--) {
      const b = state.bubbles[i];
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off top/bottom slightly
      if (b.y < b.radius || b.y > height - b.radius) b.vy *= -1;

      // Remove out of bounds
      if (b.x > width + 400 || b.x < -400) {
        state.bubbles.splice(i, 1);
        continue;
      }

      // Draw
      ctx.save();
      ctx.translate(b.x, b.y);
      
      // Hitbox logic
      let isHit = false;
      if (state.pointer.active) {
        // Generous hitbox (radius + 40)
        if (Math.hypot(b.x - state.pointer.x, b.y - state.pointer.y) < b.radius + 40) {
          isHit = true;
        }
      }

      if (isHit && !b.popped && state.isPlaying) {
        b.popped = true;
        playPopSound();
        createExplosion(b.x, b.y, b.color, false);
        state.score += 1;
        setScore(state.score);
        
        if (state.score >= state.levelGoal) {
          handleLevelUp();
        }
      }

      if (b.popped) {
        state.bubbles.splice(i, 1);
        ctx.restore();
        continue;
      }

      // Draw Bubble
      const gradient = ctx.createRadialGradient(-b.radius * 0.3, -b.radius * 0.3, b.radius * 0.1, 0, 0, b.radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, b.color);
      gradient.addColorStop(1, b.color + 'aa'); // semi-transparent edge

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-b.radius * 0.4, -b.radius * 0.4, b.radius * 0.3, b.radius * 0.15, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
        
      ctx.restore();
    }

    // Update & Draw Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.life -= deltaTime / 1000;
      
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Draw Swipe Trail
    if (state.pointer.active) {
      state.trail.push({ x: state.pointer.x, y: state.pointer.y, life: 1.0 });
    }
    
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = state.trail.length - 1; i >= 0; i--) {
      const t = state.trail[i];
      t.life -= deltaTime / 300; // fade out fast
      
      if (t.life <= 0) {
        state.trail.splice(i, 1);
        continue;
      }
      
      if (i > 0) {
        const prev = state.trail[i - 1];
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${t.life * 0.8})`;
        ctx.stroke();
        
        // Star sparkles
        if (Math.random() > 0.7) {
          ctx.fillStyle = '#FFF59D';
          ctx.beginPath();
          ctx.arc(t.x + (Math.random()-0.5)*30, t.y + (Math.random()-0.5)*30, Math.random()*5, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    if (state.isPlaying) {
      requestAnimationFrame(gameLoop);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.pointer = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.pointer.active && e.buttons === 0) {
      // If just hovering and not clicking/touching, don't do anything
      // But for touch devices, move is usually active. 
      // Let's enable swipe-without-click for accessibility if needed, 
      // but usually pointerdown/move is sufficient.
      // We will allow hovering to pop if they are dragging.
      if (e.pointerType === 'mouse') return;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.pointer = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handlePointerUp = () => {
    stateRef.current.pointer.active = false;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#E1F5FE] relative" ref={containerRef}>
      
      {/* HUD */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border-2 border-white flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-black text-slate-800">
            {score} / {stateRef.current.levelGoal}
          </span>
        </div>
      </div>

      {!isPlaying && !showLevelUp && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-lg text-center transform hover:scale-105 transition-transform">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <PlayCircle className="w-16 h-16 text-blue-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-wider">泡泡大作战</h1>
            <p className="text-lg text-slate-600 mb-8 font-medium">
              滑动手指，戳破屏幕上的大泡泡！<br/>锻炼手臂挥动能力哦~
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-2xl font-bold px-12 py-5 rounded-full shadow-lg hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all"
            >
              开始游戏
            </button>
          </div>
        </div>
      )}

      {showLevelUp && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-lg text-center animate-bounce-short">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-yellow-500 fill-yellow-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-wider">太棒了！</h1>
            <p className="text-xl text-slate-600 mb-8 font-medium">
              你已经戳破了所有的泡泡！
            </p>
            
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-400 text-white text-2xl font-bold px-12 py-5 rounded-full shadow-lg hover:shadow-purple-400/50 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-6 h-6" />
              再玩一次
            </button>
          </div>
        </div>
      )}

      <canvas 
        ref={canvasRef}
        className="w-full h-full touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      
    </div>
  );
}
