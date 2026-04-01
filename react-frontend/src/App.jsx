/**
 * App.jsx
 * Root component assembling the full application layout.
 */
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DatasetSection from './components/DatasetSection';
import PredictorForm from './components/PredictorForm';
import { warmUpAPI } from './utils/predictor';

export default function App() {
  // Ping the Render backend on load so it wakes from free-tier sleep
  useEffect(() => { warmUpAPI(); }, []);

  return (
    <div className="min-h-screen bg-mesh">
      {/* Sticky glassmorphic header */}
      <Header />

      {/* Hero section */}
      <Hero />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 my-16">
        <div className="border-t border-white/5" />
      </div>

      {/* Dataset info section (new) */}
      <DatasetSection />

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6 my-4">
        <div className="border-t border-white/5" />
      </div>

      {/* Predictor form + result */}
      <div className="mt-8">
        <PredictorForm />
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-600">
        <p>
          © 2026 EduAI Analytics · Built with React + Tailwind CSS · Powered by Machine Learning
          <br />
          Dataset:{' '}
          <a
            href="https://archive.ics.uci.edu/dataset/320/student+performance"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            UCI Student Performance (ID=320) by Paulo Cortez
          </a>
        </p>
      </footer>
    </div>
  );
}
