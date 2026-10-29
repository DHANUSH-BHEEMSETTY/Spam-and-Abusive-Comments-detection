import React from 'react';
import { Compass, MessageSquarePlus } from 'lucide-react';

interface BottomPillProps {
  onOpenBrowse: () => void;
  onOpenTestComment: () => void;
  activeView: string;
}

export const BottomPill: React.FC<BottomPillProps> = ({
  onOpenBrowse,
  onOpenTestComment,
  activeView
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 shadow-lg">
      <div className="flex items-center bg-white border border-stone-300/80 rounded-full p-1.5 shadow-md">
        
        <button
          onClick={onOpenBrowse}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeView === 'queue' || activeView === 'overview'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Browse</span>
        </button>

        <button
          onClick={onOpenTestComment}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-stone-100 transition-all"
        >
          <MessageSquarePlus className="w-4 h-4 text-slate-600" />
          <span>Comment</span>
        </button>

      </div>
    </div>
  );
};

