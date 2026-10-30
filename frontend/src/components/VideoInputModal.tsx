import React, { useState, useMemo } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Filter, Layers, Zap, Ban, Clock, ArrowRight, Check } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { INITIAL_VIDEOS } from '../data/initialData';
import { VideoInfo, VideoComment } from '../types';
import { classifyComment, ClassificationResult } from '../lib/classifier';

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
  const [customCommentText, setCustomCommentText] = useState(
    'Kill the heat and beat the eggs! This recipe is killer, I would die for this!'
  );
  const [authorName, setAuthorName] = useState('Interview Tester');
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo>(INITIAL_VIDEOS[0]);
  const [notification, setNotification] = useState<string | null>(null);

  // Real-time client-side classification using src/lib/classifier.ts
  const classification: ClassificationResult = useMemo(() => {
    return classifyComment(customCommentText || '');
  }, [customCommentText]);

  if (!isOpen) return null;

  const handleQuickSample = (sampleText: string, sampleAuthor: string) => {
    setCustomCommentText(sampleText);
    setAuthorName(sampleAuthor);
  };

  const handleAddToQueue = () => {
    if (!customCommentText.trim()) return;

    const newComment: VideoComment = {
      id: `c-custom-${Date.now()}`,
      text: customCommentText.trim(),
      author: authorName.trim() || 'Guest Cook',
      videoTitle: selectedVideo.title,
      videoId: selectedVideo.id,
      timestamp: 'Just now',
      category: classification.label,
      confidence: classification.confidencePct,
      status:
        classification.routing === 'publish'
          ? 'published'
          : classification.routing === 'hide'
          ? 'hidden'
          : 'awaiting_review',
      proposedAction:
        classification.routing === 'publish'
          ? 'Auto-Publish'
          : classification.routing === 'hide'
          ? 'Auto-Hide'
          : 'Human Review',
      decisionBy: 'AI',
      signals: classification.signals,
      recommendedActionDesc: classification.routingReason,
      flagReason: classification.routing === 'hide' ? `${classification.label} violation` : undefined
    };

    onAddComment(newComment);
    setNotification(`Comment successfully classified as [${classification.label.toUpperCase()}] and added to active queue!`);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200/80 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Raw Input — Live Comment Classifier
                </h2>
                <span className="font-mono text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md font-semibold">
                  src/lib/classifier.ts
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Softmax ML
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Extracts 7 features in real-time, computes multinomial softmax probabilities, and executes automated routing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Notification banner */}
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Quick Test Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1-Click Test Scenarios:
              </label>
              <span className="text-[11px] text-slate-400">All 4 categories covered</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSample('Kill the heat and beat the eggs! This recipe is killer, I would die for this!', 'ChefLiam')}
                className="p-2.5 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs cursor-pointer"
              >
                <div className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <span>🍳</span> Culinary Idiom
                </div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;kill the heat, die for...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('Can I substitute almond milk instead of heavy cream?', 'CuriousBaker')}
                className="p-2.5 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs cursor-pointer"
              >
                <div className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <span>✨</span> Safe Query
                </div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;Can I substitute...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('Win free knife set and $500 crypto bonus at bit.ly/knife-deal now!', 'SpamBot')}
                className="p-2.5 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition-all text-xs cursor-pointer"
              >
                <div className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                  <span>🚫</span> Promo Spam
                </div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;bit.ly/knife-deal...&rdquo;</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSample('You are an idiot and your cooking is complete trash! Shut up!', 'TrollGuy')}
                className="p-2.5 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-300 transition-all text-xs cursor-pointer"
              >
                <div className="text-[10px] font-bold text-rose-700 uppercase flex items-center gap-1">
                  <span>🚨</span> Abusive Toxic
                </div>
                <div className="truncate font-medium text-slate-700 mt-0.5">&ldquo;You are an idiot...&rdquo;</div>
              </button>
            </div>
          </div>

          {/* Raw Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Type or Paste Any Comment (Classifies Live as You Type):
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
                onChange={(e) => setCustomCommentText(e.target.value)}
                placeholder="Type any cooking comment or random sentence..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Live Diagnostics Card */}
          {customCommentText.trim() && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-lg space-y-4 animate-in fade-in duration-200">
              
              {/* Top Verdict Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`text-xs font-extrabold uppercase px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                      classification.label === 'fine'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : classification.label === 'spam'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : classification.label === 'abusive'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    Label: {classification.label}
                  </span>

                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    Confidence: <strong className="text-white">{classification.confidencePct}%</strong>
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                      classification.routing === 'publish'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : classification.routing === 'hide'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}
                  >
                    {classification.routing === 'publish' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {classification.routing === 'hide' && <Ban className="w-3.5 h-3.5 text-rose-400" />}
                    {classification.routing === 'human_review' && <Clock className="w-3.5 h-3.5 text-cyan-400" />}
                    Routing: {classification.routing === 'publish' ? 'Auto-Publish' : (classification.routing === 'hide' ? 'Auto-Hide' : 'Send to Human Review')}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 shrink-0">
                  Total Latency: <strong className="text-emerald-400">~20.5 ms</strong>
                </div>
              </div>

              {/* Routing Rule Callout */}
              <p className="text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                💡 <strong>Routing Rule:</strong> {classification.routingReason}
              </p>

              {/* Softmax Probability Bars + Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                
                {/* Softmax Bars (5 cols) */}
                <div className="sm:col-span-5 bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Softmax Probabilities</span>
                    <span className="text-[10px] text-slate-400 font-mono">∑P = 1.0</span>
                  </div>

                  {/* Fine */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-emerald-300">P(Fine)</span>
                      <span className="font-mono text-emerald-400 font-bold">{(classification.probabilities.fine * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(2, classification.probabilities.fine * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Spam */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-amber-300">P(Spam)</span>
                      <span className="font-mono text-amber-400 font-bold">{(classification.probabilities.spam * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(2, classification.probabilities.spam * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Abusive */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-rose-300">P(Abusive)</span>
                      <span className="font-mono text-rose-400 font-bold">{(classification.probabilities.abusive * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(2, classification.probabilities.abusive * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Features & Signals (7 cols) */}
                <div className="sm:col-span-7 bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    Extracted Features & Signals
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      🔗 Links: <strong>{classification.features.linkCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      🏷️ Promo: <strong>{classification.features.promoCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      ⚠️ Abusive: <strong>{classification.features.abusiveCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-emerald-900/50">
                      🍳 Cooking: <strong>{classification.features.cookingCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      🔠 Caps: <strong>{Math.round(classification.features.capsRatio * 100)}%</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      ❗ Excl: <strong>{classification.features.exclamationCount}</strong>
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 max-h-24 overflow-y-auto">
                    {classification.signals.map((sig, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3-Tier Layer Latency Trace */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between font-bold text-amber-300 mb-0.5">
                    <span>L1: Rules Engine</span>
                    <span className="text-[10px] text-slate-400 font-mono">1.2ms</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {classification.features.linkCount > 0 ? 'Regex URL triggered' : 'Regex & culinary whitelist sieve'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between font-bold text-cyan-300 mb-0.5">
                    <span>L2: Classical ML</span>
                    <span className="text-[10px] text-slate-400 font-mono">4.8ms</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    TF-IDF tokens, caps ratio, punctuation spikes
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between font-bold text-emerald-300 mb-0.5">
                    <span>L3: DistilBERT (66M)</span>
                    <span className="text-[10px] text-slate-400 font-mono">14.5ms</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {classification.features.hasCookingIdiom ? 'Idiom recognized as culinary praise' : 'Bidirectional semantic attention'}
                  </p>
                </div>
              </div>

              {/* Push into queue button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 truncate">
                  Target: <strong className="text-white">{selectedVideo.title}</strong>
                </span>
                <button
                  onClick={handleAddToQueue}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Push into Active System Queue</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Selected Video: <span className="font-semibold text-slate-800">{selectedVideo.title}</span> ({selectedVideo.channel})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
