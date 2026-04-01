/**
 * ModelMathematics.jsx
 * ====================
 * Explains the mathematical basis of the Random Forest model.
 * Includes formulas for ensemble probability, Gini impurity, and feature contribution.
 */
export default function ModelMathematics() {
  return (
    <section id="mathematics" className="max-w-7xl mx-auto px-6 pb-24">
      
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase mb-4 glass px-4 py-1.5 rounded-full">
          🧮 Mathematical Basis & Logic
        </span>
        <h2 className="font-display text-4xl font-extrabold text-white mb-4">
          How the AI <span className="text-gradient">Thinks</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Our model doesn't just "guess." It uses a **Random Forest Classifier** — an ensemble of 200 decision trees — to crunch 30 social and academic variables into a single probability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── 1. THE CLASSIFICATION GOAL ────────────────────── */}
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl text-primary font-bold">01</span>
            <h3 className="font-display text-xl font-bold text-white">The Target Variable</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The model performs **Binary Classification**. It maps 30 inputs (X) to a target y ∈ {'{0, 1}'}.
          </p>
          <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 shadow-inner">
            <p className="text-slate-500 mb-2"># The Math:</p>
            <p className="text-white">y = 1 <span className="text-slate-600">(Pass)</span> if Grade (G3) ≥ 10</p>
            <p className="text-white">y = 0 <span className="text-slate-600">(Fail)</span> if Grade (G3) &lt; 10</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 italic">
            * This is based on the standard Portuguese grading scale (0–20).
          </p>
        </div>

        {/* ── 2. ENSEMBLE PROBABILITY ───────────────────────── */}
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl text-primary font-bold">02</span>
            <h3 className="font-display text-xl font-bold text-white">Ensemble Voting Logic</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            A Random Forest runs 200 different **Decision Trees**. The final prediction is the <strong>weighted average</strong> of all individual tree outputs.
          </p>
          <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 shadow-inner overflow-x-auto">
            <p className="text-slate-500 mb-2"># Average Probability Formula:</p>
            <p className="text-gradient font-bold text-lg">P(Pass|X) = (1/N) * Σ Pᵢ(y=1|X)</p>
            <p className="text-slate-600 text-xs mt-2">Where N is total trees (200) and Pᵢ is the $i$-th tree's vote.</p>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Confidence = $max(P(Pass), P(Fail)) \times 100\%$
          </p>
        </div>

        {/* ── 3. NODE SPLITTING (GINI) ───────────────────────── */}
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl text-primary font-bold">03</span>
            <h3 className="font-display text-xl font-bold text-white">Split Basis: Gini Impurity</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            How does the AI know that "Failures" are more important than "School"? It measures <strong>Gini Impurity</strong>. It looks for splits that create the "purest" groups of passing vs. failing students.
          </p>
          <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 shadow-inner">
            <p className="text-slate-500 mb-2"># Measuring Impurity (G):</p>
            <p className="text-primary font-bold">G = 1 - (p_pass)² - (p_fail)²</p>
            <p className="text-slate-500 text-[11px] mt-2">Lower G = More "Pure" Node. The AI minimizes G at every branch.</p>
          </div>
        </div>

        {/* ── 4. FEATURE WEIGHTS (THE BASIS) ─────────────────── */}
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl text-primary font-bold">04</span>
            <h3 className="font-display text-xl font-bold text-white">Feature Basis (Weights)</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Our model calculates **Mean Decrease in Impurity** (MDI) to weigh variables. Here are the top 5 "Basis" factors:
          </p>
          <div className="space-y-3">
            {[
              { label: 'Past Failures', icon: '❌', weight: '11.88%', logic: 'Strong negative correlation.' },
              { label: 'Higher Ed Aspiration', icon: '🎓', weight: '6.70%', logic: 'Critical motivation factor.' },
              { label: 'School Choice', icon: '🏫', weight: '6.31%', logic: 'Institutional impact.' },
              { label: 'Absences', icon: '📅', weight: '5.78%', logic: 'Inversely proportional to success.' },
              { label: 'Family Relations', icon: '🫂', weight: '4.89%', logic: 'Support system strength.' },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{f.label}</p>
                    <p className="text-[10px] text-slate-500">{f.logic}</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-primary">{f.weight}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Summary CTA */}
      <div className="mt-12 text-center p-8 glass rounded-3xl border border-primary/20 bg-primary/5">
        <h4 className="font-display text-xl font-bold text-white mb-2">Scientific Transparency</h4>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Unlike "Black Box" AI, our Random Forest is fully inspectable. We used <b>Standard Label Encoding</b> to convert categories (e.g., Sex, Address) and <b>Normalization</b> for numeric ranges to ensure no single variable unfairly dominates the ensemble result.
        </p>
      </div>

    </section>
  );
}
