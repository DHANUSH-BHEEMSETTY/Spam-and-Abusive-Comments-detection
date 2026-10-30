import React, { useState } from 'react';
import { Video, Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-auto">
      {isMinimized ? (
        // Minimized sleek pill - occupies minimal screen real estate and doesn't hide text
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-slate-700/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to expand Ingestion & Live Test buttons"
        >
          <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <span>Ingest &amp; Test Actions</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      ) : (
        // Expanded full pill with easy 1-click minimize toggle
        <div className="flex items-center bg-white/90 hover:bg-white/95 backdrop-blur-md border border-stone-300/90 rounded-full p-1.5 shadow-xl transition-all">
          
          {/* Button 1: Fetch from Video */}
          <button
            onClick={onOpenBrowse}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold text-slate-800 hover:text-black hover:bg-stone-100 transition-all active:scale-95 group cursor-pointer"
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
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold text-slate-800 hover:text-black hover:bg-stone-100 transition-all active:scale-95 group cursor-pointer"
            title="Test any comment nature in real-time through the client-side classifier & cascade"
          >
            <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span>Raw Input (Live Test)</span>
          </button>

          <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Minimize bar to see full screen without obstruction"
            aria-label="Minimize bottom bar"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

        </div>
      )}
    </div>
  );
};
