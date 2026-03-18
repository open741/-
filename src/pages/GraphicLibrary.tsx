import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Upload, Wand2, Download, Trash2, Move, Printer, CheckCircle2, CircleDashed, RefreshCw, LayoutGrid, Image as ImageIcon, Type, Send, Archive, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import AIGenerateView from '../components/AIGenerateView';

type CardType = 'graphic' | 'word';
type SourceType = 'upload' | 'ai' | 'activity';

interface Card {
  id: string;
  type: CardType;
  title: string;
  imageUrl: string;
  tags: string[];
  publishStatus: 'published' | 'unpublished';
  sourceType: SourceType;
  sourceActivity?: string;
  posColor?: string;
  creator: string;
  partOfSpeech?: string;
}

const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    type: 'word',
    title: '苹果',
    imageUrl: 'https://picsum.photos/seed/apple/400/400',
    tags: ['名词', '水果'],
    publishStatus: 'published',
    sourceType: 'activity',
    sourceActivity: '认识水果',
    posColor: 'bg-blue-100 text-blue-700 border-blue-200',
    creator: '胡晓涛',
    partOfSpeech: '名词'
  },
  {
    id: '2',
    type: 'word',
    title: '吃',
    imageUrl: 'https://picsum.photos/seed/eat/400/400',
    tags: ['动词', '动作'],
    publishStatus: 'published',
    sourceType: 'activity',
    sourceActivity: '日常动作',
    posColor: 'bg-red-100 text-red-700 border-red-200',
    creator: '胡晓涛',
    partOfSpeech: '动词'
  },
  {
    id: '3',
    type: 'graphic',
    title: '红色小车',
    imageUrl: 'https://picsum.photos/seed/car/400/400',
    tags: ['交通工具', '玩具'],
    publishStatus: 'unpublished',
    sourceType: 'ai',
    creator: '胡晓涛'
  },
  {
    id: '4',
    type: 'word',
    title: '我',
    imageUrl: 'https://picsum.photos/seed/me/400/400',
    tags: ['代词', '人物'],
    publishStatus: 'published',
    sourceType: 'activity',
    sourceActivity: '自我认知',
    posColor: 'bg-green-100 text-green-700 border-green-200',
    creator: '胡晓涛',
    partOfSpeech: '代词'
  },
  {
    id: '5',
    type: 'graphic',
    title: '开心',
    imageUrl: 'https://picsum.photos/seed/happy/400/400',
    tags: ['情绪'],
    publishStatus: 'unpublished',
    sourceType: 'upload',
    creator: '胡晓涛'
  }
];

export default function GraphicLibrary() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const activeTab = (tab as 'ai-generate' | 'all' | 'graphic' | 'word') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCreator, setFilterCreator] = useState<string>('all');
  const [filterCardType, setFilterCardType] = useState<'all' | 'graphic' | 'word'>('all');
  const [filterPublishStatus, setFilterPublishStatus] = useState<'all' | 'published' | 'unpublished'>('all');
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCardName, setNewCardName] = useState('');

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const creators = Array.from(new Set(cards.map(c => c.creator))).filter(Boolean);

  const filteredCards = cards.filter(card => {
    if (activeTab !== 'all' && activeTab !== 'ai-generate' && card.type !== activeTab) return false;
    if (filterCardType !== 'all' && card.type !== filterCardType) return false;
    if (filterCreator !== 'all' && card.creator !== filterCreator) return false;
    if (filterPublishStatus !== 'all' && card.publishStatus !== filterPublishStatus) return false;
    if (searchQuery && !card.title.includes(searchQuery) && !card.tags.some(t => t.includes(searchQuery))) return false;
    return true;
  });

  const menuItems = [
    { id: 'ai-generate', label: 'AI生成图卡', icon: Wand2 },
    { id: 'all', label: '全部', icon: LayoutGrid },
    { id: 'graphic', label: '图卡', icon: ImageIcon },
    { id: 'word', label: '词卡', icon: Type },
  ] as const;

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
    setCards(cards.map(c => c.id === id ? { ...c, publishStatus: 'published' } : c));
  };

  const handleUnpublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCards(cards.map(c => c.id === id ? { ...c, publishStatus: 'unpublished' } : c));
  };

  const handleBatchPublish = () => {
    setCards(cards.map(c => selectedIds.has(c.id) ? { ...c, publishStatus: 'published' } : c));
    setSelectedIds(new Set());
  };

  const handleBatchUnpublish = () => {
    setCards(cards.map(c => selectedIds.has(c.id) ? { ...c, publishStatus: 'unpublished' } : c));
    setSelectedIds(new Set());
  };

  const handleBatchDownload = () => {
    // Placeholder for batch download
    console.log('Downloading selected items:', Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    const idsToDelete = new Set(
      cards.filter(c => selectedIds.has(c.id)).map(c => c.id)
    );
    setCards(cards.filter(c => !idsToDelete.has(c.id)));
    setSelectedIds(new Set());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCards(cards.filter(c => c.id !== id));
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
      setCards(cards.map(c => c.id === editingCard.id ? { ...c, title: newCardName.trim() } : c));
      setRenameModalOpen(false);
      setEditingCard(null);
    }
  };

  const btnClass = "flex items-center gap-2 px-4 py-2 bg-[#e8f3f0] text-[#135c4a] rounded-md text-sm font-medium hover:bg-[#d1e6df] transition-colors";
  const iconBtnClass = "p-2 bg-[#e8f3f0] text-[#135c4a] hover:bg-[#d1e6df] rounded-md transition-colors";

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar Menu */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 py-4">
        <div className="px-3 mb-6">
          <button
            onClick={() => {
              navigate('/library/ai-generate');
              setSelectedIds(new Set());
            }}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm",
              activeTab === 'ai-generate'
                ? "bg-[#0f4a3b] text-white ring-2 ring-[#0f4a3b] ring-offset-2"
                : "bg-[#135c4a] text-white hover:bg-[#0f4a3b]"
            )}
          >
            <Wand2 className="w-4 h-4" />
            AI生成图卡
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.filter(item => item.id !== 'ai-generate').map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(`/library/${item.id}`);
                setSelectedIds(new Set());
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-[#e8f3f0] text-[#135c4a]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {menuItems.find(m => m.id === activeTab)?.label || '图卡库'}
            </h2>
          </div>

          {activeTab !== 'ai-generate' && (
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
          )}
        </header>

        {/* Filter Bar */}
        {activeTab !== 'ai-generate' && (
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
              value={filterCardType}
              onChange={(e) => setFilterCardType(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135c4a] focus:border-transparent min-w-[140px] cursor-pointer hover:bg-slate-100 transition-colors text-slate-700"
            >
              <option value="all">所有类型</option>
              <option value="graphic">图卡</option>
              <option value="word">词卡</option>
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

        {/* Content */}
        <div className="flex-1 p-8 pt-6 overflow-y-auto bg-white">
          {activeTab === 'ai-generate' ? (
            <AIGenerateView />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCards.map((card) => (
                <div 
                  key={card.id} 
                  onClick={(e) => toggleSelect(card.id, e)}
                  className={cn(
                    "group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col",
                    selectedIds.has(card.id) ? "border-[#135c4a] ring-2 ring-[#135c4a]/20 shadow-md" : "border-slate-200/60 shadow-sm"
                  )}
                >
                  {/* Checkbox Overlay */}
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
                    {/* Subtle gradient overlay for depth */}
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
                      {card.type === 'word' ? (
                        <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md ml-2">词卡</span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md ml-2">图卡</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4 flex-1 content-start">
                      <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-200/60">
                        {card.sourceType === 'upload' && '用户上传'}
                        {card.sourceType === 'ai' && 'AI生成'}
                        {card.sourceType === 'activity' && `活动: ${card.sourceActivity}`}
                      </span>
                      {card.sourceType === 'activity' && card.partOfSpeech && (
                        <span className={cn("inline-flex items-center text-[11px] px-2.5 py-1 rounded-md font-medium border", card.posColor || "bg-slate-50 text-slate-600 border-slate-200/60")}>
                          {card.partOfSpeech}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
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

                        {/* Dropdown Menu */}
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
          )}
        </div>
      </div>

      {/* Rename Modal */}
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
