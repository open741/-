import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Mic, RotateCcw, CheckCircle2, XCircle, Grid, X, Play, User, Search } from 'lucide-react';
import { cn, generatePlaceholder } from '../lib/utils';

export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isArticulationTest = id === '6'; // Assuming ID 6 is Arcitulation Test

  // Assessment State
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState<Record<number, { type: 'pass' | 'distorted' | 'omitted' | 'substituted'; pinyin?: string } | null>>({});
  const [isItemSelectionOpen, setIsItemSelectionOpen] = useState(false);
  const [isSubstitutionModalOpen, setIsSubstitutionModalOpen] = useState(false);
  const [substitutionPinyin, setSubstitutionPinyin] = useState('');
  const [recordingStatuses, setRecordingStatuses] = useState<Record<number, 'idle' | 'recording' | 'completed'>>({});

  // Student Info Mockup
  const students = [
    { id: '1', name: '张小凡', age: '5岁2个月', gender: '男' },
    { id: '2', name: '李萌萌', age: '4岁8个月', gender: '女' },
    { id: '3', name: '王皮皮', age: '6岁0个月', gender: '男' },
  ];
  const [selectedStudentId, setSelectedStudentId] = useState('1');
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.includes(studentSearchQuery) || s.id.includes(studentSearchQuery)
  );

  const testItems = [
    { id: '例1', word: '桌', pinyin: 'zhuō', targetSound: 'zh', image: generatePlaceholder('Artic_S1', '桌'), question: '这是什么？', prompt: '老师指向桌子问：“这是什么？”' },
    { id: '例2', word: '象', pinyin: 'xiàng', targetSound: 'iang', image: generatePlaceholder('Artic_S2', '象'), question: '这是什么？', prompt: '什么动物的鼻子是长长的？' },
    { id: '1', word: '包', pinyin: 'bāo', targetSound: 'b', image: generatePlaceholder('Artic_1', '包'), question: '这是什么？', prompt: '小朋友背什么上学？' },
    { id: '2', word: '抛', pinyin: 'pāo', targetSound: 'p', image: generatePlaceholder('Artic_2', '抛'), question: '他在做什么？', prompt: '他把球怎么样？' },
    { id: '3', word: '猫', pinyin: 'māo', targetSound: 'm', image: generatePlaceholder('Artic_3', '猫'), question: '这是什么？', prompt: '什么“喵喵”叫？' },
    { id: '4', word: '飞', pinyin: 'fēi', targetSound: 'f', image: generatePlaceholder('Artic_4', '飞'), question: '它做什么？', prompt: '蝴蝶做什么？' },
    { id: '5', word: '刀', pinyin: 'dāo', targetSound: 'd', image: generatePlaceholder('Artic_5', '刀'), question: '这是什么？', prompt: '拿什么切东西？' },
    { id: '6', word: '套', pinyin: 'tào', targetSound: 't', image: generatePlaceholder('Artic_6', '套'), question: '这是什么？', prompt: '天冷了，手戴什么？' },
    { id: '7', word: '闹', pinyin: 'nào', targetSound: 'n', image: generatePlaceholder('Artic_7', '闹'), question: '这是什么钟？', prompt: '什么钟叫你起床？' },
    { id: '8', word: '鹿', pinyin: 'lù', targetSound: 'l', image: generatePlaceholder('Artic_8', '鹿'), question: '这是什么？', prompt: '这是梅花____。' },
    { id: '9', word: '高', pinyin: 'gāo', targetSound: 'g', image: generatePlaceholder('Artic_9', '高'), question: '哥哥的个子比妹妹怎么样？', prompt: '妹妹个子矮，哥哥比妹妹____。' },
    { id: '10', word: '铐', pinyin: 'kào', targetSound: 'k', image: generatePlaceholder('Artic_10', '铐'), question: '这是什么？', prompt: '他的手被警察怎么了？这是手____。' },
    { id: '11', word: '河', pinyin: 'hé', targetSound: 'h', image: generatePlaceholder('Artic_11', '河'), question: '这是什么？', prompt: '这是一条小____。' },
    { id: '12', word: '鸡', pinyin: 'jī', targetSound: 'j', image: generatePlaceholder('Artic_12', '鸡'), question: '这是什么？', prompt: '什么动物会“喔喔”叫？' },
    { id: '13', word: '七', pinyin: 'qī', targetSound: 'q', image: generatePlaceholder('Artic_13', '七'), question: '这是几？', prompt: '图上有几个苹果？' },
    { id: '14', word: '吸', pinyin: 'xī', targetSound: 'x', image: generatePlaceholder('Artic_14', '吸'), question: '这是什么？', prompt: '小朋友用什么喝牛奶？' },
    { id: '15', word: '猪', pinyin: 'zhū', targetSound: 'zh', image: generatePlaceholder('Artic_15', '猪'), question: '这是什么？', prompt: '什么动物的耳朵很大？' },
    { id: '16', word: '出', pinyin: 'chū', targetSound: 'ch', image: generatePlaceholder('Artic_16', '出'), question: '她在做什么？', prompt: '她不是进去，是____去。' },
    { id: '17', word: '书', pinyin: 'shū', targetSound: 'sh', image: generatePlaceholder('Artic_17', '书'), question: '这是什么？', prompt: '小朋友看什么？' },
    { id: '18', word: '肉', pinyin: 'ròu', targetSound: 'r', image: generatePlaceholder('Artic_18', '肉'), question: '这是什么？', prompt: '老虎爱吃什么？' },
    { id: '19', word: '紫', pinyin: 'zǐ', targetSound: 'z', image: generatePlaceholder('Artic_19', '紫'), question: '这是什么颜色？', prompt: '球是什么颜色的？' },
    { id: '20', word: '粗', pinyin: 'cū', targetSound: 'c', image: generatePlaceholder('Artic_20', '粗'), question: '这根黄瓜怎么样？', prompt: '那根黄瓜细，这根怎么样？' },
    { id: '21', word: '四', pinyin: 'sì', targetSound: 's', image: generatePlaceholder('Artic_21', '四'), question: '这是几？', prompt: '图上有几个苹果？' },
    { id: '22', word: '杯', pinyin: 'bēi', targetSound: 'b', image: generatePlaceholder('Artic_22', '杯'), question: '这是什么？', prompt: '用什么喝水？' },
    { id: '23', word: '泡', pinyin: 'pào', targetSound: 'p', image: generatePlaceholder('Artic_23', '泡'), question: '这是什么？', prompt: '小朋友吹什么？' },
    { id: '24', word: '倒', pinyin: 'dào', targetSound: 'd', image: generatePlaceholder('Artic_24', '倒'), question: '做什么？', prompt: '怎样让开水进杯子？' },
    { id: '25', word: '菇', pinyin: 'gū', targetSound: 'g', image: generatePlaceholder('Artic_25', '菇'), question: '这是什么？', prompt: '这是蘑____。' },
    { id: '26', word: '哭', pinyin: 'kū', targetSound: 'k', image: generatePlaceholder('Artic_26', '哭'), question: '小朋友怎么了？', prompt: '找不到妈妈，他会怎么样？' },
    { id: '27', word: '壳', pinyin: 'ké', targetSound: 'k', image: generatePlaceholder('Artic_27', '壳'), question: '这是什么？', prompt: '这是贝____。' },
    { id: '28', word: '纸', pinyin: 'zhǐ', targetSound: 'zh', image: generatePlaceholder('Artic_28', '纸'), question: '这是什么？', prompt: '老师在哪里写字？' },
    { id: '29', word: '室', pinyin: 'shì', targetSound: 'sh', image: generatePlaceholder('Artic_29', '室'), question: '这是什么？', prompt: '老师在哪里上课？' },
    { id: '30', word: '字', pinyin: 'zì', targetSound: 'z', image: generatePlaceholder('Artic_30', '字'), question: '他在写什么？', prompt: '老师拿笔写什么？' },
    { id: '31', word: '刺', pinyin: 'cì', targetSound: 'c', image: generatePlaceholder('Artic_31', '刺'), question: '花上有什么？', prompt: '____碰在手上会流血。' },
    { id: '32', word: '蓝', pinyin: 'lán', targetSound: 'an', image: generatePlaceholder('Artic_32', '蓝'), question: '这是什么颜色？', prompt: '天空是什么颜色的？' },
    { id: '33', word: '狼', pinyin: 'láng', targetSound: 'ang', image: generatePlaceholder('Artic_33', '狼'), question: '这是什么？', prompt: '什么动物长得像狗？' },
    { id: '34', word: '心', pinyin: 'xīn', targetSound: 'in', image: generatePlaceholder('Artic_34', '心'), question: '这是什么？', prompt: '这是什么形状？' },
    { id: '35', word: '星', pinyin: 'xīng', targetSound: 'ing', image: generatePlaceholder('Artic_35', '星'), question: '这是什么？', prompt: '夜晚天上什么会一闪一闪的？' },
    { id: '36', word: '船', pinyin: 'chuán', targetSound: 'uan', image: generatePlaceholder('Artic_36', '船'), question: '这是什么？', prompt: '可以乘坐什么过海？什么在海上航行？' },
    { id: '37', word: '床', pinyin: 'chuáng', targetSound: 'uang', image: generatePlaceholder('Artic_37', '床'), question: '这是什么？', prompt: '你晚上睡在什么上面？' },
    { id: '38', word: '拔', pinyin: 'bá', targetSound: 'a', image: generatePlaceholder('Artic_38', '拔'), question: '做什么？', prompt: '怎样让萝卜出来？' },
    { id: '39', word: '鹅', pinyin: 'é', targetSound: 'e', image: generatePlaceholder('Artic_39', '鹅'), question: '这是什么？', prompt: '这不是鸭子，这是____？' },
    { id: '40', word: '一', pinyin: 'yī', targetSound: 'i', image: generatePlaceholder('Artic_40', '一'), question: '这是几？', prompt: '图上有几个苹果？' },
    { id: '41', word: '家', pinyin: 'jiā', targetSound: 'ia', image: generatePlaceholder('Artic_41', '家'), question: '这是哪里？', prompt: '你放学后回哪里？' },
    { id: '42', word: '浇', pinyin: 'jiāo', targetSound: 'iao', image: generatePlaceholder('Artic_42', '浇'), question: '做什么？', prompt: '阿姨拿水壶做什么？' },
    { id: '43', word: '乌', pinyin: 'wū', targetSound: 'u', image: generatePlaceholder('Artic_43', '乌'), question: '这是什么云？', prompt: '快下雨了，天上飘什么云？' },
    { id: '44', word: '雨', pinyin: 'yǔ', targetSound: 'ü', image: generatePlaceholder('Artic_44', '雨'), question: '天上在下什么？', prompt: '小朋友身上穿的是什么衣服？' },
    { id: '45', word: '椅', pinyin: 'yǐ', targetSound: 'i', image: generatePlaceholder('Artic_45', '椅'), question: '这是什么？', prompt: '老师指向旁边椅子问：“这是什么？”' },
    { id: '46', word: '鼻', pinyin: 'bí', targetSound: 'i', image: generatePlaceholder('Artic_46', '鼻'), question: '这是什么？', prompt: '老师指自己的鼻子问：“这是什么？”' },
    { id: '47', word: '蛙', pinyin: 'wā', targetSound: '1', image: generatePlaceholder('Artic_47', '蛙'), question: '这是什么？', prompt: '它是青____。' },
    { id: '48', word: '娃', pinyin: 'wá', targetSound: '2', image: generatePlaceholder('Artic_48', '娃'), question: '这是什么？', prompt: '你喜欢抱什么？' },
    { id: '49', word: '瓦', pinyin: 'wǎ', targetSound: '3', image: generatePlaceholder('Artic_49', '瓦'), question: '这是什么？', prompt: '屋顶上有什么？' },
    { id: '50', word: '袜', pinyin: 'wà', targetSound: '4', image: generatePlaceholder('Artic_50', '袜'), question: '这是什么？', prompt: '指着小朋友的袜子问：“这是什么？”' }
  ];

  const currentItem = testItems[currentStep] || testItems[0];

  const handleResult = (type: 'pass' | 'distorted' | 'omitted' | 'substituted') => {
    const result = { type, pinyin: type === 'substituted' ? substitutionPinyin : undefined };
    setTestResults(prev => ({ ...prev, [currentStep]: result }));
    setSubstitutionPinyin('');
  };

  // Standard generic form for other IDs
  if (!isArticulationTest) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">新建评估表</h1>
          <p className="text-slate-500 mb-8">正在为评估表 ID: {id} 创建新的评估记录</p>

          <div className="h-64 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
            评估表单内容区域
          </div>
        </div>
      </div>
    );
  }

  // Modern Articulation Assessment View
  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-slate-800 leading-tight">构音语音能力评估</h1>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Student Info Area */}
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 relative">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <span className="text-sm font-black text-slate-700 group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                    {selectedStudent?.name} ({selectedStudent?.gender})
                  </span>
                  <ChevronLeft className={cn("w-3 h-3 text-slate-400 transition-transform duration-300", isStudentDropdownOpen ? "-rotate-90" : "rotate-0")} />
                </button>
                {isStudentDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsStudentDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="搜索学生姓名..."
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {filteredStudents.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedStudentId(s.id);
                              setIsStudentDropdownOpen(false);
                              setStudentSearchQuery('');
                              setCurrentStep(0);
                              setTestResults({});
                              setRecordingStatuses({});
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-all",
                              selectedStudentId === s.id ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-100"
                            )}
                          >
                            <span>{s.name}</span>
                            <span className={cn("text-[10px]", selectedStudentId === s.id ? "text-white/70" : "text-slate-400")}>{s.gender} · {s.age}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-0.5">年龄</span>
              <span className="text-xs font-black text-slate-600 tabular-nums whitespace-nowrap">{selectedStudent?.age}</span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Assessment Progress */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">进度</span>
              <span className="text-xs font-black text-[#135c4a] tabular-nums leading-none">{currentStep + 1} / {testItems.length}</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-[#135c4a] transition-all duration-500" style={{ width: `${((currentStep + 1) / testItems.length) * 100}%` }} />
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <button
            onClick={() => setIsItemSelectionOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
          >
            <Grid className="w-4 h-4" />
            全部题目
          </button>
        </div>

        <button 
          onClick={() => navigate('/assessment-result', { state: { results: testResults, studentId: selectedStudentId, testItems } })}
          className="px-5 py-2 bg-[#135c4a] text-white rounded-xl text-sm font-bold hover:bg-[#0e4537] transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          完成评估
        </button>
      </div>

      {/* Item Selection Modal */}
      {isItemSelectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">题目跳转</h3>
                <p className="text-sm text-slate-400 mt-1">点击序号即可直接跳转到对应题目位置</p>
              </div>
              <button
                onClick={() => setIsItemSelectionOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {testItems.map((item, index) => {
                  const result = testResults[index];
                  const isActive = currentStep === index;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentStep(index);
                        setIsItemSelectionOpen(false);
                      }}
                      className={cn(
                        "aspect-square rounded-xl text-sm font-black transition-all relative flex flex-col items-center justify-center border-2 gap-0.5 shadow-sm",
                        isActive ? "ring-2 ring-slate-900 ring-offset-2 scale-105 z-10" : "hover:scale-105 active:scale-95",

                        // Pass Status
                        result?.type === 'pass' && "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20",

                        // Distorted Status
                        result?.type === 'distorted' && "bg-amber-500 border-amber-500 text-white shadow-amber-500/20",

                        // Omitted Status
                        result?.type === 'omitted' && "bg-slate-400 border-slate-400 text-white shadow-slate-400/20",

                        // Substituted Status
                        result?.type === 'substituted' && "bg-blue-500 border-blue-500 text-white shadow-blue-500/20",

                        // Unrated Status
                        !result && "bg-white border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500"
                      )}
                    >
                      <span>{item.id}</span>
                      {result && (
                        <span className="text-[10px] opacity-90 leading-none">
                          {result.type === 'pass' && '√'}
                          {result.type === 'distorted' && '⊗'}
                          {result.type === 'omitted' && '⊝'}
                          {result.type === 'substituted' && (result.pinyin || 'A')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">√</div>
                <span className="text-xs font-black text-slate-500">正确</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold">⊗</div>
                <span className="text-xs font-black text-slate-500">歪曲</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold">⊝</div>
                <span className="text-xs font-black text-slate-500">遗漏</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                <span className="text-xs font-black text-slate-500">替代</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-slate-200" />
                <span className="text-xs font-black text-slate-500">待评定</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Substitution Pinyin Modal */}
      {isSubstitutionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-blue-500">A</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">输入替代拼音</h3>
              <p className="text-slate-400 mt-2">请记录受试者实际发声的拼音</p>
            </div>

            <div className="mt-10">
              <input
                type="text"
                autoFocus
                value={substitutionPinyin}
                onChange={(e) => setSubstitutionPinyin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && substitutionPinyin.trim()) {
                    handleResult('substituted');
                    setIsSubstitutionModalOpen(false);
                  }
                }}
                placeholder="在此输入实际发音的拼音..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-mono text-center focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsSubstitutionModalOpen(false);
                  setSubstitutionPinyin('');
                }}
                className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (substitutionPinyin.trim()) {
                    handleResult('substituted');
                    setIsSubstitutionModalOpen(false);
                  }
                }}
                disabled={!substitutionPinyin.trim()}
                className="py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
              >
                确定提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <main className="flex-1 p-6 lg:p-8 flex flex-col max-w-[1600px] mx-auto w-full gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

          {/* Left Column: Visuals & Stimulus */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white flex-1 flex flex-col relative group overflow-hidden">
              {/* Item ID Tag - More prominent in corner */}
              <div className="absolute top-0 left-0 bg-[#135c4a] text-white px-6 py-2 rounded-br-2xl text-xs font-black tracking-widest shadow-lg z-10">
                {currentItem.id.includes('例') ? `例题 ${currentItem.id.replace('例', '')}` : `第 ${currentItem.id} 题`}
              </div>

              {/* Navigation Buttons - Integrated into Card */}
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-24 bg-slate-50/50 hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 rounded-2xl flex items-center justify-center transition-all disabled:opacity-0 z-10 group/nav"
                title="上一题"
              >
                <ChevronLeft className="w-8 h-8 group-hover/nav:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentStep(prev => Math.min(testItems.length - 1, prev + 1))}
                disabled={currentStep === testItems.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-24 bg-slate-50/50 hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 rounded-2xl flex items-center justify-center transition-all disabled:opacity-0 z-10 group/nav"
                title="下一题"
              >
                <ChevronRight className="w-8 h-8 group-hover/nav:translate-x-1 transition-transform" />
              </button>

              <div className="flex-1 flex flex-col md:flex-row gap-10 items-center px-8">
                {/* Image Section */}
                <div className="w-full md:w-1/2 aspect-square relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-6 transition-transform duration-700 group-hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <img src={currentItem.image} alt={currentItem.word} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </div>

                {/* Text & Guidance Section */}
                <div className="flex-1 flex flex-col justify-center gap-8 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-4">
                      <h2 className="text-7xl font-black text-slate-900 tracking-tighter">{currentItem.word}</h2>
                      <span className="text-3xl font-bold text-red-500/80 font-mono italic">{currentItem.pinyin}</span>
                    </div>
                    <div className="h-1.5 w-24 bg-emerald-500 rounded-full mt-2" />
                  </div>

                  {/* Question & Prompt */}
                  <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1 w-10 h-10 bg-emerald-500 text-white rounded-xl flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-xs font-black">提问</span>
                      </div>
                      <p className="text-slate-700 text-xl font-bold leading-tight pt-1">{currentItem.question}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1 w-10 h-10 bg-amber-500 text-white rounded-xl flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
                        <span className="text-xs font-black">提示</span>
                      </div>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed italic pt-1">{currentItem.prompt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: Pronunciation */}
              <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2">
                <button className="w-20 h-20 bg-gradient-to-br from-[#135c4a] to-[#0d4537] text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-[#135c4a]/40 hover:scale-110 active:scale-90 transition-all ring-4 ring-white">
                  <Volume2 className="w-10 h-10" />
                </button>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">发音指导</span>
              </div>
            </div>
          </div>

          {/* Right Column: Decisions & AI */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Scoring Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white flex flex-col gap-6 flex-1">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">发音评定</h4>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {[
                  { type: 'pass', label: '正确', symbol: '√', color: 'emerald' },
                  { type: 'distorted', label: '歪曲', symbol: '⊗', color: 'amber' },
                  { type: 'omitted', label: '遗漏', symbol: '⊝', color: 'slate' },
                  { type: 'substituted', label: '替代', icon: 'A', color: 'blue' }
                ].map((score) => (
                  <button
                    key={score.type}
                    onClick={() => score.type === 'substituted' ? setIsSubstitutionModalOpen(true) : handleResult(score.type as any)}
                    className={cn(
                      "group flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] border-2 transition-all active:scale-95",
                      testResults[currentStep]?.type === score.type
                        ? `bg-${score.color}-50 border-${score.color}-500`
                        : "bg-slate-50 border-transparent hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all font-black text-2xl",
                      testResults[currentStep]?.type === score.type
                        ? `bg-${score.color}-500 text-white shadow-lg`
                        : "bg-white text-slate-300 border border-slate-200 group-hover:scale-110"
                    )}>
                      {score.type === 'substituted' ? (testResults[currentStep]?.pinyin || 'A') : score.symbol}
                    </div>
                    <span className={cn(
                      "text-sm font-black",
                      testResults[currentStep]?.type === score.type ? `text-${score.color}-700` : "text-slate-400"
                    )}>{score.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recognition Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col gap-6 flex-1">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                    recordingStatuses[currentStep] === 'recording' ? "bg-red-500 shadow-xl" : "bg-white/10"
                  )}>
                    <Mic className={cn("w-6 h-6", recordingStatuses[currentStep] === 'recording' ? "text-white" : "text-emerald-400")} />
                  </div>
                  <span className="font-black text-sm tracking-widest uppercase">AI 语音识别</span>
                </div>
                {recordingStatuses[currentStep] === 'recording' && (
                  <div className="animate-pulse flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full ring-1 ring-red-500/30">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">LIVE</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center flex-1 min-h-[100px]">
                {recordingStatuses[currentStep] === 'recording' ? (
                  <div className="flex items-end gap-1.5 h-10">
                    {[0.2, 0.5, 0.8, 1, 0.7, 0.4, 0.9, 0.6, 0.3].map((v, i) => (
                      <div key={i} className="w-1.5 bg-emerald-400 rounded-full animate-wave" style={{ height: `${v * 100}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                ) : recordingStatuses[currentStep] === 'completed' ? (
                  <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">识别完成</span>
                      <div className="w-px h-3 bg-white/10" />
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-all group active:scale-90"
                        title="播放录音"
                      >
                        <Play className="w-3 h-3 text-white fill-current group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-white/80">播放录音</span>
                      </button>
                    </div>
                  </div>
                ) : <p className="text-xs text-white/40 italic font-medium">使用 AI 语音识别自动评定结果</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 shrink-0">
                {(!recordingStatuses[currentStep] || recordingStatuses[currentStep] === 'idle') && (
                  <button
                    onClick={() => setRecordingStatuses(prev => ({ ...prev, [currentStep]: 'recording' }))}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl transition-all font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 active:scale-95"
                  >
                    开始 AI 识别
                  </button>
                )}

                {recordingStatuses[currentStep] === 'recording' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setRecordingStatuses(prev => ({ ...prev, [currentStep]: 'completed' }));
                        if (!testResults[currentStep]) {
                          const randomResult = Math.random() > 0.3 ? 'pass' : 'distorted';
                          setTestResults(prev => ({ ...prev, [currentStep]: { type: randomResult } }));
                        }
                      }}
                      className="flex-1 py-4 bg-white text-slate-900 rounded-2xl transition-all font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-95"
                    >
                      完成录音
                    </button>
                    <button
                      onClick={() => {
                        const hasPrevResult = testResults[currentStep] !== undefined && testResults[currentStep] !== null;
                        setRecordingStatuses(prev => ({ ...prev, [currentStep]: hasPrevResult ? 'completed' : 'idle' }));
                      }}
                      className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all font-black text-sm active:scale-95"
                    >
                      取消
                    </button>
                  </div>
                )}

                {recordingStatuses[currentStep] === 'completed' && (
                  <button
                    onClick={() => setRecordingStatuses(prev => ({ ...prev, [currentStep]: 'recording' }))}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all font-black text-sm flex items-center justify-center gap-3 border border-white/5 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" /> 重新录制识别
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes wave { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.5); } }
        .animate-wave { animation: wave 1s ease-in-out infinite; transform-origin: bottom; }
      `}</style>
    </div>
  );
}
