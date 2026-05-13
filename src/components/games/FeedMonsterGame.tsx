import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { PlayCircle, Star, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Audio Context for sound effects
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

const playChewSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.connect(gain);
      gain.connect(audioCtx!.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, audioCtx!.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx!.currentTime + 0.1);

      gain.gain.setValueAtTime(0.5, audioCtx!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx!.currentTime + 0.1);

      osc.start(audioCtx!.currentTime);
      osc.stop(audioCtx!.currentTime + 0.1);
    }, i * 150);
  }
};

const playErrorSound = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.2);
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

const LEVELS = [
  { id: 1, type: 'apple', size: 120, hasObstacle: false, name: '苹果', color: '#FF5252' },
  { id: 2, type: 'banana', size: 90, hasObstacle: true, name: '香蕉', color: '#FFEB3B' },
  { id: 3, type: 'blueberry', size: 45, hasObstacle: false, name: '蓝莓', color: '#536DFE' },
];

export default function FeedMonsterGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [isChewing, setIsChewing] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [obstacleHitFlash, setObstacleHitFlash] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const fruitRef = useRef<HTMLDivElement>(null);

  // Custom drag state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isDragging = useRef(false);

  const currentLevel = LEVELS[levelIndex];

  const snapBack = () => {
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
  };

  const instantReset = () => {
    x.set(0);
    y.set(0);
  };

  const startGame = () => {
    initAudio();
    setLevelIndex(0);
    setIsPlaying(true);
    setShowWin(false);
    instantReset();
  };

  const nextLevel = () => {
    instantReset();
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      setShowWin(true);
      playSuccessSound();
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#FF5252', '#FFEB3B', '#536DFE', '#69F0AE'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const checkCollision = (rect1: DOMRect, rect2: DOMRect) => {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  };

  const handlePanStart = () => {
    isDragging.current = true;
  };

  const handlePan = (e: any, info: any) => {
    // If not actively dragging (e.g. we hit an obstacle and dropped it), ignore pan events
    if (!isDragging.current) return;

    // Update position manually
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);

    if (!mouthRef.current || !fruitRef.current) return;

    const fruitRect = fruitRef.current.getBoundingClientRect();
    const mouthRect = mouthRef.current.getBoundingClientRect();

    // Check if near mouth to visually open it
    const fruitCenterX = fruitRect.left + fruitRect.width / 2;
    const fruitCenterY = fruitRect.top + fruitRect.height / 2;

    const distToMouth = Math.hypot(
      fruitCenterX - (mouthRect.left + mouthRect.width / 2),
      fruitCenterY - (mouthRect.top + mouthRect.height / 2)
    );

    if (distToMouth < 200) {
      if (!isMouthOpen) setIsMouthOpen(true);
    } else {
      if (isMouthOpen) setIsMouthOpen(false);
    }

    // Check collision with obstacle
    if (currentLevel.hasObstacle && obstacleRef.current) {
      const rawObsRect = obstacleRef.current.getBoundingClientRect();

      // Make the obstacle hitbox much more forgiving (shrink it by 30px on all sides)
      const obsRect = {
        left: rawObsRect.left + 30,
        right: rawObsRect.right - 30,
        top: rawObsRect.top + 30,
        bottom: rawObsRect.bottom - 30,
      } as DOMRect;

      if (checkCollision(fruitRect, obsRect)) {
        // HIT OBSTACLE!
        isDragging.current = false; // Instantly abort the drag session
        setIsMouthOpen(false);
        playErrorSound();
        snapBack(); // Animate back to start

        // Flash the obstacle
        setObstacleHitFlash(true);
        setTimeout(() => setObstacleHitFlash(false), 300);
      }
    }
  };

  const handlePanEnd = (e: any, info: any) => {
    setIsMouthOpen(false);

    // If we already aborted the drag because we hit an obstacle, do nothing
    if (!isDragging.current) return;

    isDragging.current = false; // Drag finished cleanly

    if (!mouthRef.current || !fruitRef.current) {
      snapBack();
      return;
    }

    const mouthRect = mouthRef.current.getBoundingClientRect();
    const fruitRect = fruitRef.current.getBoundingClientRect();

    // Strict DOM element coordinate check for 100% accuracy
    const fruitCenterX = fruitRect.left + fruitRect.width / 2;
    const fruitCenterY = fruitRect.top + fruitRect.height / 2;

    const distToMouth = Math.hypot(
      fruitCenterX - (mouthRect.left + mouthRect.width / 2),
      fruitCenterY - (mouthRect.top + mouthRect.height / 2)
    );

    // Hit radius definition
    const hitRadius = currentLevel.size === 45 ? 80 : 150;

    if (distToMouth < hitRadius) {
      // SUCCESS! Eaten!
      setIsChewing(true);
      playChewSound();

      setTimeout(() => {
        setIsChewing(false);
        nextLevel();
      }, 1000);
    } else {
      // MISSED! Snap back
      playErrorSound();
      snapBack();
    }
  };

  // Render the fruit SVG based on type
  const renderFruit = () => {
    if (currentLevel.type === 'apple') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg pointer-events-none">
          <path d="M50 85 C20 85 10 55 20 35 C30 15 45 20 50 25 C55 20 70 15 80 35 C90 55 80 85 50 85 Z" fill="#FF5252" />
          <path d="M50 25 Q55 10 65 5" fill="none" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 15 Q75 10 70 25 Q55 25 60 15 Z" fill="#8BC34A" />
        </svg>
      );
    } else if (currentLevel.type === 'banana') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg pointer-events-none">
          <path d="M20 80 Q50 90 80 50 Q75 40 60 60 Q40 70 25 70 Z" fill="#FFEB3B" />
          <path d="M20 80 Q15 75 25 70" fill="#795548" />
          <path d="M80 50 Q85 55 75 60" fill="#795548" />
        </svg>
      );
    } else {
      // blueberry
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg pointer-events-none">
          <circle cx="50" cy="50" r="40" fill="#536DFE" />
          <circle cx="50" cy="25" r="15" fill="#3F51B5" />
          <path d="M40 20 L60 20 M50 10 L50 30 M43 13 L57 27 M43 27 L57 13" stroke="#283593" strokeWidth="3" />
          <circle cx="35" cy="40" r="8" fill="white" opacity="0.4" />
        </svg>
      );
    }
  };

  return (
    <div className="w-full h-full bg-[#FFF3E0] relative flex items-center justify-center overflow-hidden rounded-xl" ref={containerRef}>

      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full blur-xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full blur-2xl opacity-50 pointer-events-none" />

      {!isPlaying && !showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center transform hover:scale-105 transition-transform border-4 border-orange-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <PlayCircle className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">喂食小怪兽</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              按住拖拽水果喂给饿肚子的小怪兽！<br />锻炼手指精细捏合和拖拽能力。
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-orange-400/50 hover:-translate-y-1 transition-all"
            >
              开始喂食
            </button>
          </div>
        </div>
      )}

      {showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center animate-bounce-short border-4 border-yellow-100">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-yellow-500 fill-yellow-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">喂饱啦！</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              小怪兽吃得很开心！你的手指真灵活！
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-green-400/50 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              再玩一次
            </button>
          </div>
        </div>
      )}

      {isPlaying && !showWin && (
        <>
          <div className="absolute top-6 left-6 font-bold text-slate-500 bg-white/50 px-4 py-2 rounded-full pointer-events-none z-50 border border-slate-200">
            第 {levelIndex + 1} 关：{currentLevel.name}
          </div>

          {/* Game Area */}
          <div className="w-full max-w-4xl h-full max-h-[600px] relative flex items-center">

            {/* Start Zone (Left) */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-48 border-4 border-dashed border-orange-200 rounded-full flex items-center justify-center bg-white/30 pointer-events-none">
              <span className="absolute -bottom-8 text-orange-400 font-bold text-sm tracking-wider">拖拽起点</span>
            </div>

            {/* Draggable Fruit */}
            <AnimatePresence mode="wait">
              {!isChewing && (
                <motion.div
                  ref={fruitRef}
                  key={`fruit-${currentLevel.id}`}
                  className="absolute left-10 top-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing touch-none"
                  style={{
                    width: currentLevel.size,
                    height: currentLevel.size,
                    marginLeft: (192 - currentLevel.size) / 2, // Center in the 48px box
                    x,
                    y
                  }}
                  onPanStart={handlePanStart}
                  onPan={handlePan}
                  onPanEnd={handlePanEnd}
                  whileTap={{ scale: 1.1, filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.2))" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  {renderFruit()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Obstacle (Level 2) */}
            {currentLevel.hasObstacle && (
              <div
                ref={obstacleRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <div className="w-24 h-64 bg-[#795548] rounded-[30px] shadow-lg flex items-center justify-center relative overflow-hidden transition-all">
                  {/* Flash red if recently hit */}
                  <div className={`absolute inset-0 transition-colors duration-300 ${obstacleHitFlash ? 'bg-red-500/50' : 'bg-black/10'}`}></div>
                  <div className="w-16 h-56 border-2 border-dashed border-white/20 rounded-[20px]"></div>
                  <div className="absolute flex flex-col items-center gap-1">
                    <AlertCircle className="w-6 h-6 text-white/80" />
                    <span className="text-white/80 font-bold text-xs">绕过我</span>
                  </div>
                </div>
              </div>
            )}

            {/* Monster (Right) */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
              <motion.div
                animate={isChewing ? {
                  y: [0, -20, 0, -20, 0],
                  scaleX: [1, 1.1, 0.9, 1.1, 1],
                  scaleY: [1, 0.9, 1.1, 0.9, 1]
                } : {}}
                transition={{ duration: 1 }}
                className="relative w-64 h-64"
              >
                {/* Monster Body SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Fluffy body */}
                  <path d="M 100 20 C 150 20, 180 60, 180 110 C 180 160, 150 180, 100 180 C 50 180, 20 160, 20 110 C 20 60, 50 20, 100 20 Z" fill="#00BCD4" />

                  {/* Horns */}
                  <path d="M 50 40 L 30 10 L 70 30 Z" fill="#00ACC1" />
                  <path d="M 150 40 L 170 10 L 130 30 Z" fill="#00ACC1" />

                  {/* Eyes */}
                  <g transform={isChewing ? "translate(0, 10)" : "translate(0, 0)"}>
                    <circle cx="70" cy="70" r="15" fill="white" />
                    <circle cx="130" cy="70" r="15" fill="white" />
                    <circle cx={isMouthOpen ? "75" : "70"} cy="70" r="6" fill="#1A237E" />
                    <circle cx={isMouthOpen ? "125" : "130"} cy="70" r="6" fill="#1A237E" />
                  </g>

                  {/* Mouth hitbox logic is handled by the div below, visually drawn here */}
                  {isChewing ? (
                    // Chewing mouth
                    <path d="M 60 120 Q 100 110 140 120 Q 100 140 60 120 Z" fill="#E91E63" />
                  ) : isMouthOpen ? (
                    // Open big mouth
                    <path d="M 50 120 C 50 180, 150 180, 150 120 Z" fill="#212121" />
                  ) : (
                    // Idle smile
                    <path d="M 60 120 Q 100 150 140 120" fill="none" stroke="#212121" strokeWidth="6" strokeLinecap="round" />
                  )}

                  {isMouthOpen && !isChewing && (
                    // Tongue
                    <path d="M 80 150 Q 100 170 120 150 Z" fill="#E91E63" />
                  )}
                </svg>

                {/* Mouth Hitbox for JS to measure */}
                <div
                  ref={mouthRef}
                  className="absolute left-1/2 bottom-[40px] -translate-x-1/2 w-24 h-24 rounded-full"
                  style={{ border: isMouthOpen ? '4px dashed rgba(255,255,255,0.4)' : 'none' }}
                />
              </motion.div>

              <div className="mt-4 bg-white/50 px-6 py-2 rounded-full font-bold text-cyan-700 border-2 border-cyan-200">
                喂我！
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
