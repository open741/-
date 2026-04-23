import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, ListTodo, Trash2, Settings, Plus, Search, Download, Trash, Move, Printer, Sparkles, Wand2, RefreshCw, ChevronDown, FilePlus, FileEdit, Eye } from 'lucide-react';
import { cn } from './lib/utils';
import GraphicLibrary from './pages/GraphicLibrary';
import GraphicLibraryV2 from './pages/GraphicLibraryV2';
import ActivityDetails from './pages/ActivityDetails';
import NewAssessment from './pages/NewAssessment';
import AssessmentForm from './pages/AssessmentForm';
import AssessmentHistory from './pages/AssessmentHistory';
import AiCardGeneration from './pages/AiCardGeneration';
import StudentArchive from './pages/StudentArchive';
import AssessmentResult from './pages/AssessmentResult';
import IepManagement from './pages/IepManagement';
import { RequirementsDrawer, FloatingRequirementsButton } from './components/RequirementsDrawer';
import { useState } from 'react';

// Startup migration: Clear out any old unsplash/picsum broken mock images from localStorage
try {
  const savedTasks = localStorage.getItem('ai_tasks');
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    const validTasks = tasks.filter((t: any) => {
      return !t.images?.some((img: string) => img.includes('unsplash.com') || img.includes('picsum.photos'));
    });
    if (tasks.length !== validTasks.length) {
      localStorage.setItem('ai_tasks', JSON.stringify(validTasks));
    }
  }
} catch (e) {
  // Ignore localStorage parsing errors
}

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { icon: ImageIcon, label: '图卡库', path: '/library/all', match: '/library/' },
    { icon: ImageIcon, label: '图卡库v2', path: '/library-v2', match: '/library-v2' },
    { icon: ListTodo, label: '活动库', path: '/activity', match: '/activity' },
    { icon: FilePlus, label: '评估表', path: '/new-assessment', match: '/new-assessment' },
    { icon: LayoutDashboard, label: '学员档案', path: '/student-archive', match: '/student-archive' },
    { icon: FilePlus, label: '教学计划（IEP）', path: '/iep/create', match: '/iep/create' },
  ];

  return (
    <aside className="w-64 bg-[#135c4a] flex flex-col h-screen text-white">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#135c4a]" />
        </div>
        <h1 className="text-xl font-bold text-white">茉桔AI教学平台</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={() =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname.startsWith(item.match)
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

function Topbar() {
  return (
    <header className="h-[72px] bg-[#135c4a] flex items-center justify-end px-8 text-white shrink-0">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white/80 transition-colors">
          <span className="text-[17px] font-normal tracking-wide">仁怀市特殊教育学校-仁怀特校</span>
          <ChevronDown className="w-5 h-5 opacity-60 stroke-[1.2]" />
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#E5E5E5] flex items-center justify-center overflow-hidden relative">
            <div className="w-[18px] h-[18px] rounded-full bg-[#A3A3A3] absolute top-[9px]"></div>
            <div className="w-[32px] h-[16px] rounded-t-[16px] bg-[#A3A3A3] absolute bottom-0"></div>
          </div>
          <span className="text-[17px] font-normal tracking-wide">蒋永亮</span>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [selectedPrd, setSelectedPrd] = useState({ title: '', content: '' });

  const handlePrdSelect = (title: string, content: string) => {
    setSelectedPrd({ title, content });
    setIsRequirementsOpen(true);
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
        <Sidebar />
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
            isRequirementsOpen ? "mr-[600px]" : "mr-0"
          )}
        >
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/library/all" replace />} />
              <Route path="/library/:tab" element={<GraphicLibrary />} />
              <Route path="/library-v2" element={<GraphicLibraryV2 />} />
              <Route path="/activity" element={<ActivityDetails />} />
              <Route path="/new-assessment" element={<NewAssessment />} />
              <Route path="/assessment-form/:id" element={<AssessmentForm />} />
              <Route path="/assessment-history" element={<AssessmentHistory />} />
              <Route path="/ai-generation" element={<AiCardGeneration />} />
              <Route path="/student-archive" element={<StudentArchive />} />
              <Route path="/assessment-result" element={<AssessmentResult />} />
              <Route path="/iep/create" element={<IepManagement mode="create" />} />
              <Route path="/iep/edit" element={<IepManagement mode="edit" />} />
              <Route path="/iep/view" element={<IepManagement mode="view" />} />
            </Routes>
          </main>
        </div>

        <RequirementsDrawer
          isOpen={isRequirementsOpen}
          onClose={() => setIsRequirementsOpen(false)}
          title={selectedPrd.title}
          content={selectedPrd.content}
        />

        <FloatingRequirementsButton
          onSelect={handlePrdSelect}
          isOpen={isRequirementsOpen}
        />
      </div>
    </Router>
  );
}

