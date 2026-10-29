import React from 'react';
import { ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';

interface HeaderProps {
  activeTab: 'overview' | 'queue' | 'review' | 'approach';
  setActiveTab: (tab: 'overview' | 'queue' | 'review' | 'approach') => void;
  onOpenVideoModal: () => void;
  reviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenVideoModal,
  reviewCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-2 ring-slate-800/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">CommentGuard AI</span>
              <span className="text-[10px] font-semibold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Production Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Safer conversations, smarter moderation</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center bg-stone-200/60 p-1 rounded-xl text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'queue'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comment queue
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Human review</span>
            {reviewCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white rounded-full">
                {reviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approach')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'approach'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-700 hover:text-slate-900 font-semibold bg-amber-100/70 hover:bg-amber-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Architecture & Strategy</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenVideoModal}
            className="flex items-center gap-1.5 bg-white border border-stone-300 hover:border-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all active:scale-95"
          >
            <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
            <span>Fetch from Video</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-200/50 text-[11px] font-medium text-slate-600 border border-stone-300/40">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Illustrative demo data</span>
          </div>
        </div>

      </div>
    </header>
  );
};
