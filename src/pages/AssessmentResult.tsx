import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Printer, Download, User, Calendar, FileText, CheckCircle2, TrendingUp, AlertCircle, Quote, Edit3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface TestResult {
  type: 'pass' | 'distorted' | 'omitted' | 'substituted';
  pinyin?: string;
}

export default function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results = {}, studentId = '1', testItems = [] } = (location.state as any) || {};

  // Mock student data
  const student = {
    name: '陈泓楷',
    gender: '男',
    age: '8岁9月24天',
    birthDate: '2017-06-17',
    assessmentTime: '2026-04-10',
    assessor: '孟昊天',
    monthAge: '105.8',
    id: studentId
  };

  const motorItem = testItems.find((item: any) => item.isMotorFunction);
  const formalItems = testItems.filter((item: any) => !item.id.includes('例') && !item.isMotorFunction);

  // Mock motor scores if not provided in state
  const motorScores = (location.state as any)?.motorScores || {
    jaw_down: 3, jaw_up: 4, jaw_cont: 3,
    lip_prot: 2, lip_round: 2, lip_alt: 3, lip_close: 4,
    tongue_tip_alt: 3, tongue_alt: 2
  };
  const columnCount = 3;
  const itemsPerColumn = Math.ceil(formalItems.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    formalItems.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
  );

  const getStatusInfo = (result: TestResult | null) => {
    if (!result) return { label: '未评估', color: 'text-slate-400', bgColor: 'bg-slate-50' };
    switch (result.type) {
      case 'pass': return { label: '正确', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
      case 'distorted': return { label: '歪曲', color: 'text-amber-600', bgColor: 'bg-amber-50' };
      case 'omitted': return { label: '遗漏', color: 'text-slate-500', bgColor: 'bg-slate-100' };
      case 'substituted': return { label: result.pinyin || '替代', color: 'text-blue-600', bgColor: 'bg-blue-50' };
      default: return { label: '未评估', color: 'text-slate-400', bgColor: 'bg-slate-50' };
    }
  };

  const renderHighlightedPinyin = (pinyin: string, target: string) => {
    if (!pinyin || !target) return pinyin;
    if (['1', '2', '3', '4'].includes(target)) return <span className="text-red-500">{pinyin}</span>;

    const vowels: Record<string, string> = { 'a': '[aāáǎà]', 'e': '[eēéěè]', 'i': '[iīíǐì]', 'o': '[oōóǒò]', 'u': '[uūúǔù]', 'v': '[vüǖǘǚǜ]', 'ü': '[üǖǘǚǜ]' };
    let pattern = '';
    for (const char of target.toLowerCase()) pattern += vowels[char] || char;

    try {
      const regex = new RegExp(pattern, 'i');
      const match = pinyin.match(regex);
      if (match && match.index !== undefined) {
        const start = pinyin.slice(0, match.index);
        const highlighted = pinyin.slice(match.index, match.index + match[0].length);
        const end = pinyin.slice(match.index + match[0].length);
        return <span className="text-slate-400">{start}<span className="text-red-500">{highlighted}</span>{end}</span>;
      }
    } catch (e) { }
    return pinyin;
  };

  // Sound Contrast Data based on the uploaded image
  const contrastData = [
    {
      title: '声母音位对比', items: [
        { id: 1, label: '不送气塞音与送气塞音', score: '1 / (3对)' },
        { id: 2, label: '送气塞擦音与不送气塞擦音', score: '0 / (3对)' },
        { id: 3, label: '塞音与擦音', score: '0 / (2对)' },
        { id: 4, label: '塞擦音与擦音', score: '0 / (3对)' },
        { id: 5, label: '塞音与鼻音', score: '0 / (2对)' },
        { id: 6, label: '擦音与无擦音', score: '0 / (11对)' },
        { id: 7, label: '不同构音部位的送气塞音', score: '0 / (3对)' },
        { id: 8, label: '不同构音部位的不送气塞音', score: '1 / (3对)' },
        { id: 9, label: '舌尖前音与舌尖后音', score: '0 / (3对)' },
      ], total: '2 / (23对)'
    },
    {
      title: '韵母音位对比', items: [
        { id: 10, label: '前鼻韵母与后鼻韵母', score: '0 / (3对)' },
        { id: 11, label: '鼻韵母无鼻韵母', score: '0 / (2对)' },
        { id: 12, label: '单元音、双元音与单元音', score: '1 / (2对)' },
        { id: 13, label: '前元音与后元音', score: '1 / (1对)' },
        { id: 14, label: '高元音与低元音', score: '1 / (1对)' },
        { id: 15, label: '圆唇音与非圆唇音', score: '0 / (1对)' },
      ], total: '3 / (10对)'
    },
    {
      title: '声调音位对比', items: [
        { id: 16, label: '一声与二声', score: '0 / (1对)' },
        { id: 17, label: '一声与三声', score: '0 / (1对)' },
        { id: 18, label: '一声与四声', score: '0 / (1对)' },
      ], total: '0 / (3对)'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col font-sans pb-12">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-base font-bold text-slate-800">构音语音能力评估报告</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-xl font-bold hover:bg-[#0e4537] transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
            <Printer className="w-4 h-4" /> 打印报告
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full p-8 space-y-10">
        {/* Modern Stats Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex items-center gap-10">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.2rem] flex items-center justify-center shadow-inner shrink-0 ring-1 ring-emerald-100">
              <User className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{student.name}</h2>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">{student.gender}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-3 text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-2 whitespace-nowrap"><Calendar className="w-4 h-4 text-emerald-500/60" /> 出生日期: {student.birthDate}</div>
                <div className="flex items-center gap-2 whitespace-nowrap"><TrendingUp className="w-4 h-4 text-emerald-500/60" /> 测评年龄: {student.age}</div>
                <div className="flex items-center gap-2 whitespace-nowrap"><FileText className="w-4 h-4 text-emerald-500/60" /> 月龄: {student.monthAge}</div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-emerald-500/60" /> 评估日期: {student.assessmentTime}
                  <Edit3 className="w-3.5 h-3.5 text-emerald-500/80 hover:text-emerald-600 transition-all ml-1" />
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors whitespace-nowrap">
                  <User className="w-4 h-4 text-emerald-500/60" /> 测评人员: {student.assessor}
                  <Edit3 className="w-3.5 h-3.5 text-emerald-500/80 hover:text-emerald-600 transition-all ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Sound Contrast Analysis (音位对比分析) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-[#135c4a] rounded-full" />
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">构音清晰度表</h3>
            </div>
            <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 shadow-sm">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">合计得分</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-800">3/38</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">构音清晰度</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-800">13.51</span>
                <span className="text-xs font-bold text-emerald-800/60">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {contrastData.map((section, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col overflow-hidden">
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100">
                  <h4 className="text-base font-black text-slate-700 tracking-tight">{section.title}</h4>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-[1fr_100px] bg-slate-50/30 px-6 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">语音对序号</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">对比得分</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {section.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-[1fr_100px] px-6 py-3.5 items-center hover:bg-slate-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-300 tabular-nums w-4">{item.id}</span>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-xs font-black tabular-nums border-b-2 py-0.5",
                            item.score.startsWith('0') ? "text-slate-400 border-slate-100" : "text-[#135c4a] border-[#135c4a]/20"
                          )}>
                            {item.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto bg-[#135c4a]/5 px-8 py-4 border-t border-[#135c4a]/10 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">合计得分</span>
                  <span className="text-base font-black text-[#135c4a] tabular-nums">{section.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Detailed Assessment Grid (原有的题目详情) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-8 bg-blue-500 rounded-full" />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">构音记录表</h3>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {columns.map((columnItems, colIdx) => (
                <div key={colIdx} className={cn("flex flex-col", colIdx < 2 && "lg:border-r border-slate-100")}>
                  <div className="grid grid-cols-[60px_1fr_100px] bg-slate-50/80 px-4 py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">编号</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">词语</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">结果</span>
                  </div>

                  <div className="flex flex-col">
                    {columnItems.map((item: any) => {
                      const formalIdx = formalItems.indexOf(item);
                      const result = results[formalIdx + 2];
                      const status = getStatusInfo(result);

                      return (
                        <div key={item.id} className="grid grid-cols-[60px_1fr_100px] border-b border-slate-50 hover:bg-slate-50/80 transition-all group items-center">
                          <div className="py-4 text-center font-bold text-slate-300 tabular-nums text-xs group-hover:text-slate-500 transition-colors">{item.id}</div>
                          <div className="py-2 flex flex-col items-center">
                            <span className="text-[10px] font-bold font-mono text-slate-400 mb-0.5 whitespace-nowrap">
                              {renderHighlightedPinyin(item.pinyin, item.targetSound)}
                            </span>
                            <span className="text-base font-black text-slate-800 tracking-tight">{item.word}</span>
                          </div>
                          <div className="py-4 px-2">
                            <div className={cn(
                              "px-3 py-1.5 rounded-xl text-[11px] font-black text-center shadow-sm transition-all",
                              status.bgColor,
                              status.color
                            )}>
                              {status.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 py-6 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500 font-bold text-xs">正确</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-500 font-bold text-xs">歪曲</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-slate-500 font-bold text-xs">遗漏</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-500 font-bold text-xs">替代</span>
          </div>
        </div>

        {/* Section 3: Phonemic Contrast Record Table (音位对比记录表) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-8 bg-amber-500 rounded-full" />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">音位对比记录表</h3>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-20">序号</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-50/50 w-40">音位</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-28">语音对序号</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-32">最小音位对比</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-24">卡片编号</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-28">目标音</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-28">实发音</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-50/50 w-28">对比结果</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">错误走向</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {/*序号 1-15 完整数据结构化渲染 */}
                  {[
                    // Group 1: 塞音送气/不送气
                    {
                      id: '1', pos: '塞音送气与不送气',
                      error: '送气化：送气音替代不送气音\n替代送气*：不送气音替代送气音',
                      pairs: [
                        { id: '1双唇音', contrasts: [{ type: '送气', card: '2', target: 'p' }, { type: '不送气', card: '1', target: 'b' }] },
                        { id: '2舌尖中音', contrasts: [{ type: '送气', card: '6', target: 't' }, { type: '不送气', card: '24', target: 'd' }] },
                        { id: '3舌根音', contrasts: [{ type: '送气', card: '26', target: 'k' }, { type: '不送气', card: '25', target: 'g' }] },
                      ]
                    },
                    // Group 2: 塞擦音送气/不送气
                    {
                      id: '2', pos: '塞擦音送气与不送气',
                      error: '送气化 / 替代送气',
                      pairs: [
                        { id: '4舌面音', contrasts: [{ type: '送气', card: '13', target: 'q' }, { type: '不送气', card: '12', target: 'j' }] },
                        { id: '5舌尖后音', contrasts: [{ type: '送气', card: '16', target: 'ch' }, { type: '不送气', card: '15', target: 'zh' }] },
                        { id: '6舌尖前音', contrasts: [{ type: '送气', card: '31', target: 'c' }, { type: '不送气', card: '30', target: 'z' }] },
                      ]
                    },
                    // Group 3: 塞音与擦音
                    {
                      id: '3', pos: '塞音与擦音',
                      error: '塞音化 / 替代塞音',
                      pairs: [
                        { id: '7舌根音', contrasts: [{ type: '塞音', card: '27', target: 'k' }, { type: '擦音', card: '11', target: 'h' }] },
                        { id: '8唇音', contrasts: [{ type: '塞音', card: '22', target: 'b' }, { type: '擦音', card: '4', target: 'f' }] },
                      ]
                    },
                    // Group 4: 塞擦音与擦音
                    {
                      id: '4', pos: '塞擦音与擦音',
                      error: '塞擦音化',
                      pairs: [
                        { id: '9', contrasts: [{ type: '塞擦音', card: '12', target: 'j' }] },
                      ]
                    },
                    // Group 5: 塞音与鼻音
                    {
                      id: '5', pos: '塞音与鼻音',
                      error: '鼻音化 / 替代鼻音',
                      pairs: [
                        { id: '12双唇音', contrasts: [{ type: '塞音', card: '1', target: 'b' }, { type: '鼻音', card: '3', target: 'm' }] },
                        { id: '13舌尖中音', contrasts: [{ type: '塞音', card: '24', target: 'd' }, { type: '鼻音', card: '7', target: 'n' }] },
                      ]
                    },
                    // Group 6: 擦音与无擦音
                    {
                      id: '6', pos: '擦音与无擦音',
                      error: '声母/h/遗漏*',
                      pairs: [
                        { id: '14舌根音', contrasts: [{ type: '擦音', card: '11', target: 'h' }, { type: '无插音', card: '39', target: '无插音' }] },
                      ]
                    },
                    // Group 7: 不同部位送气塞音
                    {
                      id: '7', pos: '不同部位送气塞音',
                      error: '前进化 / 退后化',
                      pairs: [
                        { id: '15', contrasts: [{ type: '双唇音', card: '23', target: 'p' }, { type: '舌尖中音', card: '6', target: 't' }] },
                        { id: '16', contrasts: [{ type: '双唇音', card: '23', target: 'p' }, { type: '舌根音', card: '10', target: 'k' }] },
                        { id: '17', contrasts: [{ type: '舌尖中音', card: '6', target: 't' }, { type: '舌根音', card: '10', target: 'k' }] },
                      ]
                    },
                    // Group 8: 不同部位不送气塞音
                    {
                      id: '8', pos: '不同部位不送气塞音',
                      error: '前进化 / 退后化',
                      pairs: [
                        { id: '18', contrasts: [{ type: '双唇音', card: '1', target: 'b' }, { type: '舌尖中音', card: '5', target: 'd' }] },
                        { id: '19', contrasts: [{ type: '双唇音', card: '1', target: 'b' }, { type: '舌根音', card: '9', target: 'g' }] },
                        { id: '20', contrasts: [{ type: '舌尖中音', card: '5', target: 'd' }, { type: '舌根音', card: '9', target: 'g' }] },
                      ]
                    },
                    // Group 9: 不同部位不送气塞擦音
                    {
                      id: '9', pos: '不同部位不送气塞擦音',
                      error: '卷舌化 / 替代卷舌*',
                      pairs: [
                        { id: '21舌尖后音', contrasts: [{ type: '舌尖后音', card: '28', target: 'zh' }] },
                      ]
                    },
                    // Group 10: 前/后鼻韵母
                    {
                      id: '10', pos: '前鼻韵母与后鼻韵母',
                      error: '鼻韵母前进/退后化',
                      pairs: [
                        { id: '24开口呼', contrasts: [{ type: '前鼻韵母', card: '32', target: 'an' }, { type: '后鼻韵母', card: '33', target: 'ang' }] },
                        { id: '25齐齿呼', contrasts: [{ type: '前鼻韵母', card: '34', target: 'in' }, { type: '后鼻韵母', card: '35', target: 'ing' }] },
                        { id: '26合口呼', contrasts: [{ type: '前鼻韵母', card: '36', target: 'uan' }, { type: '后鼻韵母', card: '37', target: 'uang' }] },
                      ]
                    },
                    // Group 11: 鼻韵母与无鼻韵母
                    {
                      id: '11', pos: '鼻韵母与无鼻韵母',
                      error: '鼻韵母遗漏*',
                      pairs: [
                        { id: '27', contrasts: [{ type: '前鼻韵母', card: '34', target: 'in' }, { type: '无鼻韵母', card: '14', target: 'i' }] },
                        { id: '28', contrasts: [{ type: '后鼻韵母', card: '35', target: 'ing' }, { type: '无鼻韵母', card: '14', target: 'i' }] },
                      ]
                    },
                    // Group 12: 元音类型
                    {
                      id: '12', pos: '三元音、双元音与单元音',
                      error: '元音/鼻韵母遗漏',
                      pairs: [
                        { id: '29', contrasts: [{ type: '三元音', card: '42', target: 'iao' }, { type: '双元音', card: '41', target: 'ia' }] },
                        { id: '30', contrasts: [{ type: '双元音', card: '41', target: 'ia' }, { type: '单元音', card: '12', target: 'i' }] },
                      ]
                    },
                    // Group 13: 前/后元音
                    {
                      id: '13', pos: '前元音与后元音对比',
                      error: '后元音前进 / 前元音退后',
                      pairs: [
                        { id: '31', contrasts: [{ type: '前元音', card: '40', target: 'i' }, { type: '后元音', card: '43', target: 'u' }] },
                      ]
                    },
                    // Group 14: 高/低元音
                    {
                      id: '14', pos: '高元音与低元音对比',
                      error: '低元音升高 / 高元音下降',
                      pairs: [
                        { id: '32', contrasts: [{ type: '高元音', card: '46', target: 'i' }, { type: '低元音', card: '38', target: 'a' }] },
                      ]
                    },
                    // Group 15: 圆唇/非圆唇
                    {
                      id: '15', pos: '圆唇音与非圆唇音对比',
                      error: '圆唇化 / 替代圆唇',
                      pairs: [
                        { id: '33', contrasts: [{ type: '圆唇音', card: '44', target: 'yu' }, { type: '非圆唇音', card: '45', target: 'yi' }] },
                      ]
                    },
                    // Group 16: 一声与二声
                    {
                      id: '16', pos: '一声与二声',
                      error: '•二声化：二声替代一声\n•替代二声*：一声替代二声',
                      pairs: [
                        { id: '34', contrasts: [{ type: '一声', card: '47', target: '1' }, { type: '二声', card: '48', target: '2' }] },
                      ]
                    },
                    // Group 17: 一声与三声
                    {
                      id: '17', pos: '一声与三声',
                      error: '•三声化：三声替代一声\n•替代三声*：一声替代三声',
                      pairs: [
                        { id: '35', contrasts: [{ type: '一声', card: '47', target: '1' }, { type: '三声', card: '49', target: '3' }] },
                      ]
                    },
                    // Group 18: 一声与四声
                    {
                      id: '18', pos: '一声与四声',
                      error: '•四声化：四声替代一声\n•替代四声*：一声替代四声',
                      pairs: [
                        { id: '36', contrasts: [{ type: '一声', card: '47', target: '1' }, { type: '四声', card: '50', target: '4' }] },
                      ]
                    },
                  ].map((group) => {
                    const groupRows = group.pairs.reduce((sum, p) => sum + p.contrasts.length, 0);
                    return group.pairs.map((pair, pIdx) => (
                      pair.contrasts.map((contrast, cIdx) => (
                        <tr key={`${group.id}-${pIdx}-${cIdx}`} className="group hover:bg-slate-50/30 transition-colors">
                          {pIdx === 0 && cIdx === 0 && (
                            <>
                              <td rowSpan={groupRows} className="px-6 py-4 text-center font-bold text-slate-300 border-r border-slate-100/50">{group.id}</td>
                              <td rowSpan={groupRows} className="px-6 py-4 font-bold text-slate-800 border-r border-slate-100/50 whitespace-pre-line">{group.pos}</td>
                            </>
                          )}
                          {cIdx === 0 && (
                            <td rowSpan={pair.contrasts.length} className="px-6 py-4 text-center font-bold border-r border-slate-100/50">{pair.id}</td>
                          )}
                          <td className="px-6 py-4 text-center border-r border-slate-100/50">{contrast.type}</td>
                          <td className="px-6 py-4 text-center tabular-nums border-r border-slate-100/50">{contrast.card}</td>
                          <td className="px-6 py-4 text-center text-lg font-black text-red-500 border-r border-slate-100/50 tabular-nums">{contrast.target}</td>
                          <td className="px-6 py-4 border-r border-slate-100/50"><div className="h-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 shadow-inner" /></td>
                          <td className="px-6 py-4 border-r border-slate-100/50"><div className="h-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 shadow-inner" /></td>
                          {pIdx === 0 && cIdx === 0 && (
                            <td rowSpan={groupRows} className="px-6 py-4 text-[10px] font-medium leading-relaxed text-slate-400 whitespace-pre-line group-hover:text-slate-500 transition-colors">
                              {group.error}
                            </td>
                          )}
                        </tr>
                      ))
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Articulation Motor Function Subjective Assessment (构音运动功能主观评估表) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">构音运动功能主观评估表</h3>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Jaw Category */}
              <div className="flex flex-col">
                <div className="bg-emerald-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">下颌构音运动功能</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm border border-emerald-100">
                    得分: {motorScores.jaw_down + motorScores.jaw_up + motorScores.jaw_cont} / 12
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { key: 'jaw_down', label: '向下运动' },
                    { key: 'jaw_up', label: '向上运动' },
                    { key: 'jaw_cont', label: '上下连续运动' }
                  ].map(item => (
                    <div key={item.key} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <span className="text-xs font-bold text-slate-500">{item.label}</span>
                      <div className="flex gap-1.5 text-slate-300">
                        {[0, 1, 2, 3, 4].map(score => (
                          <div 
                            key={score} 
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                              motorScores[item.key] === score 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-110" 
                                : "bg-slate-50 text-slate-300 border border-slate-100"
                            )}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lip Category */}
              <div className="flex flex-col">
                <div className="bg-blue-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">唇构音运动功能</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
                    得分: {motorScores.lip_prot + motorScores.lip_round + motorScores.lip_alt + motorScores.lip_close} / 16
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { key: 'lip_prot', label: '展唇运动' },
                    { key: 'lip_round', label: '圆唇运动' },
                    { key: 'lip_alt', label: '圆展交替运动' },
                    { key: 'lip_close', label: '唇闭合运动' }
                  ].map(item => (
                    <div key={item.key} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <span className="text-xs font-bold text-slate-500">{item.label}</span>
                      <div className="flex gap-1.5 text-slate-300">
                        {[0, 1, 2, 3, 4].map(score => (
                          <div 
                            key={score} 
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                              motorScores[item.key] === score 
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/10 scale-110" 
                                : "bg-slate-50 text-slate-300 border border-slate-100"
                            )}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tongue Category */}
              <div className="flex flex-col">
                <div className="bg-amber-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">舌构音运动功能</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 bg-white px-3 py-1 rounded-full shadow-sm border border-amber-100">
                    得分: {motorScores.tongue_tip_alt + motorScores.tongue_alt} / 8
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { key: 'tongue_tip_alt', label: '舌尖前后交替' },
                    { key: 'tongue_alt', label: '舌尖上下交替' }
                  ].map(item => (
                    <div key={item.key} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <span className="text-xs font-bold text-slate-500">{item.label}</span>
                      <div className="flex gap-1.5 text-slate-300">
                        {[0, 1, 2, 3, 4].map(score => (
                          <div 
                            key={score} 
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                              motorScores[item.key] === score 
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/10 scale-110" 
                                : "bg-slate-50 text-slate-300 border border-slate-100"
                            )}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-slate-400 font-bold text-sm tracking-tight">本评估报告仅供参考，不代表临床医学诊断结果。如有疑问，请咨询专业医师或相关医疗机构进行进一步诊断。</p>
          <div className="w-16 h-1.5 bg-slate-100 rounded-full" />
        </div>
      </main>
    </div>
  );
}
