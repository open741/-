import React, { useState, useEffect } from 'react';
import { Search, Printer, Upload, Sparkles, Edit2, Download, Trash2, ChevronDown, ChevronLeft, ChevronRight, CheckSquare, Square, Plus, PlusCircle, X, FolderOpen, MoreHorizontal, ListFilter } from 'lucide-react';
import { cn } from '../lib/utils';

const mockCards = [
  {
    id: 1,
    title: '哈哈哈哈哈哈哈哈',
    creator: '胡小桃',
    status: '已发布',
    activity: '认识水果',
    imageUrl: 'https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&q=80&w=400',
    selected: true,
  },
  {
    id: 2,
    title: '男孩站立',
    creator: '胡小桃',
    status: '未发布',
    activity: '日常行为',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 3,
    title: '男孩蹲下线稿',
    creator: '胡小桃',
    status: '未发布',
    activity: '涂色练习',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 4,
    title: '男孩观察瓢虫',
    creator: '胡小桃',
    status: '未发布',
    activity: '自然观察',
    imageUrl: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
  {
    id: 5,
    title: '男孩微笑',
    creator: '胡小桃',
    status: '未发布',
    activity: '情绪认知',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
  {
    id: 6,
    title: '男孩打篮球线稿',
    creator: '胡小桃',
    status: '未发布',
    activity: '体育运动',
    imageUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 7,
    title: '男孩科技感',
    creator: '胡小桃',
    status: '未发布',
    activity: '未来想象',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
  {
    id: 8,
    title: '男孩站立2',
    creator: '胡小桃',
    status: '未发布',
    activity: '日常行为',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 9,
    title: '男孩蹲下线稿2',
    creator: '胡小桃',
    status: '未发布',
    activity: '涂色练习',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 10,
    title: '男孩观察瓢虫2',
    creator: '胡小桃',
    status: '未发布',
    activity: '自然观察',
    imageUrl: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
  {
    id: 11,
    title: '男孩微笑2',
    creator: '胡小桃',
    status: '未发布',
    activity: '情绪认知',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
  {
    id: 12,
    title: '男孩打篮球线稿2',
    creator: '胡小桃',
    status: '未发布',
    activity: '体育运动',
    imageUrl: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&q=80&w=400',
    selected: false,
  },
  {
    id: 13,
    title: '男孩科技感2',
    creator: '胡小桃',
    status: '未发布',
    activity: '未来想象',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    selected: false,
    isAi: true,
  },
];

type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  cardIds: number[];
};

export default function GraphicLibraryV2() {
  const [cards, setCards] = useState(mockCards);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState<{id: string, type: 'lesson' | 'activity', label: string}[]>([]);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedSearchTags, setAppliedSearchTags] = useState<{id: string, type: 'lesson' | 'activity', label: string}[]>([]);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'f1', name: '交通工具', parentId: null, cardIds: [] },
    { id: 'f2', name: '水果', parentId: null, cardIds: [] },
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [activeFolderMenuId, setActiveFolderMenuId] = useState<string | null>(null);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [cardContextMenu, setCardContextMenu] = useState<{x: number, y: number, cardId: number, folderId: string} | null>(null);
  const [renameCardId, setRenameCardId] = useState<number | null>(null);
  const [renameCardValue, setRenameCardValue] = useState('');
  const [newFolderParentId, setNewFolderParentId] = useState<string | null | undefined>(undefined);
  const [pendingMoveCard, setPendingMoveCard] = useState<{cardId: number, sourceFolderId: string} | null>(null);

  useEffect(() => {
    const handleClick = () => {
      setActiveFolderMenuId(null);
      setCardContextMenu(null);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const openNewFolderModal = (parentId?: string | null, moveCard?: {cardId: number, sourceFolderId: string}) => {
    setNewFolderParentId(parentId !== undefined ? parentId : currentFolderId);
    setPendingMoveCard(moveCard || null);
    setNewFolderName('');
    setIsNewFolderModalOpen(true);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolderId = `f${Date.now()}`;
    const newFolder: Folder = {
      id: newFolderId,
      name: newFolderName.trim(),
      parentId: newFolderParentId !== undefined ? newFolderParentId : currentFolderId,
      cardIds: pendingMoveCard ? [pendingMoveCard.cardId] : []
    };
    
    let updatedFolders = [...folders, newFolder];
    if (pendingMoveCard) {
      updatedFolders = updatedFolders.map(f => {
        if (f.id === pendingMoveCard.sourceFolderId) {
          return { ...f, cardIds: f.cardIds.filter(id => id !== pendingMoveCard.cardId) };
        }
        return f;
      });
    }
    
    setFolders(updatedFolders);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
    setPendingMoveCard(null);
    setNewFolderParentId(undefined);
  };

  const moveCardToFolder = (cardId: number, sourceFolderId: string, targetFolderId: string) => {
    setFolders(folders.map(folder => {
      let newCardIds = [...folder.cardIds];
      let changed = false;
      if (folder.id === targetFolderId && !newCardIds.includes(cardId)) {
        newCardIds.push(cardId);
        changed = true;
      }
      if (folder.id === sourceFolderId && sourceFolderId !== targetFolderId) {
        newCardIds = newCardIds.filter(id => id !== cardId);
        changed = true;
      }
      return changed ? { ...folder, cardIds: newCardIds } : folder;
    }));
  };

  const getFolderItemCount = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return 0;
    const subFoldersCount = folders.filter(f => f.parentId === folderId).length;
    return folder.cardIds.length + subFoldersCount;
  };

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  const handleDragStart = (e: React.DragEvent, cardId: number, sourceFolderId?: string) => {
    e.dataTransfer.setData('cardId', cardId.toString());
    if (sourceFolderId) {
      e.dataTransfer.setData('sourceFolderId', sourceFolderId);
    }
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolderId(folderId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverFolderId(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    const getSubfolderIds = (id: string): string[] => {
      const children = folders.filter(f => f.parentId === id).map(f => f.id);
      return [id, ...children.flatMap(getSubfolderIds)];
    };
    const idsToDelete = getSubfolderIds(folderId);
    setFolders(folders.filter(f => !idsToDelete.includes(f.id)));
    setActiveFolderMenuId(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolderId(null);
    const cardIdStr = e.dataTransfer.getData('cardId');
    const sourceFolderId = e.dataTransfer.getData('sourceFolderId');
    
    if (cardIdStr) {
      const cardId = parseInt(cardIdStr);
      setFolders(folders.map(f => {
        let newCardIds = [...f.cardIds];
        let changed = false;
        
        if (f.id === targetFolderId && !newCardIds.includes(cardId)) {
          newCardIds.push(cardId);
          changed = true;
        }
        
        if (sourceFolderId && f.id === sourceFolderId && sourceFolderId !== targetFolderId) {
          newCardIds = newCardIds.filter(id => id !== cardId);
          changed = true;
        }
        
        return changed ? { ...f, cardIds: newCardIds } : f;
      }));
    }
  };

  const filteredCards = cards.filter(card => {
    if (appliedSearchTags.length === 0 && !appliedSearchQuery) return true;
    
    let isMatch = true;
    
    // Mock smart recommendation logic based on tags
    for (const tag of appliedSearchTags) {
      if (tag.type === 'lesson' && tag.label === '认识水果') {
        if (!(card.activity.includes('水果') || card.title.includes('水果'))) isMatch = false;
      }
      if (tag.type === 'activity' && tag.label === '户外运动') {
        if (!(card.activity.includes('运动') || card.title.includes('篮球'))) isMatch = false;
      }
    }
    
    // Normal search
    if (appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      const matchesText = card.title.toLowerCase().includes(query) || 
             card.activity.toLowerCase().includes(query) || 
             card.creator.toLowerCase().includes(query);
      if (!matchesText) isMatch = false;
    }

    return isMatch;
  });

  const removeTag = (id: string) => {
    setSearchTags(searchTags.filter(t => t.id !== id));
  };

  const selectedCount = cards.filter(c => c.selected).length;

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const filteredIds = new Set(filteredCards.map(c => c.id));
    setCards(cards.map(c => 
      filteredIds.has(c.id) ? { ...c, selected: newSelectAll } : c
    ));
  };

  const toggleSelect = (id: number) => {
    setCards(cards.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const renderCard = (card: any, folderId?: string) => (
    <div 
      key={card.id} 
      className="relative group cursor-pointer"
      onClick={() => toggleSelect(card.id)}
      draggable
      onDragStart={(e) => handleDragStart(e, card.id, folderId)}
      onContextMenu={(e) => {
        if (folderId) {
          e.preventDefault();
          setCardContextMenu({ x: e.clientX, y: e.clientY, cardId: card.id, folderId });
        }
      }}
    >
      {/* Image Container */}
      <div className={cn(
        "relative rounded-xl overflow-hidden border-2 transition-all aspect-square group-hover:rounded-b-none",
        card.selected ? "border-[#135c4a]" : "border-transparent group-hover:border-slate-200"
      )}>
        <img 
          src={card.imageUrl} 
          alt={card.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Left Checkbox */}
        <div className={cn(
          "absolute top-2 left-2 z-10",
          card.selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {card.selected ? (
            <CheckSquare className="w-5 h-5 text-[#135c4a] bg-white rounded-sm" />
          ) : (
            <Square className="w-5 h-5 text-white drop-shadow-md" />
          )}
        </div>

        {/* Top Right AI Label */}
        {card.isAi && (
          <div className="absolute top-2 right-2 text-[10px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
            AI生成
          </div>
        )}

        {/* Bottom Right Title Label */}
        <div className="absolute bottom-0 right-0 bg-black/40 text-white text-xs px-2 py-1 rounded-tl-lg backdrop-blur-sm max-w-[90%] truncate">
          {card.title}
        </div>
      </div>

      {/* Hover Overlay (Below Image) */}
      <div 
        className={cn(
          "absolute top-full left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none group-hover:pointer-events-auto",
          "bg-black/80 backdrop-blur-md rounded-b-xl p-3 flex flex-col gap-3",
          "border-2 border-t-0",
          card.selected ? "border-[#135c4a]" : "border-transparent group-hover:border-slate-200"
        )}
        style={{ marginTop: '-2px' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/80 bg-white/20 px-1.5 py-0.5 rounded">
            活动：{card.activity}
          </span>
          <span className="text-[10px] text-white/80 bg-white/20 px-1.5 py-0.5 rounded">
            {card.creator}
          </span>
        </div>
        <div className="flex items-center justify-between text-white/90">
          <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
            <Edit2 className="w-3 h-3" /> 重命名
          </button>
          <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
            <Download className="w-3 h-3" /> 下载
          </button>
          <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
            <Printer className="w-3 h-3" /> 打印
          </button>
          <button className="flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-3 h-3" /> 删除
          </button>
        </div>
      </div>
    </div>
  );

  const renderFolder = (folder: Folder) => {
    const firstCardId = folder.cardIds[0];
    const firstCard = cards.find(c => c.id === firstCardId);
    
    return (
      <div 
        key={folder.id}
        onClick={() => setCurrentFolderId(folder.id)}
        className={cn(
          "aspect-square flex flex-col rounded-xl border overflow-hidden hover:shadow-md transition-all cursor-pointer group",
          dragOverFolderId === folder.id ? "border-[#135c4a] ring-2 ring-[#135c4a]/20 bg-emerald-50" : "border-slate-200 bg-white"
        )}
        onDragOver={(e) => handleDragOver(e, folder.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, folder.id)}
      >
        <div className={cn(
          "flex-1 flex items-center justify-center transition-colors relative overflow-hidden",
          dragOverFolderId === folder.id ? "bg-emerald-50/50" : "bg-slate-50"
        )}>
          {firstCard ? (
            <>
              <img src={firstCard.imageUrl} alt={folder.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                <FolderOpen className="w-4 h-4 text-[#135c4a]" />
              </div>
            </>
          ) : (
            <div className={cn(
              "flex flex-col items-center gap-2 transition-colors",
              dragOverFolderId === folder.id ? "text-[#135c4a]" : "text-slate-400"
            )}>
              <div className="relative">
                <FolderOpen className={cn("w-8 h-8", dragOverFolderId === folder.id ? "opacity-100" : "opacity-50")} />
                {getFolderItemCount(folder.id) === 0 && <Sparkles className="w-3 h-3 absolute -top-1 -right-1 opacity-50" />}
              </div>
              <span className="text-xs">{getFolderItemCount(folder.id) > 0 ? `${getFolderItemCount(folder.id)} 个项目` : '暂无内容'}</span>
            </div>
          )}
        </div>
        <div className="p-3 flex items-center justify-between bg-white border-t border-slate-100 relative">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 truncate max-w-[100px]">{folder.name}</span>
            <span className="text-xs text-slate-400">{getFolderItemCount(folder.id)}</span>
          </div>
          <button 
            className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setActiveFolderMenuId(activeFolderMenuId === folder.id ? null : folder.id); 
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {activeFolderMenuId === folder.id && (
            <div className="absolute right-2 top-full mt-1 w-28 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-30">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setRenameFolderId(folder.id); 
                  setRenameValue(folder.name); 
                  setActiveFolderMenuId(null); 
                }} 
                className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
              >
                重命名
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteFolder(folder.id); 
                }} 
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                删除
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const folderCards = currentFolderId ? filteredCards.filter(c => folders.find(f => f.id === currentFolderId)?.cardIds.includes(c.id)) : [];
  const unclassifiedCards = filteredCards.filter(c => !folders.some(f => f.cardIds.includes(c.id)));

  const getBreadcrumbs = () => {
    const crumbs = [];
    let curr = currentFolderId;
    while (curr) {
      const f = folders.find(x => x.id === curr);
      if (f) {
        crumbs.unshift(f);
        curr = f.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };
  const breadcrumbs = getBreadcrumbs();

  const ContextMenuFolderList = ({ parentId }: { parentId: string | null }) => {
    const childFolders = folders.filter(f => f.parentId === parentId);
    return (
      <div className="absolute left-full top-0 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 -ml-1">
        {childFolders.map(f => (
          <ContextMenuItem key={f.id} folder={f} />
        ))}
        {childFolders.length > 0 && <div className="border-t border-slate-100 my-1"></div>}
        <button
          className="w-full text-left px-4 py-2 text-sm text-[#135c4a] hover:bg-emerald-50 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            if (cardContextMenu) {
              openNewFolderModal(parentId, { cardId: cardContextMenu.cardId, sourceFolderId: cardContextMenu.folderId });
              setCardContextMenu(null);
            }
          }}
        >
          <Plus className="w-4 h-4" /> 新建文件夹
        </button>
      </div>
    );
  };

  const ContextMenuItem = ({ folder }: { folder: Folder }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#135c4a] flex justify-between items-center"
          onClick={(e) => {
            e.stopPropagation();
            if (cardContextMenu) {
              moveCardToFolder(cardContextMenu.cardId, cardContextMenu.folderId, folder.id);
              setCardContextMenu(null);
            }
          }}
        >
          <span className="truncate">{folder.name}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        {isHovered && <ContextMenuFolderList parentId={folder.id} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 relative z-20 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">图卡库</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#135c4a] text-white rounded-md hover:bg-[#0f4a3b] transition-colors text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI生成图卡
          </button>
        </div>
        <button 
          onClick={() => setIsSmartSearchOpen(!isSmartSearchOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
            isSmartSearchOpen 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-emerald-50 text-[#135c4a] hover:bg-emerald-100'
          }`}
        >
          {isSmartSearchOpen ? (
            <>
              <X className="w-4 h-4" />
              收起智能搜索
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              智能搜索
            </>
          )}
        </button>
      </div>

      {/* Smart Search Area - Dropdown Animation */}
      <div 
        className={`transition-all duration-300 ease-in-out origin-top overflow-hidden border-b border-slate-100 bg-gradient-to-b from-emerald-50/50 to-white z-10 ${
          isSmartSearchOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="px-6 py-6 flex flex-col items-center justify-center relative">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#135c4a]" />
            智能搜索
          </h2>
          <div className="relative w-full max-w-4xl bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus-within:border-[#135c4a] focus-within:ring-4 focus-within:ring-[#135c4a]/10 transition-all overflow-hidden flex flex-col min-h-[120px]">
          <div className="p-4 pb-14 flex flex-col gap-2 flex-1">
            {searchTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchTags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-[#135c4a] border border-emerald-200 rounded-lg text-sm font-medium">
                    {tag.type === 'lesson' ? '教案：' : '活动：'}{tag.label}
                    <button onClick={() => removeTag(tag.id)} className="hover:text-emerald-700 ml-1 focus:outline-none">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <textarea 
              placeholder={searchTags.length === 0 ? "输入关键词，或使用右侧按钮结合教案/活动进行智能推荐..." : "继续输入关键词..."}
              className="w-full flex-1 resize-none bg-transparent focus:outline-none text-base text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setAppliedSearchQuery(searchQuery);
                  setAppliedSearchTags(searchTags);
                  setIsFoldersOpen(false);
                }
              }}
            />
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button 
              onClick={() => {
                if (!searchTags.find(t => t.type === 'lesson')) {
                  setSearchTags([...searchTags, { id: 'l1', type: 'lesson', label: '认识水果' }]);
                }
              }}
              className="h-10 px-3 flex items-center justify-center gap-1.5 rounded-[12px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
              title="加入教案"
            >
              <PlusCircle className="w-4 h-4" />
              教案
            </button>
            <button 
              onClick={() => {
                if (!searchTags.find(t => t.type === 'activity')) {
                  setSearchTags([...searchTags, { id: 'a1', type: 'activity', label: '户外运动' }]);
                }
              }}
              className="h-10 px-3 flex items-center justify-center gap-1.5 rounded-[12px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
              title="加入活动"
            >
              <PlusCircle className="w-4 h-4" />
              活动
            </button>
            <button 
              onClick={() => {
                setAppliedSearchQuery(searchQuery);
                setAppliedSearchTags(searchTags);
                setIsFoldersOpen(false);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-slate-200 bg-white text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
              title="发送搜索"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {currentFolderId === null ? (
          <>
            <div className="px-6 pt-6 flex flex-col gap-8">
              {/* Folders Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-900">
                  <button 
                    onClick={() => setIsFoldersOpen(!isFoldersOpen)}
                    className="flex items-center gap-2 hover:text-[#135c4a] transition-colors group"
                  >
                    <div className={`transition-transform duration-200 ${isFoldersOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#135c4a]" />
                    </div>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentFolderId(null)}
                      className="hover:text-[#135c4a] transition-colors text-slate-900"
                    >
                      文件夹
                    </button>
                    <span className="text-slate-400 ml-1">({currentFolders.length})</span>
                  </div>
                </div>
                
                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-all duration-300 origin-top overflow-hidden ${
                  isFoldersOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {/* New Folder */}
                  <button 
                    onClick={() => openNewFolderModal()}
                    className="aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-slate-600"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">新建文件夹</span>
                  </button>
                  {currentFolders.map(folder => renderFolder(folder))}
                </div>
              </div>

              {/* Unclassified Works Section Title */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-900">
                  {appliedSearchQuery || appliedSearchTags.length > 0 ? '搜索结果' : '未分类图卡'}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#135c4a] rounded-md hover:bg-emerald-100 transition-colors text-sm font-medium">
                      <Printer className="w-4 h-4" />
                      打印
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#135c4a] rounded-md hover:bg-emerald-100 transition-colors text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      上传图片
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                {(appliedSearchQuery || appliedSearchTags.length > 0 ? filteredCards : unclassifiedCards).map((card) => renderCard(card))}
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-4 text-sm text-slate-600">
              <span>共 {appliedSearchQuery || appliedSearchTags.length > 0 ? filteredCards.length : unclassifiedCards.length} 条</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#135c4a]">
                  <option>10条/页</option>
                  <option>20条/页</option>
                  <option>50条/页</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded text-[#135c4a] font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">5</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">6</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>前往</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#135c4a]">
                    <option>10</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <span>页</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full bg-slate-50/50">
            {/* Folder Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-lg">
                <button onClick={() => setCurrentFolderId(null)} className="text-slate-500 hover:text-[#135c4a] transition-colors font-medium">
                  全部图卡
                </button>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                    <button 
                      onClick={() => setCurrentFolderId(crumb.id)}
                      className={cn("transition-colors font-bold", index === breadcrumbs.length - 1 ? "text-slate-800" : "text-slate-500 hover:text-[#135c4a]")}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-8">
              {/* Folder Cards */}
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                  {/* New Folder Button */}
                  <button 
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="relative rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all aspect-square flex flex-col items-center justify-center gap-2 text-slate-600"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-sm font-medium">新建文件夹</span>
                  </button>
                  
                  {/* Subfolders */}
                  {currentFolders.map(folder => renderFolder(folder))}
                  
                  {/* Cards */}
                  {folderCards.map((card) => renderCard(card, currentFolderId))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[400px] p-6 text-slate-900 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">新建文件夹</h3>
              <button onClick={() => setIsNewFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">文件夹名称</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={20}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="请输入"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#135c4a] focus:ring-1 focus:ring-[#135c4a] transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {newFolderName.length} / 20
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleCreateFolder}
                className="px-4 py-2 rounded-lg bg-[#135c4a] text-white text-sm font-medium hover:bg-[#135c4a]/90 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Folder Modal */}
      {renameFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[400px] p-6 text-slate-900 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">重命名文件夹</h3>
              <button onClick={() => setRenameFolderId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">文件夹名称</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={20}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="请输入"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#135c4a] focus:ring-1 focus:ring-[#135c4a] transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {renameValue.length} / 20
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRenameFolderId(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (renameValue.trim()) {
                    setFolders(folders.map(f => f.id === renameFolderId ? { ...f, name: renameValue.trim() } : f));
                    setRenameFolderId(null);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#135c4a] text-white text-sm font-medium hover:bg-[#135c4a]/90 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Context Menu */}
      {cardContextMenu && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-100 py-1 w-40"
          style={{ top: cardContextMenu.y, left: cardContextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#135c4a] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const card = cards.find(c => c.id === cardContextMenu.cardId);
              if (card) {
                setRenameCardId(card.id);
                setRenameCardValue(card.title);
              }
              setCardContextMenu(null);
            }}
          >
            重命名
          </button>
          
          <div 
            className="relative"
            onMouseEnter={(e) => {
              const child = e.currentTarget.querySelector(':scope > .nested-menu');
              if (child) child.classList.remove('hidden');
            }}
            onMouseLeave={(e) => {
              const child = e.currentTarget.querySelector(':scope > .nested-menu');
              if (child) child.classList.add('hidden');
            }}
          >
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#135c4a] transition-colors flex justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              移动到...
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="nested-menu hidden">
              <ContextMenuFolderList parentId={null} />
            </div>
          </div>

          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setFolders(folders.map(f => 
                f.id === cardContextMenu.folderId 
                  ? { ...f, cardIds: f.cardIds.filter(id => id !== cardContextMenu.cardId) } 
                  : f
              ));
              setCardContextMenu(null);
            }}
          >
            从文件夹移除
          </button>
        </div>
      )}

      {/* Rename Card Modal */}
      {renameCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[400px] p-6 text-slate-900 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">重命名图卡</h3>
              <button onClick={() => setRenameCardId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">图卡名称</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={30}
                  value={renameCardValue}
                  onChange={(e) => setRenameCardValue(e.target.value)}
                  placeholder="请输入"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#135c4a] focus:ring-1 focus:ring-[#135c4a] transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {renameCardValue.length} / 30
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRenameCardId(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (renameCardValue.trim()) {
                    setCards(cards.map(c => c.id === renameCardId ? { ...c, title: renameCardValue.trim() } : c));
                    setRenameCardId(null);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#135c4a] text-white text-sm font-medium hover:bg-[#135c4a]/90 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
