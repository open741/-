import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Upload, Wand2, Download, Trash2, Printer, CheckCircle2, CircleDashed, Image as ImageIcon, Type, Send, Archive, MoreHorizontal, Edit2, Check, X, Loader2, Clock, ChevronLeft, ChevronRight, AlertCircle, ChevronDown, ListTodo } from 'lucide-react';
import { cn } from '../lib/utils';
import AIGenerateView from '../components/AIGenerateView';
import { useStore, AITask, Card, Activity, DialogueWord } from '../lib/store';

const TASKS_PER_PAGE = 5;
const CARDS_PER_PAGE = 12;

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="min-w-[36px] h-9 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-slate-400 px-1">...</span>
          )}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-[#135c4a] text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-slate-400 px-1">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="min-w-[36px] h-9 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function GraphicLibrary() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const activeTab = (tab as 'ai-generate' | 'all') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCreator, setFilterCreator] = useState<string>('all');
  const [filterPublishStatus, setFilterPublishStatus] = useState<'all' | 'published' | 'unpublished'>('all');
  
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskFilterCreator, setTaskFilterCreator] = useState<string>('all');
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | 'completed' | 'generating' | 'failed'>('all');

  const cards = useStore(state => state.cards);
  const aiTasks = useStore(state => state.aiTasks);
  const activities = useStore(state => state.activities);
  const updateCard = useStore(state => state.updateCard);
  const deleteCards = useStore(state => state.deleteCards);
  const deleteAITask = useStore(state => state.deleteAITask);
  const getCreators = useStore(state => state.getCreators);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCardName, setNewCardName] = useState('');
  const [taskCurrentPage, setTaskCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setCardCurrentPage(1);
  }, [activeTab, searchQuery, filterCreator, filterPublishStatus]);

  useEffect(() => {
    setTaskCurrentPage(1);
  }, [activeTab, taskSearchQuery, taskFilterCreator, taskFilterStatus]);

  const creators = getCreators();

  const filteredCards = cards.filter(card => {
    if (activeTab !== 'all' && activeTab !== 'ai-generate' && card.type !== activeTab) return false;
    if (filterCreator !== 'all' && card.creator !== filterCreator) return false;
    if (filterPublishStatus !== 'all' && card.publishStatus !== filterPublishStatus) return false;
    if (searchQuery && !card.title.includes(searchQuery) && !card.tags.some(t => t.includes(searchQuery))) return false;
    return true;
  });

  const filteredTasks = aiTasks.filter(task => {
    if (taskSearchQuery && !task.taskName.includes(taskSearchQuery)) return false;
    if (taskFilterCreator !== 'all' && task.creator !== taskFilterCreator) return false;
    if (taskFilterStatus !== 'all' && task.status !== taskFilterStatus) return false;
    return true;
  });

  const totalTaskPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const totalCardPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  
  const paginatedTasks = filteredTasks.slice(
    (taskCurrentPage - 1) * TASKS_PER_PAGE,
    taskCurrentPage * TASKS_PER_PAGE
  );
  
  const paginatedCards = filteredCards.slice(
    (cardCurrentPage - 1) * CARDS_PER_PAGE,
    cardCurrentPage * CARDS_PER_PAGE
  );

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCards.length && filteredCards.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCards.map(c => c.id)));
    }
  };

  const handlePublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCard(id, { publishStatus: 'published' });
  };

  const handleUnpublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCard(id, { publishStatus: 'unpublished' });
  };

  const handleBatchPublish = () => {
    selectedIds.forEach(id => updateCard(id, { publishStatus: 'published' }));
    setSelectedIds(new Set());
  };

  const handleBatchUnpublish = () => {
    selectedIds.forEach(id => updateCard(id, { publishStatus: 'unpublished' }));
    setSelectedIds(new Set());
  };

  const handleBatchDownload = () => {
    console.log('Downloading selected items:', Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    deleteCards(selectedIds);
    setSelectedIds(new Set());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCards(new Set([id]));
    setOpenMenuId(null);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAITask(taskId);
    setOpenMenuId(null);
  };

  const handleRenameClick = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCard(card);
    setNewCardName(card.title);
    setRenameModalOpen(true);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = () => {
    if (editingCard && newCardName.trim()) {
      updateCard(editingCard.id, { title: newCardName.trim() });
      setRenameModalOpen(false);
      setEditingCard(null);
    }
  };

  const btnClass = "flex items-center gap-2 px-4 py-2 bg-[#e8f3f0] text-[#135c4a] rounded-md text-sm font-medium hover:bg-[#d1e6df] transition-colors";
  const iconBtnClass = "p-2 bg-[#e8f3f0] text-[#135c4a] hover:bg-[#d1e6df] rounded-md transition-colors";

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const renderTaskStatus = (status: AITask['status']) => {
    switch (status) {
      case 'generating':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            生成中
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            已完成
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            生成失败
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
            <CircleDashed className="w-3.5 h-3.5" />
            待处理
          </span>
        );
    }
  };

  const renderTaskImages = (task: AITask) => {
    if (task.status === 'generating') {
      const quantity = task.quantity || 4;
      return (
        <>
          {Array.from({ length: quantity }).map((_, i) => (
            <div 
              key={i}
              className="aspect-square rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ))}
        </>
      );
    }
    
    if (task.status === 'failed') {
      const quantity = task.quantity || 4;
      return (
        <>
          {Array.from({ length: quantity }).map((_, i) => (
            <div 
              key={i}
              className="aspect-square rounded-xl bg-red-50 border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle className="w-8 h-8 text-red-300" />
              <span className="text-xs text-red-400">生成失败</span>
            </div>
          ))}
        </>
      );
    }
    
    return task.images.map((image) => (
      <div 
        key={image.id}
        className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
      >
        <img 
          src={image.imageUrl} 
          alt={`Generated ${image.id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors">
            <Download className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-8 pt-6 pb-4 flex flex-col gap-4 sticky top-0 z-20 border-b border-slate-100">
          {activeTab === 'all' ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">图卡库</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => {
                      navigate('/library/ai-generate');
                      setSelectedIds(new Set());
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm bg-[#135c4a] text-white hover:bg-[#0f4a3b]"
                  >
                    <Wand2 className="w-4 h-4" />
                    AI生成图卡
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {selectedIds.size > 0 ? (
                    <>
                      <span className="text-sm font-medium text-slate-600 mr-2">已选择 {selectedIds.size} 项</span>
                      <button 
                        onClick={handleBatchPublish}
                        className={btnClass}
                      >
                        <Send className="w-4 h-4" />
                        批量发布
                      </button>
                      <button 
                        onClick={handleBatchUnpublish}
                        className={btnClass}
                      >
                        <Archive className="w-4 h-4" />
                        批量下架
                      </button>
                      <button 
                        onClick={handleBatchDownload}
                        className={btnClass}
                      >
                        <Download className="w-4 h-4" />
                        批量下载
                      </button>
                      <button 
                        onClick={handleBatchDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        批量删除
                      </button>
                      <button 
                        onClick={() => setSelectedIds(new Set())}
                        className={btnClass}
                      >
                        取消选择
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={toggleSelectAll}
                        className={btnClass}
                      >
                        全选
                      </button>
                      <button className={iconBtnClass} title="打印">
                        <Printer className="w-5 h-5" />
                      </button>
                      <button className={btnClass}>
                        <Upload className="w-4 h-4" />
                        上传图片
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigate('/library/all');
                  setSelectedIds(new Set());
                }}
                className="flex items-center gap-1 p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">返回</span>
              </button>
              <h2 className="text-2xl font-bold text-slate-800">AI生成图卡</h2>
            </div>
          )}
        </header>

        {activeTab === 'all' && (
          <div className="bg-white px-8 py-3 border-b border-slate-100 flex items-center gap-4 sticky top-[73px] z-10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="请输入名称"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent w-64 transition-shadow"
              />
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <select
              value={filterCreator}
              onChange={(e) => setFilterCreator(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent min-w-[140px] cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
            >
              <option value="all">所有创建人</option>
              {creators.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterPublishStatus}
              onChange={(e) => setFilterPublishStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent min-w-[140px] cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
            >
              <option value="all">所有状态</option>
              <option value="published">已发布</option>
              <option value="unpublished">未发布</option>
            </select>
          </div>
        )}

        <div className={cn("flex-1 bg-white", activeTab === 'ai-generate' ? "p-6 overflow-hidden" : "p-8 pt-6 overflow-y-auto")}>
          {activeTab === 'ai-generate' ? (
            <div className="flex gap-6 h-full">
              <div className="w-1/3 flex flex-col h-full">
                <AIGenerateView />
              </div>
              <div className="w-2/3 flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-white px-6 py-3 border-b border-slate-100 flex items-center gap-4 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="请输入任务名称"
                      value={taskSearchQuery}
                      onChange={(e) => setTaskSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent w-48 transition-shadow"
                    />
                  </div>
                  
                  <div className="h-6 w-px bg-slate-200 mx-2"></div>

                  <select
                    value={taskFilterCreator}
                    onChange={(e) => setTaskFilterCreator(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent min-w-[120px] cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
                  >
                    <option value="all">所有创建人</option>
                    {creators.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={taskFilterStatus}
                    onChange={(e) => setTaskFilterStatus(e.target.value as any)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent min-w-[120px] cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
                  >
                    <option value="all">全部状态</option>
                    <option value="completed">已完成</option>
                    <option value="generating">生成中</option>
                    <option value="failed">生成失败</option>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {aiTasks.length === 0 ? (
                    <div className="text-center py-20">
                      <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 text-lg">暂无AI生成任务</p>
                      <p className="text-slate-400 text-sm mt-2">请在左侧创建新任务</p>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20">
                      <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 text-lg">没有找到匹配的任务</p>
                      <p className="text-slate-400 text-sm mt-2">请尝试调整筛选条件</p>
                    </div>
                  ) : (
                    paginatedTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="p-6 border-b border-slate-100">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-800">{task.taskName}</h3>
                                {renderTaskStatus(task.status)}
                              </div>
                              <p className="text-slate-600 text-sm mb-3">{task.prompt}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                                  <span className="font-medium">风格:</span> {task.style}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                                  <span className="font-medium">尺寸:</span> {task.size}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                                  <span className="font-medium">数量:</span> {task.quantity || 4}张
                                </span>
                                <span className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border",
                                  task.isGroupImage 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                )}>
                                  <span className="font-medium">组图:</span> {task.isGroupImage ? '已开启' : '未开启'}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="font-medium">创建人:</span> 
                                  <span className="inline-flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                                      {task.creator.charAt(0)}
                                    </span>
                                    {task.creator}
                                  </span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-slate-400">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(task.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50/50">
                          <div className="grid grid-cols-4 gap-4">
                            {renderTaskImages(task)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <Pagination 
                    currentPage={taskCurrentPage} 
                    totalPages={totalTaskPages} 
                    onPageChange={setTaskCurrentPage} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginatedCards.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={(e) => toggleSelect(card.id, e)}
                    className={cn(
                      "group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col",
                      selectedIds.has(card.id) ? "border-[#135c4a] ring-2 ring-[#135c4a]/20 shadow-md" : "border-slate-200/60 shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "absolute top-3 left-3 z-20 transition-all duration-200",
                      selectedIds.has(card.id) ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                    )}>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(card.id, e as any);
                        }}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors shadow-sm",
                          selectedIds.has(card.id) 
                            ? "bg-[#135c4a] border-2 border-[#135c4a] text-white" 
                            : "bg-white/90 border-2 border-slate-300 text-transparent hover:border-[#135c4a]"
                        )}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </div>

                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                      <img 
                        src={card.imageUrl} 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-3 right-3 z-10">
                        {card.publishStatus === 'published' ? (
                          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 shadow-sm border border-white/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            已发布
                          </div>
                        ) : (
                          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 shadow-sm border border-white/20">
                            <CircleDashed className="w-3.5 h-3.5" />
                            未发布
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-[#135c4a] transition-colors line-clamp-1">{card.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4 flex-1 content-start">
                        {(card.sourceType === 'upload' || card.sourceType === 'ai' || card.sourceType === 'activity') && (
                          <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-200/60">
                            {card.sourceType === 'upload' && '用户上传'}
                            {card.sourceType === 'ai' && `AI生成：${card.taskName || '未知任务'}`}
                            {card.sourceType === 'activity' && `AI生成：${card.sourceActivity || '未知活动'}`}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                            {card.creator.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">{card.creator}</span>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === card.id ? null : card.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {openMenuId === card.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-200">
                              {card.publishStatus === 'published' ? (
                                <button 
                                  onClick={(e) => { handleUnpublish(card.id, e); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                                >
                                  <Archive className="w-4 h-4" />
                                  下架
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => { handlePublish(card.id, e); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
                                >
                                  <Send className="w-4 h-4" />
                                  发布
                                </button>
                              )}
                              <button 
                                onClick={(e) => handleRenameClick(card, e)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                修改名称
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                下载
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
                              >
                                <Printer className="w-4 h-4" />
                                打印
                              </button>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button 
                                onClick={(e) => handleDelete(card.id, e)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                删除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination 
                currentPage={cardCurrentPage} 
                totalPages={totalCardPages} 
                onPageChange={setCardCurrentPage} 
              />
            </div>
          )}
        </div>
      </div>

      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">修改名称</h3>
              <button 
                onClick={() => setRenameModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  图片名称
                </label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent transition-all"
                  placeholder="请输入新的名称"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit();
                    if (e.key === 'Escape') setRenameModalOpen(false);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setRenameModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={!newCardName.trim()}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#135c4a] hover:bg-[#0e4739] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
