import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import PRD_CONTENT from '../../图卡库V2需求说明文档.md?raw';
import { cn } from '../lib/utils';

interface RequirementsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequirementsDrawer({ isOpen, onClose }: RequirementsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#135c4a]" />
              <h2 className="text-lg font-bold text-slate-800">需求说明文档</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-dark markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {PRD_CONTENT}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            图卡库 V2 需求说明文档 · 内部资料
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingRequirementsButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 left-8 z-[60] flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group",
        isOpen 
          ? "bg-slate-800 text-white" 
          : "bg-[#135c4a] text-white hover:bg-[#0e4739]"
      )}
    >
      <FileText className={cn("w-5 h-5 transition-transform group-hover:rotate-12", isOpen && "rotate-0")} />
      <span className="font-medium tracking-wide text-sm">需求文档</span>
      
      {/* Tooltip-like badge if closed */}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </button>
  );
}
