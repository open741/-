import React, { useState } from 'react';
import { FileText, X, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { designDocs } from '../data/designDocs';
import { cn } from '../lib/utils';

interface DesignDocPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DesignDocPanel({ isOpen, onToggle }: DesignDocPanelProps) {
  const [activeDocId, setActiveDocId] = useState(designDocs[0]?.id);
  const [copied, setCopied] = useState(false);

  const activeDoc = designDocs.find(doc => doc.id === activeDocId) || designDocs[0];

  const handleCopy = () => {
    if (activeDoc) {
      navigator.clipboard.writeText(activeDoc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={onToggle}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 transition-transform hover:scale-105 z-50"
        title="设计文档"
      >
        {isOpen ? <X className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-40 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: '400px' }}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            设计文档系统
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制 MD'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 px-2 scrollbar-hide">
          {designDocs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setActiveDocId(doc.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeDocId === doc.id
                  ? "border-slate-800 text-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {doc.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 markdown-body">
          {activeDoc ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {activeDoc.content}
            </ReactMarkdown>
          ) : (
            <div className="text-slate-500 text-center mt-10">暂无文档</div>
          )}
        </div>
      </div>
    </>
  );
}
