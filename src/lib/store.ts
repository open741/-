export interface GeneratedImage {
  id: string;
  imageUrl: string;
  taskId: string;
}

export interface AITask {
  id: string;
  taskName: string;
  prompt: string;
  style: string;
  size: string;
  creator: string;
  createdAt: Date;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  images: GeneratedImage[];
}

export interface DialogueWord {
  text: string;
  partOfSpeech: 'noun' | 'verb' | 'adj' | 'pronoun' | 'other';
  img?: string;
  isGenerating?: boolean;
}

export interface DialogueLine {
  speaker: 'teacher' | 'student';
  words: DialogueWord[];
}

export interface Activity {
  id: string;
  name: string;
  dialogues: DialogueLine[];
  wordCards: Card[];
  createdAt: Date;
}

export interface Card {
  id: string;
  type: 'graphic' | 'word';
  title: string;
  imageUrl: string;
  tags: string[];
  publishStatus: 'published' | 'unpublished';
  sourceType: 'upload' | 'ai' | 'activity';
  sourceActivity?: string;
  activityId?: string;
  posColor?: string;
  creator: string;
  partOfSpeech?: string;
  taskId?: string;
  taskName?: string;
}

const createSampleImages = (taskId: string, count: number = 4): GeneratedImage[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `img-${taskId}-${i}`,
    imageUrl: `https://picsum.photos/seed/${taskId}-${i}/400/400`,
    taskId
  }));
};

let aiTasks: AITask[] = [
  {
    id: 'task-completed-1',
    taskName: '水果认知图卡',
    prompt: '一个红色的苹果，新鲜饱满，带有绿叶，白色背景，适合儿童认知',
    style: '卡通',
    size: '1:1',
    creator: '胡晓涛',
    createdAt: new Date(Date.now() - 3600000 * 2),
    status: 'completed',
    images: createSampleImages('task-completed-1')
  },
  {
    id: 'task-completed-2',
    taskName: '动物图卡生成',
    prompt: '一只可爱的小狗，卡通风格，适合幼儿园教学使用',
    style: '卡通',
    size: '1:1',
    creator: '李明',
    createdAt: new Date(Date.now() - 3600000 * 5),
    status: 'completed',
    images: createSampleImages('task-completed-2')
  },
  {
    id: 'task-completed-3',
    taskName: '交通工具认知',
    prompt: '一辆红色的消防车，卡通风格，适合儿童认知学习',
    style: '写实',
    size: '4:3',
    creator: '胡晓涛',
    createdAt: new Date(Date.now() - 3600000 * 8),
    status: 'completed',
    images: createSampleImages('task-completed-3')
  },
  {
    id: 'task-generating-1',
    taskName: '蔬菜认知图卡',
    prompt: '一根橙色的胡萝卜，带有绿叶，简洁清晰的卡通风格',
    style: '卡通',
    size: '1:1',
    creator: '王芳',
    createdAt: new Date(Date.now() - 1800000),
    status: 'generating',
    images: []
  },
  {
    id: 'task-generating-2',
    taskName: '天气图标生成',
    prompt: '晴天的太阳图标，卡通风格，适合儿童学习天气概念',
    style: '简笔画',
    size: '1:1',
    creator: '胡晓涛',
    createdAt: new Date(Date.now() - 900000),
    status: 'generating',
    images: []
  },
  {
    id: 'task-failed-1',
    taskName: '建筑图卡生成',
    prompt: '一座现代风格的房子，带有花园和围栏',
    style: '写实',
    size: '16:9',
    creator: '李明',
    createdAt: new Date(Date.now() - 7200000),
    status: 'failed',
    images: []
  },
  {
    id: 'task-failed-2',
    taskName: '职业认知图卡',
    prompt: '一位穿着白大褂的医生，卡通风格',
    style: '卡通',
    size: '1:1',
    creator: '王芳',
    createdAt: new Date(Date.now() - 10800000),
    status: 'failed',
    images: []
  },
  {
    id: 'task-completed-4',
    taskName: '颜色认知图卡',
    prompt: '蓝色的天空，带有白云，适合儿童学习颜色',
    style: '卡通',
    size: '4:3',
    creator: '张伟',
    createdAt: new Date(Date.now() - 86400000),
    status: 'completed',
    images: createSampleImages('task-completed-4')
  },
  {
    id: 'task-completed-5',
    taskName: '形状认知图卡',
    prompt: '各种颜色的圆形、正方形、三角形，简洁清晰',
    style: '简笔画',
    size: '1:1',
    creator: '胡晓涛',
    createdAt: new Date(Date.now() - 172800000),
    status: 'completed',
    images: createSampleImages('task-completed-5')
  },
  {
    id: 'task-completed-6',
    taskName: '数字认知图卡',
    prompt: '数字1到10的卡通形象，每个数字都有可爱的表情',
    style: '卡通',
    size: '1:1',
    creator: '李明',
    createdAt: new Date(Date.now() - 259200000),
    status: 'completed',
    images: createSampleImages('task-completed-6')
  },
  {
    id: 'task-completed-7',
    taskName: '字母认知图卡',
    prompt: '英文字母A到Z的卡通形象，每个字母都有可爱的表情',
    style: '卡通',
    size: '1:1',
    creator: '王芳',
    createdAt: new Date(Date.now() - 345600000),
    status: 'completed',
    images: createSampleImages('task-completed-7')
  },
  {
    id: 'task-completed-8',
    taskName: '季节认知图卡',
    prompt: '春夏秋冬四个季节的场景，卡通风格',
    style: '卡通',
    size: '16:9',
    creator: '张伟',
    createdAt: new Date(Date.now() - 432000000),
    status: 'completed',
    images: createSampleImages('task-completed-8')
  }
];
let cards: Card[] = [];

function initializeCardsFromTasks() {
  const initialCards: Card[] = [
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
  
  aiTasks.forEach(task => {
    if (task.status === 'completed' && task.images.length > 0) {
      task.images.forEach((img, index) => {
        initialCards.push({
          id: img.id,
          type: 'graphic',
          title: `${task.taskName} - ${index + 1}`,
          imageUrl: img.imageUrl,
          tags: [task.style],
          publishStatus: 'unpublished',
          sourceType: 'ai',
          creator: task.creator,
          taskId: task.id,
          taskName: task.taskName
        });
      });
    }
  });
  
  cards = initialCards;
}

initializeCardsFromTasks();

let activities: Activity[] = [
  {
    id: 'activity-1',
    name: '认识水果',
    dialogues: [
      {
        speaker: 'teacher',
        words: [
          { text: '今天', partOfSpeech: 'other' },
          { text: '我们', partOfSpeech: 'pronoun' },
          { text: '学习', partOfSpeech: 'verb' },
          { text: '水果', partOfSpeech: 'noun' }
        ]
      },
      {
        speaker: 'student',
        words: [
          { text: '我', partOfSpeech: 'pronoun' },
          { text: '喜欢', partOfSpeech: 'verb' },
          { text: '吃', partOfSpeech: 'verb' },
          { text: '苹果', partOfSpeech: 'noun' }
        ]
      },
      {
        speaker: 'teacher',
        words: [
          { text: '很', partOfSpeech: 'other' },
          { text: '好', partOfSpeech: 'adj' },
          { text: '，', partOfSpeech: 'other' },
          { text: '苹果', partOfSpeech: 'noun' },
          { text: '是', partOfSpeech: 'verb' },
          { text: '红色', partOfSpeech: 'adj' },
          { text: '的', partOfSpeech: 'other' }
        ]
      }
    ],
    wordCards: [
      {
        id: 'wc-1-1',
        type: 'word',
        title: '今天',
        imageUrl: 'https://picsum.photos/seed/today/400/400',
        tags: ['其他', '时间'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      },
      {
        id: 'wc-1-2',
        type: 'word',
        title: '我们',
        imageUrl: 'https://picsum.photos/seed/we/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-1-3',
        type: 'word',
        title: '学习',
        imageUrl: 'https://picsum.photos/seed/study/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-1-4',
        type: 'word',
        title: '水果',
        imageUrl: 'https://picsum.photos/seed/fruit/400/400',
        tags: ['名词', '食物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-blue-100 text-blue-700 border-blue-200',
        creator: '胡晓涛',
        partOfSpeech: '名词'
      },
      {
        id: 'wc-1-5',
        type: 'word',
        title: '我',
        imageUrl: 'https://picsum.photos/seed/me-word/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-1-6',
        type: 'word',
        title: '喜欢',
        imageUrl: 'https://picsum.photos/seed/like/400/400',
        tags: ['动词', '情感'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-1-7',
        type: 'word',
        title: '吃',
        imageUrl: 'https://picsum.photos/seed/eat-act/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-1-8',
        type: 'word',
        title: '苹果',
        imageUrl: 'https://picsum.photos/seed/apple-act/400/400',
        tags: ['名词', '水果'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-blue-100 text-blue-700 border-blue-200',
        creator: '胡晓涛',
        partOfSpeech: '名词'
      },
      {
        id: 'wc-1-9',
        type: 'word',
        title: '很',
        imageUrl: 'https://picsum.photos/seed/very/400/400',
        tags: ['其他', '程度'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      },
      {
        id: 'wc-1-10',
        type: 'word',
        title: '好',
        imageUrl: 'https://picsum.photos/seed/good/400/400',
        tags: ['形容词', '评价'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-amber-100 text-amber-700 border-amber-200',
        creator: '胡晓涛',
        partOfSpeech: '形容词'
      },
      {
        id: 'wc-1-11',
        type: 'word',
        title: '，',
        imageUrl: 'https://picsum.photos/seed/comma/400/400',
        tags: ['其他', '标点'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      },
      {
        id: 'wc-1-12',
        type: 'word',
        title: '是',
        imageUrl: 'https://picsum.photos/seed/is/400/400',
        tags: ['动词', '判断'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-1-13',
        type: 'word',
        title: '红色',
        imageUrl: 'https://picsum.photos/seed/red/400/400',
        tags: ['形容词', '颜色'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-amber-100 text-amber-700 border-amber-200',
        creator: '胡晓涛',
        partOfSpeech: '形容词'
      },
      {
        id: 'wc-1-14',
        type: 'word',
        title: '的',
        imageUrl: 'https://picsum.photos/seed/de/400/400',
        tags: ['其他', '助词'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '认识水果',
        activityId: 'activity-1',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      }
    ],
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: 'activity-2',
    name: '日常动作',
    dialogues: [
      {
        speaker: 'teacher',
        words: [
          { text: '你', partOfSpeech: 'pronoun' },
          { text: '每天', partOfSpeech: 'other' },
          { text: '做', partOfSpeech: 'verb' },
          { text: '什么', partOfSpeech: 'pronoun' }
        ]
      },
      {
        speaker: 'student',
        words: [
          { text: '我', partOfSpeech: 'pronoun' },
          { text: '每天', partOfSpeech: 'other' },
          { text: '吃', partOfSpeech: 'verb' },
          { text: '饭', partOfSpeech: 'noun' },
          { text: '、', partOfSpeech: 'other' },
          { text: '睡觉', partOfSpeech: 'verb' }
        ]
      }
    ],
    wordCards: [
      {
        id: 'wc-2-1',
        type: 'word',
        title: '你',
        imageUrl: 'https://picsum.photos/seed/you/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-2-2',
        type: 'word',
        title: '每天',
        imageUrl: 'https://picsum.photos/seed/everyday/400/400',
        tags: ['其他', '时间'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      },
      {
        id: 'wc-2-3',
        type: 'word',
        title: '做',
        imageUrl: 'https://picsum.photos/seed/do/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-2-4',
        type: 'word',
        title: '什么',
        imageUrl: 'https://picsum.photos/seed/what/400/400',
        tags: ['代词', '疑问'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-2-5',
        type: 'word',
        title: '我',
        imageUrl: 'https://picsum.photos/seed/me-act2/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-2-6',
        type: 'word',
        title: '吃',
        imageUrl: 'https://picsum.photos/seed/eat-act2/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-2-7',
        type: 'word',
        title: '饭',
        imageUrl: 'https://picsum.photos/seed/rice/400/400',
        tags: ['名词', '食物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-blue-100 text-blue-700 border-blue-200',
        creator: '胡晓涛',
        partOfSpeech: '名词'
      },
      {
        id: 'wc-2-8',
        type: 'word',
        title: '、',
        imageUrl: 'https://picsum.photos/seed/dunhao/400/400',
        tags: ['其他', '标点'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-slate-100 text-slate-600 border-slate-200',
        creator: '胡晓涛',
        partOfSpeech: '其他'
      },
      {
        id: 'wc-2-9',
        type: 'word',
        title: '睡觉',
        imageUrl: 'https://picsum.photos/seed/sleep/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '日常动作',
        activityId: 'activity-2',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      }
    ],
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: 'activity-3',
    name: '自我认知',
    dialogues: [
      {
        speaker: 'teacher',
        words: [
          { text: '你', partOfSpeech: 'pronoun' },
          { text: '叫', partOfSpeech: 'verb' },
          { text: '什么', partOfSpeech: 'pronoun' },
          { text: '名字', partOfSpeech: 'noun' }
        ]
      },
      {
        speaker: 'student',
        words: [
          { text: '我', partOfSpeech: 'pronoun' },
          { text: '叫', partOfSpeech: 'verb' },
          { text: '小明', partOfSpeech: 'noun' }
        ]
      }
    ],
    wordCards: [
      {
        id: 'wc-3-1',
        type: 'word',
        title: '你',
        imageUrl: 'https://picsum.photos/seed/you-act3/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-3-2',
        type: 'word',
        title: '叫',
        imageUrl: 'https://picsum.photos/seed/call/400/400',
        tags: ['动词', '动作'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-red-100 text-red-700 border-red-200',
        creator: '胡晓涛',
        partOfSpeech: '动词'
      },
      {
        id: 'wc-3-3',
        type: 'word',
        title: '什么',
        imageUrl: 'https://picsum.photos/seed/what-act3/400/400',
        tags: ['代词', '疑问'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-3-4',
        type: 'word',
        title: '名字',
        imageUrl: 'https://picsum.photos/seed/name/400/400',
        tags: ['名词', '称呼'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-blue-100 text-blue-700 border-blue-200',
        creator: '胡晓涛',
        partOfSpeech: '名词'
      },
      {
        id: 'wc-3-5',
        type: 'word',
        title: '我',
        imageUrl: 'https://picsum.photos/seed/me-act/400/400',
        tags: ['代词', '人物'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-green-100 text-green-700 border-green-200',
        creator: '胡晓涛',
        partOfSpeech: '代词'
      },
      {
        id: 'wc-3-6',
        type: 'word',
        title: '小明',
        imageUrl: 'https://picsum.photos/seed/xiaoming/400/400',
        tags: ['名词', '人名'],
        publishStatus: 'published',
        sourceType: 'activity',
        sourceActivity: '自我认知',
        activityId: 'activity-3',
        posColor: 'bg-blue-100 text-blue-700 border-blue-200',
        creator: '胡晓涛',
        partOfSpeech: '名词'
      }
    ],
    createdAt: new Date(Date.now() - 259200000)
  }
];

let listeners: Array<() => void> = [];

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function notify() {
  listeners.forEach(l => l());
}

export function getAITasks(): AITask[] {
  return aiTasks;
}

export function getCards(): Card[] {
  return cards;
}

export function getActivities(): Activity[] {
  return activities;
}

export function addAITask(task: Omit<AITask, 'id' | 'createdAt' | 'status' | 'images'>): AITask {
  const newTask: AITask = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    status: 'generating',
    images: []
  };
  aiTasks.unshift(newTask);
  notify();
  
  setTimeout(() => {
    const generatedImages: GeneratedImage[] = [];
    for (let i = 0; i < 4; i++) {
      generatedImages.push({
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl: `https://picsum.photos/seed/${newTask.id}-${i}/400/400`,
        taskId: newTask.id
      });
    }
    
    const taskIndex = aiTasks.findIndex(t => t.id === newTask.id);
    if (taskIndex !== -1) {
      aiTasks[taskIndex] = {
        ...aiTasks[taskIndex],
        status: 'completed',
        images: generatedImages
      };
    }
    
    generatedImages.forEach((img, index) => {
      cards.unshift({
        id: img.id,
        type: 'graphic',
        title: `${task.taskName} - ${index + 1}`,
        imageUrl: img.imageUrl,
        tags: [task.style],
        publishStatus: 'unpublished',
        sourceType: 'ai',
        creator: task.creator,
        taskId: newTask.id,
        taskName: task.taskName
      });
    });
    
    notify();
  }, 3000);
  
  return newTask;
}

export function updateCard(id: string, updates: Partial<Card>) {
  cards = cards.map(c => c.id === id ? { ...c, ...updates } : c);
  notify();
}

export function deleteCards(ids: Set<string>) {
  cards = cards.filter(c => !ids.has(c.id));
  notify();
}

export function deleteAITask(id: string) {
  const task = aiTasks.find(t => t.id === id);
  if (task) {
    const imageIds = new Set(task.images.map(img => img.id));
    cards = cards.filter(c => !imageIds.has(c.id));
    aiTasks = aiTasks.filter(t => t.id !== id);
    notify();
  }
}

export function getCreators(): string[] {
  return Array.from(new Set(cards.map(c => c.creator))).filter(Boolean);
}

export function updateActivity(activityId: string, updates: Partial<Activity>) {
  const activityIndex = activities.findIndex(a => a.id === activityId);
  if (activityIndex !== -1) {
    activities[activityIndex] = { ...activities[activityIndex], ...updates };
    notify();
  }
}

export function addActivity(activity: Omit<Activity, 'createdAt'>): Activity {
  const newActivity: Activity = {
    ...activity,
    createdAt: new Date()
  };
  activities.unshift(newActivity);
  notify();
  return newActivity;
}
