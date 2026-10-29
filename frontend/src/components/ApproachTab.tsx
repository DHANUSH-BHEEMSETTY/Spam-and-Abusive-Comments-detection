import React, { useState } from 'react';
import { Layers, Cpu, Zap, ShieldAlert, CheckCircle, ArrowRight, ShieldCheck, Sparkles, AlertCircle, RefreshCw, HelpCircle, Terminal } from 'lucide-react';

export const ApproachTab: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [selectedEdgeCase, setSelectedEdgeCase] = useState<number>(0);

  const edgeCases = [
    {
      title: 'Culinary Idiom / Acclaim',
      comment: 'This risotto is killer, I would literally die for this recipe!',
      naiveVerdict: 'Flagged as Abusive / Violent (Triggers on "killer" and "die")',
      ourCascade: 'DistilBERT Context Layer recognizes positive slang acclaim. Classified as FINE (99% confidence) -> Auto-Published.',
      layerUsed: 'Layer 3: DistilBERT Semantic Context'
    },
    {
      title: 'Cooking Prep Technique',
      comment: 'Beat the egg whites until stiff peaks form.',
      naiveVerdict: 'Flagged by naive regex (Triggers on "beat")',
      ourCascade: 'Culinary domain allowlist + DistilBERT sequence parser identifies cooking verb. Classified as FINE (98% confidence) -> Auto-Published.',
      layerUsed: 'Layer 1 Allowlist + Layer 3 DistilBERT'
    },
    {
      title: 'Cooking Heat Instruction',
      comment: 'Kill the heat immediately after adding garlic so it does not burn!',
      naiveVerdict: 'Flagged by toxicity filter (Triggers on "kill")',
      ourCascade: 'Cooking lexicon engine identifies thermal regulation idiom. Classified as FINE (97% confidence) -> Auto-Published.',
      layerUsed: 'Layer 1 Allowlist + Layer 3 DistilBERT'
    },
    {
      title: 'Adversarial Obfuscated Spam',
      comment: 'F-R-E-E  G-I-F-T  C-A-R-D-S 🎁 bit.ly/chef-win',
      naiveVerdict: 'Might bypass simple word-exact blocklists',
      ourCascade: 'Regex catches bit.ly URL shortener + character de-spacing normalizer detects solicitation. Classified as SPAM (99% confidence) -> Auto-Hidden.',
      layerUsed: 'Layer 1: Regex & De-obfuscation Normalizer'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Interview Presentation Framework · AI ⊃ ML ⊃ DL Cascade
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How We Solve 20,000 Comments/Day with 2 Moderators
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            The core challenge is an extreme asymmetry: <strong>20,000 comments daily vs. 2 human moderators</strong> (who can realistically review ~1,000–1,500 total). We design a cost-effective, 3-tier cascaded architecture using <strong>Rules, Classical ML, and a Small Transformer (DistilBERT)</strong> that auto-processes 94% of traffic with high precision, escalating only the genuine 6% edge cases.
          </p>
        </div>

        {/* 3-Tier Hierarchy Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
          
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Layer 1</span>
              <span className="text-[10px] font-bold bg-stone-200 text-slate-700 px-2 py-0.5 rounded-full">~1 ms latency</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">AI Rules &amp; Regex (No Learning)</h3>
            <p className="text-xs text-slate-600 mt-1">
              Catches obvious spam links, phone numbers, crypto keywords, and duplicate text. Handles 50–60% of volume instantly at near-zero CPU cost.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Layer 2</span>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">~4 ms latency</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Classical ML (Statistical)</h3>
            <p className="text-xs text-slate-600 mt-1">
              TF-IDF, n-grams, caps ratio, punctuation density scored with Logistic Regression / Naive Bayes. Fast, probabilistic, and explainable workhorse.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Layer 3</span>
              <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">~14 ms CPU</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Small Transformer (DistilBERT)</h3>
            <p className="text-xs text-slate-600 mt-1">
              Context-aware deep learning that understands culinary nuances (&ldquo;killer recipe&rdquo;, &ldquo;kill the heat&rdquo;). Evaluates only borderline comments.
            </p>
          </div>

        </div>
      </div>

      {/* The 4 Interview Questions Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Direct Answers to the 4 Interview Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Structured responses tailored to impress the ITC Infotech interview panel.
          </p>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          {[
            { id: 1, title: 'Q1: Classification Strategy' },
            { id: 2, title: 'Q2: Action per Category' },
            { id: 3, title: 'Q3: Avoiding False Hides' },
            { id: 4, title: 'Q4: Evolving Spam Tricks' }
          ].map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveQuestion(q.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeQuestion === q.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>

        {/* Question 1 Content */}
        {activeQuestion === 1 && (
          <div className="mt-6 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-slate-900">
              Q1: How would you classify comments as fine, spam, abusive, or unclear?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
                <span className="font-bold text-slate-900 block mb-1">1. Multi-tier Scoring Pipeline:</span>
                Each comment runs through our cascade:
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                  <li><strong>Layer 1 (Rules):</strong> Regex checks for links, obfuscated URLs, known promotional phrases (&ldquo;DM me&rdquo;), and vulgarity blocklists.</li>
                  <li><strong>Layer 2 (ML):</strong> Logistic Regression with TF-IDF and metadata features (account age, caps ratio, comment rate).</li>
                  <li><strong>Layer 3 (Small Transformer):</strong> DistilBERT produces softmax probabilities: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">P(fine), P(spam), P(abusive)</code>.</li>
                </ul>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
                <span className="font-bold text-slate-900 block mb-1">2. Rigorous Confidence Thresholding:</span>
                We define explicit operational boundaries:
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                  <li><strong>Fine:</strong> <code className="text-emerald-700 font-bold">P(fine) &ge; 0.90</code> with no rule flags.</li>
                  <li><strong>Spam:</strong> <code className="text-amber-700 font-bold">P(spam) &ge; 0.90</code> or high-confidence URL match.</li>
                  <li><strong>Abusive:</strong> <code className="text-rose-700 font-bold">P(abusive) &ge; 0.90</code> with verified hostile intent.</li>
                  <li><strong>Unclear:</strong> Confidence between <code className="text-blue-700 font-bold">0.40 and 0.89</code>, or conflicting signals (e.g. high toxicity score on a positive review).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Question 2 Content */}
        {activeQuestion === 2 && (
          <div className="mt-6 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-slate-900">
              Q2: What should happen to each category?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-800 text-sm mb-1">Fine (~57%)</div>
                <div className="font-semibold text-emerald-700 mb-1">Action: Auto-Publish</div>
                <p className="text-slate-600 text-[11px]">
                  Instantly visible on the video. Zero moderator intervention required. Zero latency for creator engagement.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="font-bold text-amber-800 text-sm mb-1">Spam (~21%)</div>
                <div className="font-semibold text-amber-700 mb-1">Action: Auto-Hide &amp; Log</div>
                <p className="text-slate-600 text-[11px]">
                  Hidden immediately from public view. Logged for rate-limiting; repeat offenders receive a shadowban or captcha challenge.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="font-bold text-rose-800 text-sm mb-1">Abusive (~5%)</div>
                <div className="font-semibold text-rose-700 mb-1">Action: Auto-Hide &amp; Flag</div>
                <p className="text-slate-600 text-[11px]">
                  Hidden instantly. Flagged in user account history. Severe hate speech triggers a strike or temporary commenting freeze.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="font-bold text-blue-800 text-sm mb-1">Unclear (~18%)</div>
                <div className="font-semibold text-blue-700 mb-1">Action: Human Queue (Top ~320/day)</div>
                <p className="text-slate-600 text-[11px]">
                  Prioritized by risk score into the moderator queue. 2 human moderators review only ~320 borderline cases daily.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question 3 Content */}
        {activeQuestion === 3 && (
          <div className="mt-6 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-slate-900">
              Q3: How would you avoid hiding genuine comments by mistake?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
                <div className="font-bold text-slate-900 mb-1">1. Cooking Lexicon &amp; Context</div>
                <p className="text-slate-600 leading-relaxed">
                  Cooking videos have violent-sounding words that are actually benign: <em>&ldquo;kill the heat&rdquo;, &ldquo;beat the eggs&rdquo;, &ldquo;killer recipe&rdquo;, &ldquo;sharp knife&rdquo;</em>. Our small transformer evaluates the entire sentence context, preventing false flags.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
                <div className="font-bold text-slate-900 mb-1">2. Asymmetric High Auto-Hide Bar</div>
                <p className="text-slate-600 leading-relaxed">
                  We enforce a high 90% threshold to auto-hide. If the AI is only 75% sure a comment is spam, it does <strong>NOT</strong> hide it; it routes to human review. Hiding a genuine fan comment hurts engagement more than showing borderline text.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70">
                <div className="font-bold text-slate-900 mb-1">3. Creator &amp; User Appeal Loops</div>
                <p className="text-slate-600 leading-relaxed">
                  Creators can view a &ldquo;Held for review&rdquo; tab to restore comments with 1-click. Users can tap &ldquo;Appeal decision&rdquo;. Overturned decisions feed directly into retraining as high-weight negative samples.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question 4 Content */}
        {activeQuestion === 4 && (
          <div className="mt-6 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-base font-bold text-slate-900">
              Q4: How would you keep up with new spam tricks?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70 space-y-2">
                <div className="font-bold text-slate-900">1. Active Learning &amp; Moderator Feedback</div>
                <p className="text-slate-600">
                  Every decision made by the 2 human moderators on &ldquo;Unclear&rdquo; comments generates a high-quality labeled training sample.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-[11px] font-mono text-slate-800">
                  Moderator Action &rarr; Automated Label &rarr; Weekly Retraining &rarr; Threshold Calibration
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70 space-y-2">
                <div className="font-bold text-slate-900">2. Adversarial Text Normalization</div>
                <p className="text-slate-600">
                  Spammers use tricks like zero-width spaces, character spaces (<code className="bg-stone-200 px-1 rounded">c-h-e-a-p</code>), homoglyphs (Cyrillic &lsquo;a&rsquo; for Latin &lsquo;a&rsquo;), and URL shorteners. Our Layer 1 pre-processor normalizes Unicode, strips zero-width spaces, and unshortens redirect links.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Cooking Edge Case Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Interactive Cooking Edge-Case Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Demonstrating why a Small Transformer (DistilBERT) avoids catastrophic false positives on cooking channels.
            </p>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            Live Demonstration
          </span>
        </div>

        {/* Edge Case Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {edgeCases.map((ec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEdgeCase(idx)}
              className={`p-3 rounded-xl text-left border transition-all ${
                selectedEdgeCase === idx
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-0.5">
                Case {idx + 1}
              </div>
              <div className="text-xs font-bold truncate">{ec.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Case Detail Card */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sample Comment Input
            </div>
            <div className="text-base font-semibold text-slate-900 font-mono bg-white p-3 rounded-xl border border-stone-200">
              &ldquo;{edgeCases[selectedEdgeCase].comment}&rdquo;
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Naive System */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Naive Keyword Filter Result
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {edgeCases[selectedEdgeCase].naiveVerdict}
              </p>
              <div className="text-[10px] text-rose-700 mt-2">
                Result: Angry creator, broken fan engagement, high false-positive rate.
              </div>
            </div>

            {/* Our Cascade */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Our 3-Tier Cascade Result
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {edgeCases[selectedEdgeCase].ourCascade}
              </p>
              <div className="text-[10px] text-emerald-700 mt-2 font-mono font-semibold">
                Processed by: {edgeCases[selectedEdgeCase].layerUsed}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Why Small Transformer Comparison Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">
            Why Small Transformer (DistilBERT) vs Huge LLMs?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Interviewers look for practical engineering sense. Here is why we do not deploy massive 70B models for 20k comments/day.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Evaluation Metric</th>
                <th className="py-2.5 px-3 bg-amber-50/60 font-bold text-slate-900 rounded-t-lg">
                  Small Transformer (DistilBERT / MiniLM) &mdash; Our Choice
                </th>
                <th className="py-2.5 px-3">Generative LLMs (e.g. GPT-4 / LLaMA 70B)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Inference Latency</td>
                <td className="py-3 px-3 bg-amber-50/40 font-bold text-emerald-700 font-mono">10 &ndash; 15 ms (runs on commodity CPU)</td>
                <td className="py-3 px-3 text-slate-500 font-mono">400 &ndash; 1200 ms (needs specialized GPU)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Operating Cost (20k/day)</td>
                <td className="py-3 px-3 bg-amber-50/40 font-bold text-emerald-700 font-mono">&lt; $2.00 / month (virtually free)</td>
                <td className="py-3 px-3 text-slate-500 font-mono">$150 &ndash; $300 / month in token API calls</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Retraining Feasibility</td>
                <td className="py-3 px-3 bg-amber-50/40 font-bold text-emerald-700">Fine-tunes in 5 minutes on weekly moderator labels</td>
                <td className="py-3 px-3 text-slate-500">Fine-tuning is expensive, slow, and prone to drift</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Output Determinism</td>
                <td className="py-3 px-3 bg-amber-50/40 font-bold text-emerald-700">Calibrated probabilities (0.00 &ndash; 1.00) ideal for thresholding</td>
                <td className="py-3 px-3 text-slate-500">Freeform text generation; requires complex JSON parsing</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Privacy &amp; Compliance</td>
                <td className="py-3 px-3 bg-amber-50/40 font-bold text-emerald-700">Runs completely on-premise within company VPC</td>
                <td className="py-3 px-3 text-slate-500">Data leaves infrastructure to third-party endpoints</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

