import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Printer, Upload, Sparkles, Edit2, Download, Trash2, ChevronDown, ChevronLeft, ChevronRight, CheckSquare, Square, Plus, PlusCircle, X, FolderOpen, MoreHorizontal, ListFilter, RefreshCw } from 'lucide-react';
import { cn, generatePlaceholder } from '../lib/utils';

const mockLessons = [
  { id: 'l1', title: '认识水果' },
  { id: 'l2', title: '春天在哪里' },
  { id: 'l3', title: '我的身体' },
  { id: 'l4', title: '交通工具对对碰' },
  { id: 'l5', title: '认识颜色' },
];

const mockActivities = [
  { id: 'a1', title: '户外运动' },
  { id: 'a2', title: '涂色练习' },
  { id: 'a3', title: '日常行为' },
  { id: 'a4', title: '情绪认知' },
  { id: 'a5', title: '数学游戏' },
];

const mockCards = [
  {
    id: 1,
    title: '哈哈哈哈哈哈哈哈',
    creator: '胡小桃',
    status: '已发布',
    activity: '认识水果',
    imageUrl: generatePlaceholder('Img_1', '图卡1'),
    selected: false,
    isSystem: true,
  },
  {
    id: 2,
    title: '男孩站立',
    creator: '胡小桃',
    status: '未发布',
    activity: '日常行为',
    imageUrl: generatePlaceholder('Img_2', '图卡2'),
    selected: false,
    isSystem: true,
  },
  {
    id: 3,
    title: '男孩蹲下线稿',
    creator: '胡小桃',
    status: '未发布',
    activity: '涂色练习',
    imageUrl: generatePlaceholder('Img_3', '图卡3'),
    selected: false,
    isSystem: true,
  },
  {
    id: 4,
    title: '男孩观察瓢虫',
    creator: '胡小桃',
    status: '未发布',
    activity: '自然观察',
    imageUrl: generatePlaceholder('Img_4', '图卡4'),
    selected: false,
    isAi: true,
    isSystem: true,
  },
  {
    id: 5,
    title: '男孩微笑',
    creator: '胡小桃',
    status: '未发布',
    activity: '情绪认知',
    imageUrl: generatePlaceholder('Img_5', '图卡5'),
    selected: false,
    isAi: false,
    isSystem: true,
  },
  {
    id: 6,
    title: '男孩打篮球线稿',
    creator: '胡小桃',
    status: '未发布',
    activity: '体育运动',
    imageUrl: generatePlaceholder('Img_6', '图卡6'),
    selected: false,
    isSystem: true,
  },
  {
    id: 7,
    title: '男孩科技感',
    creator: '胡小桃',
    status: '未发布',
    activity: '未来想象',
    imageUrl: generatePlaceholder('Img_7', '图卡7'),
    selected: false,
    isAi: true,
    isSystem: true,
  },
  {
    id: 8,
    title: '男孩站立2',
    creator: '胡小桃',
    status: '未发布',
    activity: '日常行为',
    imageUrl: generatePlaceholder('Img_8', '图卡8'),
    selected: false,
    isSystem: true,
  },
  {
    id: 9,
    title: '男孩蹲下线稿2',
    creator: '胡小桃',
    status: '未发布',
    activity: '涂色练习',
    imageUrl: generatePlaceholder('Img_9', '图卡9'),
    selected: false,
    isSystem: true,
  },
  {
    id: 10,
    title: '男孩观察瓢虫2',
    creator: '胡小桃',
    status: '未发布',
    activity: '自然观察',
    imageUrl: generatePlaceholder('Img_10', '图卡10'),
    selected: false,
    isAi: true,
    isSystem: true,
  },
  {
    id: 11,
    title: '男孩微笑2',
    creator: '胡小桃',
    status: '未发布',
    activity: '情绪认知',
    imageUrl: generatePlaceholder('Img_11', '图卡11'),
    selected: false,
    isAi: true,
    isSystem: true,
  },
  {
    id: 12,
    title: '男孩打篮球线稿2',
    creator: '胡小桃',
    status: '未发布',
    activity: '体育运动',
    imageUrl: generatePlaceholder('Img_12', '图卡12'),
    selected: false,
    isSystem: true,
  },
  {
    id: 13,
    title: '男孩科技感2',
    creator: '胡小桃',
    status: '未发布',
    activity: '未来想象',
    imageUrl: generatePlaceholder('Img_13', '图卡13'),
    selected: false,
    isAi: true,
    isSystem: true,
  },
  {
    id: 14,
    title: '可爱小猫',
    creator: '胡小桃',
    status: '已发布',
    activity: '生物认知',
    imageUrl: generatePlaceholder('Img_14', '图卡14'),
    selected: false,
  },
  {
    id: 15,
    title: '金毛寻回犬',
    creator: '胡小桃',
    status: '已发布',
    activity: '生物认知',
    imageUrl: generatePlaceholder('Img_15', '图卡15'),
    selected: false,
  },
  {
    id: 16,
    title: '雨天窗外',
    creator: '胡小桃',
    status: '未发布',
    activity: '天气认知',
    imageUrl: generatePlaceholder('Img_16', '图卡16'),
    selected: false,
  },
  {
    id: 17,
    title: '彩虹',
    creator: '胡小桃',
    status: '已发布',
    activity: '自然景观',
    imageUrl: generatePlaceholder('Img_17', '图卡17'),
    selected: false,
    isAi: true,
  },
  {
    id: 18,
    title: '课堂阅读',
    creator: '胡小桃',
    status: '未发布',
    activity: '日常学习',
    imageUrl: generatePlaceholder('Img_18', '图卡18'),
    selected: false,
  },
  {
    id: 19,
    title: '课间休息',
    creator: '胡小桃',
    status: '已发布',
    activity: '日常学习',
    imageUrl: generatePlaceholder('Img_19', '图卡19'),
    selected: false,
  },
  {
    id: 20,
    title: '彩色画笔',
    creator: '胡小桃',
    status: '未发布',
    images: [
        generatePlaceholder('Img_20', '图卡20'),
        generatePlaceholder('Img_21', '图卡21'),
        generatePlaceholder('Img_22', '图卡22'),
        generatePlaceholder('Img_23', '图卡23')
      ],
    activity: '美术手工',
    selected: false,
  },
  {
    id: 21,
    title: '剪影画作',
    creator: '刘老师',
    status: '未发布',
    activity: '创意手工',
    imageUrl: generatePlaceholder('Upload_1', '用户上传自传'),
    selected: false,
    isUpload: true,
  },
  {
    id: 22,
    title: '手工风车',
    creator: '刘老师',
    status: '未发布',
    activity: '自然体验',
    imageUrl: generatePlaceholder('Upload_2', '课堂照片'),
    selected: false,
    isUpload: true,
  },
];

const mockCardDetails: Record<number, any> = {
  4: {
    taskName: '自然观察任务',
    description: '一个写实风格的男孩正在森林里观察一只红色的瓢虫，瓢虫停在一片绿叶上，背景是模糊的森林绿意，色调柔和。',
    style: '写实',
    size: '1:1',
    count: '4张',
    isGroup: '组图',
    chinese: '男孩观察瓢虫',
    english: 'Boy observing a ladybug',
    siblings: [
      generatePlaceholder('Img_25', '图卡25'),
      generatePlaceholder('Img_26', '图卡26'),
      generatePlaceholder('Img_27', '图卡27'),
      generatePlaceholder('Img_28', '图卡28')
    ]
  },
  7: {
    taskName: '科技男孩系列',
    description: '一个充满科技感的男孩，穿着发光的未来服饰，身处赛博朋克风的城市实验室，周围有全息投影，冷色调。',
    style: '3D',
    size: '1:1',
    count: '4张',
    isGroup: '组图',
    chinese: '科技感男孩',
    english: 'Tech-savvy boy',
    siblings: [
      generatePlaceholder('Img_29', '图卡29'),
      generatePlaceholder('Img_30', '图卡30'),
      generatePlaceholder('Img_31', '图卡31'),
      generatePlaceholder('Img_32', '图卡32')
    ]
  }
};


type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  cardIds: number[];
  isSystem?: boolean;
};

export default function GraphicLibraryV2() {
  const navigate = useNavigate();
  const [cards, setCards] = useState(mockCards);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState<{id: string, type: 'lesson' | 'activity', label: string}[]>([]);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedSearchTags, setAppliedSearchTags] = useState<{id: string, type: 'lesson' | 'activity', label: string}[]>([]);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([
    // 用户自定义文件夹
    { id: 'usr_1', name: '自然主题图卡', parentId: null, cardIds: [14, 15, 17] },
    { id: 'usr_2', name: '日常课件素材', parentId: null, cardIds: [18, 19, 21, 22] },

    // Level 1: 基础认知层
    { id: 'sys_1', name: '基础认知层', parentId: null, cardIds: [], isSystem: true },
    { id: 'sys_1_1', name: '常见食物', parentId: 'sys_1', cardIds: [1], isSystem: true },
    { id: 'sys_1_2', name: '居家生活', parentId: 'sys_1', cardIds: [2, 16], isSystem: true },
    { id: 'sys_1_3', name: '身体感官', parentId: 'sys_1', cardIds: [5], isSystem: true },
    
    // Level 1: 核心功能层
    { id: 'sys_2', name: '核心功能层', parentId: null, cardIds: [], isSystem: true },
    { id: 'sys_2_1', name: '日常动作', parentId: 'sys_2', cardIds: [3, 8, 20], isSystem: true },
    { id: 'sys_2_2', name: '生理调节', parentId: 'sys_2', cardIds: [9], isSystem: true },
    { id: 'sys_2_3', name: '数量逻辑', parentId: 'sys_2', cardIds: [6], isSystem: true },
    
    // Level 1: 社会化层
    { id: 'sys_3', name: '社会化层', parentId: null, cardIds: [], isSystem: true },
    { id: 'sys_3_1', name: '场景社交', parentId: 'sys_3', cardIds: [4, 10], isSystem: true },
    { id: 'sys_3_2', name: '需求表达', parentId: 'sys_3', cardIds: [11], isSystem: true },
    { id: 'sys_3_3', name: '事务关系', parentId: 'sys_3', cardIds: [7, 12, 13], isSystem: true },
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

  // Smart Search Modal States
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [lessonSearchText, setLessonSearchText] = useState('');
  const [activitySearchText, setActivitySearchText] = useState('');

  // Card Detail Modal States
  const [selectedDetailCard, setSelectedDetailCard] = useState<any>(null);
  const [currentDetailImage, setCurrentDetailImage] = useState<string | null>(null);

  // Persistence Hook: Load AI-generated cards from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('ai_tasks') || '[]');
    if (storedTasks.length > 0) {
      const generatedCards = storedTasks.flatMap((task: any) => task.images.map((img: string, idx: number) => ({
        id: typeof task.id === 'number' ? task.id * 100 + idx : parseInt(`${task.id}${idx}`),
        title: task.images.length > 1 ? `${task.title} - ${idx + 1}` : task.title,
        creator: task.creator,
        status: '未发布',
        activity: task.params.style + '系列',
        imageUrl: img,
        selected: false,
        isAi: true,
        description: task.desc,
        taskName: task.title,
        style: task.params.style,
        size: task.params.size,
        count: '1张',
        siblings: []
      })));

      // Combine with existing cards, avoiding duplicates
      const deletedAiIds = new Set(JSON.parse(localStorage.getItem('deleted_ai_cards') || '[]'));
      setCards(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNew = generatedCards.filter((c: any) => !existingIds.has(c.id) && !deletedAiIds.has(c.id));
        return [...uniqueNew, ...prev.filter((c: any) => !deletedAiIds.has(c.id))];
      });

      // Update mockDetails for modal
      generatedCards.forEach((c: any) => {
        mockCardDetails[c.id] = {
           taskName: c.taskName,
           description: c.description,
           style: c.style,
           size: c.size,
           count: c.count,
           siblings: c.siblings
        };
      });
    }
  }, []);

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

  const currentFolders = folders.filter(f => f.parentId === currentFolderId).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0));

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

  const handleDeleteCards = (idsToDelete: number[]) => {
    const deletedIds = JSON.parse(localStorage.getItem('deleted_ai_cards') || '[]');
    const newDeletedIds = [...new Set([...deletedIds, ...idsToDelete])];
    localStorage.setItem('deleted_ai_cards', JSON.stringify(newDeletedIds));

    setCards(prevCards => prevCards.filter(c => !idsToDelete.includes(c.id)));
    setFolders(prevFolders => prevFolders.map(f => ({
      ...f,
      cardIds: f.cardIds.filter(id => !idsToDelete.includes(id))
    })));
    setSelectAll(false);
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

  const renderCard = (card: any, folderId?: string | null) => {
    const isSystemFolder = folderId ? folders.find(f => f.id === folderId)?.isSystem : false;
    const isSystemCardRecord = !!card.isSystem;
    const isActionRestricted = isSystemCardRecord && (isSystemFolder || !folderId);

    return (
      <div 
        key={card.id} 
        className="relative group cursor-pointer"
        onClick={() => setSelectedDetailCard(card)}
        draggable
        onDragStart={(e) => handleDragStart(e, card.id, folderId || undefined)}
        onContextMenu={(e) => {
          if (folderId && !isActionRestricted) {
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
          <div 
            className={cn(
              "absolute top-2 left-2 z-10",
              card.selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelect(card.id);
            }}
          >
            {card.selected ? (
              <CheckSquare className="w-5 h-5 text-[#135c4a] bg-white rounded-sm" />
            ) : (
              <Square className="w-5 h-5 text-white drop-shadow-md" />
            )}
          </div>

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
              {isSystemCardRecord ? '系统内置' : card.isUpload ? '用户上传' : 'AI生成'}
            </span>
            <span className="text-[10px] text-white/80 bg-white/20 px-1.5 py-0.5 rounded">
              {card.creator}
            </span>
          </div>
          <div className="flex items-center justify-between text-white/90">
            {!isActionRestricted && (
              <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Edit2 className="w-3 h-3" /> 重命名
              </button>
            )}
            <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
              <Download className="w-3 h-3" /> 下载
            </button>
            <button className="flex items-center gap-1 text-[11px] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
              <Printer className="w-3 h-3" /> 打印
            </button>
            {!isActionRestricted && !folderId && (
              <button className="flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteCards([card.id]); }}>
                <Trash2 className="w-3 h-3" /> 删除
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFolder = (folder: Folder) => {
    const firstCardId = folder.cardIds[0];
    const firstCard = cards.find(c => c.id === firstCardId);
    
    return (
      <div 
        key={folder.id}
        onClick={() => setCurrentFolderId(folder.id)}
        className={cn(
          "aspect-square flex flex-col rounded-xl border hover:shadow-md transition-all cursor-pointer group",
          dragOverFolderId === folder.id ? "border-[#135c4a] ring-2 ring-[#135c4a]/20 bg-emerald-50" : "border-slate-200 bg-white"
        )}
        onDragOver={(e) => handleDragOver(e, folder.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, folder.id)}
      >
        <div className={cn(
          "flex-1 flex items-center justify-center transition-colors relative overflow-hidden rounded-t-[11px]",
          dragOverFolderId === folder.id ? "bg-emerald-50/50" : "bg-slate-100"
        )}>
          {folder.isSystem ? (
            <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-emerald-600 via-[#135c4a] to-slate-900 group-hover:scale-105 transition-transform duration-500">
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:20px_20px]"></div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl ring-1 ring-white/10">
                  <FolderOpen className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-[#135c4a]/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-white/10">
                <span className="text-[10px] text-white/90 font-bold tracking-wider">SYSTEM</span>
              </div>
            </div>
          ) : firstCard ? (
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
                <FolderOpen className={cn("w-10 h-10", (dragOverFolderId === folder.id) ? "opacity-100 text-[#135c4a]" : "opacity-50")} />
                {!folder.isSystem && <Sparkles className="w-3 h-3 absolute -top-1 -right-1 opacity-50" />}
              </div>
              <span className="text-xs font-medium">{getFolderItemCount(folder.id) > 0 ? `${getFolderItemCount(folder.id)} 个项目` : '暂无内容'}</span>
            </div>
          )}
        </div>
        <div className="p-3 flex items-center justify-between bg-white border-t border-slate-100 relative rounded-b-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 truncate max-w-[100px]">{folder.name}</span>
            <span className="text-xs text-slate-400">{getFolderItemCount(folder.id)}</span>
            {folder.isSystem && (
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md border border-slate-200 font-medium">系统内置</span>
            )}
          </div>
          {!folder.isSystem && (
            <button 
              className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveFolderMenuId(activeFolderMenuId === folder.id ? null : folder.id); 
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
          
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

  const folderCards = currentFolderId ? filteredCards.filter(c => folders.find(f => f.id === currentFolderId)?.cardIds.includes(c.id)).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0)) : [];
  const unclassifiedCards = filteredCards.filter(c => !folders.some(f => f.cardIds.includes(c.id))).sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0));

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

  function ContextMenuFolderList({ parentId }: { parentId: string | null }) {
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

  function ContextMenuItem({ folder }: { folder: Folder; key?: React.Key }) {
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
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 relative z-30 bg-white">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">图卡库</h1>
          <div className="h-6 w-px bg-slate-200" />
          <button 
            onClick={() => navigate('/ai-generation')}
            className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] text-white rounded-full hover:bg-[#0f4a3b] transition-all shadow-sm hover:shadow-md text-sm font-semibold active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            AI生成图卡
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (isSmartSearchOpen) {
                // Exit logic
                setIsSmartSearchOpen(false);
                setSearchQuery('');
                setSearchTags([]);
                setAppliedSearchQuery('');
                setAppliedSearchTags([]);
                setIsFoldersOpen(true);
              } else {
                // Enter logic
                setIsSmartSearchOpen(true);
              }
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold text-sm border-2",
              isSmartSearchOpen 
                ? "bg-slate-800 border-slate-800 text-white shadow-lg" 
                : "bg-emerald-50 border-emerald-100 text-[#135c4a] hover:bg-emerald-100 hover:border-emerald-200"
            )}
          >
            {isSmartSearchOpen ? (
              <>
                <X className="w-4 h-4 animate-in fade-in zoom-in duration-300" />
                <span>退出智能搜索</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 animate-in fade-in zoom-in duration-300" />
                <span>进入智能搜索</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Smart Search Area - Dropdown Animation */}
      <div 
        className={`transition-all duration-300 ease-in-out origin-top overflow-hidden border-b border-slate-100 bg-gradient-to-b from-emerald-50/50 to-white z-10 ${
          isSmartSearchOpen ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="px-6 py-4 flex items-center gap-4 relative mx-auto">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-5 h-5 text-[#135c4a]" />
            智能搜索
          </h2>
          <div className="relative flex-1 bg-white border-2 border-slate-200 rounded-full shadow-sm focus-within:border-[#135c4a] focus-within:ring-2 focus-within:ring-[#135c4a]/10 transition-all overflow-hidden flex items-center h-12">
            <div className="flex-1 flex items-center gap-2 px-4 h-full">
              {searchTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  {searchTags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#135c4a] border border-emerald-200 rounded-full text-xs font-medium whitespace-nowrap">
                      {tag.type === 'lesson' ? '教案：' : '活动：'}{tag.label}
                      <button onClick={() => removeTag(tag.id)} className="hover:text-emerald-700 ml-0.5 focus:outline-none">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input 
                placeholder={searchTags.length === 0 ? "请描述想搜索的内容，或添加教案和活动进行搜索" : "继续输入..."}
                className="flex-1 bg-transparent focus:outline-none text-sm text-slate-700 min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setAppliedSearchQuery(searchQuery);
                    setAppliedSearchTags(searchTags);
                    setIsFoldersOpen(false);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2 pr-2 h-full">
              <button 
                onClick={() => setIsLessonModalOpen(true)}
                className="h-8 px-3 flex items-center justify-center gap-1.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors text-xs font-medium"
                title="添加教案"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                教案
              </button>
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="h-8 px-3 flex items-center justify-center gap-1.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors text-xs font-medium"
                title="添加活动"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                活动
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button 
                onClick={() => {
                  setAppliedSearchQuery(searchQuery);
                  setAppliedSearchTags(searchTags);
                  setIsFoldersOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#135c4a] text-white hover:bg-[#0f4a3b] transition-colors shadow-sm"
                title="发送搜索"
              >
                <Search className="w-4 h-4" />
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
                
                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-all duration-300 origin-top ${
                  isFoldersOpen ? 'max-h-[2000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'
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
              <div className="flex flex-col gap-4">
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

                {/* Bulk Actions Bar */}
                <div className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={toggleSelectAll}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                        selectAll 
                          ? "bg-[#135c4a] text-white" 
                          : "bg-emerald-50 text-[#135c4a] hover:bg-emerald-100"
                      )}
                    >
                      全选
                    </button>
                    <span className="text-sm text-slate-400">已选{selectedCount}项</span>
                  </div>

                  {selectedCount > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                      <button className="px-4 py-1.5 bg-emerald-50 text-[#135c4a] rounded-md hover:bg-emerald-100 transition-colors text-sm font-medium">
                        批量打印
                      </button>
                      <button className="px-4 py-1.5 bg-emerald-50 text-[#135c4a] rounded-md hover:bg-emerald-100 transition-colors text-sm font-medium">
                        批量下载
                      </button>
                      <button onClick={() => handleDeleteCards(cards.filter(c => c.selected).map(c => c.id))} className="px-4 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors text-sm font-medium">
                        批量删除
                      </button>
                      <button 
                        onClick={() => setCards(cards.map(c => ({ ...c, selected: false })))}
                        className="px-4 py-1.5 bg-emerald-50 text-[#135c4a] rounded-md hover:bg-emerald-100 transition-colors text-sm font-medium"
                      >
                        取消选择
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                {(appliedSearchQuery || appliedSearchTags.length > 0 ? filteredCards : unclassifiedCards).map((card) => renderCard(card, null))}
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

      {/* Lesson Selection Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 shadow-2xl backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[480px] max-h-[80vh] flex flex-col p-6 text-slate-900 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#135c4a] rounded-full" />
                选择教案
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索教案名称..."
                value={lessonSearchText}
                onChange={(e) => setLessonSearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#135c4a] transition-all"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 mb-6">
              {mockLessons.filter(l => l.title.includes(lessonSearchText)).map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    if (!searchTags.find(t => t.id === lesson.id)) {
                      setSearchTags([...searchTags.filter((t: any) => t.type !== 'lesson' && t.type !== 'activity'), { id: lesson.id, type: 'lesson', label: lesson.title }]);
                    }
                    setIsLessonModalOpen(false);
                    setLessonSearchText('');
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#135c4a]">{lesson.title}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#135c4a] group-hover:bg-[#135c4a]/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#135c4a]/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Selection Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 shadow-2xl backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[480px] max-h-[80vh] flex flex-col p-6 text-slate-900 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                选择活动
              </h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索活动名称..."
                value={activitySearchText}
                onChange={(e) => setActivitySearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 mb-6">
              {mockActivities.filter(a => a.title.includes(activitySearchText)).map(activity => (
                <button
                  onClick={() => {
                    if (!searchTags.find(t => t.id === activity.id)) {
                      setSearchTags([...searchTags.filter((t: any) => t.type !== 'activity' && t.type !== 'lesson'), { id: activity.id, type: 'activity', label: activity.title }]);
                    }
                    setIsActivityModalOpen(false);
                    setActivitySearchText('');
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600">{activity.title}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-emerald-500/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedDetailCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-[90vw] max-w-6xl h-[85vh] rounded-3xl overflow-hidden flex shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Left: Image Viewer */}
            <div className="flex-1 bg-slate-900 relative flex items-center justify-center group/viewer">
              <img 
                src={currentDetailImage || selectedDetailCard.imageUrl} 
                className="max-w-full max-h-full object-contain"
                alt="Preview"
                referrerPolicy="no-referrer"
              />
              
              {/* Close Button */}
              <button 
                onClick={() => { setSelectedDetailCard(null); setCurrentDetailImage(null); }}
                className="absolute top-6 left-6 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-xl backdrop-blur-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Upload Card Floating Actions */}
              {(selectedDetailCard.isUpload || selectedDetailCard.isSystem) && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl text-white shadow-2xl">
                  <button className="flex flex-col items-center gap-1.5 hover:text-emerald-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Download className="w-5 h-5" />
                    <span className="text-xs font-medium">下载</span>
                  </button>
                  {!selectedDetailCard.isSystem && (
                    <>
                      <div className="w-px h-8 bg-white/20 mx-2"></div>
                      <button className="flex flex-col items-center gap-1.5 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-5 h-5" />
                        <span className="text-xs font-medium">删除</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Info Panel */}
            {!(selectedDetailCard.isUpload || selectedDetailCard.isSystem) && (
            <div className="w-[400px] flex flex-col bg-white border-l border-slate-100">
              <div className="p-6 flex items-center justify-end border-b border-slate-50 h-16">
                {/* Removed MoreHorizontal button */}
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar-light">
                {/* Sibling List */}
                {false && (
                  <div className="grid grid-cols-4 gap-2">
                     {mockCardDetails[selectedDetailCard.id].siblings.map((img: string, idx: number) => (
                       <div 
                         key={idx} 
                         onClick={() => setCurrentDetailImage(img)}
                         className={cn(
                           "aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                           (currentDetailImage === img || (!currentDetailImage && selectedDetailCard.imageUrl === img)) ? "border-[#135c4a] ring-2 ring-[#135c4a]/10" : "border-transparent opacity-60 hover:opacity-100"
                         )}
                       >
                         <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       </div>
                     ))}
                  </div>
                )}

                {/* Task Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">任务名称</h4>
                    <p className="text-lg font-bold text-slate-800">{mockCardDetails[selectedDetailCard.id]?.taskName || selectedDetailCard.title}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">画面描述</h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {mockCardDetails[selectedDetailCard.id]?.description || '暂无描述信息'}
                    </p>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-medium text-slate-500">
                    <span className="px-2 py-1 bg-slate-100 rounded">{mockCardDetails[selectedDetailCard.id]?.style || '默认风格'}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{mockCardDetails[selectedDetailCard.id]?.size || '1:1'}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{mockCardDetails[selectedDetailCard.id]?.count || '1张'}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{mockCardDetails[selectedDetailCard.id]?.chinese || '中文'}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{mockCardDetails[selectedDetailCard.id]?.english || 'English'}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-slate-50 grid grid-cols-3 gap-3">
                 <button 
                   onClick={() => {
                     const reuseTask = mockCardDetails[selectedDetailCard.id] || {
                       title: selectedDetailCard.title,
                       description: selectedDetailCard.activity
                     };
                     navigate('/ai-generation', { state: { reuseTask } });
                     setSelectedDetailCard(null);
                   }}
                   className="flex items-center justify-center gap-2 py-3 bg-white border border-emerald-100 text-[#135c4a] rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
                 >
                   <RefreshCw className="w-4 h-4" />
                   复用
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-white shadow-sm transition-all active:scale-95">
                   <Download className="w-4 h-4" />
                   下载
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 bg-white border border-red-100 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95">
                   <Trash2 className="w-4 h-4" />
                   删除
                 </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
