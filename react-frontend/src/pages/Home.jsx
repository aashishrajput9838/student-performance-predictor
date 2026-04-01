/**
 * pages/Home.jsx
 * Landing page — Hero + feature cards + CTA
 */
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🤖', title: '30-Feature AI Model', desc: 'Trained on real UCI student data using Random Forest with 80% accuracy.' },
  { icon: '⚡', title: 'Instant Prediction', desc: 'Get your Pass/Fail prediction in seconds with detailed factor breakdown.' },
  { icon: '📊', title: 'Full Explainability', desc: 'See exactly which factors influenced your result and by how much.' },
  { icon: '🔒', title: 'No Data Stored', desc: 'Your inputs are never saved. Privacy-first, all analysis is temporary.' },
];

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase mb-4 glass px-4 py-1.5 rounded-full">
            AI-Powered Academic Analysis
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Predict Your{' '}
            <span className="text-gradient">Academic</span>{' '}
            Success with AI.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
            Our machine learning model uses the{' '}
            <strong className="text-white">UCI Student Performance Dataset</strong>{' '}
            to analyze 30+ academic and social factors and predict final exam Pass / Fail outcomes.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'RF Accuracy', value: '80%' },
              { label: 'Students', value: '649' },
              { label: 'Features', value: '30' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-gradient">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/predictor"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              Try the Predictor →
            </Link>
            <Link
              to="/about"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-slate-400 glass border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              Learn About the Dataset
            </Link>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl" />
            <img
              src="/hero_image.png"
              alt="AI-powered student analysis illustration"
              className="relative rounded-3xl shadow-2xl shadow-black/50 animate-float w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-extrabold text-white mb-3">
            Why Use This <span className="text-gradient">Predictor?</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Built on real academic research data — not guesswork. Every prediction is explainable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 flex flex-col gap-3 hover:border-primary/20 hover:shadow-primary/5 hover:shadow-lg transition-all duration-200"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-display font-bold text-white text-base">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 glass rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-extrabold text-white">Ready to check your performance?</p>
            <p className="text-slate-500 text-sm mt-1">Fill in 30 factors across 4 steps — takes less than 2 minutes.</p>
          </div>
          <Link
            to="/predictor"
            className="shrink-0 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Start Prediction →
          </Link>
        </div>
      </section>
    </div>
  );
}
