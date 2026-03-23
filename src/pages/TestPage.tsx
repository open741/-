import { useState } from 'react';
import { ArrowLeft, Wand2, CheckCircle2, Play, Plus, Trash2, Edit2, Loader2, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface Word {
  id: string;
  text: string;
  pos: 'noun' | 'verb' | 'adj' | 'pronoun' | 'other';
  imageUrl?: string;
  isGenerating?: boolean;
}

const POS_COLORS = {
  noun: 'bg-blue-100 text-blue-700 border-blue-200',
  verb: 'bg-red-100 text-red-700 border-red-200',
  adj: 'bg-amber-100 text-amber-700 border-amber-200',
  pronoun: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const POS_LABELS = {
  noun: '名词',
  verb: '动词',
  adj: '形容词',
  pronoun: '代词',
  other: '其他',
};

export default function ActivityDetails() {
  const [dialogue, setDialogue] = useState('我要吃红色的苹果');
  const [isParsing, setIsParsing] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success'>('idle');

  const handleParse = () => {
    setIsParsing(true);
    // Simulate parsing
    setTimeout(() => {
      setWords([
        { id: '1', text: '我', pos: 'pronoun' },
        { id: '2', text: '要', pos: 'verb' },
        { id: '3', text: '吃', pos: 'verb' },
        { id: '4', text: '红色', pos: 'adj' },
        { id: '5', text: '的', pos: 'other' },
        { id: '6', text: '苹果', pos: 'noun' },
      ]);
      setIsParsing(false);
    }, 1500);
  };

  const handleGenerateAll = () => {
    setIsGeneratingAll(true);
    // Simulate batch generation
    setWords(prev => prev.map(w => ({ ...w, isGenerating: true })));
    
    setTimeout(() => {
      setWords(prev => prev.map((w, i) => ({
        ...w,
        isGenerating: false,
        imageUrl: `https://picsum.photos/seed/${w.text}/400/400`
      })));
      setIsGeneratingAll(false);
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 5000);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">认识水果</h2>
            <p className="text-sm text-slate-500 mt-1">活动详情与素材配置</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleParse}
            disabled={isParsing || !dialogue}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#145c44]" />}
            智能解析对话
          </button>
          <button 
            onClick={handleGenerateAll}
            disabled={words.length === 0 || isGeneratingAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#145c44] text-white rounded-lg text-sm font-medium hover:bg-[#0f4533] transition-colors disabled:opacity-50 shadow-sm shadow-[#145c44]/20"
          >
            {isGeneratingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            批量生成词卡
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-8">
        
        {syncStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-800">生成完成并已同步</h4>
              <p className="text-sm text-emerald-600 mt-1">词卡已自动存入图卡库-词卡分类，并已同步至 AAC App。</p>
            </div>
          </div>
        )}

        {/* Dialogue Input */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#e8f3ef] text-[#145c44] flex items-center justify-center text-xs font-bold">1</span>
            教学对话设计
          </h3>
          <textarea
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            placeholder="输入本次活动的教学对话..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#145c44] focus:border-transparent resize-none transition-all"
          />
        </section>

        {/* Word Breakdown & Generation */}
        {words.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#e8f3ef] text-[#145c44] flex items-center justify-center text-xs font-bold">2</span>
                词性划分与词卡预览
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>名词</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>动词</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div>形容词</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>代词</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {words.map((word, index) => (
                <div key={word.id} className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                  {/* Image Area */}
                  <div className="aspect-square relative bg-slate-100 flex items-center justify-center border-b border-slate-200">
                    {word.isGenerating ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-[#145c44]" />
                        <span className="text-xs font-medium">AI 绘制中...</span>
                      </div>
                    ) : word.imageUrl ? (
                      <>
                        <img 
                          src={word.imageUrl} 
                          alt={word.text} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button className="p-2 bg-white text-slate-700 rounded-full hover:bg-[#e8f3ef] hover:text-[#145c44] transition-colors shadow-sm" title="重新生成">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white text-slate-700 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm" title="删除">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">待生成</span>
                      </div>
                    )}
                  </div>

                  {/* Text & POS Area */}
                  <div className="p-3 bg-white flex-1 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-lg">{word.text}</span>
                      <button className="text-slate-400 hover:text-[#145c44] transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-md border font-medium", POS_COLORS[word.pos])}>
                        {POS_LABELS[word.pos]}
                      </span>
                      {word.imageUrl && (
                        <button className="text-slate-400 hover:text-emerald-600 transition-colors" title="播放发音">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Word Button */}
              <button className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#145c44] hover:border-[#145c44] hover:bg-[#e8f3ef] transition-all">
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">手动添加词汇</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
