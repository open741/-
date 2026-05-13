import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Star, RefreshCw } from 'lucide-react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type Expression = 'neutral' | 'happy' | 'sad';
type Flavor = 'strawberry' | 'chocolate' | 'matcha';
type KidType = 'boy' | 'girl' | 'bear';

interface KidData {
  id: string;
  type: KidType;
  wants: Flavor;
}

interface CakeData {
  id: string;
  flavor: Flavor;
  startX: number;
  startY: number;
}

interface Level {
  id: number;
  title: string;
  instruction: string;
  kids: KidData[];
  cakes: CakeData[];
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: '学习分享',
    instruction: '把蛋糕分给小朋友，一人一块，大家轮流吃！',
    kids: [
      { id: 'k1', type: 'boy', wants: 'strawberry' },
      { id: 'k2', type: 'girl', wants: 'strawberry' }
    ],
    cakes: [
      { id: 'c1', flavor: 'strawberry', startX: 35, startY: 65 },
      { id: 'c2', flavor: 'strawberry', startX: 65, startY: 65 }
    ]
  },
  {
    id: 2,
    title: '大家都要吃',
    instruction: '有三个小朋友哦，一定要公平，每人分一块！',
    kids: [
      { id: 'k1', type: 'boy', wants: 'strawberry' },
      { id: 'k2', type: 'girl', wants: 'strawberry' },
      { id: 'k3', type: 'bear', wants: 'strawberry' }
    ],
    cakes: [
      { id: 'c1', flavor: 'strawberry', startX: 25, startY: 65 },
      { id: 'c2', flavor: 'strawberry', startX: 50, startY: 65 },
      { id: 'c3', flavor: 'strawberry', startX: 75, startY: 65 }
    ]
  },
  {
    id: 3,
    title: '按需分配',
    instruction: '看看气泡，他们想吃什么口味？发给对应的小朋友吧！',
    kids: [
      { id: 'k1', type: 'boy', wants: 'matcha' },
      { id: 'k2', type: 'girl', wants: 'strawberry' },
      { id: 'k3', type: 'bear', wants: 'chocolate' }
    ],
    cakes: [
      { id: 'c1', flavor: 'chocolate', startX: 25, startY: 65 },
      { id: 'c2', flavor: 'matcha', startX: 50, startY: 65 },
      { id: 'c3', flavor: 'strawberry', startX: 75, startY: 65 }
    ]
  }
];

const FLAVOR_COLORS = {
  strawberry: '#FCA5A5', // Pink
  chocolate: '#78350F',  // Brown
  matcha: '#86EFAC'      // Green
};

const renderCake = (flavor: Flavor) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
    {/* Cake Base */}
    <path d="M 20 60 L 50 30 L 80 60 L 80 80 A 10 10 0 0 1 70 90 L 30 90 A 10 10 0 0 1 20 80 Z" fill="#FDE68A" />
    <path d="M 20 60 L 50 30 L 80 60 L 50 45 Z" fill="#FBBF24" />
    {/* Frosting */}
    <path d="M 20 60 L 50 30 L 80 60 Q 75 70 65 60 Q 55 70 50 60 Q 40 70 35 60 Q 25 70 20 60 Z" fill={FLAVOR_COLORS[flavor]} />
    {/* Cherry / Decoration */}
    {flavor === 'strawberry' && <circle cx="50" cy="25" r="8" fill="#EF4444" />}
    {flavor === 'chocolate' && <rect x="45" y="20" width="10" height="12" rx="2" fill="#451A03" transform="rotate(15 50 25)" />}
    {flavor === 'matcha' && <path d="M 45 25 Q 50 15 55 25 Q 50 35 45 25" fill="#22C55E" />}
  </svg>
);

const renderKid = (type: KidType, expression: Expression) => {
  const isHappy = expression === 'happy';
  const isSad = expression === 'sad';

  if (type === 'bear') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Ears */}
        <circle cx="25" cy="25" r="15" fill="#D97706" />
        <circle cx="25" cy="25" r="8" fill="#FDE68A" />
        <circle cx="75" cy="25" r="15" fill="#D97706" />
        <circle cx="75" cy="25" r="8" fill="#FDE68A" />
        {/* Head */}
        <circle cx="50" cy="50" r="40" fill="#F59E0B" />
        {/* Muzzle */}
        <ellipse cx="50" cy="65" rx="20" ry="15" fill="#FEF3C7" />
        <ellipse cx="50" cy="58" rx="8" ry="5" fill="#451A03" />
        
        {/* Eyes */}
        {isHappy ? (
          <>
            <path d="M 30 45 Q 35 35 40 45" fill="none" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
            <path d="M 60 45 Q 65 35 70 45" fill="none" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : isSad ? (
          <>
            <circle cx="35" cy="45" r="4" fill="#451A03" />
            <circle cx="65" cy="45" r="4" fill="#451A03" />
            <path d="M 30 35 L 40 40" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
            <path d="M 70 35 L 60 40" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="35" cy="45" r="4" fill="#451A03" />
            <circle cx="65" cy="45" r="4" fill="#451A03" />
          </>
        )}

        {/* Mouth */}
        {isHappy ? (
          <path d="M 40 70 Q 50 85 60 70" fill="#EF4444" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        ) : isSad ? (
          <path d="M 45 75 Q 50 70 55 75" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M 45 72 Q 50 75 55 72" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  // Human Kids (Boy/Girl)
  const skin = type === 'boy' ? '#FDE047' : '#FED7AA';
  const hair = type === 'boy' ? '#1E3A8A' : '#831843';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      {/* Hair back (girl) */}
      {type === 'girl' && <circle cx="50" cy="50" r="45" fill={hair} />}
      
      {/* Head */}
      <circle cx="50" cy="55" r="35" fill={skin} />
      
      {/* Hair front */}
      {type === 'boy' ? (
        <path d="M 15 50 Q 30 10 50 20 Q 70 10 85 50 Q 80 25 50 25 Q 20 25 15 50 Z" fill={hair} />
      ) : (
        <path d="M 15 55 Q 30 20 50 20 Q 70 20 85 55 Q 85 30 50 30 Q 15 30 15 55 Z" fill={hair} />
      )}

      {/* Eyes */}
      {isHappy ? (
        <>
          <path d="M 35 55 Q 40 48 45 55" fill="none" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
          <path d="M 55 55 Q 60 48 65 55" fill="none" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isSad ? (
        <>
          <circle cx="40" cy="55" r="4" fill="#1F2937" />
          <circle cx="60" cy="55" r="4" fill="#1F2937" />
          <path d="M 35 48 L 45 52" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M 65 48 L 55 52" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          {/* Tear */}
          <path d="M 40 65 L 42 70 A 2 2 0 0 1 38 70 Z" fill="#60A5FA" />
        </>
      ) : (
        <>
          <circle cx="40" cy="55" r="4" fill="#1F2937" />
          <circle cx="60" cy="55" r="4" fill="#1F2937" />
        </>
      )}

      {/* Blush */}
      {(isHappy || expression === 'neutral') && (
        <>
          <circle cx="30" cy="65" r="6" fill="#FCA5A5" opacity="0.6" />
          <circle cx="70" cy="65" r="6" fill="#FCA5A5" opacity="0.6" />
        </>
      )}

      {/* Mouth */}
      {isHappy ? (
        <path d="M 40 70 Q 50 85 60 70 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" strokeLinejoin="round" />
      ) : isSad ? (
        <path d="M 45 75 Q 50 70 55 75" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M 45 72 Q 50 75 55 72" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
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
  const notes = [440, 554.37, 659.25, 880];
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

export default function ShareCakeGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  
  // State machine for kids
  const [kidsState, setKidsState] = useState<Record<string, { expression: Expression, cakeId: string | null }>>({});

  const currentLevel = LEVELS[levelIndex];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !showWin && currentLevel) {
      speak(currentLevel.instruction);
      
      // Initialize kids state for new level
      const initial: Record<string, { expression: Expression, cakeId: string | null }> = {};
      currentLevel.kids.forEach(k => {
        initial[k.id] = { expression: 'neutral', cakeId: null };
      });
      setKidsState(initial);
    }
  }, [levelIndex, isPlaying, showWin, currentLevel]);

  // Handle Win Condition Evaluation
  useEffect(() => {
    if (isPlaying && !showWin && currentLevel) {
      // Check if all kids have a cake
      const keys = Object.keys(kidsState);
      const allKidsHaveCake = currentLevel.kids.length > 0 && currentLevel.kids.every(k => kidsState[k.id]?.cakeId);
      
      if (keys.length > 0 && allKidsHaveCake) {
        const timer = setTimeout(() => {
          if (levelIndex + 1 < LEVELS.length) {
            setKidsState({});
            setLevelIndex(l => l + 1);
          } else {
            setShowWin(true);
            triggerConfetti();
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [kidsState, levelIndex, isPlaying, showWin, currentLevel]);

  const startGame = () => {
    initAudio();
    setKidsState({});
    setLevelIndex(0);
    setIsPlaying(true);
    setShowWin(false);
  };

  const setKidExpression = (kidId: string, expr: Expression, durationMs?: number) => {
    setKidsState(prev => ({
      ...prev,
      [kidId]: { ...prev[kidId], expression: expr }
    }));
    
    if (durationMs) {
      setTimeout(() => {
        setKidsState(prev => {
          // Only revert to neutral if they haven't received a cake (happy) in the meantime
          if (prev[kidId]?.expression === expr && !prev[kidId]?.cakeId) {
            return {
              ...prev,
              [kidId]: { ...prev[kidId], expression: 'neutral' }
            };
          }
          return prev;
        });
      }, durationMs);
    }
  };

  const handleMatch = (cakeId: string, targetKidId: string, isSuccessful: boolean, bounceReason: 'hasCake' | 'wrongFlavor' | null) => {
    if (isSuccessful) {
      playCheerSound();
      setKidsState(prev => {
        const next: Record<string, { expression: Expression, cakeId: string | null }> = { 
          ...prev, 
          [targetKidId]: { expression: 'happy', cakeId } 
        };
        return next;
      });
    } else {
      playErrorSound();
      if (bounceReason === 'hasCake') {
        speak('他已经有蛋糕啦，要轮流分给其他人哦！');
        // Make other hungry kids sad
        currentLevel.kids.forEach(k => {
          if (k.id !== targetKidId && !kidsState[k.id]?.cakeId) {
            setKidExpression(k.id, 'sad', 2000);
          }
        });
      } else if (bounceReason === 'wrongFlavor') {
        speak('哎呀，他想吃另一种口味的蛋糕！');
        setKidExpression(targetKidId, 'sad', 2000);
      }
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#FCA5A5', '#FDE68A', '#86EFAC'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-orange-50 select-none">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-32 bg-orange-100 rounded-b-[100px] shadow-sm" />
        <div className="absolute top-4 left-10 w-8 h-12 bg-pink-300 rounded-full rotate-12 opacity-50" />
        <div className="absolute top-8 right-20 w-8 h-8 bg-blue-300 rotate-45 opacity-50" />
        <div className="absolute top-12 left-1/3 w-10 h-10 bg-yellow-300 rounded-full opacity-50" />
      </div>

      {/* Start Screen */}
      {!isPlaying && !showWin && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center border-4 border-orange-300">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <PlayCircle className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">分享小蛋糕</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              派对开始啦！切蛋糕分给小朋友们吧！<br/>记住要轮流分，千万别让谁饿肚子伤心哦！
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-orange-400/50 hover:-translate-y-1 transition-all"
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
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">大家都很开心！</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              你学会了公平分享，是个懂得照顾别人的好孩子！
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
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          
          {/* HUD */}
          <div className="absolute top-6 left-0 right-0 flex justify-center items-center px-4 z-40">
            <div className="font-bold text-orange-800 bg-white/90 px-6 py-3 rounded-full shadow-md border-2 border-orange-200 text-lg">
              第 {currentLevel.id} 关：{currentLevel.title}
            </div>
          </div>

          {/* Kids Area (Top) */}
          <div className="flex justify-center items-end gap-12 w-full h-[40%] mt-20">
            {currentLevel.kids.map(kid => {
              const state = kidsState[kid.id];
              const expr = state?.expression || 'neutral';
              
              return (
                <div key={kid.id} id={`kid-${kid.id}`} className="relative flex flex-col items-center">
                  
                  {/* Thought Bubble (Level 3) */}
                  {currentLevel.id === 3 && !state?.cakeId && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-20 bg-white p-3 rounded-2xl shadow-md border border-slate-200"
                    >
                      <div className="w-12 h-12">
                        {renderCake(kid.wants)}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45" />
                    </motion.div>
                  )}

                  {/* Character Avatar */}
                  <div className="w-32 h-32 md:w-40 md:h-40 transition-transform duration-300">
                    {renderKid(kid.type, expr)}
                  </div>
                  
                  {/* Plate for Cake */}
                  <div className="w-24 h-6 bg-slate-200 rounded-[100%] shadow-inner mt-2 flex items-center justify-center">
                     {/* Static visual of cake if they received one (just for backup, main cake animates here) */}
                     {state?.cakeId && currentLevel.cakes.find(c => c.id === state.cakeId) && (
                       <div className="w-16 h-16 -mt-8">
                         {renderCake(currentLevel.cakes.find(c => c.id === state.cakeId)!.flavor)}
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Area (Bottom) */}
          <div className="absolute bottom-0 w-full h-[40%] bg-orange-200 border-t-8 border-orange-300 shadow-2xl flex justify-center">
            {/* Table cloth detail */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-orange-100 flex justify-around opacity-50">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className="w-8 h-8 bg-orange-100 rounded-full -mt-4" />
               ))}
            </div>

            {/* Draggable Cakes */}
            {currentLevel.cakes.map(cake => {
              const isMatched = Object.values(kidsState).some(s => s.cakeId === cake.id);
              
              // If matched, don't render it here anymore as it is rendered on the plate
              if (isMatched) return null;

              return (
                <DraggableCake
                  key={`${levelIndex}-${cake.id}`}
                  cake={cake}
                  kids={currentLevel.kids}
                  kidsState={kidsState}
                  isLevel3={currentLevel.id === 3}
                  onMatch={handleMatch}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableCake({ 
  cake, 
  kids,
  kidsState,
  isLevel3,
  onMatch 
}: { 
  cake: CakeData, 
  kids: KidData[],
  kidsState: Record<string, { expression: Expression, cakeId: string | null }>,
  isLevel3: boolean,
  onMatch: (cakeId: string, kidId: string, isSuccessful: boolean, reason: 'hasCake' | 'wrongFlavor' | null) => void 
}) {
  const cakeRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handlePan = (e: any, info: any) => {
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);
  };

  const handlePanEnd = () => {
    const rect = cakeRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let matched = false;

    for (const kid of kids) {
      const targetEl = document.getElementById(`kid-${kid.id}`);
      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const targetCX = targetRect.left + targetRect.width / 2;
        const targetCY = targetRect.top + targetRect.height / 2;
        
        const dist = Math.hypot(centerX - targetCX, centerY - targetCY);
        
        // 120px generous forgiving radius for kids
        if (dist < 120) {
          matched = true;
          
          const state = kidsState[kid.id];
          
          // Rule 1: Kid already has cake (failed turn-taking)
          if (state.cakeId) {
            onMatch(cake.id, kid.id, false, 'hasCake');
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
            animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
            break;
          }

          // Rule 2: Level 3 specific flavor checking
          if (isLevel3 && cake.flavor !== kid.wants) {
            onMatch(cake.id, kid.id, false, 'wrongFlavor');
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
            animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
            break;
          }

          // Success!
          onMatch(cake.id, kid.id, true, null);
          break;
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
      ref={cakeRef}
      className="absolute w-24 h-24 -ml-12 mt-10 z-30 cursor-grab active:cursor-grabbing touch-none"
      style={{
        left: `${cake.startX}%`,
        top: `${cake.startY}%`,
        x, y,
      }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      whileTap={{ scale: 1.1, filter: "drop-shadow(0px 15px 20px rgba(0,0,0,0.2))" }}
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      {renderCake(cake.flavor)}
    </motion.div>
  );
}
