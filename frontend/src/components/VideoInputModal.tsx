import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Filter, Layers, Zap, Play, Terminal } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { INITIAL_VIDEOS } from '../data/initialData';
import { VideoInfo, VideoComment, ModerationResult } from '../types';
import { analyzeCommentWithCascade } from '../services/moderationEngine';

interface VideoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: VideoComment) => void;
  onSelectVideo: (video: VideoInfo) => void;
}

export const VideoInputModal: React.FC<VideoInputModalProps> = ({
  isOpen,
  onClose,
  onAddComment,
  onSelectVideo
}) => {
  const [customCommentText, setCustomCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Interview Tester');
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo>(INITIAL_VIDEOS[0]);
  const [liveResult, setLiveResult] = useState<ModerationResult | null>(() => 
    analyzeCommentWithCascade('Can I substitute almond milk instead of heavy cream?')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = (textToAnalyze?: string) => {
    const text = textToAnalyze || customCommentText;
    if (!text.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = analyzeCommentWithCascade(text, authorName);
      setLiveResult(result);
      setIsAnalyzing(false);
    }, 250);
  };

  const handleQuickSample = (sampleText: string, sampleAuthor: string) => {
    setCustomCommentText(sampleText);
    setAuthorName(sampleAuthor);
    handleRunAnalysis(sampleText);
  };

  const handleAddToQueue = () => {
    if (!customCommentText.trim() || !liveResult) return;

    const newComment: VideoComment = {
      id: `c-custom-${Date.now()}`,
      text: customCommentText.trim(),
      author: authorName.trim() || 'Guest Cook',
      videoTitle: selectedVideo.title,
      videoId: selectedVideo.id,
      timestamp: 'Just now',
      category: liveResult.category,
      confidence: liveResult.confidence,
      status:
        liveResult.recommendedAction.includes('Publish')
          ? 'published'
          : liveResult.recommendedAction.includes('Hide')
          ? 'hidden'
          : 'awaiting_review',
      proposedAction: liveResult.recommendedAction,
      decisionBy: 'AI',
      signals: liveResult.signals.map((s) => s.text),
      recommendedActionDesc: liveResult.reason
    };

    onAddComment(newComment);
    setNotification('Comment tested and pushed into live active queue!');
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200/80 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Raw Input — Test Comment Nature Live</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Live Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Type any sentence to see how the 3-Tier Cascade (Rules &rarr; ML &rarr; DistilBERT) classifies it in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300/80 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Notification banner */}
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
          )}

          {/* Quick Test Sample Prompts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Quick Test Scenarios (Click to test instantly):
              </label>
              <span className="text-[11px] text-slate-400">All 4 categories covered</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSample('Can I substitute coconut milk for heavy cream?', 'CuriousBaker')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs"
              >
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Recipe Query</div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;Can I substitute...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('This risotto is killer, I would literally die for this recipe!', 'ChefLiam')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs"
              >
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Cooking Slang (Fine)</div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;killer, die for...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('FREE IPHONE 16! Click bit.ly/chef-win-now to claim your gift!', 'SpamBot')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition-all text-xs"
              >
                <div className="text-[10px] font-bold text-amber-700 uppercase">Spam Link (L1 Sieve)</div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;FREE IPHONE bit.ly...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('You are an idiot, nobody should listen to your awful recipes', 'TrollGuy')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-300 transition-all text-xs"
              >
                <div className="text-[10px] font-bold text-rose-700 uppercase">Severe Insult (Abusive)</div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;You are an idiot...&rdquo;</div>
              </button>
            </div>
          </div>

          {/* Raw Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Type or Paste Any Raw Comment:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name / handle"
                className="sm:w-1/3 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              <input
                type="text"
                value={customCommentText}
                onChange={(e) => {
                  setCustomCommentText(e.target.value);
                  handleRunAnalysis(e.target.value);
                }}
                placeholder="Type any random sentence to test in live real-time..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Live Analysis Diagnostics */}
          {liveResult && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4 animate-in fade-in duration-200">
              
              {/* Verdict Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live Classification Verdict
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                        liveResult.category === 'fine'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : liveResult.category === 'spam'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : liveResult.category === 'abusive'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {liveResult.category} &middot; {liveResult.confidence}% confidence
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      &rarr; Proposed Action: <span className="underline">{liveResult.recommendedAction}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-500">
                  Total Cascade Latency: <strong className="text-emerald-700">~20.5 ms</strong>
                </div>
              </div>

              {/* 3-Tier Layer Trace */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                {/* L1 */}
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L1: Rules Engine</span>
                    <span className="text-[10px] text-slate-400 font-mono">1.2ms</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {liveResult.layerBreakdown.l1_rules.triggered ? (
                      <span className="text-rose-700 font-semibold">{liveResult.layerBreakdown.l1_rules.rule}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Passed all regex &amp; blocklist filters</span>
                    )}
                  </p>
                </div>

                {/* L2 */}
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L2: Classical ML</span>
                    <span className="text-[10px] text-slate-400 font-mono">4.8ms</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {liveResult.layerBreakdown.l2_ml.features.join(', ') || 'Standard casing & normal punctuation'}
                  </p>
                </div>

                {/* L3 */}
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L3: DistilBERT</span>
                    <span className="text-[10px] text-slate-400 font-mono">14.5ms</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {liveResult.layerBreakdown.l3_transformer.contextNotes}
                  </p>
                </div>

              </div>

              {/* Push into queue button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 truncate">
                  Video target: <strong className="text-slate-800">{selectedVideo.title}</strong>
                </span>
                <button
                  onClick={handleAddToQueue}
                  disabled={!customCommentText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Push into Active System Queue</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current Video Channel: <span className="font-semibold text-slate-800">{selectedVideo.channel}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
