/**
 * Hero.jsx
 * Landing hero section — now uses React Router Link for CTA.
 */
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Text Content */}
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
          Our machine learning model uses the <strong className="text-white">UCI Student Performance Dataset</strong> to
          analyze 30+ academic and social factors and predict final exam Pass / Fail outcomes.
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
            className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Try the Predictor →
          </Link>
          <Link
            to="/workflow"
            className="px-8 py-4 rounded-2xl font-bold text-slate-400 glass border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
          >
            How it Works
          </Link>
        </div>
      </div>

      {/* Right: Floating Illustration */}
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
  );
}
