import { useState } from 'react';
import { Sparkles, Upload, Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';

const STYLES = [
  { id: 'cartoon', label: '卡通', icon: '🎨' },
  { id: 'realistic', label: '写实', icon: '📸' },
  { id: 'stick', label: '简笔画', icon: '✏️' },
  { id: '3d', label: '3D', icon: '🧊' },
];

const SIZES = [
  { id: '1:1', label: '1:1', aspect: 'aspect-square' },
  { id: '4:3', label: '4:3', aspect: 'aspect-[4/3]' },
  { id: '3:4', label: '3:4', aspect: 'aspect-[3/4]' },
  { id: '16:9', label: '16:9', aspect: 'aspect-video' },
  { id: '9:16', label: '9:16', aspect: 'aspect-[9/16]' },
];

const STYLE_LABELS: Record<string, string> = {
  cartoon: '卡通',
  realistic: '写实',
  stick: '简笔画',
  '3d': '3D',
};

export default function AIGenerateView() {
  const addAITask = useStore(state => state.addAITask);
  const [taskName, setTaskName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [selectedSize, setSelectedSize] = useState('1:1');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(4);
  const [isGroupImage, setIsGroupImage] = useState(false);
  const [chineseText, setChineseText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleOptimize = async () => {
    if (!prompt) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setPrompt(`一个红色的、饱满的、带有绿叶的写实苹果，白色背景，高清晰度，适合儿童认知`);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    addAITask({
      taskName,
      prompt,
      style: STYLE_LABELS[selectedStyle] || selectedStyle,
      size: selectedSize,
      quantity: selectedQuantity,
      isGroupImage,
      chineseText,
      englishText,
      creator: '蒋永亮',
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt('');
      setTaskName('');
      setChineseText('');
      setEnglishText('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-10 left-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-white border border-[#135c4a]/20 shadow-xl shadow-[#135c4a]/5 rounded-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-[#135c4a]" />
            <span className="text-sm font-medium text-slate-800">生成中，请在右侧任务列表查看</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
    >
      <div className="p-6 overflow-y-auto flex-1 space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">任务名称</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="例如：水果认知图卡生成"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">画面描述</label>
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing || !prompt}
              className="text-xs flex items-center gap-1.5 text-[#135c4a] hover:text-[#0f4a3b] font-medium disabled:opacity-50 transition-colors bg-[#e8f3f0] px-3 py-1.5 rounded-full"
            >
              {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              一键优化提示词
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一个红色的苹果..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent resize-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">图像风格</label>
          <div className="grid grid-cols-3 gap-3">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                  selectedStyle === style.id
                    ? "border-[#135c4a] bg-[#e8f3f0] text-[#135c4a]"
                    : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <span className="text-2xl">{style.icon}</span>
                <span className="text-xs font-medium">{style.label}</span>
              </button>
            ))}
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-all">
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">参考图</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">生成尺寸</label>
          <div className="flex flex-wrap gap-3">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={cn(
                  "flex-1 min-w-[80px] py-3 rounded-xl border-2 text-xs font-medium transition-all flex flex-col items-center justify-center gap-2",
                  selectedSize === size.id
                    ? "border-[#135c4a] bg-[#e8f3f0] text-[#135c4a]"
                    : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className={cn("w-6 bg-current opacity-20 rounded-sm", size.aspect)}></div>
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className={cn("text-sm font-semibold", isGroupImage ? "text-slate-400" : "text-slate-700")}>生成数量</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 4].map((qty) => (
                <button
                  key={qty}
                  disabled={isGroupImage}
                  onClick={() => setSelectedQuantity(qty)}
                  className={cn(
                    "flex-1 min-w-[48px] py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                    isGroupImage
                      ? selectedQuantity === qty
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : selectedQuantity === qty
                        ? "border-[#135c4a] bg-[#e8f3f0] text-[#135c4a]"
                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {qty} 张
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">生成组图</label>
            <div className="flex items-center h-[44px]">
              <button
                onClick={() => setIsGroupImage(!isGroupImage)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:ring-offset-2",
                  isGroupImage ? "bg-[#135c4a]" : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    isGroupImage ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-slate-600">
                {isGroupImage ? '开启' : '关闭'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">在图片中生成文字</label>
          <div className="flex flex-col gap-4">
            <div className="w-full space-y-1.5">
              <label className="text-xs font-medium text-slate-500">中文</label>
              <input
                type="text"
                maxLength={8}
                value={chineseText}
                onChange={(e) => setChineseText(e.target.value)}
                placeholder="输入后可在图片中添加中文"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent transition-all"
              />
            </div>
            <div className="w-full space-y-1.5">
              <label className="text-xs font-medium text-slate-500">英文</label>
              <input
                type="text"
                maxLength={16}
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                placeholder="输入后可在图片中添加英文"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
        <button 
          onClick={handleGenerate}
          disabled={!prompt || !taskName || isGenerating}
          className="px-8 py-3 text-sm font-medium text-white bg-[#135c4a] hover:bg-[#0f4a3b] rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-[#135c4a]/20"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              开始生成
            </>
          )}
        </button>
      </div>
    </motion.div>
    </>
  );
}
