import React from 'react';
import { MessageSquare, Users, Cpu, Clock, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface OverviewTabProps {
  onNavigateToQueue: (category?: string) => void;
  onNavigateToReview: () => void;
  onNavigateToApproach: () => void;
  queueCount: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateToQueue,
  onNavigateToReview,
  onNavigateToApproach,
  queueCount
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Moderation overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            How today&apos;s comments flow through AI classification and human review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Illustrative demo data
          </span>
          <button
            onClick={onNavigateToApproach}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            View Strategy
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">20,000</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">Comments received today</div>
          <div className="text-xs text-slate-500 mt-1">Across all cooking videos</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-3">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">2</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">Human moderators</div>
          <div className="text-xs text-slate-500 mt-1">Covering the full review queue</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-3">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">94%</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">Auto-processed</div>
          <div className="text-xs text-slate-500 mt-1">Classified and acted on by AI</div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={onNavigateToReview}
          className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 group-hover:bg-amber-100">
              Review Queue →
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{320 + queueCount}</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">Awaiting review</div>
          <div className="text-xs text-slate-500 mt-1">Queued for the moderator team</div>
        </div>

      </div>

      {/* Middle Row: Two Large Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left: Comments by category */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Comments by category</h2>
              <span className="text-xs text-slate-500 font-medium">Today, all videos</span>
            </div>

            <div className="space-y-4">
              {/* Fine */}
              <div 
                onClick={() => onNavigateToQueue('fine')}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 group-hover:text-emerald-700 transition-colors">Fine</span>
                  <span className="text-slate-500 font-medium">11,400 · 57%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full transition-all duration-700 group-hover:bg-emerald-600" style={{ width: '57%' }}></div>
                </div>
              </div>

              {/* Spam */}
              <div 
                onClick={() => onNavigateToQueue('spam')}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 group-hover:text-amber-700 transition-colors">Spam</span>
                  <span className="text-slate-500 font-medium">4,200 · 21%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all duration-700 group-hover:bg-amber-500" style={{ width: '21%' }}></div>
                </div>
              </div>

              {/* Abusive */}
              <div 
                onClick={() => onNavigateToQueue('abusive')}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 group-hover:text-rose-700 transition-colors">Abusive</span>
                  <span className="text-slate-500 font-medium">900 · 5%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full transition-all duration-700 group-hover:bg-rose-500" style={{ width: '5%' }}></div>
                </div>
              </div>

              {/* Unclear */}
              <div 
                onClick={() => onNavigateToQueue('unclear')}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 group-hover:text-blue-700 transition-colors">Unclear</span>
                  <span className="text-slate-500 font-medium">3,500 · 18%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700 group-hover:bg-blue-500" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-6 pt-4 border-t border-stone-100">
            Bars show illustrative volumes. Unclear comments plus low-confidence spam and abuse make up the human review queue.
          </p>
        </div>

        {/* Right: What the AI did today */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">What the AI did today</h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Status
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <span className="text-xs font-semibold text-slate-700">Published automatically</span>
                <span className="text-sm font-bold text-slate-900 font-mono">10,700</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <span className="text-xs font-semibold text-slate-700">Hidden and logged (spam)</span>
                <span className="text-sm font-bold text-amber-700 font-mono">3,900</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <span className="text-xs font-semibold text-slate-700">Hidden + policy flagged (abuse)</span>
                <span className="text-sm font-bold text-rose-700 font-mono">880</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                <span className="text-xs font-semibold text-amber-900">Sent to human review</span>
                <span className="text-sm font-bold text-amber-800 font-mono">320</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-6 pt-4 border-t border-stone-100">
            Rule-based demo thresholds: spam &gt; 90% hides, severe abuse &gt; 90% hides and flags, everything else goes to humans.
          </p>
        </div>

      </div>

      {/* Bottom: The Moderation Workflow Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">The moderation workflow</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* Step 1 */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">Step 1</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Incoming comments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                20,000 comments a day arrive under cooking videos, live and scheduled posts.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-3 pt-2 border-t border-stone-200/50">
              High volume ingestion
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">Step 2</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">AI classification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each comment is scored as Fine, Spam, Abusive or Unclear with a confidence value.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-amber-700 mt-3 pt-2 border-t border-stone-200/50">
              Rules → ML → DistilBERT Cascade
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">Step 3</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Automatic action or human review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                94% is handled automatically. Borderline cases go to the 2 human moderators.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-3 pt-2 border-t border-stone-200/50">
              Human-in-the-Loop Safeguard
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

