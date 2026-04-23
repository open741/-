import React, { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import { ChevronRight, FileText, CheckCircle2, User, Calendar, Play, Search, Plus, Trash2, Printer, Download, Save, Settings, MessageCircle, BarChart3, ChevronDown, CheckSquare, Loader2, ArrowLeft, Sparkles, ChevronsDown, ChevronsUp, Info, Eye, FileEdit, ClipboardList, ChevronsLeft, ChevronLeft, ChevronsRight } from 'lucide-react';

interface IepManagementProps {
  mode: 'create' | 'edit' | 'view';
}

const DOMAIN_MAP: Record<string, string[]> = {
  "粗大动作领域": ["孤独症儿童发展能力评估报告-粗大动作", "0岁~6岁儿童发育行为评估报告-大运动", "CPEP-3自闭症儿童心理教育评估报告-大肌肉(GM)"],
  "精细动作领域": ["孤独症儿童发展能力评估报告-精细动作", "0岁~6岁儿童发育行为评估报告-精细动作", "CPEP-3自闭症儿童心理教育评估报告-小肌肉(FM)"],
  "感觉统合领域": ["孤独症儿童发展能力评估报告-感知觉", "儿童感觉统合能力发展评估报告-前庭功能", "儿童感觉统合能力发展评估报告-触觉防御", "儿童感觉统合能力发展评估报告-本体感"],
  "语言沟通领域": ["孤独症儿童发展能力评估报告-语言与沟通", "0岁~6岁儿童发育行为评估报告-语言", "CPEP-3自闭症儿童心理教育评估报告-认知(语言/语前)(CVP)", "CPEP-3自闭症儿童心理教育评估报告-语言表达(EL)", "CPEP-3自闭症儿童心理教育评估报告-语言理解(RL)", "构音语音能力评估报告-构音清晰度"],
  "认知与学习能力领域": ["孤独症儿童发展能力评估报告-认知", "儿童感觉统合能力发展评估报告-学习能力", "注意力缺陷多动障碍评估报告-注意力不集中", "CPEP-3自闭症儿童心理教育评估报告-模仿(视觉/动作)(VMI)"],
  "社会交往领域": ["孤独症儿童发展能力评估报告-社会交往", "0岁~6岁儿童发育行为评估报告-社会行为", "CPEP-3自闭症儿童心理教育评估报告-社交互动(SR)"],
  "情绪与行为领域": ["孤独症儿童发展能力评估报告-情绪与行为", "注意力缺陷多动障碍评估报告-多动/冲动", "注意力缺陷多动障碍评估报告-对立违抗", "CPEP-3自闭症儿童心理教育评估报告-情感表达(AE)", "CPEP-3自闭症儿童心理教育评估报告-行为特征-非语言(CMB)", "CPEP-3自闭症儿童心理教育评估报告-行为特征-语言(CVB)", "CPEP-3自闭症儿童心理教育评估报告-问题行为(PB)"],
  "生活自理与适应能力领域": ["孤独症儿童发展能力评估报告-生活自理", "0岁~6岁儿童发育行为评估报告-适应能力", "CPEP-3自闭症儿童心理教育评估报告-个人自理(PSC)", "CPEP-3自闭症儿童心理教育评估报告-适应行为(AB)"]
};

const STUDENTS = [
  { id: '1', name: '张小明', gender: '男', dob: '2018-05-12', age: '5岁5月' },
  { id: '2', name: '李华', gender: '女', dob: '2019-02-28', age: '4岁10月' },
];

const REPORT_TYPES = [
  "孤独症儿童发展能力评估报告",
  "0岁~6岁儿童发育行为评估报告",
  "CPEP-3自闭症儿童心理教育评估报告",
  "儿童感觉统合能力发展评估报告",
  "注意力缺陷多动障碍评估报告",
  "构音语音能力评估报告"
];

// Mock Goals Structure: domain -> [{ id, longTerm: '', shortTerms: [{id, text}] }]
interface ShortTermGoal {
  id: string;
  text: string;
}
interface LongTermGoal {
  id: string;
  text: string;
  shortTerms: ShortTermGoal[];
}
type GoalsState = Record<string, LongTermGoal[]>;

const TABS = [
  { id: 'basic', label: '基本信息' },
  { id: 'goals', label: '康复目标' },
  { id: 'activities', label: '康复活动与训练' },
  { id: 'halfYear', label: '半年计划' },
  { id: 'month', label: '月计划' },
  { id: 'week', label: '周计划' },
];

const MOCK_REPORT_INSTANCES: Record<string, { id: string, date: string, assessor: string }[]> = {
  "孤独症儿童发展能力评估报告": [
    { id: 'RPT1260398', date: '2024-04-20', assessor: '蒋老师' },
    { id: 'RPT1260402', date: '2023-11-15', assessor: '王老师' },
  ],
  "0岁~6岁儿童发育行为评估报告": [
    { id: 'RPT1260405', date: '2024-03-10', assessor: '李老师' },
  ],
  "CPEP-3自闭症儿童心理教育评估报告": [
    { id: 'RPT1260408', date: '2024-02-15', assessor: '蒋老师' },
  ],
  "儿童感觉统合能力发展评估报告": [
    { id: 'RPT1260411', date: '2024-04-05', assessor: '陈老师' },
  ],
  "注意力缺陷多动障碍评估报告": [
    { id: 'RPT1260415', date: '2024-01-20', assessor: '张老师' },
  ],
  "构音语音能力评估报告": [
    { id: 'RPT1260419', date: '2024-04-12', assessor: '蒋老师' },
  ],
};

const MOCK_GOALS_POOL: Record<string, { lt: string, st: string[] }[]> = {
  "粗大动作领域": [{ lt: "提高下肢力量与身体协调性", st: ["单脚站立持续保持平衡 5 秒", "双腿并拢连续跳过 15cm 高度的障碍物 3 个"] }],
  "精细动作领域": [{ lt: "增强手眼协调及手指精细控制能力", st: ["在 30 秒内能用镊子夹起 10 颗直径 1cm 的珠子", "能沿直线剪开长达 10cm 的白纸而不偏离轨道"] }],
  "感觉统合领域": [{ lt: "提高前庭平衡感与本体觉过滤能力", st: ["在此俯卧滑板上完成 5 米往返滑行且头部保持抬起", "能在一分钟的旋转训练后迅速恢复平衡站立"] }],
  "语言沟通领域": [{ lt: "提高口语表达的完整性与社交理解力", st: ["能用三词句（我想要xx）表达基本生理需求", "在提示下能听懂并执行两个步骤的连续指令"] }],
  "认知与学习能力领域": [{ lt: "提升注意力持久度与形状辨识能力", st: ["能在一组混合物体中准确挑出 3 种不同的几何形状", "在老师引导下能维持单项任务注意力达 5 分钟"] }],
  "社会交往领域": [{ lt: "增强社交主动性与轮侯意识", st: ["能主动邀请同伴参与简单的桌面游戏", "在小组活动中能遵守轮流规则（不少于 3 轮）"] }],
  "情绪与行为领域": [{ lt: "建立自我情绪调节机制与减少挑战行为", st: ["在愿望受挫时能通过深呼吸等方式自我平复（不叫喊）", "能配合完成日常流程转换而无需过度安抚"] }],
  "生活自理与适应能力领域": [{ lt: "提高独立穿衣素质与进食规范", st: ["能独立扣好 3 颗直径 2cm 的纽扣", "能使用勺子独立进食且不洒落食物（饭粒少于 5 粒）"] }],
};

export default function IepManagement({ mode }: IepManagementProps) {
  // --- UI State ---
  const [step, setStep] = useState(mode === 'create' ? 1 : 2);
  const [activeTab, setActiveTab] = useState('basic');

  // --- Form Data State ---
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mode === 'create' ? '' : '1');

  // Track selected specific instances per category
  const [selectedReportInstances, setSelectedReportInstances] = useState<Record<string, { id: string, date: string, assessor: string } | null>>(
    mode === 'create' ? {} : { "孤独症儿童发展能力评估报告": MOCK_REPORT_INSTANCES["孤独症儿童发展能力评估报告"][0] }
  );

  const [browsingCategory, setBrowsingCategory] = useState<string | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [diagnosisTime, setDiagnosisTime] = useState('');
  const [homePhone, setHomePhone] = useState('13509876789');
  const [physicalConditions, setPhysicalConditions] = useState<string[]>(['孤独症']);
  const [disabilityLevel, setDisabilityLevel] = useState('二级');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const [startDate, setStartDate] = useState(mode === 'create' ? '' : '2024-05-01');
  const [endDate, setEndDate] = useState(mode === 'create' ? '' : '2024-11-01');
  const [analysis, setAnalysis] = useState('儿童在精细动作上有良好表现，但在社会交往和情绪调节需要更多干预支持。');

  // Goals State
  const [goals, setGoals] = useState<GoalsState>(
    mode === 'view' ? {
      "语言沟通领域": [
        { id: 'lt1', text: '能听懂日常指令并用短语回应', shortTerms: [{ id: 'st1', text: '在提示下能听指令指认日常物品' }, { id: 'st2', text: '能清晰发音说出需求单词（比如水、饭、饼干）' }] }
      ]
    } : {}
  );

  // Expanded goals accordion
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['言语与语言沟通领域']);

  const isView = mode === 'view';
  const selectedStudent = STUDENTS.find(s => s.id === selectedStudentId);

  // Derived active domains from SELECTED INSTANCES
  const activeDomains = useMemo(() => {
    const selectedCategories = Object.keys(selectedReportInstances).filter(cat => selectedReportInstances[cat] !== null);
    if (selectedCategories.length === 0) return [];

    const actDomains = Object.keys(DOMAIN_MAP).filter(domain => {
      return DOMAIN_MAP[domain].some(source => selectedCategories.some(cat => source.includes(cat)));
    });
    return actDomains.length ? actDomains : Object.keys(DOMAIN_MAP).slice(0, 3);
  }, [selectedReportInstances]);

  // Generators
  const [selectedHalfYearId, setSelectedHalfYearId] = useState<string | null>(mode === 'view' ? 'HY1' : null);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(mode === 'view' ? 'M1' : null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(mode === 'view' ? 'W1' : null);

  const mockHalfYearPlans = [
    { id: '1', planNo: 'A260084', prepDate: '2026-04-02', startDate: '2026-04-02', endDate: '2026-04-03', age: '0岁2个月', createdAt: '2026-04-22 15:00:09', status: '进行中' },
  ];
  const mockMonthPlans = [
    { id: '1', planNo: 'B260247', month: '2026-03', prepDate: '2026-03-05', startDate: '2026-03-11', endDate: '2026-03-13', age: '0岁2个月', creator: '胡晓涛', createdAt: '2026-03-31 12:46:10', status: '进行中' },
  ];
  const mockWeekPlans = [
    {
      id: 'W1',
      planNo: 'W20260401',
      prepDate: '2026-04-01',
      startDate: '2026-04-06',
      endDate: '2026-04-12',
      age: '5岁5月',
      creator: '蒋老师',
      createdAt: '2026-04-01 10:00:00'
    },
    {
      id: 'W2',
      planNo: 'W20260408',
      prepDate: '2026-04-08',
      startDate: '2026-04-13',
      endDate: '2026-04-19',
      age: '5岁5月',
      creator: '蒋老师',
      createdAt: '2026-04-08 14:30:00'
    },
  ];

  const [halfYearPlans, setHalfYearPlans] = useState(mockHalfYearPlans);
  const [monthPlans, setMonthPlans] = useState(mockMonthPlans);
  const [weekPlans, setWeekPlans] = useState(mockWeekPlans);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isMonthGenerateModalOpen, setIsMonthGenerateModalOpen] = useState(false);
  const [isWeekGenerateModalOpen, setIsWeekGenerateModalOpen] = useState(false);
  const [generateStartDate, setGenerateStartDate] = useState('');
  const [generateEndDate, setGenerateEndDate] = useState('');
  const [generateMonth, setGenerateMonth] = useState('');
  const [generateWeekStart, setGenerateWeekStart] = useState('2026-04-06');
  const [isWeekPickerOpen, setIsWeekPickerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const [activities, setActivities] = useState<Record<string, { title: string, type: 'activity' | 'game', content: string, domain: string }>>({});
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  const showAlert = (message: string, title: string = '提示') => {
    setDialogConfig({ isOpen: true, type: 'alert', title, message });
  };

  const showConfirm = (message: string, onConfirm: () => void, title: string = '确认') => {
    setDialogConfig({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  const handleAiGenerateGoals = () => {
    setIsGeneratingGoals(true);
    setTimeout(() => {
      const generatedGoals: GoalsState = { ...goals };
      activeDomains.forEach(domain => {
        const pool = MOCK_GOALS_POOL[domain] || [{ lt: "待设定长期目标", st: ["待设定短期目标"] }];
        const newGoals = pool.map((item, idx) => ({
          id: `gen-lt-${domain}-${idx}-${Date.now()}`,
          text: item.lt,
          shortTerms: item.st.map((stText, stIdx) => ({
            id: `gen-st-${domain}-${idx}-${stIdx}-${Date.now()}`,
            text: stText
          }))
        }));
        generatedGoals[domain] = [...(generatedGoals[domain] || []), ...newGoals];
      });
      setGoals(generatedGoals);
      setExpandedDomains(activeDomains);
      setIsGeneratingGoals(false);
    }, 1500);
  };

  const handleGenerateHalfYearPlan = () => {
    if (!generateStartDate || !generateEndDate) {
      showAlert('请选择开始和结束日期');
      return;
    }

    setIsGenerateModalOpen(false);
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = {
        id: String(halfYearPlans.length + 1),
        planNo: `A${Math.floor(100000 + Math.random() * 900000)}`,
        prepDate: new Date().toISOString().split('T')[0],
        startDate: generateStartDate,
        endDate: generateEndDate,
        age: selectedStudent?.age || '未知',
        createdAt: new Date().toLocaleString().replace(/\//g, '-'),
        status: '进行中'
      };

      setHalfYearPlans([newPlan, ...halfYearPlans]);
      setGenerateStartDate('');
      setGenerateEndDate('');
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateMonthPlan = () => {
    if (!generateMonth) {
      showAlert('请选择所属月份');
      return;
    }

    setIsMonthGenerateModalOpen(false);
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = {
        id: String(monthPlans.length + 1),
        planNo: `B${Math.floor(100000 + Math.random() * 900000)}`,
        month: generateMonth,
        prepDate: new Date().toISOString().split('T')[0],
        startDate: `${generateMonth}-01`,
        endDate: `${generateMonth}-28`, // 简化处理
        age: selectedStudent?.age || '未知',
        creator: '胡晓涛',
        createdAt: new Date().toLocaleString().replace(/\//g, '-'),
        status: '进行中'
      };

      setMonthPlans([newPlan, ...monthPlans]);
      setGenerateMonth('');
      setIsGenerating(false);
    }, 1500);
  };

  const handleDeleteHalfYearPlan = (id: string) => {
    showConfirm('确定要删除这份半年计划吗？删除后将无法恢复。', () => {
      setHalfYearPlans(prev => prev.filter(p => p.id !== id));
    });
  };

  const handleDeleteMonthPlan = (id: string) => {
    showConfirm('确定要删除这份月计划吗？删除后将无法恢复。', () => {
      setMonthPlans(prev => prev.filter(p => p.id !== id));
    });
  };

  const handleGenerateWeekPlan = () => {
    setIsWeekGenerateModalOpen(false);
    setIsGenerating(true);
    setTimeout(() => {
      const startDate = new Date(generateWeekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const format = (d: Date) => d.toISOString().split('T')[0];
      const startDateStr = format(startDate);
      const endDateStr = format(endDate);

      const newPlan = {
        id: String(weekPlans.length + 1),
        planNo: `W${Math.floor(100000 + Math.random() * 900000)}`,
        prepDate: new Date().toISOString().split('T')[0],
        startDate: startDateStr,
        endDate: endDateStr,
        age: selectedStudent?.age || '未知',
        creator: '蒋老师',
        createdAt: new Date().toLocaleString().replace(/\//g, '-')
      };

      setWeekPlans([newPlan, ...weekPlans]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDeleteWeekPlan = (id: string) => {
    showConfirm('确定要删除这份周计划吗？删除后将无法恢复。', () => {
      setWeekPlans(prev => prev.filter(p => p.id !== id));
    });
  };

  const handleGenerateAnalysis = () => {
    setIsGeneratingAnalysis(true);
    setTimeout(() => {
      setAnalysis('经过多维评估分析，该名学员在粗大动作领域处于中等水平，能够完成大部分同龄人的基本动作，但在精细动作协调性方面仍有进步空间。言语沟通方面，词汇量丰富但社交逻辑仍需引导。情绪控制能力良好，能够理解并遵守基本课堂逻辑。建议后续加强视觉模仿与精细抓握的针对性训练。');
      setIsGeneratingAnalysis(false);
    }, 1500);
  };


  const handleNextStep = () => {
    const selectedCount = Object.values(selectedReportInstances).filter(v => v !== null).length;
    if (!selectedStudentId || selectedCount === 0 || !startDate || !endDate) {
      showAlert('请选择学员、至少选择一份评估报告，并设置计划周期');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      // Generate goals for all active domains
      const generatedGoals: GoalsState = {};
      activeDomains.forEach(domain => {
        const pool = MOCK_GOALS_POOL[domain] || [{ lt: "待设定长期目标", st: ["待设定短期目标"] }];
        generatedGoals[domain] = pool.map((item, idx) => ({
          id: `gen-lt-${domain}-${idx}-${Date.now()}`,
          text: item.lt,
          shortTerms: item.st.map((stText, stIdx) => ({
            id: `gen-st-${domain}-${idx}-${stIdx}-${Date.now()}`,
            text: stText
          }))
        }));
      });

      setGoals(generatedGoals);
      setExpandedDomains(activeDomains); // Auto-expand all generated goals

      // Generate activities for the timetable
      const genActivities: Record<string, { title: string, type: 'activity' | 'game', content: string, domain: string }> = {};
      const domains = activeDomains.length > 0 ? activeDomains : ["粗大动作领域", "精细动作领域", "认知与学习能力领域"];

      [1, 2, 3, 4, 5].forEach(day => {
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(session => {
          const key = `${day}-${session}`;
          const domain = domains[Math.floor(Math.random() * domains.length)];
          const type = Math.random() > 0.5 ? 'activity' : 'game';
          genActivities[key] = {
            title: domain,
            type: type,
            content: type === 'activity' ? `康复活动 ${key}` : `互动游戏 ${key}`,
            domain: domain
          };
        });
      });
      setActivities(genActivities);

      setIsGenerating(false);
      setStep(2);
    }, 1500);
  };

  const toggleReportCategory = (category: string) => {
    if (isView && step === 2) return;
    if (mode === 'edit' && step === 2) return;

    if (!selectedStudentId) {
      showAlert('请先选择学员，再选择对应的评估报告');
      return;
    }

    setReportSearchQuery('');
    setBrowsingCategory(category);
  };

  const selectReportInstance = (category: string, instance: { id: string, date: string, assessor: string } | null) => {
    setSelectedReportInstances(prev => ({
      ...prev,
      [category]: instance
    }));
    setReportSearchQuery('');
    setBrowsingCategory(null);
  };

  const handleExpandAll = () => {
    setExpandedDomains([...activeDomains]);
  };

  const handleCollapseAll = () => {
    setExpandedDomains([]);
  };

  const toggleDomainExpanded = (domain: string) => {
    setExpandedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const addLongTermGoal = (domain: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: [
        ...(prev[domain] || []),
        { id: `lt-${Date.now()}`, text: '', shortTerms: [] }
      ]
    }));
    if (!expandedDomains.includes(domain)) toggleDomainExpanded(domain);
  };

  const updateLongTermGoal = (domain: string, ltId: string, text: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: prev[domain].map(lt => lt.id === ltId ? { ...lt, text } : lt)
    }));
  };

  const removeLongTermGoal = (domain: string, ltId: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: prev[domain].filter(lt => lt.id !== ltId)
    }));
  };

  const addShortTermGoal = (domain: string, ltId: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: prev[domain].map(lt => {
        if (lt.id === ltId) {
          return {
            ...lt,
            shortTerms: [...lt.shortTerms, { id: `st-${Date.now()}`, text: '' }]
          };
        }
        return lt;
      })
    }));
  };

  const updateShortTermGoal = (domain: string, ltId: string, stId: string, text: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: prev[domain].map(lt => {
        if (lt.id === ltId) {
          return {
            ...lt,
            shortTerms: lt.shortTerms.map(st => st.id === stId ? { ...st, text } : st)
          };
        }
        return lt;
      })
    }));
  };

  const removeShortTermGoal = (domain: string, ltId: string, stId: string) => {
    setGoals(prev => ({
      ...prev,
      [domain]: prev[domain].map(lt => {
        if (lt.id === ltId) {
          return {
            ...lt,
            shortTerms: lt.shortTerms.filter(st => st.id !== stId)
          };
        }
        return lt;
      })
    }));
  };

  const handleTabBack = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id);
    } else if (mode === 'create') {
      setStep(1);
    }
  };

  const handleTabForward = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white px-8 py-3 border-b flex items-center justify-between shrink-0 z-20 sticky top-0 shadow-sm transition-all text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-bold text-slate-600">
            {mode === 'create' ? '创建教学计划 (IEP)' : mode === 'edit' ? '编辑教学计划 (IEP)' : '查看教学计划 (IEP)'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isView && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-all text-sm font-medium shadow-sm">
                <Printer className="w-4 h-4" /> 打印预览
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#135c4a] rounded-lg text-white hover:bg-[#0f4b3c] transition-all text-sm font-medium shadow-md shadow-[#135c4a]/20">
                <Download className="w-4 h-4" /> 导出 PDF 报告
              </button>
            </>
          )}
          {!isView && step === 2 && (
            <>
              <button
                onClick={() => {
                  showConfirm('请确认是否返回，返回后将丢失当前IEP数据！', () => {
                    setStep(1);
                    setSelectedReportInstances({});
                    setGoals({});
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all font-bold shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> 返回
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#135c4a] rounded-lg text-white hover:bg-[#0f4b3c] transition-all font-medium shadow-md shadow-[#135c4a]/20">
                <Save className="w-4 h-4" /> 保存计划
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {step === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
              {/* Left Side: Student Focus */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4" /> 选择学员
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 text-left text-slate-700 focus:outline-none focus:border-[#135c4a] focus:ring-4 focus:ring-[#135c4a]/5 transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold truncate text-slate-600">
                          {selectedStudent ? selectedStudent.name : '请通过姓名搜索学员...'}
                        </span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform group-hover:text-slate-500", isStudentDropdownOpen && "rotate-180")} />
                      </button>

                      {isStudentDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setIsStudentDropdownOpen(false)}></div>
                          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                              <div className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl focus-within:border-[#135c4a] transition-all">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                  autoFocus
                                  placeholder="搜索学员..."
                                  className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700"
                                  value={studentSearchQuery}
                                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto py-2">
                              {STUDENTS.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())).length > 0 ? (
                                STUDENTS.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())).map(s => (
                                  <div
                                    key={s.id}
                                    onClick={() => {
                                      if (selectedStudentId !== s.id) {
                                        setSelectedStudentId(s.id);
                                        setSelectedReportInstances({});
                                      }
                                      setIsStudentDropdownOpen(false);
                                      setStudentSearchQuery('');
                                    }}
                                    className={cn(
                                      "px-5 py-3.5 cursor-pointer transition-all flex items-center justify-between mx-2 rounded-xl mb-1",
                                      selectedStudentId === s.id ? "bg-[#135c4a] text-white" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm", selectedStudentId === s.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400")}>
                                        {s.name.charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-bold text-sm">{s.name}</span>
                                        <span className={cn("text-[10px] uppercase font-bold", selectedStudentId === s.id ? "text-white/60" : "text-slate-400")}>{s.gender} · {s.age}</span>
                                      </div>
                                    </div>
                                    {selectedStudentId === s.id && <CheckCircle2 className="w-5 h-5" />}
                                  </div>
                                ))
                              ) : (
                                <div className="p-10 text-center text-slate-400 text-sm italic">未匹配到学员信息</div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {selectedStudent ? (
                    <div className="bg-[#135c4a] rounded-3xl p-8 text-white shadow-xl shadow-[#135c4a]/20 relative overflow-hidden group flex-1">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                      <div className="relative z-10 space-y-6">
                        {/* Name Header */}
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                            {selectedStudent.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">{selectedStudent.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{selectedStudent.gender}</span>
                              <span className="text-white/60 text-xs font-medium">{selectedStudent.age}</span>
                            </div>
                          </div>
                        </div>

                        {/* Detail Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">出生日期</span>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">{selectedStudent.dob}</span>
                              <Calendar className="w-3.5 h-3.5 text-white/20" />
                            </div>
                          </div>
                          <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">家庭电话</span>
                            <span className="text-sm font-bold truncate block">{homePhone}</span>
                          </div>
                          <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">诊断时间</span>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">{diagnosisTime || '2026-02-02'}</span>
                              <Calendar className="w-3.5 h-3.5 text-white/20" />
                            </div>
                          </div>
                          <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">已完成评估报告数量</span>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">4 份</span>
                              <FileText className="w-3.5 h-3.5 text-white/20" />
                            </div>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="space-y-5 pt-2">
                          {/* Row 1: Physical Conditions */}
                          <div>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-2">身体状况</span>
                            <div className="flex flex-wrap gap-2">
                              {physicalConditions.map(cond => (
                                <span key={cond} className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold border border-white/10">{cond}</span>
                              ))}
                            </div>
                          </div>

                          {/* Row 2: Disability Level */}
                          <div>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-2">残疾等级</span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#135c4a] border border-white/20 rounded text-[10px] font-black italic shadow-inner">
                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" /> {disabilityLevel}
                            </span>
                          </div>

                          {/* Row 3: Plan Cycle */}
                          <div>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1">计划周期</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/10 rounded-xl p-3 border border-white/5 focus-within:border-white/20 transition-all group/input">
                                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1 group-focus-within/input:text-white/60 transition-colors flex items-center gap-1">开始日期 <span className="text-rose-400">*</span></span>
                                <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="bg-transparent border-none outline-none text-sm font-bold text-white w-full [color-scheme:dark] cursor-pointer"
                                />
                              </div>
                              <div className="bg-white/10 rounded-xl p-3 border border-white/5 focus-within:border-white/20 transition-all group/input">
                                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest block mb-1 group-focus-within/input:text-white/60 transition-colors flex items-center gap-1">结束日期 <span className="text-rose-400">*</span></span>
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="bg-transparent border-none outline-none text-sm font-bold text-white w-full [color-scheme:dark] cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 flex-1">
                      <User className="w-12 h-12 opacity-20 mb-3" />
                      <p className="text-xs font-bold text-center leading-relaxed">选择学员后<br />系统将同步其学员档案</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Assessment Selection */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> 添加评估报告记录
                    </h2>
                  </div>

                  <div className="p-8 flex-1">
                    {!selectedStudentId ? (
                      <div className="flex flex-col items-center justify-center h-full py-24 text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                          <BarChart3 className="w-10 h-10 opacity-20" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 mb-1">等待选择学员</h4>
                        <p className="text-xs text-slate-400 italic">请先在左侧选择需要创建教学计划（IEP）的学员</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {REPORT_TYPES.map(category => {
                            const selected = selectedReportInstances[category];
                            return (
                              <div
                                key={category}
                                onClick={() => toggleReportCategory(category)}
                                className={cn(
                                  "p-6 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col group h-36 justify-between",
                                  selected
                                    ? "border-[#135c4a] bg-[#135c4a]/[0.02] shadow-sm"
                                    : "border-slate-50 hover:bg-slate-50/80 hover:border-slate-200"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 pr-4">
                                    <h3 className={cn("text-sm font-bold leading-tight", selected ? "text-[#135c4a]" : "text-slate-600")}>{category}</h3>
                                  </div>
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                                    selected ? "bg-[#135c4a] text-white shadow-lg shadow-[#135c4a]/20" : "bg-slate-100 text-slate-300 group-hover:scale-110 group-hover:text-slate-400"
                                  )}>
                                    {selected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                  </div>
                                </div>

                                <div className="mt-auto">
                                  {selected ? (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectReportInstance(category, null);
                                        }}
                                        className="absolute -top-2 -left-2 w-7 h-7 bg-white border border-rose-100 shadow-xl shadow-rose-500/10 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all z-20 group/cancel active:scale-90"
                                        title="取消勾选"
                                      >
                                        <Plus className="w-4 h-4 rotate-45" />
                                      </button>

                                      <div className="mt-auto flex items-end justify-between">
                                        <div className="space-y-1">
                                          <div className="text-[10px] text-slate-500 font-black italic tracking-tight">{selected.id}</div>
                                          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                                            <span>评估日期: {selected.date}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> {selected.assessor}</span>
                                          </div>
                                        </div>
                                        <div className="text-[11px] font-bold text-[#135c4a] underline decoration-dotted mb-0.5">重新选择</div>
                                      </div>
                                    </>
                                  ) : (
                                    null
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
                          <div className="flex flex-col">
                          </div>
                          <button
                            onClick={handleNextStep}
                            disabled={isGenerating}
                            className="h-14 px-12 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/10 hover:bg-[#135c4a] transition-all flex items-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" /> AI生成中...
                              </>
                            ) : (
                              <>
                                <span>开始生成 IEP 计划</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Selection Modal */}
              {browsingCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setBrowsingCategory(null)}></div>
                  <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">历史评估报告</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{browsingCategory}</p>
                      </div>
                      <button onClick={() => setBrowsingCategory(null)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
                        <Plus className="w-6 h-6 rotate-45" />
                      </button>
                    </div>

                    <div className="p-6 border-b border-slate-50 bg-white">
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus-within:bg-white focus-within:border-[#135c4a] focus-within:ring-4 focus-within:ring-[#135c4a]/5 transition-all">
                        <Search className="w-5 h-5 text-slate-300" />
                        <input
                          placeholder="按日期、评估人或评估报告编号搜索"
                          className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-600 placeholder:text-slate-300"
                          value={reportSearchQuery}
                          onChange={(e) => setReportSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                      {(() => {
                        const instances = (MOCK_REPORT_INSTANCES[browsingCategory] || []);
                        const filtered = instances.filter(i =>
                          i.id.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
                          i.date.includes(reportSearchQuery) ||
                          i.assessor.includes(reportSearchQuery)
                        );

                        if (filtered.length > 0) {
                          return (
                            <div className="grid grid-cols-1 gap-3">
                              {filtered.map(instance => (
                                <div
                                  key={instance.id}
                                  onClick={() => selectReportInstance(browsingCategory, instance)}
                                  className={cn(
                                    "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group mx-2",
                                    selectedReportInstances[browsingCategory]?.id === instance.id
                                      ? "border-[#135c4a] bg-[#135c4a]/5 shadow-sm"
                                      : "border-slate-50 hover:bg-slate-50/50 hover:border-slate-200"
                                  )}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={cn(
                                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                      selectedReportInstances[browsingCategory]?.id === instance.id ? "bg-[#135c4a] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white"
                                    )}>
                                      <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-700 text-sm italic">{instance.id}</span>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {instance.date}</span>
                                        <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1"><User className="w-3.5 h-3.5" /> {instance.assessor}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                    selectedReportInstances[browsingCategory]?.id === instance.id ? "bg-[#135c4a] border-[#135c4a] text-white shadow-lg shadow-[#135c4a]/30" : "border-slate-200 bg-white"
                                  )}>
                                    {selectedReportInstances[browsingCategory]?.id === instance.id && <CheckCircle2 className="w-4 h-4" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-16 text-center flex flex-col items-center">
                              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-200" />
                              </div>
                              <h4 className="text-sm font-bold text-slate-400">未找到匹配的评估记录</h4>
                              <p className="text-xs text-slate-300 mt-1 italic">尝试更换搜索关键词</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    {selectedReportInstances[browsingCategory] && (
                      <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                        <button
                          onClick={() => selectReportInstance(browsingCategory, null)}
                          className="px-6 py-2.5 text-xs font-black text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all uppercase tracking-widest"
                        >
                          取消当前选择
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col min-h-[800px] overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Modern Stepper Nav */}
              <div className="flex items-center justify-between px-10 py-5 border-b border-slate-50 bg-slate-50/30 shrink-0">
                <div className="flex items-center gap-4">
                  {activeTab !== 'basic' && (
                    <button
                      onClick={handleTabBack}
                      className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" /> 上一页
                    </button>
                  )}

                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden lg:flex items-center gap-1.5 mr-4">
                    {TABS.map((t, idx) => {
                      const isActive = activeTab === t.id;
                      const isPast = TABS.findIndex(tab => tab.id === activeTab) > idx;
                      return (
                        <div key={t.id} className="flex items-center">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-700",
                            isActive ? "bg-[#135c4a] scale-[2] shadow-lg shadow-[#135c4a]/30" : isPast ? "bg-[#135c4a]/30" : "bg-slate-200"
                          )} title={t.label} />
                          {idx < TABS.length - 1 && <div className={cn("w-3 h-[1px] mx-1 opacity-20", isPast ? "bg-[#135c4a]" : "bg-slate-300")} />}
                        </div>
                      );
                    })}
                  </div>

                  {activeTab !== 'week' && (
                    <button
                      onClick={handleTabForward}
                      className="h-10 pl-6 pr-4 bg-[#135c4a] text-white rounded-xl hover:bg-[#0f4b3c] hover:shadow-xl hover:shadow-[#135c4a]/20 transition-all text-xs font-black flex items-center gap-4 shadow-lg shadow-[#135c4a]/10 group"
                    >
                      下一步
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="flex border-b border-slate-100 px-8 shrink-0 bg-white overflow-x-auto no-scrollbar scroll-smooth">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-8 py-5 font-black transition-all border-b-[3px] whitespace-nowrap text-[13px] uppercase tracking-wider relative",
                      activeTab === tab.id
                        ? "border-[#135c4a] text-[#135c4a]"
                        : "border-transparent text-slate-300 hover:text-slate-500"
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#135c4a] animate-in slide-in-from-left duration-300"></div>}
                  </button>
                ))}
              </div>

              {/* Tab Workspace */}
              <div className="p-12 flex-1 overflow-auto bg-slate-50/20 custom-scrollbar">

                {/* TAB: Basic Info */}
                {activeTab === 'basic' && (
                  <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Section 1 */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-[#135c4a]" /> 学员基本信息</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#135c4a]" />
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">姓名</span>
                          <span className="font-bold text-slate-800">{selectedStudent?.name || '未知'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">性别</span>
                          <span className="font-bold text-slate-800">{selectedStudent?.gender || '未知'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">年龄</span>
                          <span className="font-bold text-slate-800">{selectedStudent?.age || '未知'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">出生日期</span>
                          <span className="font-bold text-slate-800">{selectedStudent?.dob || '未知'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">家庭电话</span>
                          <span className="font-bold text-slate-800">{homePhone}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">诊断时间</span>
                          <span className="font-bold text-slate-800">{diagnosisTime || '2026-02-02'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">评估报告数量</span>
                          <span className="font-bold text-slate-800">4 份</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">计划开始日期</span>
                          <span className="font-bold text-slate-800">{startDate || '--'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">计划结束日期</span>
                          <span className="font-bold text-slate-800">{endDate || '--'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">残疾等级</span>
                          <span className="inline-flex px-2 py-0.5 bg-[#135c4a]/5 text-[#135c4a] rounded text-[10px] font-bold border border-[#135c4a]/10">{disabilityLevel}</span>
                        </div>
                        <div className="md:col-span-4">
                          <div className="w-full h-px bg-slate-50 -mx-8 mb-8" />
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">身体状况</span>
                          <div className="flex flex-wrap gap-2">
                            {physicalConditions.map(cond => (
                              <span key={cond} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[11px] font-bold border border-slate-100 shadow-sm">{cond}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2 */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[#135c4a]" /> 制定IEP数据来源</h3>
                      <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-4">
                        {Object.values(selectedReportInstances).filter(v => v !== null).length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {Object.entries(selectedReportInstances).map(([cat, instance]) => instance && (
                              <div key={cat} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm font-bold text-[#135c4a]">{cat}</span>
                                <div className="flex items-center gap-4 text-xs text-slate-500 italic">
                                  <span>日期：{instance.date}</span>
                                  <span>评估人：{instance.assessor}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">无依据报告</span>
                        )}
                      </div>
                    </div>



                    {/* Section 4 */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#135c4a]" /> 发展水平与优劣势分析</h3>
                        {!isView && (
                          <button
                            onClick={handleGenerateAnalysis}
                            disabled={isGeneratingAnalysis}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#135c4a] to-[#1a7d65] text-white rounded-full text-xs font-bold shadow-md shadow-[#135c4a]/20 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-50 disabled:translate-y-0"
                          >
                            {isGeneratingAnalysis ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>生成中...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                <span>AI生成</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <textarea
                        className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-slate-700 resize-none disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:border-[#135c4a] shadow-inner font-medium text-sm leading-relaxed"
                        placeholder="请输入综合分析内容..."
                        value={analysis}
                        disabled={isView || isGeneratingAnalysis}
                        onChange={e => setAnalysis(e.target.value)}
                      />
                    </div>

                  </div>
                )}

                {/* TAB: Goals */}
                {activeTab === 'goals' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            if (expandedDomains.length === activeDomains.length) {
                              setExpandedDomains([]);
                            } else {
                              setExpandedDomains([...activeDomains]);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm min-w-[100px] justify-center"
                        >
                          {expandedDomains.length === activeDomains.length ? (
                            <>
                              <ChevronsUp className="w-3.5 h-3.5" /> 全部折叠
                            </>
                          ) : (
                            <>
                              <ChevronsDown className="w-3.5 h-3.5" /> 全部展开
                            </>
                          )}
                        </button>
                        {!isView && (
                          <button
                            onClick={handleAiGenerateGoals}
                            disabled={isGeneratingGoals}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#135c4a] text-white rounded-lg hover:bg-[#0f4b3c] transition-all text-xs font-bold shadow-md shadow-[#135c4a]/10 disabled:opacity-50"
                          >
                            {isGeneratingGoals ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>生成中...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-emerald-300" />
                                <span>AI 生成</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-50/80 px-4 py-1.5 rounded-full border border-slate-100">
                        <Info className="w-3.5 h-3.5 text-[#135c4a]" />
                        <span className="font-medium italic">系统已根据所选评估报告自动过滤出涉及的康复领域</span>
                      </div>
                    </div>
                    {activeDomains.map((domain, i) => {
                      const isExpanded = expandedDomains.includes(domain);
                      const domainGoals = goals[domain] || [];

                      return (
                        <div key={domain} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                          {/* Accordion header */}
                          <div
                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 group"
                            onClick={() => toggleDomainExpanded(domain)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#135c4a]/10 text-[#135c4a] flex items-center justify-center font-bold">
                                {i + 1}
                              </div>
                              <span className="font-bold text-slate-800 text-lg">{domain}</span>
                              <span className="text-xs text-[#135c4a] bg-[#135c4a]/10 px-2 py-0.5 rounded-md ml-2 border border-[#135c4a]/20">
                                {domainGoals.length} 长期目标
                              </span>
                            </div>
                            <ChevronDown className={cn("text-slate-400 w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
                          </div>

                          {/* Accordion content */}
                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                              {domainGoals.length === 0 ? (
                                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-slate-300">
                                  <p className="text-slate-400 mb-4">该领域当前暂无设定的长期目标</p>
                                  {!isView && (
                                    <button
                                      onClick={() => addLongTermGoal(domain)}
                                      className="inline-flex items-center gap-2 text-[#135c4a] hover:bg-[#135c4a]/10 px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                      <Plus className="w-4 h-4" /> 添加长期目标
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {domainGoals.map((lt, index) => (
                                    <div key={lt.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
                                      <div className="flex gap-4 items-start mb-4">
                                        <div className="w-6 h-6 bg-[#135c4a] text-white rounded-md flex items-center justify-center text-xs font-bold mt-2">
                                          长期
                                        </div>
                                        <div className="flex-1">
                                          {isView ? (
                                            <div className="text-slate-800 font-medium py-2 px-3 bg-slate-50 rounded-md border border-slate-100">
                                              {lt.text || <span className="text-slate-400 italic">未填写内容</span>}
                                            </div>
                                          ) : (
                                            <input
                                              value={lt.text}
                                              onChange={e => updateLongTermGoal(domain, lt.id, e.target.value)}
                                              className="w-full text-slate-800 font-medium font-sans border-b-2 border-slate-200 focus:border-[#135c4a] px-2 py-2 outline-none bg-transparent transition-colors disabled:bg-slate-50"
                                              placeholder="输入该领域的长期目标"
                                            />
                                          )}
                                        </div>
                                        {!isView && (
                                          <button
                                            onClick={() => removeLongTermGoal(domain, lt.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-1"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>

                                      <div className="ml-10 pl-6 border-l-2 border-slate-100 space-y-3">
                                        {lt.shortTerms.map((st, i) => (
                                          <div key={st.id} className="flex gap-3 items-center group">
                                            <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-[10px] font-bold shrink-0">
                                              短期
                                            </div>
                                            {isView ? (
                                              <div className="w-full text-slate-700 py-1.5 px-3 bg-slate-50 rounded-md border border-transparent text-sm">
                                                {st.text || <span className="text-slate-400 italic">未填写内容</span>}
                                              </div>
                                            ) : (
                                              <input
                                                value={st.text}
                                                onChange={e => updateShortTermGoal(domain, lt.id, st.id, e.target.value)}
                                                className="flex-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 focus:border-orange-300 focus:bg-white rounded-md px-3 py-1.5 outline-none transition-colors"
                                                placeholder="输入该领域的短期目标"
                                              />
                                            )}
                                            {!isView && (
                                              <button
                                                onClick={() => removeShortTermGoal(domain, lt.id, st.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-all shrink-0"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        ))}

                                        {!isView && (
                                          <button
                                            onClick={() => addShortTermGoal(domain, lt.id)}
                                            className="text-xs text-orange-600 font-medium hover:underline flex items-center gap-1 mt-2"
                                          >
                                            <Plus className="w-3 h-3" /> 添加短期目标
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}

                                  {!isView && (
                                    <button
                                      onClick={() => addLongTermGoal(domain)}
                                      className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 hover:text-[#135c4a] hover:border-[#135c4a] hover:bg-[#135c4a]/5 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                                    >
                                      <Plus className="w-4 h-4" /> 添加长期目标
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB: Activities */}
                {activeTab === 'activities' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-slate-50/50">
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 border-r border-b border-slate-100 text-center w-24">时间段</th>
                              {['周一', '周二', '周三', '周四', '周五'].map(day => (
                                <th key={day} className="px-6 py-4 font-black uppercase tracking-widest text-[11px] text-slate-600 border-r border-b border-slate-100 text-center last:border-r-0">
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {/* Morning Sessions */}
                            <tr>
                              <td colSpan={6} className="px-6 py-2 text-[10px] font-black text-[#135c4a] uppercase tracking-[0.2em] border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#135c4a]" /> 上午
                                </div>
                              </td>
                            </tr>
                            {[
                              { label: '第一节' },
                              { label: '第二节' },
                              { label: '第三节' },
                              { label: '第四节' }
                            ].map((session, sIdx) => (
                              <tr key={sIdx} className="group hover:bg-slate-50/30 transition-colors">
                                <td className="px-4 py-8 border-r border-b border-slate-100 text-center bg-slate-50/30">
                                  <div className="text-[11px] font-black text-slate-500">{session.label}</div>
                                </td>
                                {[1, 2, 3, 4, 5].map(day => {
                                  const cellData = activities[`${day}-${sIdx + 1}`];
                                  return (
                                    <td key={day} className="px-4 py-4 border-r border-b border-slate-100 last:border-r-0 relative min-h-[100px]">
                                      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#135c4a]/30 transition-all cursor-default min-h-[70px] flex flex-col justify-between">
                                        {cellData ? (
                                          <>
                                            <div className="text-xs font-bold text-slate-700 line-clamp-1 leading-relaxed mb-2">
                                              {cellData.title}
                                            </div>
                                            <div className="space-y-1">
                                              {cellData.type === 'activity' ? (
                                                <div className="flex items-center gap-1.5 px-1.5 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">
                                                  <Sparkles className="w-2.5 h-2.5" />
                                                  <span>{cellData.content}</span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-1.5 px-1.5 py-1 bg-purple-50 text-purple-600 rounded text-[9px] font-bold">
                                                  <Play className="w-2.5 h-2.5" />
                                                  <span>{cellData.content}</span>
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex flex-col items-center justify-center py-4 opacity-20">
                                            <div className="text-[10px] font-black text-slate-400">待生成</div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}

                            {/* Afternoon Sessions */}
                            <tr>
                              <td colSpan={6} className="px-6 py-2 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 下午
                                </div>
                              </td>
                            </tr>
                            {[
                              { label: '第五节' },
                              { label: '第六节' },
                              { label: '第七节' },
                              { label: '第八节' }
                            ].map((session, sIdx) => (
                              <tr key={sIdx} className="group hover:bg-slate-50/30 transition-colors">
                                <td className="px-4 py-8 border-r border-b border-slate-100 text-center bg-slate-50/30">
                                  <div className="text-[11px] font-black text-slate-500">{session.label}</div>
                                </td>
                                {[1, 2, 3, 4, 5].map(day => {
                                  const cellData = activities[`${day}-${sIdx + 5}`];
                                  return (
                                    <td key={day} className="px-4 py-4 border-r border-b border-slate-100 last:border-r-0 relative min-h-[100px]">
                                      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#135c4a]/30 transition-all cursor-default min-h-[70px] flex flex-col justify-between">
                                        {cellData ? (
                                          <>
                                            <div className="text-xs font-bold text-slate-700 line-clamp-1 leading-relaxed mb-2">
                                              {cellData.title}
                                            </div>
                                            <div className="space-y-1">
                                              {cellData.type === 'activity' ? (
                                                <div className="flex items-center gap-1.5 px-1.5 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">
                                                  <Sparkles className="w-2.5 h-2.5" />
                                                  <span>{cellData.content}</span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-1.5 px-1.5 py-1 bg-purple-50 text-purple-600 rounded text-[9px] font-bold">
                                                  <Play className="w-2.5 h-2.5" />
                                                  <span>{cellData.content}</span>
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex flex-col items-center justify-center py-4 opacity-20">
                                            <div className="text-[10px] font-black text-slate-400">待生成</div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Half-Year */}
                {activeTab === 'halfYear' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                      {/* Filter Bar */}
                      <div className="p-6 border-b border-slate-50 flex items-center bg-white shrink-0">
                        <button
                          onClick={() => setIsGenerateModalOpen(true)}
                          disabled={isGenerating}
                          className={cn(
                            "h-10 px-5 rounded-xl transition-all text-sm font-bold flex items-center gap-2",
                            isGenerating
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-[#135c4a] text-white hover:bg-[#0f4b3c] shadow-lg shadow-[#135c4a]/10"
                          )}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> 生成半年计划
                            </>
                          )}
                        </button>
                      </div>

                      {/* Table Header */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-50">
                            <tr>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">序号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">计划编号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">制定日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">开始时间</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">结束时间</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">制定计划时年龄</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">创建时间</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {halfYearPlans.map((plan, idx) => (
                              <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-5 text-center text-slate-400 font-medium whitespace-nowrap">{idx + 1}</td>
                                <td className="px-6 py-5">
                                  <span className="font-bold text-[#135c4a] cursor-pointer hover:underline">{plan.planNo}</span>
                                </td>
                                <td className="px-6 py-5 text-slate-500 font-medium">{plan.prepDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium">{plan.startDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium">{plan.endDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium">{plan.age}</td>
                                <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tight">{plan.createdAt}</td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center justify-center gap-3">
                                    <button className="p-2 text-slate-400 hover:text-[#135c4a] hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="查看">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="编辑">
                                      <FileEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteHalfYearPlan(plan.id)}
                                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                                      title="删除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Empty Placeholder if no data */}
                      {halfYearPlans.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300">
                          <ClipboardList className="w-16 h-16 opacity-10 mb-4" />
                          <p className="text-sm font-medium">暂无半年计划记录</p>
                        </div>
                      )}
                    </div>

                    {/* Generate Modal */}
                    {isGenerateModalOpen && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
                          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#135c4a]/10 rounded-2xl flex items-center justify-center text-[#135c4a]">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800">生成半年计划</h3>
                            </div>
                            <button onClick={() => setIsGenerateModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                              <Plus className="w-6 h-6 rotate-45" />
                            </button>
                          </div>

                          <div className="p-8 space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                  开始时间 <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative group">
                                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#135c4a] transition-colors" />
                                  <input
                                    type="date"
                                    value={generateStartDate}
                                    onChange={(e) => setGenerateStartDate(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#135c4a] focus:bg-white focus:ring-4 focus:ring-[#135c4a]/5 transition-all"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                  结束时间 <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative group">
                                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#135c4a] transition-colors" />
                                  <input
                                    type="date"
                                    value={generateEndDate}
                                    onChange={(e) => setGenerateEndDate(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#135c4a] focus:bg-white focus:ring-4 focus:ring-[#135c4a]/5 transition-all"
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                              系统将基于当前康复目标，自动生成对应时间跨度的半年康复计划记录。
                            </p>
                          </div>

                          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center gap-4">
                            <button
                              onClick={() => setIsGenerateModalOpen(false)}
                              className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-slate-300 transition-all text-sm"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleGenerateHalfYearPlan}
                              className="flex-1 h-12 rounded-2xl bg-[#135c4a] text-white font-bold hover:bg-[#0f4b3c] transition-all text-sm shadow-lg shadow-[#135c4a]/20 active:scale-[0.98]"
                            >
                              立即生成
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Month Plan */}
                {activeTab === 'month' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                      {/* NEW TABLE CODE START */}
                      <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-white shrink-0">
                        <button
                          onClick={() => halfYearPlans.length > 0 && setIsMonthGenerateModalOpen(true)}
                          disabled={halfYearPlans.length === 0 || isGenerating}
                          className={cn(
                            "h-10 px-5 rounded-xl transition-all text-sm font-bold flex items-center gap-2",
                            (halfYearPlans.length > 0 && !isGenerating)
                              ? "bg-[#135c4a] text-white hover:bg-[#0f4b3c] shadow-lg shadow-[#135c4a]/10"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          )}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> 生成月计划
                            </>
                          )}
                        </button>
                        {halfYearPlans.length === 0 && !isGenerating && (
                          <div className="flex items-center gap-2 text-rose-500 animate-in fade-in slide-in-from-left-2 duration-500">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold tracking-wide italic">月计划依据半年计划生成，请先生成半年计划！</span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-50">
                            <tr>
                              <th className="px-4 py-4 font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">序号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">计划编号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">所属月份</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">制定日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">开始日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">结束日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">制定计划时年龄</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">创建人</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">创建时间</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {monthPlans.map((plan, idx) => (
                              <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-5 text-center text-slate-400 font-medium whitespace-nowrap">{idx + 1}</td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <span className="font-bold text-[#135c4a] cursor-pointer hover:underline">{plan.planNo}</span>
                                </td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.month}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.prepDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.startDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.endDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.age}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.creator}</td>
                                <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tight flex flex-col leading-tight whitespace-nowrap">
                                  <span>{plan.createdAt.split(' ')[0]}</span>
                                  <span>{plan.createdAt.split(' ')[1]}</span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-3">
                                    <button className="p-2 text-slate-400 hover:text-[#135c4a] hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="查看">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95" title="编辑">
                                      <FileEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMonthPlan(plan.id)}
                                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                                      title="删除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Empty Placeholder if no data */}
                      {monthPlans.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300">
                          <ClipboardList className="w-16 h-16 opacity-10 mb-4" />
                          <p className="text-sm font-medium">暂无月计划记录</p>
                        </div>
                      )}
                    </div>

                    {/* Month Generate Modal */}
                    {isMonthGenerateModalOpen && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
                          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#135c4a]/10 rounded-2xl flex items-center justify-center text-[#135c4a]">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800">生成月计划</h3>
                            </div>
                            <button onClick={() => setIsMonthGenerateModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                              <Plus className="w-6 h-6 rotate-45" />
                            </button>
                          </div>

                          <div className="p-8 space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                  所属月份 <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative group">
                                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#135c4a] transition-colors" />
                                  <input
                                    type="month"
                                    value={generateMonth}
                                    onChange={(e) => setGenerateMonth(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#135c4a] focus:bg-white focus:ring-4 focus:ring-[#135c4a]/5 transition-all"
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                              系统将基于半年计划，自动生成对应月份的月度康复计划记录。
                            </p>
                          </div>

                          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center gap-4">
                            <button
                              onClick={() => setIsMonthGenerateModalOpen(false)}
                              className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-slate-300 transition-all text-sm"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleGenerateMonthPlan}
                              className="flex-1 h-12 rounded-2xl bg-[#135c4a] text-white font-bold hover:bg-[#0f4b3c] transition-all text-sm shadow-lg shadow-[#135c4a]/20 active:scale-[0.98]"
                            >
                              立即生成
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* TAB: Week Plan */}
                {activeTab === 'week' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                      {/* Filter Bar */}
                      <div className="p-6 border-b border-slate-50 flex items-center bg-white shrink-0">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsWeekGenerateModalOpen(true)}
                            disabled={isGenerating || monthPlans.length === 0}
                            className={cn(
                              "h-10 px-5 rounded-xl transition-all text-sm font-bold flex items-center gap-2",
                              (isGenerating || monthPlans.length === 0)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-[#135c4a] text-white hover:bg-[#0f4b3c] shadow-lg shadow-[#135c4a]/10"
                            )}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                生成周计划
                              </>
                            )}
                          </button>
                          {monthPlans.length === 0 && (
                            <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-4 py-2 rounded-xl animate-in fade-in slide-in-from-left-2 duration-500">
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-xs font-bold">周计划依据月计划生成，请先生成月计划！</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* List View */}
                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-50">
                            <tr>
                              <th className="px-4 py-4 font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">序号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">计划编号</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">制定日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">开始日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">结束日期</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">制定计划时年龄</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">创建人</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap">创建时间</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {weekPlans.map((plan, index) => (
                              <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-5 text-center text-slate-400 font-medium whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <span className="font-bold text-[#135c4a] cursor-pointer hover:underline">{plan.planNo}</span>
                                </td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.prepDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.startDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.endDate}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.age}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap">{plan.creator}</td>
                                <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tight flex flex-col leading-tight whitespace-nowrap">
                                  <span>{plan.createdAt?.split(' ')[0] || '2024-05-01'}</span>
                                  <span>{plan.createdAt?.split(' ')[1] || '10:00:00'}</span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-3">
                                    <button className="p-2 text-slate-400 hover:text-[#135c4a] hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md" title="查看">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md" title="编辑">
                                      <FileEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteWeekPlan(plan.id)}
                                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                      title="删除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Empty Placeholder if no data */}
                      {weekPlans.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300">
                          <ClipboardList className="w-16 h-16 opacity-10 mb-4" />
                          <p className="text-sm font-medium">暂无周计划记录</p>
                        </div>
                      )}
                    </div>

                    {/* Week Generate Modal */}
                    {isWeekGenerateModalOpen && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
                          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#135c4a]/10 rounded-2xl flex items-center justify-center text-[#135c4a]">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800">生成周计划</h3>
                            </div>
                            <button onClick={() => setIsWeekGenerateModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                              <Plus className="w-6 h-6 rotate-45" />
                            </button>
                          </div>

                          <div className="p-8 space-y-6 overflow-visible">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                选择计划周期 <span className="text-rose-400">*</span>
                              </label>

                              <div className="relative">
                                {/* The Clickable Input Field */}
                                <button
                                  onClick={() => setIsWeekPickerOpen(!isWeekPickerOpen)}
                                  className={cn(
                                    "w-full h-14 bg-white border rounded-2xl px-5 flex items-center gap-3 transition-all",
                                    isWeekPickerOpen ? "border-[#135c4a] ring-4 ring-[#135c4a]/5" : "border-slate-100 hover:border-slate-200"
                                  )}
                                >
                                  <Calendar className={cn("w-5 h-5 transition-colors", isWeekPickerOpen ? "text-[#135c4a]" : "text-slate-300")} />
                                  <span className={cn("text-sm font-bold", generateWeekStart ? "text-slate-700" : "text-slate-400")}>
                                    {generateWeekStart ? `${generateWeekStart} ~ 2026-04-12` : '选择一周'}
                                  </span>
                                  <ChevronDown className={cn("w-4 h-4 ml-auto text-slate-300 transition-transform duration-300", isWeekPickerOpen && "rotate-180")} />
                                </button>

                                {/* The Popover Calendar */}
                                {isWeekPickerOpen && (
                                  <div className="absolute top-full left-0 right-0 mt-3 z-[110] bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top">
                                    {/* Arrow for popover */}
                                    <div className="absolute -top-1.5 left-10 w-3 h-3 bg-white border-t border-l border-slate-100 rotate-45" />

                                    <div className="relative z-10">
                                      <div className="flex items-center justify-between mb-6">
                                        <div className="flex gap-1">
                                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors"><ChevronsLeft className="w-4 h-4" /></button>
                                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">2026年 4月</span>
                                        <div className="flex gap-1">
                                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors"><ChevronsRight className="w-4 h-4" /></button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-7 gap-y-1 text-center">
                                        {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                                          <span key={d} className="text-[10px] font-black text-slate-300 mb-4">{d}</span>
                                        ))}

                                        {[30, 31].map(d => <span key={`prev-${d}`} className="text-xs text-slate-200 py-2.5">{d}</span>)}
                                        {[1, 2, 3, 4, 5].map(d => <span key={`curr-start-${d}`} className="text-xs text-slate-400 py-2.5">{d}</span>)}

                                        {[6, 7, 8, 9, 10, 11, 12].map((d, i) => (
                                          <button
                                            key={`selected-${d}`}
                                            onClick={() => {
                                              setGenerateWeekStart(`2026-04-06`);
                                              setIsWeekPickerOpen(false);
                                            }}
                                            className={cn(
                                              "text-xs font-bold py-2.5 transition-all relative z-10",
                                              "bg-slate-50 text-[#135c4a]",
                                              i === 0 && "rounded-l-2xl",
                                              i === 6 && "rounded-r-2xl"
                                            )}
                                          >
                                            {d}
                                          </button>
                                        ))}

                                        {[13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(d => (
                                          <button key={`day-${d}`} className="text-xs font-medium text-slate-600 py-2.5 hover:bg-slate-50 rounded-2xl transition-all">{d}</button>
                                        ))}

                                        <button className="text-xs font-black text-[#135c4a] py-2.5 hover:bg-slate-50 rounded-2xl transition-all relative">
                                          23
                                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#135c4a] rounded-full" />
                                        </button>

                                        {[24, 25, 26, 27, 28, 29, 30].map(d => (
                                          <button key={`day-${d}`} className="text-xs font-medium text-slate-600 py-2.5 hover:bg-slate-50 rounded-2xl transition-all">{d}</button>
                                        ))}

                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => <span key={`next-${d}`} className="text-xs text-slate-200 py-2.5">{d}</span>)}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                              系统将基于月度康复计划，自动生成具体到每一天的周度训练课表。
                            </p>
                          </div>

                          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center gap-4">
                            <button
                              onClick={() => setIsWeekGenerateModalOpen(false)}
                              className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-slate-300 transition-all text-sm"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleGenerateWeekPlan}
                              className="flex-1 h-12 rounded-2xl bg-[#135c4a] text-white font-bold hover:bg-[#0f4b3c] transition-all text-sm shadow-lg shadow-[#135c4a]/20 active:scale-[0.98]"
                            >
                              立即生成
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
      {/* Global Custom Dialog Modal */}
      {dialogConfig.isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  dialogConfig.type === 'confirm' ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                )}>
                  {dialogConfig.type === 'confirm' ? <Trash2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{dialogConfig.title}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {dialogConfig.message}
              </p>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center gap-3">
              {dialogConfig.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-slate-300 transition-all text-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      dialogConfig.onConfirm?.();
                      setDialogConfig(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="flex-1 h-11 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all text-sm shadow-lg shadow-rose-500/20 active:scale-95"
                  >
                    确定放弃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
                  className="w-full h-11 rounded-xl bg-[#135c4a] text-white font-bold hover:bg-[#0f4b3c] transition-all text-sm shadow-lg shadow-[#135c4a]/20 active:scale-95"
                >
                  知道了
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
