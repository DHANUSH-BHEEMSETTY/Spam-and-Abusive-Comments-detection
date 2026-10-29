import React from 'react';
import { Video, Zap, MessageSquareCode } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';

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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 shadow-xl animate-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center bg-white/95 backdrop-blur-md border border-stone-300 rounded-full p-1.5 shadow-lg">
        
        {/* Button 1: Fetch from Video */}
        <button
          onClick={onOpenBrowse}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-800 hover:text-black hover:bg-stone-100 transition-all active:scale-95 group"
          title="Fetch comments from a YouTube video URL or catalog"
        >
          <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
          </div>
          <span>Fetch from Video</span>
        </button>

        <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>

        {/* Button 2: Raw Input (Live Test) */}
        <button
          onClick={onOpenTestComment}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-800 hover:text-black hover:bg-stone-100 transition-all active:scale-95 group"
          title="Test any comment nature in real-time through the 3-Tier AI cascade"
        >
          <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span>Raw Input (Live Test)</span>
        </button>

      </div>
    </div>
  );
};
