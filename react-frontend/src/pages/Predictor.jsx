/**
 * pages/Predictor.jsx
 * The 30-feature prediction form page
 */
import PredictorForm from '../components/PredictorForm';

export default function Predictor() {
  return (
    <div className="min-h-screen py-12">
      <div className="text-center mb-10 px-6">
        <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase mb-3 glass px-4 py-1.5 rounded-full">
          Random Forest · 30 Features · 80% Accuracy
        </span>
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-3">
          Student <span className="text-gradient">Performance</span> Predictor
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Answer all 30 questions across 4 steps. The AI will analyze every factor and predict your Pass/Fail outcome.
        </p>
      </div>

      <PredictorForm />
    </div>
  );
}
