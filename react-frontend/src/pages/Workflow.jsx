/**
 * Workflow.jsx
 * ============
 * A highly visual page showing the data journey from input to result.
 * Features a vertical timeline with icons and detailed technical explanations.
 */
import { Link } from 'react-router-dom';

const WORKFLOW_STEPS = [
  {
    icon: '📝',
    title: 'Input Gathering: The Student Wizard',
    description: 'The user enters 30 social, academic, and demographic factors across 4 intuitive steps (School, Social, Academic, Personal).',
    tech: 'React 19 + Framer Motion (State Management)',
    details: 'Each field is validated in real-time to ensure it falls within the expected UCI range (e.g., Absences 0–93, Age 15–22).'
  },
  {
    icon: '☁️',
    title: 'Secure API Request',
    description: 'The frontend bundles the user entries into a structured JSON payload and sends it to our Flask REST server on Render.',
    tech: 'HTTPS / Axios / JSON POST',
    details: 'The request includes all 30 features as strings/numbers. If the server is offline, the app triggers an automatic local fallback mechanism.'
  },
  {
    icon: '⚙️',
    title: 'Server-Side Preprocessing',
    description: 'The Flask backend receives the raw JSON and converts categorical strings (e.g., "GP", "F", "Urban") into numeric labels.',
    tech: 'Python / Scikit-Learn (LabelEncoder)',
    details: 'The data is transformed into a exact feature vector [x₁, x₂, ..., x₃₀] that matches the model’s training schema.'
  },
  {
    icon: '🌳',
    title: 'Random Forest Inference',
    description: 'The 30-feature vector is passed through 200 independent Decision Trees trained on the UCI Dataset.',
    tech: 'Pickle Loaded Random Forest Classifier (80% Acc)',
    details: 'Each tree calculates a "Pass" probability based on Gini Impurity node splits. Factors like "Failures" and "Higher Ed" weigh heavily here.'
  },
  {
    icon: '⚖️',
    title: 'Probability Aggregation',
    description: 'The AI averages the independent votes from all 200 trees to determine the final Pass/Fail likelihood.',
    tech: 'Ensemble Averaging / 0.5 Threshold',
    details: 'Results with a probability ≥ 50% are classified as a PASS ($y=1$), otherwise FAIL ($y=0$).'
  },
  {
    icon: '✨',
    title: 'Detailed Result Insights',
    description: 'The backend returns the result, confidence score, and a feature importance breakdown for the specific user profile.',
    tech: 'Interactive React Re-render',
    details: 'The user sees their result alongside "Feature Importances" to understand *why* the AI reached that conclusion.'
  }
];

export default function Workflow() {
  return (
    <div className="min-h-screen py-16 px-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase mb-4 glass px-4 py-1.5 rounded-full">
          🔄 End-to-End Data Journey
        </span>
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-6">
          The <span className="text-gradient">Workflow</span> Behind the Prediction
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          From your first click to the final AI insight — here is exactly how your data moves through our prediction engine.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto relative">
        
        {/* Connecting Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-12 md:space-y-24">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              
              {/* Content Panel */}
              <div className="flex-1 w-full">
                <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/15 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{step.icon}</span>
                    <h3 className="font-display text-xl font-bold text-white tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed italic">{step.description}</p>
                  
                  <div className="bg-black/30 rounded-2xl p-5 border border-white/5 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Stack / Tech</p>
                      <code className="text-xs text-slate-300 font-mono">{step.tech}</code>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Technical Logic</p>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{step.details}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Number Circle (Center) */}
              <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-dark border-2 border-primary border-primary flex items-center justify-center text-primary font-display font-extrabold text-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] md:mx-4">
                {idx + 1}
              </div>

              {/* Visual Placeholder (Opposite Side) */}
              <div className="flex-1 hidden md:flex justify-center items-center">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-40 animate-pulse" />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="max-w-4xl mx-auto mt-24 text-center">
        <div className="glass rounded-3xl p-10 border border-primary/20 bg-primary/5 shadow-2xl shadow-primary/10">
          <h2 className="font-display text-2xl font-bold text-white mb-3">Does this make sense?</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">
            Behind every Pass/Fail prediction is a complex ensemble calculation. We prioritize scientific accuracy and data transparency above all else.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/predictor"
              className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 transition-all duration-200"
            >
              Start Prediction →
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-2xl font-bold text-slate-400 glass border border-white/10 hover:text-white transition-all duration-200"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
