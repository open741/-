import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// Dynamically import all matching markdown files
const prdFiles = import.meta.glob('../../*需求说明文档.md', { query: '?raw', import: 'default' });

interface RequirementsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
}

export function RequirementsDrawer({ isOpen, onClose, content, title }: RequirementsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[100] flex flex-col border-l border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#135c4a]" />
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar-dark markdown-body ProseMirror">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '# 请选择一份文档'}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400 text-center bg-slate-50/30">
            {title} · 内部资料
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FloatingButtonProps {
  onSelect: (title: string, content: string) => void;
  isOpen: boolean;
}

export function FloatingRequirementsButton({ onSelect, isOpen }: FloatingButtonProps) {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [availableDocs, setAvailableDocs] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Extract titles from filenames
    const titles = Object.keys(prdFiles).map(path => {
      const parts = path.split('/');
      return parts[parts.length - 1].replace(/\.md$/, '');
    });
    setAvailableDocs(titles);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setMenuPos(null);
    } else {
      setMenuPos({ x: e.clientX, y: e.clientY });
      setIsMenuOpen(true);
    }
  };

  const handleDocSelect = async (title: string) => {
    const fileName = `${title}.md`;
    const path = `../../${fileName}`;
    const loader = prdFiles[path];
    
    if (loader) {
      const content = await loader() as string;
      onSelect(title, content);
      setIsMenuOpen(false);
      setMenuPos(null);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as HTMLElement).closest('.requirements-menu') && !(e.target as HTMLElement).closest('.floating-req-btn')) {
        setIsMenuOpen(false);
        setMenuPos(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isMenuOpen]);

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          "floating-req-btn fixed bottom-8 left-8 z-[110] flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group",
          isOpen || isMenuOpen
            ? "bg-slate-800 text-white" 
            : "bg-[#135c4a] text-white hover:bg-[#0e4739]"
        )}
      >
        <FileText className={cn("w-5 h-5 transition-transform group-hover:rotate-12", (isOpen || isMenuOpen) && "rotate-0")} />
        <span className="font-medium tracking-wide text-sm">需求文档</span>
        {!isOpen && !isMenuOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isMenuOpen && menuPos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{ 
              position: 'fixed' as const,
              left: menuPos.x,
              bottom: window.innerHeight - menuPos.y + 10, // Show above button
              zIndex: 120
            }}
            className="requirements-menu bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 min-w-[220px] overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">请选择文档</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar-dark">
              {availableDocs.map((doc) => (
                <button
                  key={doc}
                  onClick={() => handleDocSelect(doc)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[#135c4a] transition-colors">{doc}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#135c4a] transition-all transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

