import React, { useState } from 'react';
import {
  User,
  Calendar,
  FileText,
  Sparkles,
  Search,
  ChevronDown,
  Plus,
  ClipboardList,
  Stethoscope,
  Heart,
  Info,
  Wand2,
  Import,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Target,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';


const DISABILITY_TYPES = [
  '肢体残疾', '智力残疾', '孤独症', '视力残疾', '言语残疾', '听力残疾'
];

const DISABILITY_GRADES = [
  '未评级', '一级', '二级', '三级', '四级'
];

const REPORT_DOMAIN_MAP: Record<string, string[]> = {
  "孤独症儿童发展能力评估报告": ["感知觉", "粗大动作", "精细动作", "语言与沟通", "认知", "社会交往", "生活自理", "情绪与行为"],
  "0岁~6岁儿童发育行为评估报告": ["大运动", "精细动作", "适应能力", "语言", "社会行为"],
  "CPEP-3自闭症儿童心理教育评估报告": ["认知（语言/语前）（CVP）", "语言表达（EL）", "语言理解（RL）", "小肌肉（FM）", "大肌肉（GM）", "模仿(视觉/动作)(VMI)", "情感表达（AE）", "社交互动(SR)", "行为特征-非语言（CMB）", "行为特征-语言（CVB）", "问题行为（PB）", "个人自理(PSC)", "适应行为（AB）"],
  "注意力缺陷多动障碍评估报告": ["注意力不集中", "多动/冲动", "对立违抗"],
  "儿童感觉统合能力发展评估报告": ["前庭功能", "触觉防御", "本体感", "学习能力"],
  "构音语音能力评估报告": ["构音清晰度"]
};

const MOCK_REPORT_INSTANCES: Record<string, { id: string, date: string, assessor: string }[]> = {
  "孤独症儿童发展能力评估报告": [
    { id: 'RPT1260398', date: '2024-04-20', assessor: '蒋老师' },
    { id: 'RPT1260402', date: '2023-11-15', assessor: '王老师' },
  ],
  "0岁~6岁儿童发育行为评估报告": [
    { id: 'RPT1260405', date: '2024-03-10', assessor: '李老师' },
  ],
  "CPEP-3自闭症儿童心理教育评估报告": [
    { id: 'RPT1260408', date: '2024-02-15', assessor: '蒋老师' },
  ],
  "儿童感觉统合能力发展评估报告": [
    { id: 'RPT1260411', date: '2024-04-05', assessor: '陈老师' },
  ],
  "注意力缺陷多动障碍评估报告": [
    { id: 'RPT1260415', date: '2024-01-20', assessor: '张老师' },
  ],
  "构音语音能力评估报告": [
    { id: 'RPT1260419', date: '2024-04-12', assessor: '蒋老师' },
  ],
};

export default function ComprehensiveReport() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [analysisDate, setAnalysisDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedReportInstances, setSelectedReportInstances] = useState<Record<string, { id: string, date: string, assessor: string } | null>>({});
  const [browsingCategory, setBrowsingCategory] = useState<string | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Form Data States
  const [assessmentSituation, setAssessmentSituation] = useState('');
  const [domainResults, setDomainResults] = useState<Record<string, string>>({});
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [parentExpectations, setParentExpectations] = useState('');
  const [rehabGoals, setRehabGoals] = useState('');

  const clearData = () => {
    setAssessmentSituation('');
    setDomainResults({});
    setStrengths('');
    setWeaknesses('');
    setParentExpectations('');
    setRehabGoals('');
  };

  // Mock student data with background information
  const students = [
    {
      id: '1',
      name: '张小凡',
      gender: '男',
      birthDate: '2019-05-12',
      age: '5岁11月',
      disabilities: ['孤独症'],
      grade: '二级',
      diagnosis: '疑似孤独症谱系障碍',
      interests: '拼图、听儿歌、旋转的物体',
      pastInfo: '曾在某康复机构进行过半年的语言干预'
    },
    {
      id: '2',
      name: '陈泓楷',
      gender: '男',
      birthDate: '2017-06-17',
      age: '8岁9月',
      disabilities: ['智力残疾', '孤独症'],
      grade: '三级',
      diagnosis: '智力发育迟缓、孤独症',
      interests: '玩水、乐高、画画',
      pastInfo: '长期进行感统训练和言语训练'
    },
    {
      id: '3',
      name: '李萌萌',
      gender: '女',
      birthDate: '2020-02-20',
      age: '4岁2月',
      disabilities: ['视力残疾'],
      grade: '一级',
      diagnosis: '先天性视力障碍',
      interests: '听故事、触摸不同质地的玩具',
      pastInfo: '无'
    },
  ];

  const currentStudent = students.find(s => s.id === selectedStudent);

  const activeDomains = Object.entries(selectedReportInstances)
    .filter(([_, instance]) => instance !== null)
    .flatMap(([reportType, _]) => {
      const domains = REPORT_DOMAIN_MAP[reportType] || [];
      return domains.map(domainLabel => ({
        id: `${reportType}-${domainLabel}`,
        label: domainLabel,
        report: reportType
      }));
    });

  const toggleReportCategory = (category: string) => {
    if (!selectedStudent) {
      alert('请先选择学员');
      return;
    }
    setReportSearchQuery('');
    setBrowsingCategory(category);
  };

  const selectReportInstance = (category: string, instance: { id: string, date: string, assessor: string } | null) => {
    setSelectedReportInstances(prev => ({
      ...prev,
      [category]: instance
    }));
    // Clear all data below when report selection changes
    clearData();
    setReportSearchQuery('');
    setBrowsingCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col pb-32">
      {/* Header Bar */}
      <header className="h-[72px] bg-white flex items-center justify-between px-8 text-slate-800 shrink-0 sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-100" />
          <h1 className="text-lg font-black tracking-tight text-slate-800">新建评估综合分析报告</h1>
        </div>

        <div className="flex items-center gap-12 bg-[#edf4f2] px-8 py-2 rounded-2xl border border-[#dae5e2]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#135c4a]">评估分析人员：</span>
            <span className="text-sm font-black text-[#135c4a]">某某老师</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#135c4a]">分析时间：</span>
            <div className="relative">
              <input
                type="date"
                value={analysisDate}
                onChange={(e) => setAnalysisDate(e.target.value)}
                className="bg-white border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 pl-8 focus:ring-2 focus:ring-[#135c4a]/10 cursor-pointer shadow-sm w-40"
              />
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Section: Student Basic Information */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group overflow-hidden">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">学生基本资料</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Student Selector */}
            <div className="space-y-3 col-span-1 md:col-span-1">
              <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <div className="relative group/select">
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedStudent(id);
                    setSelectedReportInstances({});
                    clearData();
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-base font-bold text-slate-700 appearance-none focus:outline-none focus:border-[#135c4a] focus:bg-white transition-all cursor-pointer shadow-inner"
                >
                  <option value="">请选择学员</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover/select:text-[#135c4a] transition-colors" />
              </div>
            </div>

            {/* Read-only fields */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1">性别</label>
              <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base font-bold text-slate-400 shadow-inner">
                {currentStudent?.gender || '--'}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1">出生年月</label>
              <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base font-bold text-slate-400 shadow-inner">
                {currentStudent?.birthDate || '--'}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 ml-1">实际年龄</label>
              <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base font-bold text-slate-400 shadow-inner">
                {currentStudent?.age || '--'}
              </div>
            </div>

            {/* Physical Condition Checkboxes (Now Read-only) */}
            <div className="col-span-full space-y-4">
              <label className="text-sm font-bold text-slate-500 ml-1">身体状况</label>
              <div className="flex flex-wrap gap-3">
                {DISABILITY_TYPES.map(type => (
                  <div
                    key={type}
                    className={cn(
                      "px-6 py-3 rounded-2xl font-bold text-sm border-2 transition-all",
                      currentStudent?.disabilities?.includes(type)
                        ? "bg-[#135c4a]/5 border-[#135c4a] text-[#135c4a] shadow-sm"
                        : "bg-slate-50/50 border-slate-100 text-slate-300"
                    )}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Disability Grade Radios (Now Read-only) */}
            <div className="col-span-full space-y-4">
              <label className="text-sm font-bold text-slate-500 ml-1">残疾等级</label>
              <div className="flex flex-wrap gap-3">
                {DISABILITY_GRADES.map(grade => (
                  <div
                    key={grade}
                    className={cn(
                      "px-6 py-3 rounded-2xl font-bold text-sm border-2 transition-all",
                      currentStudent?.grade === grade
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-slate-50/50 border-slate-100 text-slate-300"
                    )}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </div>

            {/* Read-only Text Areas */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <Stethoscope className="w-4 h-4 text-[#135c4a]" />
                  <label className="text-sm font-bold text-slate-700">临床诊断</label>
                </div>
                <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-medium text-slate-500 min-h-[120px] shadow-inner whitespace-pre-wrap">
                  {currentStudent?.diagnosis || '暂无数据'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <label className="text-sm font-bold text-slate-700">兴趣爱好</label>
                </div>
                <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-medium text-slate-500 min-h-[120px] shadow-inner whitespace-pre-wrap">
                  {currentStudent?.interests || '暂无数据'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <Info className="w-4 h-4 text-blue-500" />
                  <label className="text-sm font-bold text-slate-700">既往医疗和康复信息</label>
                </div>
                <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-medium text-slate-500 min-h-[120px] shadow-inner whitespace-pre-wrap">
                  {currentStudent?.pastInfo || '暂无数据'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Assessment Table Selection */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">评估报告记录</h2>
            </div>
          </div>

          {!selectedStudent ? (
            <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
              <ClipboardList className="w-12 h-12 opacity-20" />
              <p className="font-bold text-sm">选择学员后，系统将同步其可用的评估报告</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(REPORT_DOMAIN_MAP).map(category => {
                const selected = selectedReportInstances[category];
                return (
                  <div
                    key={category}
                    onClick={() => toggleReportCategory(category)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col h-40 justify-between group",
                      selected
                        ? "border-[#135c4a] bg-[#135c4a]/[0.02] shadow-md shadow-[#135c4a]/5"
                        : "border-slate-50 hover:bg-slate-50/80 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className={cn("text-[13px] font-black leading-snug", selected ? "text-[#135c4a]" : "text-slate-600")}>{category}</h3>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0",
                        selected ? "bg-[#135c4a] text-white shadow-lg shadow-[#135c4a]/20" : "bg-slate-100 text-slate-300 group-hover:scale-110 group-hover:text-slate-400"
                      )}>
                        {selected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </div>

                    <div className="mt-auto">
                      {selected ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">{selected.id}</span>
                            <span className="text-[#135c4a] font-black underline decoration-dotted">更换</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selected.date}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selected.assessor}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-300 font-bold italic tracking-wider uppercase">暂未添加记录</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section: Assessment Situation */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">评估时的基本情况</h2>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#f0f9f6] text-[#135c4a] rounded-2xl font-black text-sm hover:bg-[#e6f4f0] transition-all border border-[#d1e9e2] active:scale-95">
              <Sparkles className="w-4 h-4" />
              AI 分析
            </button>
          </div>

          <textarea
            placeholder="请输入评估时的基本情况描述，或点击 AI 分析自动生成..."
            value={assessmentSituation}
            onChange={(e) => setAssessmentSituation(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-base font-medium text-slate-600 min-h-[160px] focus:outline-none focus:border-[#135c4a] focus:bg-white transition-all shadow-inner resize-none"
          />
        </section>

        {/* Section: Assessment Results (8 Domains) */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">评估结果</h2>
            </div>
          </div>

          <div className="border-2 border-slate-50 rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[200px] flex flex-col">
            {activeDomains.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-sm font-black text-slate-500 uppercase tracking-widest w-[25%]">评估报告</th>
                    <th className="px-8 py-5 text-left text-sm font-black text-slate-500 uppercase tracking-widest w-[15%]">领域</th>
                    <th className="px-8 py-5 text-left text-sm font-black text-slate-500 uppercase tracking-widest">评估结果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeDomains.map((domain, index) => {
                    // Calculate rowspan for merging report names
                    const isFirstInReport = index === 0 || domain.report !== activeDomains[index - 1].report;
                    let rowSpan = 1;
                    if (isFirstInReport) {
                      for (let i = index + 1; i < activeDomains.length; i++) {
                        if (activeDomains[i].report === domain.report) rowSpan++;
                        else break;
                      }
                    }

                    return (
                      <tr key={domain.id} className="group hover:bg-slate-50/30 transition-colors">
                        {isFirstInReport && (
                          <td 
                            rowSpan={rowSpan} 
                            className="px-8 py-6 align-top border-r border-slate-50 text-sm font-black text-slate-400 bg-slate-50/10 leading-relaxed whitespace-nowrap"
                          >
                            {domain.report}
                          </td>
                        )}
                        <td className="px-8 py-6 align-top border-r border-slate-50 whitespace-nowrap">
                          <span className="text-base font-black text-[#135c4a]">{domain.label}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="relative">
                            <textarea
                              placeholder={`请输入${domain.label}领域的评估分析结果...`}
                              value={domainResults[domain.id] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDomainResults(prev => ({ ...prev, [domain.id]: val }));
                              }}
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-600 min-h-[100px] focus:outline-none focus:border-[#135c4a] focus:bg-white transition-all resize-none leading-relaxed"
                            />
                            <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-600 rounded-lg text-[10px] font-black hover:bg-emerald-50 transition-all border border-emerald-100 opacity-0 group-hover:opacity-100 shadow-sm active:scale-95">
                              <Wand2 className="w-3 h-3" />
                              AI
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-300 gap-4">
                <Info className="w-12 h-12 opacity-20" />
                <p className="font-bold text-sm">请先选择评估报告以载入康复领域</p>
              </div>
            )}
          </div>
        </section>

        {/* Section: Comprehensive Analysis of Assessment Results */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">评估结果综合情况分析</h2>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#f0f9f6] text-[#135c4a] rounded-2xl font-black text-sm hover:bg-[#e6f4f0] transition-all border border-[#d1e9e2] active:scale-95">
              <Sparkles className="w-4 h-4" />
              AI 分析
            </button>
          </div>

          <div className="border-2 border-slate-100 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 bg-[#135c4a] text-white py-4 px-8 font-black text-sm tracking-widest text-center">
              <div className="border-r border-white/20">能力优势</div>
              <div>能力劣势</div>
            </div>
            <div className="grid grid-cols-2 min-h-[200px]">
              <textarea
                placeholder="请输入能力优势分析..."
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full p-8 text-sm font-medium text-slate-600 focus:outline-none focus:bg-slate-50/50 transition-all border-r border-slate-100 resize-none"
              />
              <textarea
                placeholder="请输入能力劣势分析..."
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                className="w-full p-8 text-sm font-medium text-slate-600 focus:outline-none focus:bg-slate-50/50 transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section: Parent's Expectations */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">家长的期望</h2>
          </div>

          <textarea
            placeholder="请输入家长的期望..."
            value={parentExpectations}
            onChange={(e) => setParentExpectations(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-base font-medium text-slate-600 min-h-[140px] focus:outline-none focus:border-[#135c4a] focus:bg-white transition-all shadow-inner resize-none"
          />
        </section>

        {/* Section: Rehabilitation Goals and Suggestions */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">康复目标和建议</h2>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#f0f9f6] text-[#135c4a] rounded-2xl font-black text-sm hover:bg-[#e6f4f0] transition-all border border-[#d1e9e2] active:scale-95">
              <Sparkles className="w-4 h-4" />
              AI 分析
            </button>
          </div>

          <textarea
            placeholder="请输入康复目标建议描述..."
            value={rehabGoals}
            onChange={(e) => setRehabGoals(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-base font-medium text-slate-600 min-h-[180px] focus:outline-none focus:border-[#135c4a] focus:bg-white transition-all shadow-inner resize-none"
          />
        </section>

        {/* Section: Tentative Curriculum */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative group">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#f0f9f6] text-[#135c4a] rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">初定课程</h2>
          </div>

          <div className="border-2 border-slate-50 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  <th className="py-5 px-4 font-black">序号</th>
                  <th className="py-5 px-4 font-black">排课时间</th>
                  <th className="py-5 px-4 font-black">排课周期</th>
                  <th className="py-5 px-4 font-black">课程</th>
                  <th className="py-5 px-4 font-black">教室</th>
                  <th className="py-5 px-4 font-black">学员</th>
                  <th className="py-5 px-4 font-black">老师</th>
                  <th className="py-5 px-4 font-black">助教</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-300 font-bold italic text-sm">
                    暂无数据
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex justify-end items-center gap-4 pr-4">
            <span className="text-sm font-black text-slate-600">家长签名：</span>
            <div className="w-40 border-b-2 border-slate-200 pb-1" />
          </div>
        </section>

      </main>

      {/* Footer Actions (Fixed at Bottom, offset for Sidebar) */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/95 border-t border-slate-100 py-4 flex items-center justify-center gap-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-2.5 bg-white text-slate-400 border border-slate-200 rounded-xl font-black text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          取消
        </button>
        <button
          className="px-10 py-2.5 bg-[#135c4a] text-white rounded-xl font-black text-sm hover:bg-[#0f4a3b] transition-all shadow-lg shadow-[#135c4a]/10 active:scale-95"
        >
          提交
        </button>
      </div>

      {/* Report Selection Modal */}
      {browsingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setBrowsingCategory(null)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">历史评估报告</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{browsingCategory}</p>
              </div>
              <button onClick={() => setBrowsingCategory(null)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-6 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus-within:bg-white focus-within:border-[#135c4a] focus-within:ring-4 focus-within:ring-[#135c4a]/5 transition-all">
                <Search className="w-5 h-5 text-slate-300" />
                <input
                  placeholder="按日期、评估人或评估报告编号搜索"
                  className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-600 placeholder:text-slate-300"
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
              {(() => {
                const instances = (MOCK_REPORT_INSTANCES[browsingCategory] || []);
                const filtered = instances.filter(i =>
                  i.id.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
                  i.date.includes(reportSearchQuery) ||
                  i.assessor.includes(reportSearchQuery)
                );

                if (filtered.length > 0) {
                  return (
                    <div className="grid grid-cols-1 gap-3">
                      {filtered.map(instance => (
                        <div
                          key={instance.id}
                          onClick={() => selectReportInstance(browsingCategory, instance)}
                          className={cn(
                            "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group mx-2",
                            selectedReportInstances[browsingCategory]?.id === instance.id
                              ? "border-[#135c4a] bg-[#135c4a]/5 shadow-sm"
                              : "border-slate-50 hover:bg-slate-50/50 hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                              selectedReportInstances[browsingCategory]?.id === instance.id ? "bg-[#135c4a] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white"
                            )}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-sm italic">{instance.id}</span>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {instance.date}</span>
                                <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1"><User className="w-3.5 h-3.5" /> {instance.assessor}</span>
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                            selectedReportInstances[browsingCategory]?.id === instance.id ? "bg-[#135c4a] border-[#135c4a] text-white shadow-lg shadow-[#135c4a]/30" : "border-slate-200 bg-white"
                          )}>
                            {selectedReportInstances[browsingCategory]?.id === instance.id && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="p-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-200" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-400">未找到匹配的评估记录</h4>
                      <p className="text-xs text-slate-300 mt-1 italic">尝试更换搜索关键词</p>
                    </div>
                  );
                }
              })()}
            </div>
            {selectedReportInstances[browsingCategory] && (
              <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => selectReportInstance(browsingCategory, null)}
                  className="px-6 py-2.5 text-xs font-black text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all uppercase tracking-widest"
                >
                  取消当前选择
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
