import React, { useState } from 'react';
import { X, Eye, MessageSquare, Play, Sparkles, Check, ExternalLink, Download } from 'lucide-react';
import { VideoInfo, VideoComment } from '../types';
import { INITIAL_VIDEOS } from '../data/initialData';
import { YouTubeIcon } from './YouTubeIcon';
import { analyzeCommentWithCascade } from '../services/moderationEngine';

interface BrowseVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideoId: string | null;
  onSelectVideo: (video: VideoInfo | null) => void;
  onOpenCommentForVideo: (video: VideoInfo) => void;
  onIngestVideoComments?: (comments: VideoComment[]) => void;
}

export const BrowseVideosModal: React.FC<BrowseVideosModalProps> = ({
  isOpen,
  onClose,
  selectedVideoId,
  onSelectVideo,
  onOpenCommentForVideo,
  onIngestVideoComments
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [customVideos, setCustomVideos] = useState<VideoInfo[]>(INITIAL_VIDEOS);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchCustom = () => {
    if (!customUrl.trim()) return;
    setIsFetching(true);

    setTimeout(() => {
      let title = 'Imported Cooking Masterclass';
      if (customUrl.toLowerCase().includes('pasta')) title = 'Authentic Handmade Carbonara';
      else if (customUrl.toLowerCase().includes('pizza')) title = 'Neapolitan Sourdough Pizza at Home';
      else if (customUrl.toLowerCase().includes('steak')) title = 'Reverse Sear Ribeye Steak Masterclass';
      else if (customUrl.toLowerCase().includes('biryani')) title = 'Hyderabadi Dum Biryani Recipe';
      else title = 'YouTube Cooking Video (' + (customUrl.slice(-11) || 'Live Stream') + ')';

      const newVid: VideoInfo = {
        id: `custom-vid-${Date.now()}`,
        title: title,
        channel: 'Creator Kitchen',
        views: '98,200 views',
        thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        url: customUrl.trim(),
        commentCount: 142
      };

      setCustomVideos([newVid, ...customVideos]);
      onSelectVideo(newVid);

      // Ingest 4 sample comments analyzed through cascade
      if (onIngestVideoComments) {
        const rawSamples = [
          { text: 'Can I substitute almond milk in this recipe?', author: 'BakerSam' },
          { text: 'FREE KNIFE SET! Click bit.ly/knife-gift-99 to claim', author: 'SpamChef' },
          { text: 'This dish looks like trash, you have zero culinary talent', author: 'Hater99' },
          { text: 'Kill the heat before adding the cream so it does not curdle!', author: 'ChefAdvice' }
        ];

        const processed: VideoComment[] = rawSamples.map((raw, idx) => {
          const res = analyzeCommentWithCascade(raw.text, raw.author);
          return {
            id: `c-ingested-${Date.now()}-${idx}`,
            text: raw.text,
            author: raw.author,
            videoTitle: newVid.title,
            videoId: newVid.id,
            timestamp: 'Just now',
            category: res.category,
            confidence: res.confidence,
            status: res.recommendedAction.includes('Publish')
              ? 'published'
              : res.recommendedAction.includes('Hide')
              ? 'hidden'
              : 'awaiting_review',
            proposedAction: res.recommendedAction,
            decisionBy: 'AI',
            signals: res.signals.map((s) => s.text),
            recommendedActionDesc: res.reason
          };
        });

        onIngestVideoComments(processed);
      }

      setIsFetching(false);
      setCustomUrl('');
      setIngestStatus(`Successfully ingested "${newVid.title}" and ran 3-tier cascade on comments!`);
      setTimeout(() => setIngestStatus(null), 3000);
    }, 600);
  };

  const handleFetchCommentsForPreset = (v: VideoInfo) => {
    if (!onIngestVideoComments) return;
    
    const sampleBatch = [
      { text: `What oven temperature should I use for ${v.title}?`, author: 'CuriousCook' },
      { text: 'DM me on WhatsApp +1800293 for chef brand deals and growth!', author: 'PromoBot' },
      { text: `This ${v.title} recipe is killer, I would literally die for this!`, author: 'FoodieFan' },
      { text: 'I am not sure about step 3, seems slightly off...', author: 'DoubtfulViewer' }
    ];

    const processedBatch: VideoComment[] = sampleBatch.map((raw, idx) => {
      const res = analyzeCommentWithCascade(raw.text, raw.author);
      return {
        id: `c-batch-${Date.now()}-${idx}`,
        text: raw.text,
        author: raw.author,
        videoTitle: v.title,
        videoId: v.id,
        timestamp: 'Just now',
        category: res.category,
        confidence: res.confidence,
        status: res.recommendedAction.includes('Publish')
          ? 'published'
          : res.recommendedAction.includes('Hide')
          ? 'hidden'
          : 'awaiting_review',
        proposedAction: res.recommendedAction,
        decisionBy: 'AI',
        signals: res.signals.map((s) => s.text),
        recommendedActionDesc: res.reason
      };
    });

    onIngestVideoComments(processedBatch);
    onSelectVideo(v);
    setIngestStatus(`Ingested 4 fresh comments for "${v.title}" through live AI pipeline!`);
    setTimeout(() => {
      setIngestStatus(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200/80 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Play className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Browse Video Catalog &amp; Channels
              </h2>
              <p className="text-xs text-slate-500">
                Select a cooking video to filter its incoming comment stream, or paste any video link
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

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Notification */}
          {ingestStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{ingestStatus}</span>
            </div>
          )}

          {/* Custom YouTube URL Input */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Ingest Any Video URL (YouTube)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=any_cooking_video..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
              <button
                onClick={handleFetchCustom}
                disabled={!customUrl.trim() || isFetching}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span>{isFetching ? 'Ingesting...' : 'Ingest & Moderate'}</span>
              </button>
            </div>
          </div>

          {/* Quick Filter: All Videos */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Videos on Platform
            </h3>
            <button
              onClick={() => {
                onSelectVideo(null);
                onClose();
              }}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedVideoId === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Show All Videos (20,000 Stream)
            </button>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customVideos.map((v) => {
              const isSelected = selectedVideoId === v.id;
              return (
                <div
                  key={v.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900 shadow-xs'
                      : 'border-stone-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-24 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">{v.channel}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>{v.views}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          {v.commentCount} comments
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1.5 flex-wrap">
                    <button
                      onClick={() => {
                        onSelectVideo(v);
                        onClose();
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-slate-800'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{isSelected ? 'Active Filter' : 'Filter Comments'}</span>
                    </button>

                    <button
                      onClick={() => handleFetchCommentsForPreset(v)}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center gap-1"
                      title="Simulate fetching live comments and running AI cascade"
                    >
                      <Download className="w-3 h-3 text-emerald-600" />
                      <span>Fetch Comments</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCommentForVideo(v);
                        onClose();
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-amber-600" />
                      <span>Test Post</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Selected Video Filter:{' '}
            <span className="font-bold text-slate-800">
              {customVideos.find((v) => v.id === selectedVideoId)?.title || 'All Videos'}
            </span>
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
