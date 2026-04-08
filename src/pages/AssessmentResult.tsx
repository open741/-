import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Printer, Download, User, Calendar, FileText, CheckCircle2, TrendingUp, AlertCircle, Quote } from 'lucide-react';
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
    name: '张小凡',
    gender: '男',
    age: '5岁2个月',
    id: studentId
  };

  const formalItems = testItems.filter((item: any) => !item.id.includes('例'));
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

  // Sound Contrast Data based on the uploaded image
  const contrastData = [
    { title: '声母音位对比', items: [
      { id: 1, label: '不送气塞音与送气塞音', score: '1 / (3对)' },
      { id: 2, label: '送气塞擦音与不送气塞擦音', score: '0 / (3对)' },
      { id: 3, label: '塞音与擦音', score: '0 / (2对)' },
      { id: 4, label: '塞擦音与擦音', score: '0 / (3对)' },
      { id: 5, label: '塞音与鼻音', score: '0 / (2对)' },
      { id: 6, label: '擦音与无擦音', score: '0 / (11对)' },
      { id: 7, label: '不同构音部位的送气塞音', score: '0 / (3对)' },
      { id: 8, label: '不同构音部位的不送气塞音', score: '1 / (3对)' },
      { id: 9, label: '舌尖前音与舌尖后音', score: '0 / (3对)' },
    ], total: '2 / (23对)' },
    { title: '韵母音位对比', items: [
      { id: 10, label: '前鼻韵母与后鼻韵母', score: '0 / (3对)' },
      { id: 11, label: '鼻韵母无鼻韵母', score: '0 / (2对)' },
      { id: 12, label: '单元音、双元音与单元音', score: '1 / (2对)' },
      { id: 13, label: '前元音与后元音', score: '1 / (1对)' },
      { id: 14, label: '高元音与低元音', score: '1 / (1对)' },
      { id: 15, label: '圆唇音与非圆唇音', score: '0 / (1对)' },
    ], total: '3 / (10对)' },
    { title: '声调音位对比', items: [
      { id: 16, label: '一声与二声', score: '0 / (1对)' },
      { id: 17, label: '一声与三声', score: '0 / (1对)' },
      { id: 18, label: '一声与四声', score: '0 / (1对)' },
    ], total: '0 / (3对)' }
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
          <h1 className="text-base font-bold text-slate-800">评估结果报告</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Download className="w-4 h-4" /> 导出 PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-xl font-bold hover:bg-[#0e4537] transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
            <Printer className="w-4 h-4" /> 打印报告
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full p-8 space-y-10">
        {/* Modern Stats Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-white flex items-center gap-8">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-inner shrink-0 ring-1 ring-emerald-100">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-800">{student.name}</h2>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-wider">{student.gender}</span>
              </div>
              <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500/60" /> {student.age}</span>
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-500/60" /> 学号: {student.id}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#135c4a] rounded-[2.5rem] p-8 shadow-xl shadow-emerald-900/20 flex flex-col justify-center text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 transition-transform duration-700">
              <TrendingUp className="w-32 h-32" />
            </div>
            <p className="text-emerald-200/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Articulation Clarity</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tabular-nums">13.51</span>
              <span className="text-xl font-bold text-emerald-300">%</span>
            </div>
          </div>

          <div className="bg-amber-500 rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/20 flex flex-col justify-center text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 transition-transform duration-700">
              <AlertCircle className="w-32 h-32" />
            </div>
            <p className="text-amber-100/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Advice</p>
            <p className="text-2xl font-black tracking-tight">立即干预进行治疗</p>
          </div>
        </div>

        {/* Section 1: Sound Contrast Analysis (音位对比分析) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-8 bg-[#135c4a] rounded-full" />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">评估结论：音位对比分析</h3>
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
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">评判明细：各题目得分详情</h3>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {columns.map((columnItems, colIdx) => (
                <div key={colIdx} className={cn("flex flex-col", colIdx < 2 && "lg:border-r border-slate-100")}>
                  <div className="grid grid-cols-[60px_1fr_100px] bg-slate-50/80 px-4 py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">No.</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stimulus</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome</span>
                  </div>
                  
                  <div className="flex flex-col">
                    {columnItems.map((item: any) => {
                      const formalIdx = formalItems.indexOf(item);
                      const result = results[formalIdx + 2];
                      const status = getStatusInfo(result);
                      
                      return (
                        <div key={item.id} className="grid grid-cols-[60px_1fr_100px] border-b border-slate-50 hover:bg-slate-50/80 transition-all group items-center">
                          <div className="py-4 text-center font-bold text-slate-300 tabular-nums text-xs group-hover:text-slate-500 transition-colors">{item.id}</div>
                          <div className="py-4 text-center">
                            <span className="text-lg font-black text-slate-700 tracking-tight">{item.word}</span>
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
        <div className="flex items-center justify-center gap-8 py-6 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-500" />
             <span className="text-slate-500 font-bold text-xs">正确</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-amber-500" />
             <span className="text-slate-500 font-bold text-xs">歪曲/音位对比异常</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-slate-300" />
             <span className="text-slate-500 font-bold text-xs">未评估项目</span>
           </div>
        </div>

        {/* Report Footer */}
        <div className="flex flex-col items-center gap-4 py-8">
           <p className="text-slate-400 font-bold text-sm tracking-tight">评估完成时间：{new Date().toLocaleString()}</p>
           <div className="w-16 h-1.5 bg-slate-100 rounded-full" />
        </div>
      </main>
    </div>
  );
}
