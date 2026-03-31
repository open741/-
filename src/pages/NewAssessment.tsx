import React from 'react';
import { Play, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const assessmentForms = [
  {
    id: 1,
    name: '孤独症儿童发展能力评估表',
    shortName: '孤独症',
    ageRange: '0岁~6岁',
    duration: '2~4小时',
    action: '继续',
  },
  {
    id: 2,
    name: '0岁~6岁儿童发育行为评估量表',
    shortName: '儿心量表-II',
    ageRange: '0岁~6岁',
    duration: '0.5~1小时',
    action: '选择',
  },
  {
    id: 3,
    name: '自闭症儿童心理教育评核量表',
    shortName: 'CPEP-3',
    ageRange: '2岁~7岁',
    duration: '1~2小时',
    action: '继续',
  },
  {
    id: 4,
    name: '注意力缺陷多动障碍评定量表',
    shortName: 'SNAP-IV-26',
    ageRange: '6岁~18岁',
    duration: '20~30分钟',
    action: '继续',
  },
  {
    id: 5,
    name: '儿童感觉统合能力发展评定量表',
    shortName: '感统',
    ageRange: '3岁~12岁',
    duration: '20分钟左右',
    action: '选择',
  },
];

export default function NewAssessment() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">新建评估表</h1>
          <p className="text-slate-500 mt-2">请选择需要使用的评估方法</p>
        </div>
        <button 
          onClick={() => navigate('/assessment-history')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
        >
          <History className="w-4 h-4" />
          评估历史
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 line-clamp-2">
                {form.name}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-20">简称：</span>
                  <span className="text-slate-700 font-medium">{form.shortName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-20">适用年龄：</span>
                  <span className="text-slate-700">{form.ageRange}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-20">评估时间：</span>
                  <span className="text-slate-700">{form.duration}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => navigate(`/assessment-form/${form.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm"
              >
                <Play className="w-4 h-4" />
                {form.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
