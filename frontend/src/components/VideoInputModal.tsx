import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Filter, Layers, Play } from 'lucide-react';
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
  const [videoUrl, setVideoUrl] = useState('');
  const [customCommentText, setCustomCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo>(INITIAL_VIDEOS[0]);
  const [liveResult, setLiveResult] = useState<ModerationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = () => {
    if (!customCommentText.trim()) return;
    setIsAnalyzing(true);
    setLiveResult(null);

    setTimeout(() => {
      const result = analyzeCommentWithCascade(customCommentText, authorName);
      setLiveResult(result);
      setIsAnalyzing(false);
    }, 400);
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
    setNotification('Comment successfully processed and added to active queue!');
    setTimeout(() => {
      setNotification(null);
      setCustomCommentText('');
      setLiveResult(null);
    }, 2000);
  };

  const handleSelectPresetVideo = (v: VideoInfo) => {
    setSelectedVideo(v);
    setVideoUrl(v.url);
    onSelectVideo(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200/80 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <YouTubeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Video Ingestion &amp; Live AI Playground
              </h2>
              <p className="text-xs text-slate-500">
                Input a YouTube cooking video or test real-time comments through the 3-Layer Cascade
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Notification banner */}
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
          )}

          {/* Section 1: Choose Cooking Video */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1. Select Video or Paste YouTube URL
              </label>
              <span className="text-[11px] text-slate-500">Platform cooking catalog</span>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=cooking_video_id"
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              <button
                onClick={() => {
                  setNotification('Fetched metadata for video: ' + (selectedVideo.title));
                  setTimeout(() => setNotification(null), 2500);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xs"
              >
                Fetch Metadata
              </button>
            </div>

            {/* Presets grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {INITIAL_VIDEOS.map((v) => {
                const isSelected = selectedVideo.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectPresetVideo(v)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-stone-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-16 object-cover rounded-lg mb-1.5"
                    />
                    <div className="text-[11px] font-bold text-slate-900 truncate">
                      {v.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{v.channel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Input Custom Comment */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                2. Live Test a Custom Comment
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCustomCommentText('This risotto is killer, I would literally die for this recipe!');
                    setAuthorName('ChefMarco');
                  }}
                  className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-100"
                >
                  Test Idiom (&ldquo;killer&rdquo;)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomCommentText('Win free cookware gift! Visit bit.ly/chefpromo now!');
                    setAuthorName('PromoBot');
                  }}
                  className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-100"
                >
                  Test Spam Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomCommentText('You are an idiot, nobody should listen to your awful recipes');
                    setAuthorName('TrollUser');
                  }}
                  className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full hover:bg-rose-100"
                >
                  Test Abuse
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author handle (e.g. food_lover_99)"
                  className="w-1/3 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800"
                />
                <input
                  type="text"
                  value={customCommentText}
                  onChange={(e) => setCustomCommentText(e.target.value)}
                  placeholder="Type any comment to test live AI classification..."
                  className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={!customCommentText.trim() || isAnalyzing}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAnalyzing ? 'Running Cascade...' : 'Run 3-Tier AI Cascade'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Live Cascade Diagnostic Result */}
          {liveResult && (
            <div className="pt-2 border-t border-stone-100 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>AI Cascade Execution Trace</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
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
                </div>
              </div>

              {/* 3 Step Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                
                {/* L1 */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L1: Rules Engine</span>
                    <span className="text-[10px] text-slate-500 font-mono">{liveResult.layerBreakdown.l1_rules.latencyMs}ms</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {liveResult.layerBreakdown.l1_rules.triggered ? (
                      <span className="text-rose-700 font-semibold">Matched: {liveResult.layerBreakdown.l1_rules.rule}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">No blocklist violations</span>
                    )}
                  </div>
                </div>

                {/* L2 */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L2: Classical ML</span>
                    <span className="text-[10px] text-slate-500 font-mono">{liveResult.layerBreakdown.l2_ml.latencyMs}ms</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Features: {liveResult.layerBreakdown.l2_ml.features.join(', ') || 'Standard casing & tokens'}
                  </div>
                </div>

                {/* L3 */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>L3: DistilBERT Context</span>
                    <span className="text-[10px] text-slate-500 font-mono">{liveResult.layerBreakdown.l3_transformer.latencyMs}ms</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {liveResult.layerBreakdown.l3_transformer.contextNotes}
                  </div>
                </div>

              </div>

              {/* Action Banner & Add Button */}
              <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Proposed System Action: {liveResult.recommendedAction}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {liveResult.reason}
                  </p>
                </div>
                <button
                  onClick={handleAddToQueue}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Push into Live System</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Current Video: <span className="font-semibold text-slate-800">{selectedVideo.title}</span>
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
