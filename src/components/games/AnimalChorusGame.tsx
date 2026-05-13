import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Star, RefreshCw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const ANIMALS = [
  { id: 'dog', name: '小狗', soundText: '汪汪汪！', color: '#fbbf24', svg: <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><path fill="#fef3c7" d="M20 40 Q50 10 80 40 Q90 60 80 80 Q50 90 20 80 Q10 60 20 40" /><circle cx="35" cy="45" r="5" fill="#451a03"/><circle cx="65" cy="45" r="5" fill="#451a03"/><path fill="#451a03" d="M45 60 Q50 65 55 60 Q50 70 45 60" /><path fill="#d97706" d="M15 30 Q25 15 35 30 Q25 40 15 30" /><path fill="#d97706" d="M85 30 Q75 15 65 30 Q75 40 85 30" /></svg> },
  { id: 'cat', name: '小猫', soundText: '喵喵喵！', color: '#f87171', svg: <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><path fill="#fee2e2" d="M20 40 Q50 20 80 40 Q90 60 80 80 Q50 90 20 80 Q10 60 20 40" /><path fill="#fee2e2" d="M20 40 L10 10 L40 25 Z" /><path fill="#fee2e2" d="M80 40 L90 10 L60 25 Z" /><circle cx="35" cy="45" r="4" fill="#451a03"/><circle cx="65" cy="45" r="4" fill="#451a03"/><path fill="#fca5a5" d="M45 55 L50 60 L55 55 Z" /><path stroke="#451a03" strokeWidth="2" fill="none" d="M30 60 Q20 60 10 55 M30 65 Q20 65 10 65 M30 70 Q20 70 10 75 M70 60 Q80 60 90 55 M70 65 Q80 65 90 65 M70 70 Q80 70 90 75" /></svg> },
  { id: 'duck', name: '小鸭', soundText: '嘎嘎嘎！', color: '#4ade80', svg: <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><circle cx="50" cy="50" r="35" fill="#fef08a"/><circle cx="35" cy="40" r="5" fill="#451a03"/><circle cx="65" cy="40" r="5" fill="#451a03"/><path fill="#fb923c" d="M30 55 Q50 45 70 55 Q60 70 40 70 Z" /></svg> },
  { id: 'cow', name: '小牛', soundText: '哞哞哞！', color: '#60a5fa', svg: <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><path fill="#f8fafc" d="M25 40 Q50 15 75 40 Q85 65 75 80 Q50 90 25 80 Q15 65 25 40" /><path fill="#334155" d="M30 40 Q40 30 45 45 Q35 55 30 40" /><path fill="#334155" d="M65 50 Q75 40 80 55 Q70 65 65 50" /><path fill="#fca5a5" d="M35 70 Q50 60 65 70 Q60 85 40 85 Z" /><circle cx="40" cy="45" r="4" fill="#451a03"/><circle cx="60" cy="45" r="4" fill="#451a03"/><path fill="#cbd5e1" d="M20 35 Q10 20 25 25 Z" /><path fill="#cbd5e1" d="M80 35 Q90 20 75 25 Z" /></svg> }
];

const ROUNDS = [
  { level: 1, target: 'dog', options: ['dog', 'cat'], type: 'sound', title: '听叫声找动物' },
  { level: 1, target: 'cat', options: ['cat', 'duck'], type: 'sound', title: '听叫声找动物' },
  { level: 2, target: 'duck', options: ['dog', 'duck', 'cow'], type: 'name', title: '听名字找动物' },
  { level: 2, target: 'cow', options: ['cat', 'duck', 'cow'], type: 'name', title: '听名字找动物' }
];

let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
};

const playDog = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
};

const playCat = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

const playDuck = (ctx: AudioContext) => {
  const playQuack = (timeOffset: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, ctx.currentTime + timeOffset);
    gain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + timeOffset + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + timeOffset);
    osc.stop(ctx.currentTime + timeOffset + 0.2);
  };
  playQuack(0);
  playQuack(0.2);
};

const playCow = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
};

const playErrorSound = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.2);
};

const playSuccessSound = () => {
  if (!audioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audioCtx!.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx!.currentTime + i * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx!.currentTime + i * 0.1 + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start(audioCtx!.currentTime + i * 0.1);
    osc.stop(audioCtx!.currentTime + i * 0.1 + 0.3);
  });
};

const playAnimalSound = (id: string) => {
  if (!audioCtx) return;
  if (id === 'dog') playDog(audioCtx);
  else if (id === 'cat') playCat(audioCtx);
  else if (id === 'duck') playDuck(audioCtx);
  else if (id === 'cow') playCow(audioCtx);
};

const speak = (text: string, onEnd?: () => void) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
};

export default function AnimalChorusGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'win'>('start');
  const [roundIndex, setRoundIndex] = useState(0);
  const [clickedCard, setClickedCard] = useState<{ id: string, type: 'correct' | 'wrong' } | null>(null);
  
  const interactionIdRef = useRef(0);

  const startGame = () => {
    initAudio();
    setRoundIndex(0);
    setGameState('playing');
    setClickedCard(null);
  };

  const repeatInstruction = () => {
    initAudio();
    const round = ROUNDS[roundIndex];
    if (round.type === 'sound') {
      speak('听听看，这是谁的叫声？', () => {
        setTimeout(() => playAnimalSound(round.target), 500);
      });
    } else {
      const animalName = ANIMALS.find(a => a.id === round.target)?.name;
      speak(`请问，哪个是 ${animalName}？`);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      repeatInstruction();
    }
  }, [roundIndex, gameState]);

  const handleCardClick = (id: string) => {
    if (clickedCard?.type === 'correct') return; // Lock if already transitioning
    initAudio();

    const round = ROUNDS[roundIndex];
    const currentInteraction = ++interactionIdRef.current;

    if (id === round.target) {
      setClickedCard({ id, type: 'correct' });
      playAnimalSound(id);
      speak('太棒了，你找对了！');

      setTimeout(() => {
        if (interactionIdRef.current !== currentInteraction) return;
        setClickedCard(null);
        if (roundIndex + 1 < ROUNDS.length) {
          setRoundIndex(r => r + 1);
        } else {
          setGameState('win');
          playSuccessSound();
          triggerConfetti();
        }
      }, 1800);
    } else {
      setClickedCard({ id, type: 'wrong' });
      playErrorSound();
      playAnimalSound(id);

      setTimeout(() => {
        if (interactionIdRef.current !== currentInteraction) return;
        setClickedCard(null);
      }, 1000);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2000;
    const colors = ['#fde047', '#a3e635', '#60a5fa', '#f472b6'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const round = ROUNDS[roundIndex];

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl bg-sky-100 select-none">
      <style>{`
        @keyframes anim-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px) rotate(-5deg); }
          40% { transform: translateX(12px) rotate(5deg); }
          60% { transform: translateX(-12px) rotate(-5deg); }
          80% { transform: translateX(12px) rotate(5deg); }
        }
        @keyframes anim-pop {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes anim-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes anim-bubble-pop {
          0% { transform: translateX(-50%) scale(0.5) translateY(10px); opacity: 0; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Farm Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-green-100" />
        <div className="absolute top-8 right-12 w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_50px_rgba(253,224,71,0.8)]" />
        <div className="absolute top-16 left-20 w-32 h-10 bg-white rounded-full opacity-90 blur-[2px]" />
        <div className="absolute top-10 left-24 w-16 h-16 bg-white rounded-full opacity-90 blur-[2px]" />
        <div className="absolute top-20 right-48 w-40 h-12 bg-white rounded-full opacity-80 blur-[2px]" />
        <div className="absolute -bottom-20 left-0 w-[150%] h-[50%] bg-gradient-to-t from-green-500 to-green-400 rounded-[100%] -translate-x-1/4" />
        <div className="absolute -bottom-32 right-0 w-[120%] h-[60%] bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-[100%] translate-x-1/4 opacity-80" />
      </div>

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center transform hover:scale-105 transition-transform border-4 border-yellow-200" style={{ animation: 'anim-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <PlayCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">动物合唱团</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              听一听，找一找，模仿农场里的小动物们的叫声吧！<br/>锻炼语言理解与发音模仿。
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-yellow-400/50 hover:-translate-y-1 transition-all"
            >
              开始游戏
            </button>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === 'win' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center max-w-md text-center border-4 border-green-200" style={{ animation: 'anim-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, anim-float 3s ease-in-out infinite alternate' }}>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-green-500 fill-green-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-wider">合唱圆满成功！</h1>
            <p className="text-base text-slate-600 mb-8 font-medium">
              你不仅找对了所有小动物，模仿地也很好哦！
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
      {gameState === 'playing' && round && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-8">
          
          {/* HUD & Instruction */}
          <div className="absolute -top-32 left-0 right-0 flex justify-between items-center px-4">
            <div className="font-bold text-emerald-800 bg-white/80 px-5 py-2.5 rounded-full shadow-sm border border-emerald-100">
              第 {round.level} 关：{round.title}
            </div>
            
            <button 
              onClick={repeatInstruction}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-5 py-2.5 rounded-full shadow-md transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              再听一次
            </button>
          </div>

          {/* Pure React + CSS Animal Cards Rendering */}
          <div key={`round-${roundIndex}`} className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full mt-10 min-h-[200px]">
            {round.options.map((id, index) => {
              const animal = ANIMALS.find(a => a.id === id)!;
              const isThisCardClicked = clickedCard?.id === id;
              const isWrong = isThisCardClicked && clickedCard.type === 'wrong';
              const isCorrect = isThisCardClicked && clickedCard.type === 'correct';
              
              let animationStyle = '';
              if (isWrong) animationStyle = 'anim-shake 0.5s ease-in-out';
              
              return (
                <div 
                  key={`card-${id}`}
                  style={{ animation: `anim-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s forwards`, opacity: 0 }}
                  className="relative cursor-pointer"
                >
                  <div
                    onClick={() => handleCardClick(id)}
                    className={`relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] shadow-xl p-6 flex items-center justify-center border-4 backdrop-blur-sm transition-all duration-300
                      ${isWrong ? 'border-red-400 opacity-80' : 'border-white/50'}
                      ${isCorrect ? 'border-yellow-300 shadow-[0_0_40px_rgba(253,224,71,0.6)] scale-110 -translate-y-6' : 'hover:-translate-y-2 hover:scale-105 hover:shadow-2xl'}
                    `}
                    style={{ 
                      backgroundColor: animal.color, 
                      animation: animationStyle
                    }}
                  >
                    {/* Speech Bubble */}
                    {isThisCardClicked && (
                      <div 
                        style={{ animation: 'anim-bubble-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                        className="pointer-events-none absolute -top-16 left-1/2 bg-white px-5 py-2 rounded-2xl shadow-xl border-2 border-slate-100 font-black text-2xl text-slate-700 whitespace-nowrap z-50 origin-bottom"
                      >
                        {animal.soundText}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-100 rotate-45" />
                      </div>
                    )}
                    
                    {/* SVG Content */}
                    <div className="w-full h-full pointer-events-none">
                      {animal.svg}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
