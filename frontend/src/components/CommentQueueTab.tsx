import React, { useState } from 'react';
import { Search, SlidersHorizontal, AlertTriangle, RotateCcw, Check, Ban, Flag, Sparkles, CheckCircle2, Clock, Layers, Cpu, Zap, ArrowRight } from 'lucide-react';
import { VideoComment, Category, ModeratorAction } from '../types';
import { analyzeCommentWithCascade } from '../services/moderationEngine';

interface CommentQueueTabProps {
  comments: VideoComment[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onModeratorAction: (commentId: string, action: ModeratorAction, overrideCategory?: Category) => void;
  onRestoreComment: (commentId: string) => void;
}

export const CommentQueueTab: React.FC<CommentQueueTabProps> = ({
  comments,
  selectedCategory,
  setSelectedCategory,
  onModeratorAction,
  onRestoreComment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string>(comments[0]?.id || '');
  const [overrideCategory, setOverrideCategory] = useState<Category | null>(null);
  const [panelTab, setPanelTab] = useState<'decision' | 'pipeline'>('decision');

  // Filter comments
  const filteredComments = comments.filter((c) => {
    const matchesCategory =
      selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.videoTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedComment = comments.find((c) => c.id === selectedCommentId) || comments[0];

  // Run live cascade analysis on selected comment for real-time pipeline visualization
  const liveAnalysis = selectedComment ? analyzeCommentWithCascade(selectedComment.text, selectedComment.author) : null;

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'fine':
        return {
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          bar: 'bg-emerald-600',
          dot: 'bg-emerald-600'
        };
      case 'spam':
        return {
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          bar: 'bg-amber-600',
          dot: 'bg-amber-600'
        };
      case 'abusive':
        return {
          text: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          bar: 'bg-rose-600',
          dot: 'bg-rose-600'
        };
      case 'unclear':
      default:
        return {
          text: 'text-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          bar: 'bg-blue-600',
          dot: 'bg-blue-600'
        };
    }
  };

  const getStatusBadge = (comment: VideoComment) => {
    if (comment.status === 'published') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Published
        </span>
      );
    }
    if (comment.status === 'hidden') {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <Ban className="w-3 h-3 text-rose-600" />
            Hidden
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestoreComment(comment.id);
            }}
            className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-0.5 underline transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Restore
          </button>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Awaiting review
      </span>
    );
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comment queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sample comments with classification, confidence and proposed action. Click a row to open the decision panel.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Illustrative demo data
        </span>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comments, authors or videos..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              All
            </button>
            <button
              onClick={() => setSelectedCategory('fine')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'fine'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fine
            </button>
            <button
              onClick={() => setSelectedCategory('spam')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'spam'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spam
            </button>
            <button
              onClick={() => setSelectedCategory('abusive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'abusive'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Abusive
            </button>
            <button
              onClick={() => setSelectedCategory('unclear')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'unclear'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unclear
            </button>
          </div>

          <span className="text-xs font-medium text-slate-500 whitespace-nowrap pl-2">
            {filteredComments.length} of {comments.length} comments
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Comment List + Right Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Comment List */}
        <div className="lg:col-span-7 space-y-2.5">
          {filteredComments.map((comment) => {
            const isSelected = comment.id === selectedComment?.id;
            const style = getCategoryColor(comment.category);

            return (
              <div
                key={comment.id}
                onClick={() => {
                  setSelectedCommentId(comment.id);
                  setOverrideCategory(null);
                }}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-800 ring-1 ring-slate-800 shadow-xs'
                    : 'border-stone-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Comment Header Quote */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      &ldquo;{comment.text}&rdquo;
                    </p>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-700">{comment.author}</span>
                      <span>·</span>
                      <span>{comment.videoTitle}</span>
                      <span>·</span>
                      <span>{comment.timestamp}</span>
                    </div>
                  </div>

                  {/* Right Action summary */}
                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-medium text-slate-700">
                      {comment.proposedAction}
                    </span>
                    {getStatusBadge(comment)}
                  </div>
                </div>

                {/* Bottom Bar: Category pill + Confidence Bar */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                    {comment.category}
                  </span>

                  {/* Progress bar */}
                  <div className="flex-1 max-w-[120px] h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${comment.confidence}%` }}
                    ></div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {comment.confidence}%
                  </span>
                </div>
              </div>
            );
          })}

          {filteredComments.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-200/80 text-center text-slate-500">
              No comments match your search criteria.
            </div>
          )}
        </div>

        {/* Right Column: Sticky Decision Panel */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedComment ? (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
              
              {/* Header with View Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Decision panel</h2>
                  <div className="flex bg-stone-100 p-0.5 rounded-lg text-[11px] font-medium">
                    <button
                      onClick={() => setPanelTab('decision')}
                      className={`px-2 py-1 rounded-md transition-all ${
                        panelTab === 'decision'
                          ? 'bg-white font-bold text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setPanelTab('pipeline')}
                      className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                        panelTab === 'pipeline'
                          ? 'bg-slate-900 font-bold text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>Pipeline Trace</span>
                    </button>
                  </div>
                </div>
                {getStatusBadge(selectedComment)}
              </div>

              {/* Comment Quote & Metadata */}
              <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60">
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  &ldquo;{selectedComment.text}&rdquo;
                </p>
                <div className="text-xs text-slate-500 mt-2">
                  <span className="font-medium text-slate-700">{selectedComment.author}</span> · {selectedComment.videoTitle} · {selectedComment.timestamp} · <span className="text-slate-400">decided by {selectedComment.decisionBy}</span>
                </div>
              </div>

              {/* TAB 1: DECISION SUMMARY VIEW */}
              {panelTab === 'decision' && (
                <>
                  {/* Classification + Confidence Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(overrideCategory || selectedComment.category).bg} ${getCategoryColor(overrideCategory || selectedComment.category).text} border ${getCategoryColor(overrideCategory || selectedComment.category).border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(overrideCategory || selectedComment.category).dot}`}></span>
                          {overrideCategory || selectedComment.category}
                        </span>
                        <span className="font-bold text-slate-700 font-mono">
                          {selectedComment.confidence}%
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">Cascaded AI Score</span>
                    </div>

                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCategoryColor(overrideCategory || selectedComment.category).bar} rounded-full transition-all duration-500`}
                        style={{ width: `${selectedComment.confidence}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      {selectedComment.recommendedActionDesc}
                    </p>
                  </div>

                  {/* Signals List */}
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">
                      Signals
                    </h3>
                    <ul className="space-y-1.5">
                      {selectedComment.signals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-slate-400 mt-0.5">●</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Action Card */}
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/70">
                    <div className="text-[11px] font-bold tracking-wider uppercase text-amber-800 mb-1">
                      Recommended Action
                    </div>
                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                      {selectedComment.proposedAction}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {selectedComment.recommendedActionDesc}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: LIVE 3-TIER PIPELINE EXECUTION TRACE VIEW */}
              {panelTab === 'pipeline' && liveAnalysis && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                    <span>Real-time Cascade Execution</span>
                    <span className="text-emerald-700 font-mono font-bold">Total: ~20.5 ms</span>
                  </div>

                  {/* Layer 1: Rules */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                        Layer 1: Rules &amp; Regex
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{liveAnalysis.layerBreakdown.l1_rules.latencyMs} ms</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {liveAnalysis.layerBreakdown.l1_rules.triggered ? (
                        <span className="text-amber-700 font-semibold">Matched: {liveAnalysis.layerBreakdown.l1_rules.rule}</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Clean: Passed all blocklists and domain regexes</span>
                      )}
                    </p>
                  </div>

                  {/* Layer 2: ML Features */}
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        Layer 2: Classical ML (TF-IDF)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{liveAnalysis.layerBreakdown.l2_ml.latencyMs} ms</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Features extracted: {liveAnalysis.layerBreakdown.l2_ml.features.join(', ') || 'Normal casing, standard lexical n-grams'}
                    </p>
                  </div>

                  {/* Layer 3: DistilBERT Context */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Layer 3: DistilBERT Transformer
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{liveAnalysis.layerBreakdown.l3_transformer.latencyMs} ms</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {liveAnalysis.layerBreakdown.l3_transformer.contextNotes}
                    </p>
                  </div>

                  {/* Cascade Decision Result */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-400 mb-0.5">
                      <span>Threshold Engine Decision</span>
                      <span>{selectedComment.confidence}% Confidence</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {selectedComment.confidence >= 90
                        ? `Confidence is ≥90% → Automatic action taken (${selectedComment.proposedAction}). No human moderator needed.`
                        : `Confidence is ${selectedComment.confidence}% (between 40% and 89%) → Borderline case routed to the 2 human moderators.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Moderator Override Section */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <div className="text-xs font-bold tracking-wider uppercase text-slate-500">
                  Moderator Override
                </div>

                {/* Category selector pills */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(['fine', 'spam', 'abusive', 'unclear'] as Category[]).map((cat) => {
                    const isCurrent = (overrideCategory || selectedComment.category) === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setOverrideCategory(cat)}
                        className={`text-xs py-1.5 font-medium rounded-lg capitalize transition-all ${
                          isCurrent
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* 3 Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onModeratorAction(selectedComment.id, 'approve', overrideCategory || undefined)}
                    className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>

                  <button
                    onClick={() => onModeratorAction(selectedComment.id, 'hide', overrideCategory || undefined)}
                    className="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Hide
                  </button>

                  <button
                    onClick={() => onModeratorAction(selectedComment.id, 'escalate', overrideCategory || undefined)}
                    className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Escalate
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 text-center text-slate-500">
              Select a comment to inspect signals and AI reasoning.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
