/**
 * PredictionResult.jsx
 * ====================
 * Shows the full AI result including:
 *   1. Pass/Fail badge
 *   2. Confidence gauge
 *   3. "How this result was calculated" — per-feature explanation panel
 *      with health bars, contribution %, vs-average labels, and importance badges
 */
import { useState } from 'react';

// Returns a Tailwind color class based on health score (0-100)
function healthColor(health) {
  if (health >= 80) return 'bg-green-500';
  if (health >= 55) return 'bg-yellow-400';
  return 'bg-red-500';
}

function healthLabel(health) {
  if (health >= 80) return { text: 'Strong', color: 'text-green-400' };
  if (health >= 55) return { text: 'Average', color: 'text-yellow-400' };
  return { text: 'Weak', color: 'text-red-400' };
}

// Single feature row in the breakdown panel
function FeatureRow({ feat }) {
  const hl   = healthLabel(feat.health);
  const sign = feat.vsAvg >= 0 ? '+' : '';

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-2">
      {/* Top row: icon + label + importance badge + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{feat.icon}</span>
          <span className="text-sm font-semibold text-slate-200">{feat.label}</span>
          {/* Importance badge */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
            {feat.importance}% weight
          </span>
        </div>
        <span className={`text-xs font-bold ${hl.color}`}>{hl.text}</span>
      </div>

      {/* Health bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${healthColor(feat.health)}`}
          style={{ width: `${feat.health}%` }}
        />
      </div>

      {/* Bottom row: raw value + vs avg + contribution */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          Your value:{' '}
          <span className="text-slate-300 font-semibold">
            {feat.key === 'extracurricular'
              ? (feat.rawValue ? 'Yes' : 'No')
              : feat.key === 'parentEdu'
              ? ['', 'High School', 'Associate', 'Bachelor', 'Master', 'PhD'][feat.rawValue] ?? feat.rawValue
              : `${feat.rawValue}${feat.unit}`}
          </span>
        </span>
        <span>
          vs avg:{' '}
          <span className={feat.vsAvg >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
            {sign}{feat.vsAvg}%
          </span>
        </span>
        <span>
          Contribution:{' '}
          <span className="text-slate-300 font-semibold">{feat.contribPct}%</span>
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-600 leading-snug">{feat.description}</p>
    </div>
  );
}

export default function PredictionResult({ result }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!result) return null;

  const isPass = result.result === 'Pass';

  const colors = isPass
    ? {
        badge:   'bg-green-500/20 text-green-400 border border-green-500/30',
        gauge:   'bg-gradient-to-r from-green-500 to-emerald-400',
        glow:    'shadow-green-500/10',
        emoji:   '🎉',
        title:   'Predicted to PASS!',
        msg:     'Your study habits and attendance suggest you are on track for success.',
      }
    : {
        badge:   'bg-red-500/20 text-red-400 border border-red-500/30',
        gauge:   'bg-gradient-to-r from-red-500 to-orange-400',
        glow:    'shadow-red-500/10',
        emoji:   '⚠️',
        title:   'Predicted to FAIL',
        msg:     'You may be at risk. Focus on attendance and previous grade improvement.',
      };

  return (
    <div className={`mt-6 space-y-4 animate-fade-up`}>

      {/* ── RESULT CARD ─────────────────────────────────── */}
      <div className={`glass rounded-2xl p-6 shadow-xl ${colors.glow}`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-widest">
            AI Analysis Complete
          </p>
          {result.source === 'api' ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
              ✓ Real ML Model
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
              ⚡ Local Estimate
            </span>
          )}
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className={`text-xl font-extrabold font-display px-6 py-2 rounded-full ${colors.badge}`}>
            {colors.emoji} {colors.title}
          </span>
        </div>

        {/* Confidence gauge */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Confidence Score</span>
            <span className="font-bold text-slate-200">{result.confidence}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${colors.gauge}`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-slate-400 text-center leading-relaxed">{colors.msg}</p>

        {/* Toggle breakdown */}
        <button
          onClick={() => setShowBreakdown((v) => !v)}
          className="mt-5 w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:border-primary/40 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{showBreakdown ? '▲ Hide' : '▼ Show'} How This Result Was Calculated</span>
        </button>
      </div>

      {/* ── EXPLANATION PANEL ───────────────────────────── */}
      {showBreakdown && (
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-up">

          {/* Header */}
          <div className="text-center mb-2">
            <h3 className="font-display text-lg font-bold text-white">
              🔍 How the AI Reached This Decision
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              The model uses <span className="text-primary font-semibold">feature importances</span> from a
              Random Forest trained on <span className="text-primary font-semibold">40,000 real student records</span>.
              Each factor below contributed to the final score.
            </p>
          </div>

          {/* Score vs threshold explanation */}
          <div className="glass rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Score meter */}
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your Score</p>
              <p className="font-display text-4xl font-extrabold text-gradient">{result.score}</p>
            </div>
            <div className="text-slate-600 text-2xl hidden sm:block">vs</div>
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pass Threshold</p>
              <p className="font-display text-4xl font-extrabold text-slate-400">{result.threshold}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Result</p>
              <p className={`font-display text-2xl font-extrabold ${isPass ? 'text-green-400' : 'text-red-400'}`}>
                {isPass ? 'PASS ✓' : 'FAIL ✗'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {isPass
                  ? `+${(result.score - result.threshold).toFixed(3)} above threshold`
                  : `${(result.score - result.threshold).toFixed(3)} below threshold`}
              </p>
            </div>
          </div>

          {/* Feature importance chart (static bar chart) */}
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">
              📊 Feature Importance (from 40K-record model)
            </p>
            {result.breakdown.map((feat) => (
              <div key={feat.key} className="flex items-center gap-3 mb-2 last:mb-0">
                <span className="text-base w-6 text-center">{feat.icon}</span>
                <span className="text-xs text-slate-400 w-36 shrink-0">{feat.label}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                    style={{ width: `${feat.importance}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-300 w-10 text-right">{feat.importance}%</span>
              </div>
            ))}
          </div>

          {/* Per-feature health breakdown */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">
              🧮 Your Input Breakdown — Each Factor's Contribution
            </p>
            <div className="space-y-3">
              {result.breakdown.map((feat) => (
                <FeatureRow key={feat.key} feat={feat} />
              ))}
            </div>
          </div>

          {/* Formula explanation */}
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">📐 Scoring Basis</p>
            <div className="space-y-1.5 font-mono text-xs text-slate-400">
              <p className="text-primary font-bold hover:text-white transition-colors cursor-help" title="Probability is the mean of all tree predictions">
                P(Pass) = (1/N_trees) * Σ Pᵢ(y=1|X)
              </p>
              <p className="text-slate-500 mt-2">
                Prediction uses 200 Decision Trees. Node splits are based on <b>Gini Impurity</b> index.
              </p>
              <div className="border-t border-white/10 mt-2 pt-2">
                <p>Confidence: <span className="text-accent font-bold">{result.confidence}%</span></p>
                <p>Pass if P(Pass) ≥ <span className="text-yellow-400 font-bold">50%</span>
                  &nbsp;→&nbsp;
                  <span className={isPass ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    {isPass ? 'PASS ✓' : 'FAIL ✗'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-700 text-center leading-relaxed">
            Weights derived from Random Forest feature importances trained on 40,000 student records.
            Normalised against dataset averages. This is an educational demonstration.
          </p>
        </div>
      )}
    </div>
  );
}
