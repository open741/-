import React, { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import BubblePopGame from '../components/games/BubblePopGame';
import FeedMonsterGame from '../components/games/FeedMonsterGame';
import FireflyGame from '../components/games/FireflyGame';
import AnimalChorusGame from '../components/games/AnimalChorusGame';
import ShapeTrainGame from '../components/games/ShapeTrainGame';
import ShareCakeGame from '../components/games/ShareCakeGame';
import EmotionWeatherGame from '../components/games/EmotionWeatherGame';
import MorningRoutineGame from '../components/games/MorningRoutineGame';
import {
  ChevronRight,
  ChevronDown,
  Activity,
  Hand,
  Puzzle,
  MessageCircle,
  Lightbulb,
  Users,
  Heart,
  UserCheck,
  Gamepad2,
  FolderOpen,
  Folder
} from 'lucide-react';

export default function RehabilitationTraining() {
  const [activeTab, setActiveTab] = useState<string>('gross-motor');
  const [activeSubTab, setActiveSubTab] = useState<string>('upper-limb');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Moved categories inside to ensure HMR picks up changes correctly
  const categories = useMemo(() => [
    {
      id: 'gross-motor',
      name: '粗大动作',
      icon: Activity,
      subCategories: [
        {
          id: 'upper-limb',
          name: '上肢运动',
          items: [
            { id: 'bubble-pop', name: '泡泡大作战', component: BubblePopGame }
          ]
        },
        {
          id: 'core-strength',
          name: '核心力量',
          items: []
        }
      ]
    },
    {
      id: 'fine-motor',
      name: '精细动作',
      icon: Hand,
      subCategories: [
        {
          id: 'finger-control',
          name: '手部精细捏合',
          items: [
            { id: 'feed-monster', name: '喂食小怪兽', component: FeedMonsterGame }
          ]
        }
      ]
    },
    {
      id: 'sensory-integration',
      name: '感觉统合',
      icon: Puzzle,
      subCategories: [
        {
          id: 'visual-tracking',
          name: '视觉追踪',
          items: [
            { id: 'firefly-catch', name: '追逐萤火虫', component: FireflyGame }
          ]
        }
      ]
    },
    {
      id: 'language-communication',
      name: '语言沟通',
      icon: MessageCircle,
      subCategories: [
        {
          id: 'language-comprehension',
          name: '语言理解与发音',
          items: [
            { id: 'animal-chorus', name: '动物合唱团', component: AnimalChorusGame }
          ]
        }
      ]
    },
    {
      id: 'cognitive-learning',
      name: '认知与学习能力',
      icon: Lightbulb,
      subCategories: [
        {
          id: 'shape-color-matching',
          name: '形状与颜色匹配',
          items: [
            { id: 'shape-train', name: '形状小火车', component: ShapeTrainGame }
          ]
        }
      ]
    },
    {
      id: 'social-interaction',
      name: '社会交往',
      icon: Users,
      subCategories: [
        {
          id: 'turn-taking',
          name: '轮流与分享',
          items: [
            { id: 'share-cake', name: '分享小蛋糕', component: ShareCakeGame }
          ]
        }
      ]
    },
    {
      id: 'emotion-behavior',
      name: '情绪与行为',
      icon: Heart,
      subCategories: [
        {
          id: 'emotion-regulation',
          name: '情绪认知与调节',
          items: [
            { id: 'emotion-weather', name: '情绪气象站', component: EmotionWeatherGame }
          ]
        }
      ]
    },
    { 
      id: 'life-skills', 
      name: '生活自理与适应能力', 
      icon: UserCheck, 
      subCategories: [
        {
          id: 'morning-routine',
          name: '早晨准备工作',
          items: [
            { id: 'morning-manager', name: '早晨小管家', component: MorningRoutineGame }
          ]
        }
      ] 
    },
  ], []);

  const getActiveComponent = () => {
    if (!selectedGame) return null;
    for (const cat of categories) {
      for (const sub of cat.subCategories || []) {
        for (const item of sub.items || []) {
          if (item.id === selectedGame) {
            const GameComp = item.component;
            return <GameComp />;
          }
        }
      }
    }
    return null;
  };

  // If a game is selected, show it in full screen mode within the container
  if (selectedGame) {
    return (
      <div className="w-full h-full relative bg-slate-900">
        {getActiveComponent()}
        <button
          onClick={() => setSelectedGame(null)}
          className="absolute top-6 right-6 z-[100] bg-[#135c4a] hover:bg-[#0f4a3c] text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-medium transition-all shadow-md shadow-[#135c4a]/30"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          返回
        </button>
      </div>
    );
  }

  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#F4F7F9] overflow-hidden">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#135c4a] to-[#1e8a70] px-10 py-8 shrink-0 text-white relative overflow-hidden shadow-sm">
        {/* Decorative circles */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50px] right-[100px] w-64 h-64 bg-[#135c4a] rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto flex items-end gap-4">
          <h1 className="text-3xl font-black tracking-tight">康复训练中心</h1>
          <p className="text-white/80 text-base mb-1">趣味互动游戏，全方位提升各项核心能力</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-10 pt-6 pb-20 relative z-20">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Level 1 Tabs */}
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-1">
            {categories.map(cat => {
              const isActive = activeTab === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    if (cat.subCategories && cat.subCategories.length > 0) {
                      setActiveSubTab(cat.subCategories[0].id);
                    } else {
                      setActiveSubTab('');
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300",
                    isActive
                      ? "bg-[#135c4a] text-white shadow-md shadow-[#135c4a]/20 scale-100"
                      : "text-slate-600 hover:bg-slate-100 scale-95 hover:scale-100"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Level 2 Sub-Tabs (Pills) */}
          {activeCategory?.subCategories && activeCategory.subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 pb-4">
              {activeCategory.subCategories.map(sub => {
                const isSubActive = activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id)}
                    className={cn(
                      "px-5 py-2 rounded-full text-[15px] font-semibold transition-all duration-200",
                      isSubActive
                        ? "bg-[#135c4a]/10 text-[#135c4a] ring-1 ring-[#135c4a]/30"
                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                    )}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards Grid */}
          <div className="pt-2">
            {activeCategory?.subCategories?.length ? (
              activeCategory.subCategories.filter(s => s.id === activeSubTab).map(sub => (
                <div key={sub.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {sub.items?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {sub.items.map(item => (
                        <div
                          key={item.id}
                          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                          onClick={() => setSelectedGame(item.id)}
                        >
                          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                            {/* Decorative background for the game card */}
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNjYmQ1ZTEiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] opacity-50 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
                            <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                              <Gamepad2 className="w-10 h-10 text-indigo-500" />
                            </div>
                          </div>

                          <h4 className="text-[17px] font-bold text-slate-800 mb-2">{item.name}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                            互动训练游戏，针对{sub.name}进行定制化康复练习。
                          </p>

                          <div className="w-full py-2.5 bg-slate-50 group-hover:bg-[#135c4a] group-hover:text-white text-[#135c4a] rounded-xl font-semibold text-sm flex items-center justify-center transition-colors">
                            开始训练
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/50 border border-slate-200 border-dashed rounded-3xl py-16 flex flex-col items-center justify-center text-slate-400 mt-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Folder className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-lg font-medium text-slate-500">该分类下暂无开放的训练项目</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/50 border border-slate-200 border-dashed rounded-3xl py-20 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-lg font-medium text-slate-500">即将推出</p>
                <p className="text-sm mt-1">此能力维度的训练游戏正在开发中</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
