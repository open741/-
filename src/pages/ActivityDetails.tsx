import { useState } from 'react';
import { ArrowLeft, Printer, RefreshCw, XCircle, Star, ChevronDown, CheckCircle2, X, Wand2, Loader2, Upload, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore, Activity, DialogueLine, Card } from '../lib/store';

export default function ActivityDetails() {
  const updateActivity = useStore(state => state.updateActivity);
  const [activeTab, setActiveTab] = useState<'details' | 'dialogue'>('details');

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-[#135c4a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">活动详情</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-md text-sm font-medium hover:bg-[#0f4a3b] transition-colors">
            <XCircle className="w-4 h-4" />
            取消审核
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#e8f3f0] text-[#135c4a] rounded-md text-sm font-medium hover:bg-[#d1e6df] transition-colors">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#e8f3f0] text-[#135c4a] rounded-md text-sm font-medium hover:bg-[#d1e6df] transition-colors">
            <Printer className="w-4 h-4" />
            打印
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Activity ID Banner */}
        <div className="bg-[#e8f3f0] rounded-xl p-4 flex items-center justify-center relative mb-6">
          <h2 className="text-xl font-bold text-[#135c4a]">活动编号：ACT261229</h2>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 rotate-12">
            <div className="border-4 border-[#135c4a] text-[#135c4a] px-3 py-1 rounded-md font-bold text-sm tracking-widest opacity-80">
              审核通过
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              "pb-4 text-base font-medium transition-colors relative",
              activeTab === 'details' ? "text-[#135c4a]" : "text-slate-500 hover:text-slate-700"
            )}
          >
            活动详情
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#135c4a] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('dialogue')}
            className={cn(
              "pb-4 text-base font-medium transition-colors relative",
              activeTab === 'dialogue' ? "text-[#135c4a]" : "text-slate-500 hover:text-slate-700"
            )}
          >
            活动对话
            {activeTab === 'dialogue' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#135c4a] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'details' ? <ActivityDetailsTab /> : <ActivityDialogueTab />}
      </div>
    </div>
  );
}

function ActivityDetailsTab() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {/* Row 1 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>活动名称
          </label>
          <input type="text" placeholder="3个项目" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>活动类型
          </label>
          <input type="text" placeholder="感觉" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>强度
          </label>
          <div className="flex items-center gap-1 h-10">
            {[1, 2, 3].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            {[4, 5].map(i => <Star key={i} className="w-5 h-5 fill-slate-200 text-slate-200" />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>时长
          </label>
          <input type="text" defaultValue="10" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>人数
          </label>
          <input type="text" defaultValue="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">适用年级</label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 text-slate-500">
                <option>请选择</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">科目</label>
            <input type="text" placeholder="请选择科目" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">单元</label>
            <input type="text" placeholder="请选择单元" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">主题</label>
            <input type="text" placeholder="请选择主题" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <span className="text-red-500">*</span>难度
          </label>
          <div className="flex items-center gap-6 h-10">
            {['入门级', '初级', '中级', '高级'].map((level, i) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="difficulty" defaultChecked={i === 0} className="w-4 h-4 text-[#135c4a] focus:ring-[#135c4a]" />
                <span className="text-sm text-slate-600">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Full width fields */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">训练目的</label>
        <textarea placeholder="请填写训练目的" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 min-h-[80px] resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">活动辅具</label>
        <div className="w-full py-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-sm text-slate-400">
          暂无数据
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">活动教具</label>
        <div className="w-full py-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-sm text-slate-400">
          暂无数据
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">活动学具</label>
        <div className="w-full py-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-sm text-slate-400">
          暂无数据
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">准备</label>
        <textarea placeholder="请填写准备" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 min-h-[80px] resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">操作步骤</label>
        <div className="flex items-start gap-3">
          <div className="mt-2 w-2 h-2 rounded-full bg-[#135c4a]" />
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">第1步</span>
            <input type="text" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">难度调整</label>
        <textarea placeholder="请填写难度调整" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 min-h-[80px] resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">AAC使用建议</label>
        <textarea 
          placeholder="例：擎天4格，放入“小明（学生）照片”、“教师照片”、“打招呼照片”、“再见照片”；&#10;对应录音“小明、老师、早上好、再见”；&#10;上课/下课时教师与学生打招呼/告别，学生请讨擎天打招呼/告别“老师早上好”" 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 min-h-[100px] resize-none placeholder:text-slate-400" 
        />
      </div>

      <div className="space-y-4">
        <div className="bg-[#e8f3f0] py-3 rounded-t-lg text-center font-bold text-[#135c4a]">
          活动评价项目
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-medium text-slate-600">
              <th className="py-3 px-4 w-20">序号</th>
              <th className="py-3 px-4">活动评价项目</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            <tr>
              <td className="py-4 px-4">1</td>
              <td className="py-4 px-4">会不会变</td>
            </tr>
            <tr>
              <td className="py-4 px-4">2</td>
              <td className="py-4 px-4">能够独立完成10个</td>
            </tr>
            <tr>
              <td className="py-4 px-4">3</td>
              <td className="py-4 px-4">灵活爬行</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-100 text-blue-700 border-blue-200',
  verb: 'bg-red-100 text-red-700 border-red-200',
  adj: 'bg-amber-100 text-amber-700 border-amber-200',
  pronoun: 'bg-green-100 text-green-700 border-green-200',
  other: 'bg-slate-100 text-slate-600 border-slate-200',
};

const POS_LABELS: Record<string, string> = {
  noun: '名词',
  verb: '动词',
  adj: '形容词',
  pronoun: '代词',
  other: '其他',
};

const CURRENT_ACTIVITY_ID = 'activity-1';

const INITIAL_PARSED_DIALOGUES = [
  {
    speaker: 'teacher' as const,
    words: [
      { text: '宝宝', partOfSpeech: 'noun' as const, img: '' },
      { text: '你好', partOfSpeech: 'other' as const, img: '' },
      { text: '，', partOfSpeech: 'other' as const },
      { text: '我们', partOfSpeech: 'pronoun' as const, img: '' },
      { text: '来', partOfSpeech: 'verb' as const, img: '' },
      { text: '玩游戏', partOfSpeech: 'verb' as const, img: '' },
      { text: '吧。', partOfSpeech: 'other' as const }
    ]
  },
  {
    speaker: 'student' as const,
    words: [
      { text: '好', partOfSpeech: 'adj' as const, img: '' },
      { text: '呀', partOfSpeech: 'other' as const, img: '' },
      { text: '。', partOfSpeech: 'other' as const }
    ]
  },
  {
    speaker: 'teacher' as const,
    words: [
      { text: '看', partOfSpeech: 'verb' as const, img: '' },
      { text: '，', partOfSpeech: 'other' as const },
      { text: '这里', partOfSpeech: 'pronoun' as const, img: '' },
      { text: '有', partOfSpeech: 'verb' as const, img: '' },
      { text: '三个', partOfSpeech: 'adj' as const, img: '' },
      { text: '小玩具', partOfSpeech: 'noun' as const, img: '' },
      { text: '。', partOfSpeech: 'other' as const }
    ]
  },
  {
    speaker: 'student' as const,
    words: [
      { text: '是', partOfSpeech: 'verb' as const, img: '' },
      { text: '什么', partOfSpeech: 'pronoun' as const, img: '' },
      { text: '呀', partOfSpeech: 'other' as const, img: '' },
      { text: '？', partOfSpeech: 'other' as const }
    ]
  }
];

const INITIAL_RAW_DIALOGUES = [
  { speaker: 'teacher' as const, text: '宝宝你好，我们来玩游戏吧。' },
  { speaker: 'student' as const, text: '好呀。' },
  { speaker: 'teacher' as const, text: '看，这里有三个小玩具。' },
  { speaker: 'student' as const, text: '是什么呀？' },
];

function ActivityDialogueTab() {
  const updateActivity = useStore(state => state.updateActivity);
  const [dialogueState, setDialogueState] = useState<'empty' | 'editing' | 'parsing' | 'parsed'>('empty');
  const [rawDialogues, setRawDialogues] = useState<{ speaker: 'teacher' | 'student', text: string }[]>([]);
  const [dialogues, setDialogues] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingWords, setGeneratingWords] = useState<string[]>([]);
  const [generateTarget, setGenerateTarget] = useState<{ type: 'sentence', dIdx: number } | { type: 'word', dIdx: number, wIdx: number } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [selectedSize, setSelectedSize] = useState('1:1');
  const [includeChinese, setIncludeChinese] = useState(false);
  const [includeEnglish, setIncludeEnglish] = useState(false);
  const [ageRange, setAgeRange] = useState('15~24月龄');
  const [vocabLevel, setVocabLevel] = useState('初级');

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

  const shouldHaveImage = (word: any) => word.partOfSpeech !== 'other';

  const handleGenerateDialogue = () => {
    setDialogueState('editing');
    setRawDialogues(INITIAL_RAW_DIALOGUES.map(d => ({ ...d })));
  };

  const handleClearDialogues = () => {
    setDialogueState('empty');
    setRawDialogues([]);
    setDialogues([]);
  };

  const handleDeleteDialoguePair = (pairIndex: number) => {
    const newRaw = [...rawDialogues];
    newRaw.splice(pairIndex * 2, 2);
    setRawDialogues(newRaw);
  };

  const handleCompleteDialogue = () => {
    setDialogueState('parsing');
    setTimeout(() => {
      const parsedDialogues = INITIAL_PARSED_DIALOGUES.map(d => ({ ...d }));
      setDialogues(parsedDialogues);
      
      const wordCards: Card[] = [];
      parsedDialogues.forEach((dialogue, dIdx) => {
        dialogue.words.forEach((word, wIdx) => {
          wordCards.push({
            id: `wc-${CURRENT_ACTIVITY_ID}-${dIdx}-${wIdx}`,
            type: 'word',
            title: word.text,
            imageUrl: '',
            tags: [POS_LABELS[word.partOfSpeech]],
            publishStatus: 'published',
            sourceType: 'activity',
            sourceActivity: '3个项目',
            activityId: CURRENT_ACTIVITY_ID,
            posColor: POS_COLORS[word.partOfSpeech],
            creator: '胡晓涛',
            partOfSpeech: POS_LABELS[word.partOfSpeech]
          });
        });
      });
      
      updateActivity(CURRENT_ACTIVITY_ID, {
        dialogues: parsedDialogues,
        wordCards: wordCards
      });
      
      setDialogueState('parsed');
    }, 1500);
  };

  const handleRawDialogueChange = (index: number, text: string) => {
    const newRaw = [...rawDialogues];
    newRaw[index].text = text;
    setRawDialogues(newRaw);
  };

  const openGenerateModalForWord = (dIdx: number, wIdx: number) => {
    setGenerateTarget({ type: 'word', dIdx, wIdx });
    setIsModalOpen(true);
  };

  const openGenerateModalForSentence = (dIdx: number) => {
    setGenerateTarget({ type: 'sentence', dIdx });
    setIsModalOpen(true);
  };

  const handleStartGenerate = () => {
    if (!generateTarget) return;
    
    setIsModalOpen(false);

    const wordsToGenerate: string[] = [];
    if (generateTarget.type === 'word') {
      wordsToGenerate.push(`${generateTarget.dIdx}-${generateTarget.wIdx}`);
    } else {
      dialogues[generateTarget.dIdx].words.forEach((word: any, wIdx: number) => {
        if (shouldHaveImage(word) && !word.img) {
          wordsToGenerate.push(`${generateTarget.dIdx}-${wIdx}`);
        }
      });
    }

    if (wordsToGenerate.length === 0) return;

    setGeneratingWords(prev => [...prev, ...wordsToGenerate]);

    setTimeout(() => {
      const updatedDialogues = [...dialogues];
      
      wordsToGenerate.forEach(key => {
        const [dIdxStr, wIdxStr] = key.split('-');
        const dIdx = parseInt(dIdxStr);
        const wIdx = parseInt(wIdxStr);
        const word = updatedDialogues[dIdx].words[wIdx];
        
        updatedDialogues[dIdx].words[wIdx] = {
          ...word,
          img: `https://picsum.photos/seed/${word.text}-${Date.now()}/100/100`
        };
      });
      
      setDialogues(updatedDialogues);
      
      const updatedWordCards: Card[] = [];
      updatedDialogues.forEach((dialogue, dIdx) => {
        dialogue.words.forEach((word: any, wIdx) => {
          if (word.img) {
            updatedWordCards.push({
              id: `wc-${CURRENT_ACTIVITY_ID}-${dIdx}-${wIdx}`,
              type: 'word',
              title: word.text,
              imageUrl: word.img,
              tags: [POS_LABELS[word.partOfSpeech]],
              publishStatus: 'published',
              sourceType: 'activity',
              sourceActivity: '3个项目',
              activityId: CURRENT_ACTIVITY_ID,
              posColor: POS_COLORS[word.partOfSpeech],
              creator: '胡晓涛',
              partOfSpeech: POS_LABELS[word.partOfSpeech]
            });
          }
        });
      });
      
      updateActivity(CURRENT_ACTIVITY_ID, {
        dialogues: updatedDialogues,
        wordCards: updatedWordCards
      });
      
      setGeneratingWords(prev => prev.filter(w => !wordsToGenerate.includes(w)));
    }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8 relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">活动对话</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">月龄段:</label>
            <div className="relative">
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="appearance-none px-3 py-2 pr-8 bg-white border border-[#135c4a] text-slate-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#135c4a] min-w-[120px]"
              >
                <option value="1~4月龄">1~4月龄</option>
                <option value="5~8月龄">5~8月龄</option>
                <option value="9~12月龄">9~12月龄</option>
                <option value="15~24月龄">15~24月龄</option>
                <option value="27~36月龄">27~36月龄</option>
                <option value="42~60月龄">42~60月龄</option>
                <option value="66~84月龄">66~84月龄</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#135c4a] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">词汇等级:</label>
            <div className="relative">
              <select
                value={vocabLevel}
                onChange={(e) => setVocabLevel(e.target.value)}
                className="appearance-none px-3 py-2 pr-8 bg-white border border-[#135c4a] text-slate-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#135c4a] min-w-[100px]"
              >
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#135c4a] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={handleGenerateDialogue}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {dialogueState === 'empty' ? '一键生成对话' : '重新生成对话'}
          </button>
          {dialogueState !== 'empty' && (
            <button 
              onClick={handleClearDialogues}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
            >
              清空对话
            </button>
          )}
          {dialogueState === 'editing' && (
            <button 
              onClick={handleCompleteDialogue}
              className="px-4 py-2 bg-[#135c4a] text-white rounded-md text-sm font-medium hover:bg-[#0f4a3b] transition-colors"
            >
              完成
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4 pt-4">
        {dialogueState === 'empty' && (
          <div className="py-12 text-center text-slate-500">
            暂未生成活动对话
          </div>
        )}

        {dialogueState === 'editing' && (
          <div className="space-y-4">
            {Array.from({ length: Math.ceil(rawDialogues.length / 2) }).map((_, pairIdx) => (
              <div key={pairIdx} className="relative group p-4 border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
                <button 
                  onClick={() => handleDeleteDialoguePair(pairIdx)}
                  className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="删除此组对话"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  {[0, 1].map(offset => {
                    const idx = pairIdx * 2 + offset;
                    const dialogue = rawDialogues[idx];
                    if (!dialogue) return null;
                    return (
                      <div key={idx} className="flex gap-3 items-start pr-8">
                        <div className="w-16 shrink-0 pt-2 text-right font-medium text-slate-600">
                          {dialogue.speaker === 'teacher' ? '老师：' : '学生：'}
                        </div>
                        <textarea
                          value={dialogue.text}
                          onChange={(e) => handleRawDialogueChange(idx, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a]/20 min-h-[60px] resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {dialogueState === 'parsing' && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#135c4a]" />
            <p>正在解析词性...</p>
          </div>
        )}

        {dialogueState === 'parsed' && dialogues.map((dialogue, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3",
              dialogue.speaker === 'teacher' ? "justify-start" : "justify-end"
            )}
          >
            <div 
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                dialogue.speaker === 'teacher' 
                  ? "bg-slate-100 rounded-tl-md" 
                  : "bg-emerald-50 rounded-tr-md"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-slate-500">
                  {dialogue.speaker === 'teacher' ? '老师' : '学生'}
                </div>
                <button 
                  onClick={() => openGenerateModalForSentence(idx)}
                  className="text-xs flex items-center gap-1 text-[#135c4a] hover:bg-[#e8f3f0] px-2 py-1 rounded transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  生成本句图卡
                </button>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                {dialogue.words.map((word: any, wordIdx: number) => {
                  const isGeneratingWord = generatingWords.includes(`${idx}-${wordIdx}`);
                  return (
                  <div
                    key={wordIdx}
                    className="flex flex-col items-center gap-1 relative group"
                  >
                    {word.img ? (
                      <div 
                        className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white relative group-hover:ring-2 group-hover:ring-[#135c4a] transition-all cursor-pointer"
                        onClick={() => openGenerateModalForWord(idx, wordIdx)}
                      >
                        <img 
                          src={word.img} 
                          alt={word.text}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <RefreshCw className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : isGeneratingWord ? (
                      <div className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm bg-white flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[#135c4a] animate-spin" />
                      </div>
                    ) : null}
                    <div className="relative">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm border cursor-default",
                          POS_COLORS[word.partOfSpeech]
                        )}
                      >
                        {word.text}
                        <span className="text-[10px] opacity-70">
                          {POS_LABELS[word.partOfSpeech]}
                        </span>
                      </span>
                      {!word.img && !isGeneratingWord && shouldHaveImage(word) && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto">
                          <button 
                            onClick={() => openGenerateModalForWord(idx, wordIdx)}
                            className="bg-white border border-slate-200 shadow-md rounded-md px-2 py-1.5 text-[#135c4a] hover:bg-[#e8f3f0] flex items-center gap-1 whitespace-nowrap"
                          >
                            <Wand2 className="w-3 h-3" />
                            <span className="text-xs font-medium">生成图卡</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Generate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800">
                <Wand2 className="w-5 h-5 text-[#135c4a]" />
                <h2 className="text-lg font-bold">AI生成图卡</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Style Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">图像风格</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

              {/* Size Selection */}
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

              {/* Text Generation in Image */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">在图片中生成文字</label>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex items-center justify-between w-full sm:w-[200px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="text-sm font-medium text-slate-700">中文</label>
                    <button
                      onClick={() => setIncludeChinese(!includeChinese)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        includeChinese ? "bg-[#135c4a]" : "bg-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          includeChinese ? "translate-x-4" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-[200px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="text-sm font-medium text-slate-700">英文</label>
                    <button
                      onClick={() => setIncludeEnglish(!includeEnglish)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        includeEnglish ? "bg-[#135c4a]" : "bg-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          includeEnglish ? "translate-x-4" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleStartGenerate}
                className="px-6 py-2.5 bg-[#135c4a] text-white rounded-lg text-sm font-medium hover:bg-[#0f4a3b] transition-colors flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                开始生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
