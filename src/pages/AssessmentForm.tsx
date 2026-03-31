import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

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
