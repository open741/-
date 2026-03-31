import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Copy, Edit3, Trash2, Eye, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const historyData = [
  { id: 1, title: '注意力缺陷多动障碍评定量表(SNAP-IV-26)', student: '820 验收', age: '7岁5个月', creator: '胡晓涛', assessmentId: 'TBL260373', date: '2026-03-31', color: 'bg-[#4a8a70]' },
  { id: 2, title: '0岁~6岁儿童发育行为评估量表', student: '820 验收', age: '1岁4个月', creator: '胡晓涛', assessmentId: 'TBL260372', date: '2020-03-01', color: 'bg-[#98c972]' },
  { id: 3, title: '儿童感觉统合能力发展评定量表', student: '820 验收', age: '7岁5个月', creator: '胡晓涛', assessmentId: 'TBL260371', date: '2026-03-30', color: 'bg-[#a3d95d]' },
  { id: 4, title: '全量数据', student: '820 验收', age: '7岁4个月', creator: '李林杰', assessmentId: 'TBL260370', date: '2026-03-27', color: 'bg-[#a3b14b]', hasEdit: true },
  { id: 5, title: '儿童感觉统合能力发展评定量表', student: 'AAA建材李哥', age: '10岁4个月', creator: '胡晓涛', assessmentId: 'TBL260368', date: '2026-03-27', color: 'bg-[#e89f4c]' },
  { id: 6, title: '儿童感觉统合能力发展评定量表', student: 'AAA建材李哥', age: '10岁4个月', creator: '胡晓涛', assessmentId: 'TBL260366', date: '2026-03-27', color: 'bg-[#66b5c2]' },
  { id: 7, title: '儿童感觉统合能力发展评定量表', student: '820 验收', age: '7岁4个月', creator: '胡晓涛', assessmentId: 'TBL260365', date: '2026-03-27', color: 'bg-[#a8a18c]' },
  { id: 8, title: '儿童感觉统合能力发展评定量表', student: 'AAA建材李哥', age: '10岁4个月', creator: '王若丞', assessmentId: 'TBL260364', date: '2026-03-27', color: 'bg-[#e89b9b]' },
  { id: 9, title: '儿童感觉统合能力发展评定量表', student: 'AAA建材李哥', age: '10岁4个月', creator: '王若丞', assessmentId: 'TBL260363', date: '2026-03-27', color: 'bg-[#3b5982]' },
  { id: 10, title: '儿童感觉统合能力发展评定量表', student: 'AAA建材李哥', age: '10岁4个月', creator: '王若丞', assessmentId: 'TBL260362', date: '2026-03-27', color: 'bg-[#b8b4d4]' },
];

export default function AssessmentHistory() {
  const navigate = useNavigate();

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入关键词" 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#135c4a]"
            />
          </div>
          <div className="relative w-48">
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#135c4a] text-slate-500">
              <option value="">请选择学员</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-64">
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#135c4a] text-slate-500">
              <option value="">请选择评估方法</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-slate-600">时间：</span>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="开始日期" className="bg-transparent text-sm w-24 focus:outline-none text-slate-600" readOnly />
              <span className="text-slate-400 mx-2">-</span>
              <input type="text" placeholder="结束日期" className="bg-transparent text-sm w-24 focus:outline-none text-slate-600" readOnly />
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/new-assessment')}
          className="ml-6 flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-md hover:bg-[#0f4a3b] transition-colors text-sm font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增评估表
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-6">
          {historyData.map((item) => (
            <div 
              key={item.id} 
              className={cn("rounded-xl p-5 text-white flex flex-col h-[200px] relative group", item.color)}
            >
              <h3 className="font-medium text-[15px] leading-snug mb-4 line-clamp-2 pr-2">
                {item.title}
              </h3>
              
              <div className="space-y-1.5 text-[13px] text-white/90 flex-1">
                <div className="flex">
                  <span className="w-14 shrink-0">学生：</span>
                  <span className="truncate">{item.student}</span>
                </div>
                <div className="flex">
                  <span className="w-14 shrink-0">年龄：</span>
                  <span className="truncate">{item.age}</span>
                </div>
                <div className="flex">
                  <span className="w-14 shrink-0">创建人：</span>
                  <span className="truncate">{item.creator}</span>
                </div>
                <div className="flex">
                  <span className="w-14 shrink-0">评估编号：</span>
                  <span className="truncate">{item.assessmentId}</span>
                </div>
                <div className="flex">
                  <span className="w-14 shrink-0">评估日期：</span>
                  <span className="truncate">{item.date}</span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3 opacity-80">
                <button className="hover:opacity-100 transition-opacity" title="复制">
                  <Copy className="w-4 h-4" />
                </button>
                {item.hasEdit && (
                  <button className="hover:opacity-100 transition-opacity" title="编辑">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button className="hover:opacity-100 transition-opacity" title="删除">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="hover:opacity-100 transition-opacity" title="查看">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-auto pt-4 flex items-center justify-center gap-4 text-sm text-slate-600">
        <span>共 215 条</span>
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#135c4a]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 disabled:opacity-50" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#135c4a] text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">4</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">5</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">6</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200">22</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>前往</span>
          <input type="text" defaultValue="1" className="w-12 text-center border border-slate-200 rounded py-1 focus:outline-none focus:ring-1 focus:ring-[#135c4a]" />
          <span>页</span>
        </div>
      </div>
    </div>
  );
}
