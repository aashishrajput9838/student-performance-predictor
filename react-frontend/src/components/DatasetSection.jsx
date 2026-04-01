/**
 * DatasetSection.jsx
 * ==================
 * UCI ML Repository — Student Performance Dataset (ID=320)
 * https://archive.ics.uci.edu/dataset/320/student+performance
 *
 * 649 students · 30 features · Target: G3 (final grade)
 * Published by Paulo Cortez, University of Minho, Portugal (2008)
 */

const DATASET_STATS = [
  { icon: '📦', label: 'Students',  value: '649' },
  { icon: '📋', label: 'Features',  value: '30' },
  { icon: '🎯', label: 'Target',    value: 'G3 Grade' },
  { icon: '🏫', label: 'Schools',   value: '2' },
  { icon: '🧠', label: 'RF Acc.',   value: '80%' },
  { icon: '📅', label: 'Year',      value: '2008' },
  { icon: '⚖️', label: 'Area',      value: 'Social Sci.' },
];

// Top 10 features used in the predictor (from RF feature importances)
const TOP_FEATURES = [
  { name: 'failures',  label: 'Past Failures',            icon: '❌', importance: 11.88, highlight: true,  desc: 'Number of past class failures (0–3). Strongest single predictor of final grade.' },
  { name: 'higher',    label: 'Wants Higher Education',   icon: '🎓', importance:  6.70, highlight: true,  desc: 'Whether the student wants to pursue higher education (yes/no). Strong motivation signal.' },
  { name: 'school',    label: 'School Attended',          icon: '🏫', importance:  6.31, highlight: false, desc: 'GP (Gabriel Pereira) or MS (Mousinho da Silveira). School environment matters.' },
  { name: 'absences',  label: 'School Absences',          icon: '📅', importance:  5.78, highlight: true,  desc: 'Number of days absent from school (0–93). More absences → higher fail risk.' },
  { name: 'famrel',    label: 'Family Relationship',      icon: '👨‍👩‍👧', importance:  4.89, highlight: true,  desc: 'Quality of family relationships (1=very bad, 5=excellent). Strong support helps.' },
  { name: 'Walc',      label: 'Weekend Alcohol',          icon: '🍺', importance:  4.72, highlight: true,  desc: 'Weekend alcohol consumption (1=very low, 5=very high). Negatively impacts performance.' },
  { name: 'freetime',  label: 'Free Time After School',   icon: '⏰', importance:  4.30, highlight: true,  desc: 'Amount of free time after school (1=very low, 5=very high).' },
  { name: 'Fedu',      label: "Father's Education",       icon: '👨‍🎓', importance:  4.15, highlight: true,  desc: "Father's education level (0=none, 4=higher). Parental education boosts outcomes." },
  { name: 'age',       label: 'Student Age',              icon: '🎂', importance:  4.04, highlight: true,  desc: 'Age of the student (15–22). Older students in secondary school may have more failures.' },
  { name: 'health',    label: 'Health Status',            icon: '💊', importance:  3.93, highlight: true,  desc: 'Current health status (1=very bad, 5=very good). Health affects attendance and focus.' },
];

// All 30 features of the dataset
const ALL_ATTRIBUTES = [
  { name: 'school',     type: 'Categorical', desc: 'Student school: GP or MS' },
  { name: 'sex',        type: 'Categorical', desc: 'Student gender: F or M' },
  { name: 'age',        type: 'Numeric',     desc: 'Age: 15–22' },
  { name: 'address',    type: 'Categorical', desc: 'Urban (U) or Rural (R)' },
  { name: 'famsize',    type: 'Categorical', desc: 'Family size ≤ 3 or > 3' },
  { name: 'Pstatus',    type: 'Categorical', desc: 'Parents living together (T) or apart (A)' },
  { name: 'Medu',       type: 'Numeric',     desc: "Mother's education (0–4)" },
  { name: 'Fedu',       type: 'Numeric',     desc: "Father's education (0–4)" },
  { name: 'Mjob',       type: 'Categorical', desc: "Mother's job (teacher, health, services, etc.)" },
  { name: 'Fjob',       type: 'Categorical', desc: "Father's job" },
  { name: 'reason',     type: 'Categorical', desc: 'Reason to choose school (home/reputation/course/other)' },
  { name: 'guardian',   type: 'Categorical', desc: 'Student guardian (mother/father/other)' },
  { name: 'traveltime', type: 'Numeric',     desc: 'Home to school travel time (1=<15min, 4=>1hr)' },
  { name: 'studytime',  type: 'Numeric',     desc: 'Weekly study time (1=<2hrs, 4=>10hrs)' },
  { name: 'failures',   type: 'Numeric',     desc: 'Number of past class failures (0–3+)' },
  { name: 'schoolsup',  type: 'Binary',      desc: 'Extra educational support from school (yes/no)' },
  { name: 'famsup',     type: 'Binary',      desc: 'Family educational support (yes/no)' },
  { name: 'paid',       type: 'Binary',      desc: 'Extra paid classes (yes/no)' },
  { name: 'activities', type: 'Binary',      desc: 'Extra-curricular activities (yes/no)' },
  { name: 'nursery',    type: 'Binary',      desc: 'Attended nursery school (yes/no)' },
  { name: 'higher',     type: 'Binary',      desc: 'Wants higher education (yes/no)' },
  { name: 'internet',   type: 'Binary',      desc: 'Internet access at home (yes/no)' },
  { name: 'romantic',   type: 'Binary',      desc: 'In a romantic relationship (yes/no)' },
  { name: 'famrel',     type: 'Numeric',     desc: 'Family relationship quality (1–5)' },
  { name: 'freetime',   type: 'Numeric',     desc: 'Free time after school (1–5)' },
  { name: 'goout',      type: 'Numeric',     desc: 'Going out with friends (1–5)' },
  { name: 'Dalc',       type: 'Numeric',     desc: 'Workday alcohol consumption (1–5)' },
  { name: 'Walc',       type: 'Numeric',     desc: 'Weekend alcohol consumption (1–5)' },
  { name: 'health',     type: 'Numeric',     desc: 'Current health status (1–5)' },
  { name: 'absences',   type: 'Numeric',     desc: 'Number of school absences (0–93)' },
];

const TARGETS = [
  { name: 'G1', desc: 'First period grade (0–20)' },
  { name: 'G2', desc: 'Second period grade (0–20)' },
  { name: 'G3', desc: 'Final grade (0–20) — Prediction Target → Pass (≥10) / Fail (<10)', highlight: true },
];

const TYPE_COLORS = {
  Categorical: 'bg-pink-500/20 text-pink-400',
  Numeric:     'bg-accent/20 text-accent',
  Binary:      'bg-yellow-500/20 text-yellow-400',
  Target:      'bg-primary/20 text-primary',
};

function ImportanceBar({ feat }) {
  const isGood = !['failures', 'absences', 'Walc', 'age'].includes(feat.name);
  return (
    <div className={`glass rounded-xl p-4 flex flex-col gap-2 hover:border-primary/20 hover:shadow-primary/5 hover:shadow-lg transition-all duration-200 ${feat.highlight ? 'border border-primary/15' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{feat.icon}</span>
          <span className="text-sm font-semibold text-slate-200">{feat.label}</span>
          {feat.highlight && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">USED IN PREDICTOR</span>
          )}
        </div>
        <span className="text-xs font-bold text-slate-300">{feat.importance}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isGood ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
          style={{ width: `${Math.min(100, feat.importance * 5)}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
    </div>
  );
}

export default function DatasetSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 pb-24">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-bold text-accent tracking-widest uppercase mb-4 glass px-4 py-1.5 rounded-full">
          🎓 UCI ML Repository · Dataset ID 320
        </span>
        <h2 className="font-display text-4xl font-extrabold text-white mb-4">
          Student{' '}
          <span className="text-gradient">Performance</span>{' '}
          Dataset
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
          Real secondary school student data from two Portuguese schools.
          Collected via school reports and questionnaires — used to predict final exam grades.
        </p>
        <a
          href="https://archive.ics.uci.edu/dataset/320/student+performance"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:border-accent/40 hover:text-accent transition-all duration-200"
        >
          <span>🔗</span><span>View on UCI ML Repository</span><span className="text-xs">↗</span>
        </a>
      </div>

      {/* Author + Stats */}
      <div className="glass rounded-3xl p-6 mb-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-extrabold text-sm font-display text-center leading-tight p-1">
            UCI
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Author / Publisher</p>
            <p className="text-base font-bold text-white">Paulo Cortez</p>
            <p className="text-xs text-slate-500">University of Minho, Portugal · 2008</p>
          </div>
        </div>
        <div className="w-px h-10 bg-white/10 hidden lg:block" />
        <div className="flex flex-wrap gap-4 flex-1">
          {DATASET_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center min-w-[68px]">
              <span className="text-lg mb-1">{s.icon}</span>
              <p className="font-display text-lg font-extrabold text-gradient">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="glass rounded-2xl p-6 mb-10">
        <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>📄</span> Dataset Overview
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          This dataset approaches student achievement in secondary education at two Portuguese schools.
          Data was collected using <span className="text-white font-semibold">school reports</span> and{' '}
          <span className="text-white font-semibold">student questionnaires</span>. Features include
          student grades, demographic, social, and school-related variables.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed mt-3">
          The target variable <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded font-mono text-xs">G3</code> is
          the final grade (0–20). For this project, we convert it into a{' '}
          <span className="text-green-400 font-semibold">binary classification</span>:{' '}
          <span className="text-green-400 font-semibold">Pass</span> (G3 ≥ 10) /{' '}
          <span className="text-red-400 font-semibold">Fail</span> (G3 {'<'} 10).
          <br/>
          <span className="text-slate-500 text-xs mt-1 inline-block">
            Distribution: ~84.6% Pass · ~15.4% Fail · Random Forest Accuracy: <span className="text-accent font-bold">80%</span>
          </span>
        </p>
      </div>

      {/* Target Variables */}
      <div className="glass rounded-2xl p-6 mb-10">
        <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Target Variables
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TARGETS.map((t) => (
            <div key={t.name} className={`glass rounded-xl p-4 ${t.highlight ? 'border border-primary/25' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <code className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${t.highlight ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-300'}`}>
                  {t.name}
                </code>
                {t.highlight && <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">PREDICTION TARGET</span>}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importances */}
      <div className="mb-10">
        <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>📊</span> Feature Importances
          <span className="text-sm font-normal text-slate-500 ml-1">— Top 10 (Random Forest)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Features highlighted with <span className="text-primary font-bold">USED IN PREDICTOR</span> are the ones powering the AI prediction above.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOP_FEATURES.map((f) => <ImportanceBar key={f.name} feat={f} />)}
        </div>
      </div>

      {/* All 30 Features Reference Table */}
      <div className="mb-10">
        <h3 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
          <span>🗂️</span> All 30 Features
          <span className="text-sm font-normal text-slate-500 ml-1">— Complete Reference</span>
        </h3>
        <div className="glass rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-slate-500 font-semibold uppercase tracking-wider w-28">Feature</th>
                <th className="py-2 pr-4 text-slate-500 font-semibold uppercase tracking-wider w-24">Type</th>
                <th className="py-2 text-slate-500 font-semibold uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {ALL_ATTRIBUTES.map((attr, i) => (
                <tr key={attr.name} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="py-2 pr-4 font-mono text-accent">{attr.name}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_COLORS[attr.type] || TYPE_COLORS.Numeric}`}>
                      {attr.type}
                    </span>
                  </td>
                  <td className="py-2 text-slate-400">{attr.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-600 uppercase tracking-wider">Tags:</span>
        {['Education', 'Classification', 'Regression', 'Social Science', 'UCI Repository', 'Portugal', 'Secondary School'].map((tag) => (
          <span key={tag} className="text-xs px-3 py-1 rounded-full glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors duration-200 cursor-default">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
