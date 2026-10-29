import React, { useState, useEffect } from 'react';
import { Layers, Zap, ShieldCheck, CheckCircle2, Ban, Clock, ArrowRight, Play, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { analyzeCommentWithCascade } from '../services/moderationEngine';
import { ModerationResult } from '../types';

export const AnimatedArchitectureFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [testSentence, setTestSentence] = useState<string>('This risotto is killer, I would literally die for this recipe!');
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ModerationResult>(() => analyzeCommentWithCascade('This risotto is killer, I would literally die for this recipe!'));

  const sampleSentences = [
    { text: 'This risotto is killer, I would literally die for this recipe!', label: 'Cooking Praise (Nuance)' },
    { text: 'FREE IPHONE 16! Click bit.ly/win-chef-99 now!', label: 'Spam Link (L1 Sieve)' },
    { text: 'You are an idiot and your cooking looks like garbage', label: 'Severe Toxicity (Abuse)' },
    { text: 'Hmm not sure about this timing... feels a bit weird...', label: 'Ambiguous / Borderline (Unclear)' }
  ];

  const handleSelectSentence = (text: string) => {
    setTestSentence(text);
    const res = analyzeCommentWithCascade(text);
    setAnalysisResult(res);
    startAnimation();
  };

  const startAnimation = () => {
    setIsSimulating(true);
    setActiveStep(1); // L1
    
    setTimeout(() => {
      setActiveStep(2); // L2
      setTimeout(() => {
        setActiveStep(3); // L3
        setTimeout(() => {
          setActiveStep(4); // Decision
          setTimeout(() => {
            setActiveStep(5); // Action
            setIsSimulating(false);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const mermaidSource = `graph TD
    A[Incoming Comment: 20,000/day] --> B[Layer 1: AI Rules & Regex ~1.2ms]
    B -->|URL / Link Shorteners / DM pitch| Hide1[Auto-Hide Spam: 98% Conf]
    B -->|Severe Hate Speech Blocklist| Hide2[Auto-Hide Abuse: 97% Conf]
    B -->|Culinary Idiom Match 'kill heat', 'beat'| L3Direct[Fast-track Cooking Context]
    B -->|Standard Text| C[Layer 2: Classical ML ~4.8ms]
    
    C -->|TF-IDF + Caps Ratio + Punctuation Features| D[Layer 3: Small Transformer DistilBERT ~14.5ms]
    L3Direct --> D
    
    D --> E{Cascade Confidence Threshold Engine}
    E -->|Confidence >= 90% (Fine)| Act1[Auto-Publish ~57%]
    E -->|Confidence >= 90% (Spam / Abuse)| Act2[Auto-Hide & Flag ~26%]
    E -->|Confidence 40% - 89% (Ambiguous)| Act3[Human Queue: 2 Moderators ~320/day]
    
    Act3 --> F[Moderator Review: Approve / Hide / Escalate]
    F --> G[(Active Learning Retraining Dataset)]
    G -->|Weekly Fine-Tuning & Drift Recalibration| D`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mermaidSource);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Animated Pipeline Architecture
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How Incoming Comments Flow Through the 3-Tier Cascade
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Watch any comment travel through Rules &rarr; Classical ML &rarr; DistilBERT &rarr; Threshold Router in real-time.
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-700 transition-all self-start sm:self-auto shrink-0"
        >
          {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copiedMermaid ? 'Mermaid Code Copied!' : 'Copy Mermaid Code'}</span>
        </button>
      </div>

      {/* Preset Test Buttons for Live Flow Demonstration */}
      <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/60 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Click a Scenario to Animate the Live Flow:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleSentences.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSentence(s.text)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                testSentence === s.text
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                  : 'border-stone-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-[11px] opacity-80">{s.label}</div>
              <div className="truncate text-xs mt-0.5">&ldquo;{s.text}&rdquo;</div>
            </button>
          ))}
        </div>
      </div>

      {/* Animated Pipeline Nodes Display */}
      <div className="relative py-4">
        
        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          
          {/* Node 1: Ingestion */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${
            activeStep === 0 || activeStep === 1
              ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/10 shadow-xs scale-102'
              : 'border-stone-200 bg-white opacity-85'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Step 1</span>
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Ingestion</h4>
            <div className="text-[11px] text-slate-500 mt-1">20,000/day</div>
            <p className="text-[10px] text-slate-400 mt-2">Incoming raw video comment</p>
          </div>

          {/* Node 2: Layer 1 Rules */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${
            activeStep === 1
              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-xs scale-102'
              : 'border-stone-200 bg-white opacity-85'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-700">Layer 1</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">~1.2 ms</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Deterministic Rules</h4>
            <div className="text-[11px] text-slate-500 mt-1">Regex &amp; Allowlist</div>
            <p className="text-[10px] text-slate-500 mt-2">
              {analysisResult.layerBreakdown.l1_rules.triggered
                ? 'Flagged: ' + analysisResult.layerBreakdown.l1_rules.rule
                : 'Clean: Passed regex checks'}
            </p>
          </div>

          {/* Node 3: Layer 2 ML */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${
            activeStep === 2
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-xs scale-102'
              : 'border-stone-200 bg-white opacity-85'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-blue-700">Layer 2</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">~4.8 ms</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Classical ML</h4>
            <div className="text-[11px] text-slate-500 mt-1">TF-IDF &amp; Features</div>
            <p className="text-[10px] text-slate-500 mt-2">
              Features: {analysisResult.layerBreakdown.l2_ml.features[0] || 'Standard casing'}
            </p>
          </div>

          {/* Node 4: Layer 3 DistilBERT */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${
            activeStep === 3
              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 shadow-xs scale-102'
              : 'border-stone-200 bg-white opacity-85'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Layer 3</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">~14.5 ms</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Small Transformer</h4>
            <div className="text-[11px] text-slate-500 mt-1">DistilBERT Context</div>
            <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
              {analysisResult.layerBreakdown.l3_transformer.contextNotes}
            </p>
          </div>

          {/* Node 5: Cascade Outcome */}
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${
            activeStep === 4 || activeStep === 5
              ? analysisResult.category === 'fine'
                ? 'border-emerald-700 bg-emerald-100/70 text-emerald-900 ring-2 ring-emerald-500/30'
                : analysisResult.category === 'spam'
                ? 'border-amber-600 bg-amber-100/70 text-amber-900 ring-2 ring-amber-500/30'
                : analysisResult.category === 'abusive'
                ? 'border-rose-600 bg-rose-100/70 text-rose-900 ring-2 ring-rose-500/30'
                : 'border-blue-600 bg-blue-100/70 text-blue-900 ring-2 ring-blue-500/30'
              : 'border-stone-200 bg-white opacity-85'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase">Decision Router</span>
              <span className="font-mono font-bold text-xs">{analysisResult.confidence}%</span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {analysisResult.category}
            </h4>
            <div className="text-[11px] font-bold mt-1">
              {analysisResult.recommendedAction}
            </div>
            <p className="text-[10px] mt-2 opacity-80">
              {analysisResult.confidence >= 90
                ? 'Automatic action taken. Zero moderator load.'
                : 'Routed to 2 Human Moderators for verification.'}
            </p>
          </div>

        </div>

        {/* Execution Summary Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-stone-900 text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Live Sentence Under Analysis:</span>
            <span className="font-semibold text-white">&ldquo;{testSentence}&rdquo;</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-amber-400 font-mono font-bold">Total Cascade Latency: ~20.5 ms</span>
            <button
              onClick={startAnimation}
              disabled={isSimulating}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold flex items-center gap-1 transition-all"
            >
              <RotateCcw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Re-animate Flow</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

