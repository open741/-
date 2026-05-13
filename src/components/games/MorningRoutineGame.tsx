import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  PlayCircle, RefreshCw, Star, Droplets, Droplet, 
  Shirt, Sun, CloudRain, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom solid hand SVG (no transparent gaps)
const SolidHand = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4c-2.2 0-4 1.8-4 4v20h-4V12c0-2.2-1.8-4-4-4s-4 1.8-4 4v20h-2V16c0-2.2-1.8-4-4-4s-4 1.8-4 4v24c0 13.3 10.7 24 24 24s24-10.7 24-24V20c0-2.2-1.8-4-4-4s-4 1.8-4 4v12h-4V8c0-2.2-1.8-4-4-4z" fill="currentColor" />
  </svg>
);

// --- Types ---
type GameState = 'start' | 'playing' | 'level_complete' | 'finished';

// --- Main Component ---
export default function MorningRoutineGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Level specific states
  const [faucetOn, setFaucetOn] = useState(false);
  const [handsSoapy, setHandsSoapy] = useState(false);
  const [handsRinsed, setHandsRinsed] = useState(false);
  
  const [brushWet, setBrushWet] = useState(false);
  const [rubCount, setRubCount] = useState(0);
  
  const [washingTime, setWashingTime] = useState(0);
  const lastHandsDragTimeRef = useRef<number>(0);

  const [weather, setWeather] = useState<'sunny' | 'rainy'>('sunny');
  const [clothesSelected, setClothesSelected] = useState<string | null>(null);

  // Sound effect helper (simulated with standard HTML5 audio if we had assets, 
  // here we just use visual cues and simple beeps if needed, but we'll stick to visuals for now)
  const playErrorSound = () => {
    // In a real app, this would play an error buzzer.
    // For now, we rely on visual shake.
  };

  const nextLevel = () => {
    if (level < 3) {
      setLevel(l => l + 1);
      setCurrentStepIndex(0);
      setGameState('playing');
      resetLevelStates();
    } else {
      setGameState('finished');
      confetti({ particleCount: 150, spread: 70 });
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setCurrentStepIndex(0);
    resetLevelStates();
    setGameState('playing');
  };

  const resetLevelStates = () => {
    setFaucetOn(false);
    setHandsSoapy(false);
    setHandsRinsed(false);
    setBrushWet(false);
    setRubCount(0);
    setWashingTime(0);
    setWeather(Math.random() > 0.5 ? 'sunny' : 'rainy');
    setClothesSelected(null);
  };

  useEffect(() => {
    if (gameState === 'start') {
      resetLevelStates();
    }
  }, [gameState]);

  // --- Level 1: Hand Washing ---
  useEffect(() => {
    if (level === 1 && currentStepIndex === 2 && gameState === 'playing') {
      const interval = setInterval(() => {
        if (Date.now() - lastHandsDragTimeRef.current < 300) {
          setWashingTime(prev => {
            const next = prev + 1; // +1 every 100ms
            if (next >= 50) { // 50 * 100ms = 5 seconds
              clearInterval(interval);
              setHandsRinsed(true);
              setHandsSoapy(false);
              setCurrentStepIndex(3);
              setScore(s => s + 1);
              return 50;
            }
            return next;
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [level, currentStepIndex, gameState]);

  const renderLevel1 = () => {
    const steps = [
      { id: 'turn-on', label: '1. 打开水龙头' },
      { id: 'soap', label: '2. 抹肥皂' },
      { id: 'rinse', label: '3. 冲洗干净 (坚持5秒)' },
      { id: 'turn-off', label: '4. 关紧水龙头' }
    ];

    const handleFaucetClick = () => {
      if (currentStepIndex === 0 && !faucetOn) {
        setFaucetOn(true);
        setCurrentStepIndex(1);
        setScore(s => s + 1);
      } else if (currentStepIndex === 3 && faucetOn) {
        setFaucetOn(false);
        setScore(s => s + 1);
        setTimeout(() => {
          setGameState('level_complete');
          confetti();
        }, 1000);
      } else if (currentStepIndex !== 0 && currentStepIndex !== 3) {
        // Wrong step to interact with faucet
        playErrorSound();
      }
    };

    const handleSoapDragEnd = (e: any, info: any) => {
      if (currentStepIndex !== 1) return;
      
      const handsEl = document.getElementById('hands-target');
      if (handsEl) {
        const rect = handsEl.getBoundingClientRect();
        if (info.point.x >= rect.left && info.point.x <= rect.right &&
            info.point.y >= rect.top && info.point.y <= rect.bottom) {
          setHandsSoapy(true);
          setCurrentStepIndex(2);
          setScore(s => s + 1);
        }
      }
    };

    const handleHandsDrag = (e: any, info: any) => {
      if (currentStepIndex !== 2) return;
      
      const waterEl = document.getElementById('water-target');
      if (waterEl) {
        const rect = waterEl.getBoundingClientRect();
        if (info.point.x >= rect.left && info.point.x <= rect.right &&
            info.point.y >= rect.top && info.point.y <= rect.bottom) {
          lastHandsDragTimeRef.current = Date.now();
        }
      }
    };

    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <h2 className="text-3xl font-black text-slate-700 mb-8">第一关：洗洗手，讲卫生</h2>
        
        {/* Step Indicator */}
        <div className="flex gap-4 mb-12">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${
                idx === currentStepIndex 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-110' 
                  : idx < currentStepIndex 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step.label}
              {idx === 2 && currentStepIndex === 2 && (
                <span className="ml-2 bg-white text-blue-500 px-3 py-0.5 rounded-full text-sm flex items-center gap-1 font-black">
                  倒数 {Math.max(0, 5 - Math.floor(washingTime / 10))}s
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-4xl h-96 bg-blue-50/50 rounded-3xl border-4 border-white shadow-inner flex overflow-hidden">
          {/* Sink Area */}
          <div className="flex-1 flex flex-col items-center justify-end pb-10 relative border-r-2 border-white/50">
            {/* Faucet */}
            <div 
              className={`absolute top-10 left-1/2 -translate-x-1/2 w-20 h-32 bg-slate-300 rounded-t-3xl border-b-8 border-slate-400 cursor-pointer transition-transform ${currentStepIndex === 0 || currentStepIndex === 3 ? 'hover:scale-105 ring-4 ring-yellow-400 ring-offset-4 ring-offset-blue-50' : ''}`}
              onClick={handleFaucetClick}
            >
              <div className="w-8 h-8 bg-slate-400 rounded-full absolute -right-4 top-4" />
            </div>

            {/* Water Target */}
            <div id="water-target" className="absolute top-42 left-1/2 -translate-x-1/2 w-32 h-40 flex justify-center">
              {faucetOn && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  className="w-8 bg-blue-400/60 rounded-b-xl"
                />
              )}
            </div>

            {/* Sink Basin */}
            <div className="w-64 h-24 bg-white rounded-b-[100px] shadow-inner mt-40 z-10" />
            
            {/* Hands (Draggable for rinsing) */}
            <motion.div
              id="hands-target"
              drag={currentStepIndex === 2}
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 50 }}
              dragElastic={0.2}
              onDrag={handleHandsDrag}
              className={`absolute bottom-20 z-20 flex items-center justify-center gap-2 ${
                currentStepIndex === 2 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Left Hand */}
              <SolidHand className={`w-16 h-16 transition-colors duration-300 drop-shadow-lg ${handsSoapy ? 'text-green-400' : 'text-orange-400'}`} />
              
              {/* Right Hand */}
              <SolidHand className={`w-16 h-16 transition-colors duration-300 drop-shadow-lg transform scale-x-[-1] ${handsSoapy ? 'text-green-400' : 'text-orange-400'}`} />

              {/* Soap Bubbles */}
              {handsSoapy && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-5 h-5 bg-white/90 rounded-full absolute -top-2 left-6 shadow-sm border border-green-100" />
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, delay: 0.2 }} className="absolute top-4 -right-2 w-7 h-7 bg-white/90 rounded-full shadow-sm border border-green-100" />
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, delay: 0.4 }} className="absolute bottom-2 left-10 w-6 h-6 bg-white/90 rounded-full shadow-sm border border-green-100" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Items Area */}
          <div className="w-64 bg-white/40 p-8 flex flex-col items-center justify-center gap-8">
            {/* Soap - disappears after use */}
            {currentStepIndex <= 1 && (
              <motion.div
                drag={currentStepIndex === 1}
                dragConstraints={{ left: -400, right: 0, top: -100, bottom: 100 }}
                onDragEnd={handleSoapDragEnd}
                whileHover={currentStepIndex === 1 ? { scale: 1.1 } : {}}
                className={`relative z-50 w-20 h-16 bg-green-300 rounded-2xl shadow-md border-b-4 border-green-500 flex items-center justify-center text-white font-bold ${currentStepIndex === 1 ? 'ring-4 ring-yellow-400 ring-offset-4 cursor-grab active:cursor-grabbing' : 'opacity-50'}`}
              >
                香皂
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Level 2: Brushing Teeth ---
  const [brushingTime, setBrushingTime] = useState(0); // 0 to 100 (represents 10 seconds)
  const lastDragTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameState === 'start' || currentStepIndex === 0) {
      setBrushingTime(0);
    }
  }, [gameState, currentStepIndex]);

  useEffect(() => {
    if (level === 2 && currentStepIndex === 1 && gameState === 'playing') {
      const interval = setInterval(() => {
        if (Date.now() - lastDragTimeRef.current < 300) {
          setBrushingTime(prev => {
            const next = prev + 1; // +1 every 100ms = 10 seconds to reach 100
            if (next >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setGameState('level_complete');
                confetti();
              }, 500);
              return 100;
            }
            return next;
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [level, currentStepIndex, gameState]);

  const renderLevel2 = () => {
    const steps = [
      { id: 'water', label: '1. 沾点水' },
      { id: 'brush', label: '2. 刷牙 (坚持10秒)' }
    ];

    const handleBrushToWater = (e: any, info: any) => {
      if (currentStepIndex !== 0) return;
      const cupEl = document.getElementById('cup-target');
      if (cupEl) {
        const rect = cupEl.getBoundingClientRect();
        if (info.point.x >= rect.left && info.point.x <= rect.right &&
            info.point.y >= rect.top && info.point.y <= rect.bottom) {
          setBrushWet(true);
          setCurrentStepIndex(1);
          setScore(s => s + 1);
        }
      }
    };

    const handleBrushRub = (e: any, info: any) => {
      if (currentStepIndex !== 1) return;
      const teethEl = document.getElementById('teeth-target');
      if (teethEl) {
        const rect = teethEl.getBoundingClientRect();
        // Check if brush is over teeth
        if (info.point.x >= rect.left && info.point.x <= rect.right &&
            info.point.y >= rect.top && info.point.y <= rect.bottom) {
          lastDragTimeRef.current = Date.now();
        }
      }
    };

    const secondsLeft = Math.max(0, 10 - Math.floor(brushingTime / 10));

    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <h2 className="text-3xl font-black text-slate-700 mb-8">第二关：刷刷牙，亮晶晶</h2>
        
        <div className="flex gap-4 mb-12">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${
                idx === currentStepIndex 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-110' 
                  : idx < currentStepIndex 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step.label}
              {idx === 1 && currentStepIndex === 1 && (
                <span className="ml-2 bg-white text-blue-500 px-3 py-0.5 rounded-full text-sm flex items-center gap-1 font-black">
                  倒数 {secondsLeft}s
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-4xl h-96 bg-indigo-50/50 rounded-3xl border-4 border-white shadow-inner flex overflow-hidden">
          
          {/* Character / Face Area */}
          <div className="flex-1 flex items-end justify-center border-r-2 border-white/50 relative pt-8">
            <div className="relative w-64 h-80 bg-[#ffe0bd] rounded-t-[120px] flex flex-col items-center pt-16 border-4 border-[#e8c098] border-b-0 shadow-lg">
              {/* Eyes */}
              <div className="flex gap-12 mb-6">
                <div className="w-5 h-7 bg-slate-800 rounded-full relative">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1" />
                </div>
                <div className="w-5 h-7 bg-slate-800 rounded-full relative">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1" />
                </div>
              </div>
              
              {/* Open Mouth (Teeth target) */}
              <div id="teeth-target" className="relative w-44 h-28 bg-red-400 rounded-[50px] flex items-center justify-center border-8 border-red-500 overflow-hidden shadow-inner mt-2">
                <div className="absolute inset-0 bg-red-900/30" />
                {/* Teeth Container */}
                <div className="w-36 h-14 bg-white rounded-xl shadow-inner grid grid-cols-4 gap-1 p-1 z-10">
                  {[...Array(8)].map((_, i) => {
                    const targetProgress = (i + 1) * 12.5; // 100 / 8 = 12.5
                    const isClean = brushingTime >= targetProgress;
                    return (
                      <div key={i} className={`bg-slate-50 rounded-md border border-slate-200 transition-colors duration-500 ${isClean ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'bg-yellow-200'}`} />
                    );
                  })}
                </div>
              </div>

              {/* Blush */}
              <div className="absolute top-28 left-6 w-8 h-5 bg-red-400/30 rounded-full blur-[2px]" />
              <div className="absolute top-28 right-6 w-8 h-5 bg-red-400/30 rounded-full blur-[2px]" />
            </div>
          </div>

          {/* Tools Area */}
          <div className="w-80 bg-white/40 p-8 flex flex-col items-center justify-around relative">
            <div id="cup-target" className={`w-24 h-32 bg-blue-200 rounded-b-2xl border-x-4 border-b-4 border-blue-400 flex items-end justify-center pb-2 mt-auto mb-10 ${currentStepIndex === 0 ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-indigo-50' : ''}`}>
              <div className="w-20 h-24 bg-blue-300/50 rounded-b-xl flex items-start justify-center pt-2">
                <div className="w-16 h-2 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Toothbrush (Positioned between person and cup) */}
          <motion.div
            drag
            dragConstraints={{ left: -500, right: 200, top: -200, bottom: 200 }}
            dragElastic={0.1}
            onDragEnd={handleBrushToWater}
            onDrag={handleBrushRub}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ rotate: -15, scale: 1.1 }}
            className="absolute left-[58%] top-1/2 -translate-y-1/2 w-32 h-8 bg-green-400 rounded-full flex items-center shadow-xl cursor-grab active:cursor-grabbing z-50 origin-right"
            style={{ x: 0, y: 0 }}
          >
            {/* Bristles */}
            <div className="w-10 h-12 bg-white border-2 border-slate-200 rounded-l-md -ml-2 -mt-2 flex flex-col gap-[2px] p-[2px]">
              <div className="w-full h-1 bg-slate-100" />
              <div className="w-full h-1 bg-slate-100" />
              <div className="w-full h-1 bg-slate-100" />
              {brushWet && <div className="absolute -top-3 left-2 w-4 h-4 bg-blue-300 rounded-full animate-bounce shadow-sm" />}
            </div>
          </motion.div>

        </div>
      </div>
    );
  };

  // --- Level 3: Getting Dressed ---
  const renderLevel3 = () => {
    const handleClothesDrag = (clothesType: 'long' | 'short', info: any) => {
      const charEl = document.getElementById('character-target');
      if (charEl) {
        const rect = charEl.getBoundingClientRect();
        if (info.point.x >= rect.left && info.point.x <= rect.right &&
            info.point.y >= rect.top && info.point.y <= rect.bottom) {
          
          if ((weather === 'sunny' && clothesType === 'short') ||
              (weather === 'rainy' && clothesType === 'long')) {
            setClothesSelected(clothesType);
            setScore(s => s + 1);
            setTimeout(() => {
              setGameState('finished');
              confetti({ particleCount: 150, spread: 70 });
            }, 1000);
          } else {
            playErrorSound();
          }
        }
      }
    };

    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <h2 className="text-3xl font-black text-slate-700 mb-4">第三关：穿衣出门</h2>
        
        <div className="flex items-center gap-4 mb-8 bg-white px-6 py-3 rounded-full shadow-md border-2 border-slate-100">
          <span className="font-bold text-slate-600 text-lg">今天的天气是：</span>
          {weather === 'sunny' ? (
            <div className="flex items-center gap-2 text-orange-500">
              <Sun className="w-8 h-8 fill-orange-200" />
              <span className="font-black text-xl">晴天，很热</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-blue-500">
              <CloudRain className="w-8 h-8 fill-blue-200" />
              <span className="font-black text-xl">下雨，很冷</span>
            </div>
          )}
        </div>

        <div className="relative w-full max-w-4xl h-96 bg-amber-50/50 rounded-3xl border-4 border-white shadow-inner flex overflow-hidden">
          
          {/* Character */}
          <div className="flex-1 flex items-center justify-center border-r-2 border-white/50">
            <div id="character-target" className="relative w-40 h-64 bg-orange-100 rounded-[40px] flex flex-col items-center pt-8 border-4 border-orange-200">
              <div className="w-16 h-16 bg-orange-200 rounded-full mb-2 flex items-center justify-center">
                {/* Face */}
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                </div>
              </div>
              
              {/* Body */}
              <div className="w-24 h-32 bg-orange-200 rounded-2xl relative flex justify-center">
                {clothesSelected === 'short' && (
                  <div className="absolute -top-2 w-28 h-20 bg-green-400 rounded-xl" />
                )}
                {clothesSelected === 'long' && (
                  <div className="absolute -top-2 w-32 h-36 bg-purple-400 rounded-xl" />
                )}
              </div>
            </div>
          </div>

          {/* Wardrobe */}
          <div className="w-96 bg-white/40 p-8 flex justify-center items-center gap-8">
            {clothesSelected !== 'short' ? (
              <motion.div
                layoutId="clothes-short"
                drag={!clothesSelected}
                dragSnapToOrigin={true}
                dragConstraints={{ left: -500, right: 0, top: -200, bottom: 200 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => handleClothesDrag('short', info)}
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing z-10"
              >
                <div className="w-20 h-16 bg-green-400 rounded-xl relative">
                  <div className="absolute -left-2 top-0 w-6 h-8 bg-green-400 rounded-l-lg" />
                  <div className="absolute -right-2 top-0 w-6 h-8 bg-green-400 rounded-r-lg" />
                </div>
                <span className="font-bold text-slate-600">短袖</span>
              </motion.div>
            ) : (
              <div className="w-32 h-32 opacity-0" />
            )}

            {clothesSelected !== 'long' ? (
              <motion.div
                layoutId="clothes-long"
                drag={!clothesSelected}
                dragSnapToOrigin={true}
                dragConstraints={{ left: -500, right: 0, top: -200, bottom: 200 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => handleClothesDrag('long', info)}
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing z-10"
              >
                <div className="w-20 h-24 bg-purple-400 rounded-xl relative">
                  <div className="absolute -left-4 top-0 w-6 h-16 bg-purple-400 rounded-l-lg rotate-12" />
                  <div className="absolute -right-4 top-0 w-6 h-16 bg-purple-400 rounded-r-lg -rotate-12" />
                </div>
                <span className="font-bold text-slate-600">外套</span>
              </motion.div>
            ) : (
              <div className="w-32 h-32 opacity-0" />
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-50 to-indigo-100 overflow-hidden relative font-sans">
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
                {level === 1 ? '洗手流程' : level === 2 ? '刷牙流程' : '穿衣出门'}
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
            <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-300 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg rotate-3">
              <Sun className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">早晨小管家</h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              新的一天开始啦！<br/>
              让我们一起来完成早晨的准备工作吧。
            </p>
            <button 
              onClick={() => setGameState('playing')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold px-12 py-5 rounded-full shadow-xl shadow-emerald-200 transition-all flex items-center gap-3 mx-auto"
            >
              <PlayCircle className="w-8 h-8" />
              开始游戏
            </button>
          </motion.div>
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <div className="pt-24 px-12 w-full h-full flex flex-col">
          {level === 1 && renderLevel1()}
          {level === 2 && renderLevel2()}
          {level === 3 && renderLevel3()}
        </div>
      )}

      {/* Level Complete Overlay */}
      {gameState === 'level_complete' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-2xl text-center max-w-lg border-2 border-slate-100"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">太棒了！</h2>
            <p className="text-lg text-slate-500 mb-8 font-medium">
              你成功完成了这个准备步骤！
            </p>
            <button 
              onClick={nextLevel}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-200 transition-all flex items-center gap-2 mx-auto"
            >
              下一关 <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Finished Screen */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-xl border-t-8 border-emerald-500"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
              <Star className="w-16 h-16 text-emerald-500 fill-emerald-200" />
            </div>
            <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">全部完成！</h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              你真是一个自理小能手！<br/>
              早晨的准备工作都做得很完美。
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={resetGame}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
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
