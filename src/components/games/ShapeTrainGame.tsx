import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Star, RefreshCw } from 'lucide-react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type ShapeType = 'circle' | 'triangle' | 'square';
type ColorType = 'red' | 'blue' | 'amber';

interface BlockData {
  id: string;
  shape: ShapeType;
  color: ColorType;
  startX: number;
  startY: number;
}

interface CarriageData {
  id: string;
  targetShape: ShapeType;
  targetColor: ColorType;
}

interface Level {
  id: number;
  title: string;
  instruction: string;
  carriages: CarriageData[];
  blocks: BlockData[];
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: '形状匹配',
    instruction: '把相同形状的积木，拖进对应的车厢吧！',
    carriages: [
      { id: 'c1', targetShape: 'circle', targetColor: 'amber' },
      { id: 'c2', targetShape: 'triangle', targetColor: 'amber' },
      { id: 'c3', targetShape: 'square', targetColor: 'amber' },
    ],
    blocks: [
      { id: 'b1', shape: 'square', color: 'amber', startX: 25, startY: 20 },
      { id: 'b2', shape: 'circle', color: 'amber', startX: 50, startY: 30 },
      { id: 'b3', shape: 'triangle', color: 'amber', startX: 75, startY: 20 },
    ]
  },
  {
    id: 2,
    title: '颜色匹配',
    instruction: '形状一样，但颜色不同哦。把相同颜色的积木拖进去！',
    carriages: [
      { id: 'c1', targetShape: 'circle', targetColor: 'blue' },
      { id: 'c2', targetShape: 'circle', targetColor: 'red' },
      { id: 'c3', targetShape: 'circle', targetColor: 'amber' },
    ],
    blocks: [
      { id: 'b1', shape: 'circle', color: 'red', startX: 25, startY: 25 },
      { id: 'b2', shape: 'circle', color: 'amber', startX: 50, startY: 15 },
      { id: 'b3', shape: 'circle', color: 'blue', startX: 75, startY: 25 },
    ]
  },
  {
    id: 3,
    title: '综合匹配',
    instruction: '这次要看仔细形状和颜色哦，全部放对吧！',
    carriages: [
      { id: 'c1', targetShape: 'triangle', targetColor: 'red' },
      { id: 'c2', targetShape: 'square', targetColor: 'blue' },
      { id: 'c3', targetShape: 'circle', targetColor: 'amber' },
    ],
    blocks: [
      { id: 'b1', shape: 'square', color: 'blue', startX: 20, startY: 20 },
      { id: 'b2', shape: 'triangle', color: 'red', startX: 50, startY: 30 },
      { id: 'b3', shape: 'circle', color: 'amber', startX: 80, startY: 20 },
    ]
  }
];

const getColorHex = (color: ColorType) => {
  switch (color) {
    case 'red': return '#EF4444';
    case 'blue': return '#3B82F6';
    case 'amber': return '#F59E0B';
    default: return '#000000';
  }
};

const renderShape = (shape: ShapeType, colorHex: string, isHollow: boolean = false) => {
  const fill = isHollow ? 'none' : colorHex;
  const stroke = colorHex;
  const strokeWidth = isHollow ? 8 : 0;
  
  if (shape === 'circle') {
    return <circle cx="50" cy="50" r="35" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  } else if (shape === 'triangle') {
    return <polygon points="50,15 85,80 15,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
  } else if (shape === 'square') {
    return <rect x="20" y="20" width="60" height="60" rx="10" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
};

let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
};

const playErrorSound = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};

const playCheerSound = () => {
  if (!audioCtx) return;
  const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq / 2, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime + (i * 0.05));
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + (i * 0.05) + 0.1);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (i * 0.05) + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + (i * 0.05));
    osc.stop(audioCtx.currentTime + (i * 0.05) + 0.5);
  });
};

const speak = (text: string) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

export default function ShapeTrainGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [matchedBlocks, setMatchedBlocks] = useState<string[]>([]);
  
  const currentLevel = LEVELS[levelIndex];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !showWin && currentLevel) {
      speak(currentLevel.instruction);
    }
  }, [levelIndex, isPlaying, showWin]);

  const startGame = () => {
    initAudio();
    setLevelIndex(0);
    setMatchedBlocks([]);
    setIsPlaying(true);
    setShowWin(false);
  };

  const handleMatch = (blockId: string) => {
    playCheerSound();
    setMatchedBlocks(prev => {
      if (prev.includes(blockId)) return prev;
      return [...prev, blockId];
    });
  };

  useEffect(() => {
    if (isPlaying && !showWin && currentLevel) {
      if (matchedBlocks.length > 0 && matchedBlocks.length === currentLevel.blocks.length) {
        const timer = setTimeout(() => {
          if (levelIndex + 1 < LEVELS.length) {
            setLevelIndex(l => l + 1);
            setMatchedBlocks([]);
          } else {
            setShowWin(true);
            triggerConfetti();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [matchedBlocks.length, levelIndex, isPlaying, showWin, currentLevel]);

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#fde047', '#a3e635', '#60a5fa', '#f472b6'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 to-sky-100 select-none">
      
      {/* Background Scenery */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 w-full h-1/3 bg-green-400 rounded-t-[50%]" />
        <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-80 blur-[2px]" />
        <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-80 blur-[2px]" />
      </div>

      {/* Start Screen */}
      {!isPlaying && !showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center border-4 border-sky-300">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
              <PlayCircle className="w-16 h-16 text-sky-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">形状小火车</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              将彩色的形状积木装进对应的小火车车厢里！<br/>锻炼形状认知与专注力。
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-sky-400/50 hover:-translate-y-1 transition-all"
            >
              开始游戏
            </button>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center animate-bounce-short border-4 border-green-200">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-green-500 fill-green-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">全部装载完成！</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              你太棒了，小火车要出发啦！
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-green-400/50 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              再玩一次
            </button>
          </div>
        </div>
      )}

      {/* Game Area */}
      {isPlaying && !showWin && currentLevel && (
        <div className="relative z-10 w-full h-full flex flex-col">
          
          {/* HUD */}
          <div className="absolute top-6 left-0 right-0 flex justify-center items-center px-4">
            <div className="font-bold text-sky-800 bg-white/90 px-6 py-3 rounded-full shadow-md border-2 border-sky-200 text-lg">
              第 {currentLevel.id} 关：{currentLevel.title}
            </div>
          </div>

          {/* Draggable Blocks Area */}
          <div className="relative w-full h-1/2 mt-20">
            {currentLevel.blocks.map(block => (
              <DraggableBlock 
                key={`${levelIndex}-${block.id}`} 
                block={block} 
                carriages={currentLevel.carriages} 
                isMatched={matchedBlocks.includes(block.id)}
                onMatch={handleMatch}
                onFail={playErrorSound}
              />
            ))}
          </div>

          {/* Train Area */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center items-end">
            
            {/* Engine */}
            <div className="relative w-28 h-32 bg-pink-500 rounded-r-3xl rounded-tl-xl border-4 border-slate-800 flex flex-col items-center justify-end shadow-xl z-20">
              <div className="absolute top-0 right-4 w-8 h-12 bg-slate-700 -mt-12 rounded-t-md" />
              <div className="absolute top-4 left-4 w-12 h-12 bg-sky-200 rounded-md border-2 border-slate-800" />
              <div className="w-full flex justify-around mb-2">
                <div className="w-10 h-10 bg-slate-800 rounded-full border-4 border-slate-300 -mb-6" />
                <div className="w-10 h-10 bg-slate-800 rounded-full border-4 border-slate-300 -mb-6" />
              </div>
            </div>
            
            {/* Link */}
            <div className="w-4 h-4 bg-slate-800 mb-6" />

            {/* Carriages */}
            {currentLevel.carriages.map((carriage, idx) => (
              <React.Fragment key={carriage.id}>
                <div 
                  id={`carriage-${carriage.id}`}
                  className="relative w-32 h-24 bg-indigo-500 rounded-xl border-4 border-slate-800 flex items-center justify-center shadow-xl z-10"
                >
                  <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-90 drop-shadow-sm">
                    {renderShape(carriage.targetShape, getColorHex(carriage.targetColor), true)}
                  </svg>
                  {/* Wheels */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-around">
                    <div className="w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-300" />
                    <div className="w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-300" />
                  </div>
                </div>
                {idx < currentLevel.carriages.length - 1 && (
                  <div className="w-4 h-4 bg-slate-800 mb-6" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Train Tracks */}
          <div className="absolute bottom-10 left-0 right-0 h-4 bg-slate-600 border-y-2 border-slate-800 z-0" />
          
        </div>
      )}
    </div>
  );
}

function DraggableBlock({ 
  block, 
  carriages, 
  isMatched, 
  onMatch, 
  onFail 
}: { 
  block: BlockData, 
  carriages: CarriageData[], 
  isMatched: boolean, 
  onMatch: (id: string) => void, 
  onFail: () => void 
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handlePan = (e: any, info: any) => {
    if (isMatched) return;
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);
  };

  const handlePanEnd = () => {
    if (isMatched) return;
    const rect = blockRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let matched = false;

    for (const carriage of carriages) {
      const targetEl = document.getElementById(`carriage-${carriage.id}`);
      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const targetCX = targetRect.left + targetRect.width / 2;
        const targetCY = targetRect.top + targetRect.height / 2;
        
        const dist = Math.hypot(centerX - targetCX, centerY - targetCY);
        
        // 80px generous forgiving radius
        if (dist < 80) {
          if (block.shape === carriage.targetShape && block.color === carriage.targetColor) {
            // Success
            const snapX = x.get() + (targetCX - centerX);
            const snapY = y.get() + (targetCY - centerY);
            animate(x, snapX, { type: 'spring', damping: 15, stiffness: 200 });
            animate(y, snapY, { type: 'spring', damping: 15, stiffness: 200 });
            onMatch(block.id);
            matched = true;
            break;
          } else {
            // Wrong Target
            onFail();
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
            animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
            matched = true;
            break;
          }
        }
      }
    }

    if (!matched) {
      // Missed everything
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
    }
  };

  return (
    <motion.div
      ref={blockRef}
      className={`absolute w-20 h-20 -ml-10 -mt-10 ${isMatched ? 'z-20' : 'z-30 cursor-grab active:cursor-grabbing'} touch-none`}
      style={{
        left: `${block.startX}%`,
        top: `${block.startY}%`,
        x, y,
      }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      whileTap={isMatched ? {} : { scale: 1.1, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.3))" }}
      initial={{ scale: 0 }}
      animate={{ scale: isMatched ? 0.9 : 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <div className="w-full h-full drop-shadow-lg">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {renderShape(block.shape, getColorHex(block.color), false)}
        </svg>
      </div>
    </motion.div>
  );
}
