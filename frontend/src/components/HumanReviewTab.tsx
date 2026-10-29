import React from 'react';
import { AlertTriangle, Check, Ban, Flag, RotateCcw, TrendingDown, TrendingUp, Sparkles, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { VideoComment, ModeratorAction, ModeratorDecisionLog, Category } from '../types';

interface HumanReviewTabProps {
  reviewComments: VideoComment[];
  decisionLogs: ModeratorDecisionLog[];
  onModeratorAction: (commentId: string, action: ModeratorAction) => void;
  onRestoreComment: (commentId: string) => void;
  onTriggerRetrainingSim: () => void;
  isRetraining: boolean;
}

export const HumanReviewTab: React.FC<HumanReviewTabProps> = ({
  reviewComments,
  decisionLogs,
  onModeratorAction,
  onRestoreComment,
  onTriggerRetrainingSim,
  isRetraining
}) => {
  const getCategoryBadge = (cat: Category) => {
    switch (cat) {
      case 'spam':
        return {
          text: 'text-amber-800',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          dot: 'bg-amber-600'
        };
      case 'abusive':
        return {
          text: 'text-rose-800',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          dot: 'bg-rose-600'
        };
      case 'fine':
        return {
          text: 'text-emerald-800',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          dot: 'bg-emerald-600'
        };
      case 'unclear':
      default:
        return {
          text: 'text-blue-800',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          dot: 'bg-blue-600'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Human review &amp; learning
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Borderline comments for the moderator team, and how their decisions feed back into the system.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Illustrative demo data
        </span>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Review queue + Recent moderator decisions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Review Queue */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Review queue</h2>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-stone-100 px-2.5 py-1 rounded-full">
                {reviewComments.length} items
              </span>
            </div>

            <div className="space-y-4">
              {reviewComments.map((item) => {
                const badge = getCategoryBadge(item.category);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-stone-200/70 hover:border-slate-300 transition-all bg-stone-50/40"
                  >
                    {/* Comment text */}
                    <p className="text-sm font-semibold text-slate-900">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    {/* Metadata & Confidence */}
                    <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-700">{item.author}</span>
                      <span>·</span>
                      <span>{item.videoTitle}</span>
                      <span>·</span>
                      <span>{item.timestamp}</span>
                      {item.confidence && (
                        <>
                          <span>·</span>
                          <span className="font-mono font-medium text-slate-700">{item.confidence}% confidence</span>
                        </>
                      )}
                    </div>

                    {/* Tags row & Action buttons */}
                    <div className="mt-3.5 pt-3 border-t border-stone-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Status & category tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          {item.category}
                        </span>

                        {item.status === 'awaiting_review' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Awaiting review
                          </span>
                        )}

                        {item.status === 'hidden' && (
                          <>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <Ban className="w-3 h-3 text-rose-600" />
                              Hidden
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-stone-100 px-2 py-0.5 rounded-full">
                              Policy review
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => onModeratorAction(item.id, 'approve')}
                          className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>

                        <button
                          onClick={() => onModeratorAction(item.id, 'hide')}
                          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95"
                        >
                          <Ban className="w-3 h-3" />
                          Hide
                        </button>

                        <button
                          onClick={() => onModeratorAction(item.id, 'escalate')}
                          className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95"
                        >
                          <Flag className="w-3 h-3" />
                          Escalate
                        </button>

                        {item.status === 'hidden' && (
                          <button
                            onClick={() => onRestoreComment(item.id)}
                            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-2 underline transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Restore
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              {reviewComments.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  🎉 All pending review comments have been cleared by the moderators!
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Recent moderator decisions */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent moderator decisions</h2>
              {decisionLogs.length > 0 && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  {decisionLogs.length} active labels added
                </span>
              )}
            </div>

            {decisionLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-stone-200 rounded-xl">
                No moderator decisions yet. Decide on comments in the queue or above.
              </div>
            ) : (
              <div className="space-y-3">
                {decisionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">&ldquo;{log.commentText}&rdquo;</span>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Author: {log.author} · Decided by {log.moderatorName} · {log.timestamp}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[11px] uppercase ${
                          log.newAction === 'approve'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.newAction === 'hide'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.newAction}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-white border border-stone-200 px-2 py-0.5 rounded">
                        {log.trainingSampleStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: How moderators teach the system + Monitoring metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: How moderators teach the system */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              How moderators teach the system
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every moderator decision and every appeal becomes a labelled example. These are used to evaluate the classifier and to prepare rule and threshold updates — nothing is auto-trained without review.
            </p>

            <div className="space-y-3 pt-1">
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs font-bold text-slate-900 mb-1">Moderator decisions</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Each Approve / Hide / Escalate action is stored with the comment&apos;s signals as a labelled example.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs font-bold text-slate-900 mb-1">Appeals from users</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reversed decisions are marked as mislabels and weighted higher in the next evaluation round.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs font-bold text-slate-900 mb-1">Weekly evaluation</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thresholds (e.g. the 90% auto-hide cut-off) are re-checked against the fresh labelled examples.
                </p>
              </div>
            </div>

            {/* Interactive Retraining Button */}
            <div className="pt-2">
              <button
                onClick={onTriggerRetrainingSim}
                disabled={isRetraining}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isRetraining ? 'animate-spin' : ''}`} />
                <span>{isRetraining ? 'Retraining DistilBERT & Updating Weights...' : 'Run Simulated Weekly Retraining Loop'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Monitoring metrics */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Monitoring metrics</h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Drift Watch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Metric 1 */}
              <div className="bg-stone-50/70 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs text-slate-500 font-medium">False positive rate</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  <span>2.1%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Fine comments wrongly hidden this week (was 3.4%)
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-stone-50/70 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs text-slate-500 font-medium">Spam escape rate</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  <span>0.8%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Spam visible to users after 24h (was 1.5%)
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-stone-50/70 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs text-slate-500 font-medium">Review backlog</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  <span>320</span>
                  <span className="text-xs font-semibold text-amber-600 flex items-center">
                    <TrendingUp className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Comments waiting for the 2 moderators
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-stone-50/70 rounded-xl p-3.5 border border-stone-200/60">
                <div className="text-xs text-slate-500 font-medium">Appeal reversal rate</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  <span>4.5%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingDown className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Appeals that overturned a moderation decision
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-stone-100">
              Illustrative figures for the demo week.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

