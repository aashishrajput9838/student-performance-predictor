/**
 * pages/About.jsx
 * Dataset info, model details, and feature importances
 */
import DatasetSection from '../components/DatasetSection';

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="text-center mb-10 px-6">
        <span className="inline-block text-xs font-bold text-accent tracking-widest uppercase mb-3 glass px-4 py-1.5 rounded-full">
          🎓 UCI ML Repository · Dataset ID 320
        </span>
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-3">
          About the <span className="text-gradient">Dataset</span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Real Portuguese secondary school data — 649 students, 30 features, collected via school reports and questionnaires.
        </p>
      </div>

      <DatasetSection />
    </div>
  );
}
