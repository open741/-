import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Search, ChevronDown, Check, X, Shield, Clock, AlertCircle, Wand2, Image as ImageIcon, LayoutGrid, Type, MoreHorizontal, Upload, Download, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn, generatePlaceholder } from '../lib/utils';

export default function AiCardGeneration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('cartoon');
  const [size, setSize] = useState('1:1');
  const [counts, setCounts] = useState('4张');

  // Handle passed data from 'Reuse' button in Library
  useEffect(() => {
    if (location.state?.reuseTask) {
      const task = location.state.reuseTask;
      setTaskName(task.taskName || task.title || '');
      setDescription(task.description || task.desc || '');
      
      if (task.style === '3D') setStyle('3d');
      else if (task.style === '写实') setStyle('realistic');
      else if (task.style === '卡通') setStyle('cartoon');
      else if (task.style === '简笔画') setStyle('drawing');
      
      if (task.size) setSize(task.size);
      if (task.count) setCounts(task.count);
      
      // Clear state to avoid re-population on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const styles = [
    { id: 'cartoon', label: '卡通', icon: generatePlaceholder('Cartoon', '卡通风') },
    { id: 'realistic', label: '写实', icon: generatePlaceholder('Realistic', '写实风') },
    { id: 'drawing', label: '简笔画', icon: generatePlaceholder('Drawing', '简笔画') },
    { id: '3d', label: '3D', icon: generatePlaceholder('3D', '3D风') },
  ];

  const sizes = [
    { id: '1:1', label: '1 : 1', icon: LayoutGrid },
    { id: '4:3', label: '4 : 3', icon: LayoutGrid },
    { id: '3:4', label: '3 : 4', icon: LayoutGrid },
    { id: '16:9', label: '16 : 9', icon: LayoutGrid },
    { id: '9:16', label: '9 : 16', icon: LayoutGrid },
  ];

  const [taskList, setTaskList] = useState<any[]>([]);

  const handleStartGeneration = () => {
    if (!taskName.trim()) return;
    const newTask = {
      id: Date.now(),
      title: taskName,
      desc: description,
      creator: '胡晓涛',
      time: new Date().toLocaleString(),
      status: 'generating',
      images: Array(parseInt(counts) || 4).fill(0).map((_, i) => {
        const color = ['135c4a', 'e8f5e9', 'ffebee', 'e3f2fd', 'fff3e0'][i % 5];
        const textColor = i % 5 === 0 ? 'fff' : '333';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#${textColor}">AI Generated ${i+1}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
      }),
      params: { 
        style: style === 'cartoon' ? '卡通' : style === 'Realistic' ? '写实' : style === 'drawing' ? '简笔画' : '3D', 
        size: size, 
        count: counts, 
        mosaic: '未开启' 
      }
    };
    setTaskList([newTask, ...taskList]);
    
    // PERSISTENCE: Save to localStorage so Library can see it
    const storedTasks = JSON.parse(localStorage.getItem('ai_tasks') || '[]');
    localStorage.setItem('ai_tasks', JSON.stringify([newTask, ...storedTasks]));
    
    // MOCK: Auto-complete generation after 3 seconds
    setTimeout(() => {
      setTaskList(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'completed' } : t));
      
      // Update localStorage as well
      const currentStored = JSON.parse(localStorage.getItem('ai_tasks') || '[]');
      const updatedStored = currentStored.map((t: any) => t.id === newTask.id ? { ...t, status: 'completed' } : t);
      localStorage.setItem('ai_tasks', JSON.stringify(updatedStored));
    }, 3000);

    // Clear inputs
    setTaskName('');
    setDescription('');
  };

  // Load persisted tasks on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('ai_tasks') || '[]');
    if (storedTasks.length > 0) {
      setTaskList(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNew = storedTasks.filter((t: any) => !existingIds.has(t.id));
        return [...uniqueNew, ...prev];
      });
    }
  }, []);

  const handleReuse = (task: any) => {
    setTaskName(task.title);
    setDescription(task.desc);
    
    // Attempt to map back params
    if (task.params.style === '3D') setStyle('3d');
    else if (task.params.style === '写实') setStyle('realistic');
    else if (task.params.style === '卡通') setStyle('cartoon');
    else if (task.params.style === '简笔画') setStyle('drawing');
    
    setSize(task.params.size);
    setCounts(task.params.count);

    // Scroll to top of left panel
    const leftPanel = document.querySelector('.custom-scrollbar');
    if (leftPanel) leftPanel.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faf9] overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-white border-b border-slate-100 flex items-center px-6 gap-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#135c4a]" />
          <h1 className="text-lg font-bold text-slate-900">AI生成图卡</h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configurations */}
        <div className="w-[380px] bg-[#1a4d3f] p-6 overflow-y-auto text-emerald-50/90 custom-scrollbar">
          <div className="space-y-8">
            <section>
              <label className="block text-sm font-medium mb-3">任务名称</label>
              <input 
                type="text" 
                placeholder="例如：水果认知圈卡生成"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all text-white"
              />
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">画面描述</label>
                <button className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition-colors">
                  <Wand2 className="w-3.5 h-3.5" />
                  一键优化提示词
                </button>
              </div>
              <textarea 
                rows={6}
                placeholder="例如：一个红色的苹果..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all resize-none text-white"
              />
            </section>

            <section>
              <label className="block text-sm font-medium mb-4">图像风格</label>
              <div className="grid grid-cols-4 gap-3">
                {styles.map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 group transition-all",
                      style === s.id ? "scale-105" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl overflow-hidden border-2 transition-all",
                      style === s.id ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-transparent"
                    )}>
                      <img src={s.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-medium">{s.label}</span>
                  </button>
                ))}
                <button className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all">
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium">参考图</span>
                </button>
              </div>
            </section>

            <section>
              <label className="block text-sm font-medium mb-4">生成尺寸</label>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-2 rounded-xl border border-white/10 transition-all",
                      size === s.id ? "bg-white/20 border-emerald-400 text-white" : "hover:bg-white/5"
                    )}
                  >
                    <s.icon className={cn(
                      "w-4 h-4",
                      s.id === '1:1' ? 'aspect-square' : s.id === '4:3' ? 'aspect-[4/3]' : 'aspect-square'
                    )} />
                    <span className="text-[10px] whitespace-nowrap">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <label className="block text-sm font-medium mb-2">生成数量</label>
              <div className="flex bg-white/10 rounded-lg p-1">
                {['1张', '2张', '4张', '生成组图'].map((c) => (
                  <button 
                    key={c}
                    onClick={() => setCounts(c)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                      counts === c ? "bg-emerald-600 text-white shadow-sm" : "hover:bg-white/5"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <button 
              onClick={handleStartGeneration}
              className="w-full bg-[#96c141] hover:bg-[#a7d152] text-emerald-900 font-bold py-4 rounded-2xl shadow-lg shadow-black/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-6 group"
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              开始生成
            </button>
          </div>
        </div>

        {/* Right Panel - Task List */}
        <div className="flex-1 bg-white p-6 overflow-y-auto overflow-x-hidden flex flex-col gap-6 custom-scrollbar-light">
          {/* List Headers */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="请输入任务名称" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#135c4a] transition-all"
              />
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>所有创建人</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>全部状态</option>
            </select>
          </div>

          {/* Task Cards */}
          <div className="space-y-6">
            {taskList.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "relative bg-white rounded-2xl border transition-all p-6",
                  task.status === 'generating' ? "border-orange-200 bg-orange-50/10" : 
                  task.status === 'completed' ? "border-emerald-200 bg-emerald-50/10" : 
                  "border-red-200 bg-red-50/10"
                )}
              >
                <div className={cn(
                  "absolute -top-3 right-6 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10",
                  task.status === 'generating' ? "bg-orange-500 text-white" : 
                  task.status === 'completed' ? "bg-emerald-500 text-white" : 
                  "bg-red-500 text-white"
                )}>
                  {task.status === 'generating' ? <><Clock className="w-3 h-3" /> 生成中</> : 
                   task.status === 'completed' ? <><Check className="w-3 h-3" /> 已完成</> : 
                   <><AlertCircle className="w-3 h-3" /> 生成失败</>}
                </div>

                {task.status === 'completed' && (
                  <button 
                    onClick={() => handleReuse(task)}
                    className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-[#135c4a] hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm active:scale-95 z-10"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    复用
                  </button>
                )}

                <div className="flex gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{task.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
                      <span>创建人：{task.creator}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                    </div>

                    <div className="flex gap-2">
                       {Object.entries(task.params).map(([key, val]) => (
                         <span key={key} className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-500">
                           {val}
                         </span>
                       ))}
                    </div>
                  </div>

                    <div className="grid grid-cols-4 gap-2 w-[400px] shrink-0">
                      {task.images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 group relative border border-slate-100">
                          <img 
                            src={img} 
                            className={cn("w-full h-full object-cover transition-transform duration-500 group-hover:scale-110", task.status === 'generating' && "blur-sm opacity-50")} 
                            referrerPolicy="no-referrer"
                          />
                          
                          {task.status === 'generating' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Wand2 className="w-6 h-6 text-[#135c4a] animate-pulse" />
                            </div>
                          )}

                          {task.status === 'completed' && (
                            <button 
                              className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm border border-slate-100 transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                              title="下载图片"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
