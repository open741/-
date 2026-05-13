import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  CloudRain, 
  CloudLightning, 
  PlayCircle, 
  RefreshCw, 
  Star,
  Wind,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type EmotionType = 'happy' | 'sad' | 'angry';

interface Level {
  id: number;
  title: string;
  description: string;
  type: 'matching' | 'breathing' | 'impulse';
  targetEmotions: EmotionType[];
}

// --- Icons / Assets ---
const WeatherIcon = ({ type, className }: { type: EmotionType; className?: string }) => {
  switch (type) {
    case 'happy':
      return (
        <div className={`relative ${className}`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-full h-full text-yellow-400 fill-yellow-200" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pt-2">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-slate-800 rounded-full" />
        </div>
      );
    case 'sad':
      return (
        <div className={`relative ${className}`}>
          <CloudRain className="w-full h-full text-blue-400 fill-blue-100" />
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
          </div>
          <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-6 h-2 border-t-2 border-slate-800 rounded-full" />
          {/* Animated raindrops */}
          <motion.div 
            className="absolute -bottom-2 left-1/4 w-1 h-3 bg-blue-400 rounded-full"
            animate={{ y: [0, 10], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          />
          <motion.div 
            className="absolute -bottom-4 left-1/2 w-1 h-3 bg-blue-400 rounded-full"
            animate={{ y: [0, 10], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
          />
        </div>
      );
    case 'angry':
      return (
        <div className={`relative ${className}`}>
          <CloudLightning className="w-full h-full text-slate-500 fill-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <div className="flex gap-3">
              <div className="w-3 h-1 bg-slate-800 rounded-full rotate-12" />
              <div className="w-3 h-1 bg-slate-800 rounded-full -rotate-12" />
            </div>
          </div>
          <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full" />
        </div>
      );
  }
};

const EmotionCard = ({ type, onDragEnd }: { type: EmotionType; onDragEnd: (type: EmotionType, x: number, y: number) => void }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={(e, info) => onDragEnd(type, info.point.x, info.point.y)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-32 h-40 bg-white rounded-2xl shadow-xl border-4 border-indigo-100 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-4"
    >
      <div className="flex-1 flex items-center justify-center">
        {type === 'happy' && (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex flex-col items-center justify-center gap-2">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
            <div className="w-8 h-4 border-b-4 border-slate-800 rounded-full" />
          </div>
        )}
        {type === 'sad' && (
          <div className="w-16 h-16 bg-blue-100 rounded-full flex flex-col items-center justify-center gap-2">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
            <div className="w-8 h-2 border-t-4 border-slate-800 rounded-full" />
          </div>
        )}
        {type === 'angry' && (
          <div className="w-16 h-16 bg-red-100 rounded-full flex flex-col items-center justify-center gap-1">
            <div className="flex gap-4">
              <div className="w-3 h-1 bg-slate-800 rounded-full rotate-45" />
              <div className="w-3 h-1 bg-slate-800 rounded-full -rotate-45" />
            </div>
            <div className="w-8 h-1 bg-slate-800 rounded-full" />
          </div>
        )}
      </div>
      <span className="mt-2 text-lg font-bold text-slate-700">
        {type === 'happy' ? '开心' : type === 'sad' ? '伤心' : '生气'}
      </span>
    </motion.div>
  );
};

// --- Main Component ---
export default function EmotionWeatherGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'breathing' | 'finished'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState<EmotionType | null>(null);
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'exhale' | 'wait'>('wait');
  const [breathingCount, setBreathingCount] = useState(0);
  const [timer, setTimer] = useState(3); // Countdown for breathing
  const [whackItems, setWhackItems] = useState<{ id: number; type: EmotionType; x: number; y: number }[]>([]);

  // --- Matching Logic ---
  const spawnCard = useCallback(() => {
    const types: EmotionType[] = level === 1 ? ['happy', 'sad'] : ['angry'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setCurrentCard(randomType);
  }, [level]);

  useEffect(() => {
    if (gameState === 'playing' && level < 3) {
      spawnCard();
    }
  }, [gameState, level, spawnCard]);

  const handleDragEnd = (type: EmotionType, x: number, y: number) => {
    // Find weather element positions
    const targets = document.querySelectorAll('.weather-target');
    let hit = false;

    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const targetType = target.getAttribute('data-type') as EmotionType;

      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom &&
        type === targetType
      ) {
        hit = true;
        setScore(s => s + 1);
        setCurrentCard(null);

        if (type === 'angry' && level === 2) {
          setGameState('breathing');
          startBreathingExercise();
        } else {
          // Check level completion
          if (score >= 4 && level === 1) {
            setLevel(2);
            setScore(0);
          } else {
            setTimeout(spawnCard, 500);
          }
        }
      }
    });

    if (!hit) {
      // Return animation is handled by framer-motion constraints
    }
  };

  // --- Breathing Logic ---
  const startBreathingExercise = () => {
    setTimer(3);
    setBreathingStep('wait');
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          runBreathingLoop(1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const runBreathingLoop = (count: number) => {
    setBreathingCount(count);
    setBreathingStep('inhale');
    
    setTimeout(() => {
      setBreathingStep('exhale');
      setTimeout(() => {
        if (count >= 2) {
          // Finished breathing
          setGameState('playing');
          setLevel(3);
          setScore(0);
          confetti();
        } else {
          runBreathingLoop(count + 1);
        }
      }, 4000);
    }, 4000);
  };

  // --- Impulse Control (Level 3) ---
  useEffect(() => {
    if (level === 3 && gameState === 'playing') {
      const interval = setInterval(() => {
        const id = Date.now();
        const type: EmotionType = Math.random() > 0.4 ? 'happy' : 'angry';
        const newItem = {
          id,
          type,
          x: 10 + Math.random() * 80, // %
          y: 20 + Math.random() * 60, // %
        };
        setWhackItems(prev => [...prev, newItem]);

        // Remove after 2 seconds
        setTimeout(() => {
          setWhackItems(prev => prev.filter(i => i.id !== id));
        }, 2000);
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [level, gameState]);

  const handleWhack = (item: { id: number; type: EmotionType }) => {
    if (item.type === 'happy') {
      setScore(s => s + 1);
      setWhackItems(prev => prev.filter(i => i.id !== item.id));
      if (score + 1 >= 10) {
        setGameState('finished');
        confetti();
      }
    } else {
      // Clicked angry cloud - penalty or shake
      setScore(s => Math.max(0, s - 1));
      // Add visual feedback
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
    setWhackItems([]);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-50 to-indigo-100 overflow-hidden relative font-sans">
      
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl" />
      </div>

      {/* Header Info */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex gap-4">
          <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-600">
              {level}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">当前关卡</div>
              <div className="text-lg font-black text-slate-700">
                {level === 1 ? '基础情绪识别' : level === 2 ? '复杂情绪调节' : '冲动控制练习'}
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-black text-slate-700">{score}</span>
          </div>
        </div>
      </div>

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-xl"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg rotate-3">
              <Sun className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">情绪气象站</h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              欢迎来到情绪气象站！<br/>
              让我们一起认识情绪，学会像调节天气一样调节自己的心情。
            </p>
            <button 
              onClick={() => setGameState('playing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-bold px-12 py-5 rounded-full shadow-xl shadow-indigo-200 transition-all flex items-center gap-3 mx-auto"
            >
              <PlayCircle className="w-8 h-8" />
              开始探索
            </button>
          </motion.div>
        </div>
      )}

      {/* Matching View (Level 1 & 2) */}
      {gameState === 'playing' && level < 3 && (
        <div className="h-full w-full flex flex-col items-center justify-center pt-20">
          <div className="flex gap-20 mb-32">
            {level === 1 && (
              <>
                <div data-type="happy" className="weather-target flex flex-col items-center gap-4">
                  <WeatherIcon type="happy" className="w-48 h-48" />
                  <span className="px-6 py-2 bg-yellow-400 text-white font-bold rounded-full text-xl shadow-lg shadow-yellow-100">
                    开心
                  </span>
                </div>
                <div data-type="sad" className="weather-target flex flex-col items-center gap-4">
                  <WeatherIcon type="sad" className="w-48 h-48" />
                  <span className="px-6 py-2 bg-blue-400 text-white font-bold rounded-full text-xl shadow-lg shadow-blue-100">
                    伤心
                  </span>
                </div>
              </>
            )}
            {level === 2 && (
              <div className="flex gap-12 items-end">
                <div data-type="happy" className="weather-target flex flex-col items-center gap-4">
                  <WeatherIcon type="happy" className="w-48 h-48" />
                  <span className="px-6 py-2 bg-yellow-400 text-white font-bold rounded-full text-xl shadow-lg shadow-yellow-100">
                    开心
                  </span>
                </div>
                <div data-type="angry" className="weather-target flex flex-col items-center gap-4">
                  <WeatherIcon type="angry" className="w-48 h-48" />
                  <span className="px-6 py-2 bg-red-500 text-white font-bold rounded-full text-xl shadow-lg shadow-red-100">
                    生气
                  </span>
                </div>
                <div data-type="sad" className="weather-target flex flex-col items-center gap-4">
                  <WeatherIcon type="sad" className="w-48 h-48" />
                  <span className="px-6 py-2 bg-blue-400 text-white font-bold rounded-full text-xl shadow-lg shadow-blue-100">
                    伤心
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="h-48 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div
                  key={currentCard}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <EmotionCard type={currentCard} onDragEnd={handleDragEnd} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-12 text-slate-400 font-bold text-lg">
            拖动下方的卡片，送到对应的天气精灵那里吧！
          </div>
        </div>
      )}

      {/* Breathing Exercise View */}
      {gameState === 'breathing' && (
        <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur flex flex-col items-center justify-center text-center">
          {timer > 0 ? (
            <motion.div 
              key={timer}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-9xl font-black text-indigo-600"
            >
              {timer}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-4xl font-black text-slate-800 mb-4">
                {breathingStep === 'inhale' ? '深呼吸... 吸气' : '慢慢地... 呼气'}
              </h2>
              <div className="relative flex items-center justify-center w-96 h-96">
                <motion.div
                  animate={{ 
                    scale: breathingStep === 'inhale' ? 1.5 : 1,
                    backgroundColor: breathingStep === 'inhale' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                  }}
                  transition={{ 
                    duration: 4, 
                    ease: [0.45, 0, 0.55, 1] // Precise breathing easing
                  }}
                  className="w-48 h-48 rounded-full border-8 border-indigo-500 flex items-center justify-center"
                >
                  {breathingStep === 'exhale' && breathingCount === 2 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex gap-3 mb-2">
                        <div className="w-3 h-3 bg-slate-800 rounded-full" />
                        <div className="w-3 h-3 bg-slate-800 rounded-full" />
                      </div>
                      <div className="w-12 h-6 border-b-4 border-slate-800 rounded-full" />
                    </motion.div>
                  ) : (
                    <Wind className={`w-20 h-20 text-indigo-500 ${breathingStep === 'inhale' ? 'animate-pulse' : ''}`} />
                  )}
                </motion.div>
                
                {/* Visual ring indicators */}
                <motion.div 
                  animate={{ scale: breathingStep === 'inhale' ? 1.8 : 1 }}
                  transition={{ duration: 4, ease: [0.45, 0, 0.55, 1] }}
                  className="absolute inset-0 border-2 border-indigo-200 rounded-full opacity-30"
                />
              </div>
              <p className="mt-12 text-xl text-slate-500 font-medium max-w-md">
                跟着小泡泡一起呼吸，<br/>让生气的心情慢慢平静下来。
              </p>
            </div>
          )}
        </div>
      )}

      {/* Impulse Control View (Level 3) */}
      {gameState === 'playing' && level === 3 && (
        <div className="h-full w-full relative">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center">
            <h2 className="text-3xl font-black text-slate-700 mb-2">抓住开心的太阳！</h2>
            <p className="text-slate-500 font-medium">注意：不要点到生气的乌云哦</p>
          </div>

          <AnimatePresence>
            {whackItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute cursor-pointer p-4 group"
                onClick={() => handleWhack(item)}
              >
                <div className="relative">
                  {item.type === 'happy' ? (
                    <div className="hover:scale-110 transition-transform">
                      <Sun className="w-24 h-24 text-yellow-400 fill-yellow-200" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                        <div className="flex gap-2 mb-1">
                          <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                        </div>
                        <div className="w-6 h-3 border-b-2 border-slate-800 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="hover:scale-110 transition-transform">
                      <CloudLightning className="w-24 h-24 text-slate-500 fill-slate-200" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                        <div className="flex gap-2 mb-1">
                          <div className="w-2 h-0.5 bg-slate-800 rounded-full rotate-12" />
                          <div className="w-2 h-0.5 bg-slate-800 rounded-full -rotate-12" />
                        </div>
                        <div className="w-6 h-0.5 bg-slate-800 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <div className="bg-white/50 px-8 py-4 rounded-full flex gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-slate-600 font-bold">点中太阳 +1分</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-slate-600 font-bold">点中乌云 -1分</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success / Finished Screen */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-xl border-t-8 border-indigo-500"
          >
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
              <Star className="w-16 h-16 text-indigo-500 fill-indigo-200" />
            </div>
            <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">太棒了！</h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              你已经成功完成了所有气象站的挑战！<br/>
              你是个掌握情绪的天气小专家。
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={resetGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-6 h-6" />
                再玩一次
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
