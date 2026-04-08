import React, { useState } from 'react';
import { ChevronLeft, Plus, Search, Calendar, User, FileText, BookOpen, Clock, Activity, GraduationCap, ClipboardList, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface AssessmentRecord {
  id: string;
  order: number;
  code: string;
  name: string;
  method: string;
  age: string;
  evaluator: string;
}

const mockRecordDetails: AssessmentRecord[] = [
  {
    id: '1',
    order: 1,
    code: 'TBL260324',
    name: '0 岁～6 岁儿童发育行为评估量表',
    method: '儿心量表-II',
    age: '0岁1个月',
    evaluator: '李林杰'
  },
  {
    id: '2',
    order: 2,
    code: 'TBL260274',
    name: '0 岁～6 岁儿童发育行为评估量表',
    method: '儿心量表-II',
    age: '0岁1个月',
    evaluator: '李林杰'
  }
];

export default function StudentArchive() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('评估表记录');

  const tabs = [
    { id: '儿童基本信息', icon: User },
    { id: '学生课表', icon: Clock },
    { id: '评估表记录', icon: ClipboardList },
    { id: '评估报告记录', icon: FileText },
    { id: '参加课程记录', icon: Activity },
    { id: '教学档案', icon: GraduationCap },
    { id: '医疗档案', icon: Stethoscope },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 border-b border-slate-100 flex items-center px-6 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-slate-50 rounded-lg transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">修改学员</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Profile */}
        <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-y-auto">
          <div className="p-8 flex flex-col items-center border-b border-slate-100">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-sm">
                <div className="w-16 h-16 bg-black rounded-full relative flex items-center justify-center overflow-hidden">
                   <div className="absolute top-2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <div className="w-6 h-2 bg-white rounded-full"></div>
                      </div>
                   </div>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-slate-100">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-slate-500 text-sm">姓名：<span className="text-slate-800 font-medium ml-1">b111</span></div>
              <div className="text-slate-500 text-sm">性别：<span className="text-slate-800 font-medium ml-1">女</span></div>
              <div className="text-slate-500 text-sm">ID：<span className="text-slate-800 font-medium ml-1">84</span></div>
              <div className="text-slate-500 text-xs mt-2">录入时间：2026-02-27</div>
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-3.5 text-sm font-bold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "text-[#135c4a] bg-emerald-50/50" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {tab.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    placeholder="请输入关键词" 
                    className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#135c4a] transition-all"
                  />
                </div>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-[#135c4a]">
                  <option>请选择评估方法</option>
                </select>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4" />
                  <span>时间：</span>
                  <input type="text" placeholder="开始日期" className="w-24 outline-none text-slate-700 bg-transparent placeholder:text-slate-300" />
                  <span className="mx-1">-</span>
                  <input type="text" placeholder="结束日期" className="w-24 outline-none text-slate-700 bg-transparent placeholder:text-slate-300" />
                </div>
              </div>

              <button 
                onClick={() => navigate('/new-assessment')}
                className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-lg hover:bg-[#135c4a]/90 transition-colors shadow-sm font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                新建评估表
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500 w-20">序号</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500">评估表编号</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-center">评估表名称</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-center">评估方法</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-center">评估时年龄</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-center">评估员</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockRecordDetails.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-[13px] text-slate-500">{record.order}</td>
                      <td className="px-6 py-5 text-[13px] text-[#135c4a] font-medium hover:underline cursor-pointer">{record.code}</td>
                      <td className="px-6 py-5 text-[13px] text-[#135c4a] text-center hover:underline cursor-pointer">{record.name}</td>
                      <td className="px-6 py-5 text-[13px] text-slate-600 text-center">{record.method}</td>
                      <td className="px-6 py-5 text-[13px] text-slate-600 text-center">{record.age}</td>
                      <td className="px-6 py-5 text-[13px] text-slate-600 text-center">{record.evaluator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-6 text-[13px] text-slate-500 bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <span>共 2 条</span>
                  <select className="bg-white border border-slate-200 rounded px-2 py-1 outline-none">
                    <option>10条/页</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#135c4a] text-white font-medium">1</button>

                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>前往</span>
                  <input type="text" defaultValue="1" className="w-10 border border-slate-200 rounded px-2 py-1 text-center outline-none" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using ImageIcon from App.tsx/Lucide
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
