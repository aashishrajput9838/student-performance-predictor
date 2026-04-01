/**
 * PredictorForm.jsx
 * =================
 * Multi-step form collecting ALL 30 UCI Student Performance features.
 *
 * Step 1 — Personal Info    (school, sex, age, address, famsize, Pstatus, guardian)
 * Step 2 — Family & Parents (Medu, Fedu, Mjob, Fjob, famsup, nursery)
 * Step 3 — Academic Life    (reason, traveltime, studytime, failures, schoolsup, paid, activities, higher, internet)
 * Step 4 — Lifestyle        (romantic, famrel, freetime, goout, Dalc, Walc, health, absences)
 */
import { useState } from 'react';
import PredictionResult from './PredictionResult';
import {
  predictWithFallback, SAMPLE_DATA,
  SCHOOL_OPTIONS, SEX_OPTIONS, ADDRESS_OPTIONS, FAMSIZE_OPTIONS,
  PSTATUS_OPTIONS, GUARDIAN_OPTIONS, JOB_OPTIONS, REASON_OPTIONS,
  EDU_OPTIONS, TRAVEL_OPTIONS, STUDY_OPTIONS, SCALE_1_5, YES_NO,
} from '../utils/predictor';

// ── Reusable field components ────────────────────────────────────
function Field({ label, id, icon, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>{icon}</span> {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200";
const selectCls = inputCls + " cursor-pointer";

function TextInput({ id, placeholder, min, max, step, value, onChange, required, type = 'number' }) {
  return (
    <input
      id={id} type={type} placeholder={placeholder}
      min={min} max={max} step={step}
      value={value} onChange={onChange} required={required}
      className={inputCls}
    />
  );
}

function Select({ id, value, onChange, options, children }) {
  return (
    <select id={id} value={value} onChange={onChange} className={selectCls}>
      {options
        ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
        : children}
    </select>
  );
}

function ScaleSelect({ id, value, onChange, low, high }) {
  return (
    <select id={id} value={value} onChange={onChange} className={selectCls}>
      {SCALE_1_5.map((v) => (
        <option key={v} value={v}>
          {v} {v === 1 ? `— ${low}` : v === 5 ? `— ${high}` : ''}
        </option>
      ))}
    </select>
  );
}

function YesNoSelect({ id, value, onChange }) {
  return (
    <select id={id} value={value} onChange={onChange} className={selectCls}>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  );
}

// ── Step indicator ───────────────────────────────────────────────
const STEPS = [
  { num: 1, label: 'Personal',  icon: '👤' },
  { num: 2, label: 'Family',    icon: '👨‍👩‍👧' },
  { num: 3, label: 'Academic',  icon: '📚' },
  { num: 4, label: 'Lifestyle', icon: '⚽' },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 z-0" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary z-0 transition-all duration-500"
        style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
      />
      {STEPS.map((step) => {
        const done    = current > step.num;
        const active  = current === step.num;
        return (
          <div key={step.num} className="flex flex-col items-center gap-1 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${done   ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg' : ''}
              ${active ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-primary/30 shadow-lg scale-110' : ''}
              ${!done && !active ? 'bg-white/5 border border-white/15 text-slate-500' : ''}
            `}>
              {done ? '✓' : step.icon}
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${active ? 'text-primary' : 'text-slate-500'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
const INITIAL = {
  school:'GP', sex:'F', age:'', address:'U', famsize:'GT3',
  Pstatus:'T', Medu:'2', Fedu:'2', Mjob:'other', Fjob:'other',
  reason:'reputation', guardian:'mother', traveltime:'1', studytime:'2',
  failures:'', schoolsup:'no', famsup:'yes', paid:'no', activities:'no',
  nursery:'yes', higher:'yes', internet:'yes', romantic:'no',
  famrel:'4', freetime:'3', goout:'3', Dalc:'1', Walc:'2',
  health:'3', absences:'',
};

export default function PredictorForm() {
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState(INITIAL);
  const [result, setResult]         = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Analyzing 30 Factors...');

  const handle = (e) => {
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
    setResult(null);
  };

  const loadSample = () => { setForm({ ...SAMPLE_DATA }); setResult(null); };
  const reset      = () => { setForm(INITIAL); setResult(null); setStep(1); };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMsg('Waking up AI model...');

    // Give the loading message a beat, then update as we fetch
    const warmupTimer = setTimeout(() => setLoadingMsg('Running Random Forest analysis...'), 3000);
    try {
      const prediction = await predictWithFallback(form);
      setResult(prediction);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      clearTimeout(warmupTimer);
      setIsLoading(false);
      setLoadingMsg('Analyzing 30 Factors...');
    }
  };

  const totalFilled = Object.entries(form).filter(([,v]) => v !== '' && v !== null).length;
  const progress    = Math.round((totalFilled / 30) * 100);

  return (
    <section id="predictor" className="max-w-3xl mx-auto px-6 pb-24">
      <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block text-xs font-bold text-primary tracking-widest uppercase mb-3 glass px-4 py-1.5 rounded-full">
            UCI ML Repository · 30 Features · 80% RF Accuracy
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Student Performance Predictor
          </h2>
          <p className="text-slate-400 text-sm">
            Fill in all student details across 4 steps — the AI will analyze every factor.
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold">{totalFilled}/30</span>
          </div>
        </div>

        {/* Step bar */}
        <StepBar current={step} />

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* ===== STEP 1: Personal Info ===== */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-display font-bold text-white text-lg">Personal Information</p>
                  <p className="text-xs text-slate-500">Basic student demographics and household details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="School" id="school" icon="🏫" required>
                  <Select id="school" value={form.school} onChange={handle} options={SCHOOL_OPTIONS} />
                </Field>
                <Field label="Gender" id="sex" icon="👤" required>
                  <Select id="sex" value={form.sex} onChange={handle} options={SEX_OPTIONS} />
                </Field>
                <Field label="Age (years)" id="age" icon="🎂" required>
                  <TextInput id="age" placeholder="e.g. 16" min="14" max="22" value={form.age} onChange={handle} required />
                </Field>
                <Field label="Home Address" id="address" icon="📍" required>
                  <Select id="address" value={form.address} onChange={handle} options={ADDRESS_OPTIONS} />
                </Field>
                <Field label="Family Size" id="famsize" icon="🏠" required>
                  <Select id="famsize" value={form.famsize} onChange={handle} options={FAMSIZE_OPTIONS} />
                </Field>
                <Field label="Parent Cohabitation Status" id="Pstatus" icon="👨‍👩‍👦" required>
                  <Select id="Pstatus" value={form.Pstatus} onChange={handle} options={PSTATUS_OPTIONS} />
                </Field>
                <Field label="Student's Guardian" id="guardian" icon="🧑" required>
                  <Select id="guardian" value={form.guardian} onChange={handle} options={GUARDIAN_OPTIONS} />
                </Field>
                <Field label="In a Romantic Relationship?" id="romantic" icon="💕">
                  <YesNoSelect id="romantic" value={form.romantic} onChange={handle} />
                </Field>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Family & Parents ===== */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-display font-bold text-white text-lg">Family & Parents</p>
                  <p className="text-xs text-slate-500">Parental background, education, jobs and home support</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Mother's Education Level" id="Medu" icon="👩‍🎓" required>
                  <Select id="Medu" value={form.Medu} onChange={handle} options={EDU_OPTIONS} />
                </Field>
                <Field label="Father's Education Level" id="Fedu" icon="👨‍🎓" required>
                  <Select id="Fedu" value={form.Fedu} onChange={handle} options={EDU_OPTIONS} />
                </Field>
                <Field label="Mother's Job" id="Mjob" icon="💼" required>
                  <Select id="Mjob" value={form.Mjob} onChange={handle} options={JOB_OPTIONS} />
                </Field>
                <Field label="Father's Job" id="Fjob" icon="🔧" required>
                  <Select id="Fjob" value={form.Fjob} onChange={handle} options={JOB_OPTIONS} />
                </Field>
                <Field label="Family Relationship Quality (1–5)" id="famrel" icon="🤝">
                  <ScaleSelect id="famrel" value={form.famrel} onChange={handle} low="Very Bad" high="Excellent" />
                </Field>
                <Field label="Family Educational Support?" id="famsup" icon="📖">
                  <YesNoSelect id="famsup" value={form.famsup} onChange={handle} />
                </Field>
                <Field label="Attended Nursery School?" id="nursery" icon="🍼">
                  <YesNoSelect id="nursery" value={form.nursery} onChange={handle} />
                </Field>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Academic Life ===== */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-display font-bold text-white text-lg">Academic Life</p>
                  <p className="text-xs text-slate-500">School choice, study habits, failures and academic support</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Reason to Choose This School" id="reason" icon="🎯" required>
                  <Select id="reason" value={form.reason} onChange={handle} options={REASON_OPTIONS} />
                </Field>
                <Field label="Home to School Travel Time" id="traveltime" icon="🚌">
                  <Select id="traveltime" value={form.traveltime} onChange={handle} options={TRAVEL_OPTIONS} />
                </Field>
                <Field label="Weekly Study Time" id="studytime" icon="📚" required>
                  <Select id="studytime" value={form.studytime} onChange={handle} options={STUDY_OPTIONS} />
                </Field>
                <Field label="Number of Past Class Failures (0–3)" id="failures" icon="❌" required>
                  <TextInput id="failures" placeholder="e.g. 0" min="0" max="3" value={form.failures} onChange={handle} required />
                </Field>
                <Field label="Extra Educational Support from School?" id="schoolsup" icon="🏫">
                  <YesNoSelect id="schoolsup" value={form.schoolsup} onChange={handle} />
                </Field>
                <Field label="Extra Paid Classes (subject tuition)?" id="paid" icon="💳">
                  <YesNoSelect id="paid" value={form.paid} onChange={handle} />
                </Field>
                <Field label="Participates in Extracurricular Activities?" id="activities" icon="⚽">
                  <YesNoSelect id="activities" value={form.activities} onChange={handle} />
                </Field>
                <Field label="Wants to Pursue Higher Education?" id="higher" icon="🎓" required>
                  <YesNoSelect id="higher" value={form.higher} onChange={handle} />
                </Field>
                <Field label="Internet Access at Home?" id="internet" icon="🌐">
                  <YesNoSelect id="internet" value={form.internet} onChange={handle} />
                </Field>
                <Field label="Number of School Absences (days)" id="absences" icon="📅" required>
                  <TextInput id="absences" placeholder="e.g. 4" min="0" max="93" value={form.absences} onChange={handle} required />
                </Field>
              </div>
            </div>
          )}

          {/* ===== STEP 4: Lifestyle & Final ===== */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚽</span>
                <div>
                  <p className="font-display font-bold text-white text-lg">Lifestyle & Wellbeing</p>
                  <p className="text-xs text-slate-500">Social life, health, and personal habits — all matter!</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Free Time After School (1–5)" id="freetime" icon="⏰">
                  <ScaleSelect id="freetime" value={form.freetime} onChange={handle} low="Very Low" high="Very High" />
                </Field>
                <Field label="Going Out with Friends (1–5)" id="goout" icon="🚶">
                  <ScaleSelect id="goout" value={form.goout} onChange={handle} low="Very Low" high="Very High" />
                </Field>
                <Field label="Workday Alcohol Consumption (1–5)" id="Dalc" icon="🍷">
                  <ScaleSelect id="Dalc" value={form.Dalc} onChange={handle} low="Very Low" high="Very High" />
                </Field>
                <Field label="Weekend Alcohol Consumption (1–5)" id="Walc" icon="🍺">
                  <ScaleSelect id="Walc" value={form.Walc} onChange={handle} low="Very Low" high="Very High" />
                </Field>
                <Field label="Current Health Status (1–5)" id="health" icon="💊">
                  <ScaleSelect id="health" value={form.health} onChange={handle} low="Very Bad" high="Very Good" />
                </Field>
              </div>

              {/* Summary preview */}
              <div className="glass rounded-xl p-4 mt-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">📋 Response Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs">
                  {[
                    ['School',    form.school],
                    ['Gender',    form.sex === 'F' ? 'Female' : 'Male'],
                    ['Age',       `${form.age} years`],
                    ['Failures',  form.failures],
                    ['Absences',  `${form.absences} days`],
                    ['Higher Ed', form.higher === 'yes' ? '✅ Yes' : '❌ No'],
                    ['Study Time',{ 1:'<2h', 2:'2-5h', 3:'5-10h', 4:'>10h' }[form.studytime]],
                    ['Health',    `${form.health}/5`],
                    ['Walc',      `${form.Walc}/5`],
                    ['Medu',      `Level ${form.Medu}`],
                    ['Fedu',      `Level ${form.Fedu}`],
                    ['Internet',  form.internet === 'yes' ? '✅ Yes' : '❌ No'],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-slate-500">{lbl}</span>
                      <span className="text-slate-300 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex gap-3 mt-8">
            {/* Sample / Reset */}
            {step === 1 ? (
              <button type="button" onClick={loadSample}
                className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:border-primary/50 hover:text-slate-200 transition-all duration-200"
              >
                Load Sample
              </button>
            ) : (
              <button type="button" onClick={prev}
                className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:border-white/20 hover:text-slate-200 transition-all duration-200"
              >
                ← Back
              </button>
            )}

            <div className="flex-1" />

            {step < 4 ? (
              <button type="button" onClick={next}
                className="flex-[2] py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                Next: {STEPS[step].label} {STEPS[step].icon} →
              </button>
            ) : (
              <button type="submit" disabled={isLoading}
                className="flex-[2] py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {loadingMsg}
                  </span>
                ) : '🔍 Analyze & Predict'}
              </button>
            )}
          </div>
        </form>

        {/* Result */}
        <PredictionResult result={result} />

        {/* Reset when result shown */}
        {result && (
          <button onClick={reset}
            className="mt-4 w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-500 hover:border-white/20 hover:text-slate-300 transition-all duration-200"
          >
            ↺ Start Over
          </button>
        )}
      </div>
    </section>
  );
}
