/**
 * predictor.js
 * ============
 * Full 30-feature UCI Student Performance predictor (ID=320).
 * Uses ALL feature importances from the trained Random Forest (80% accuracy).
 *
 * Feature importances (top 15 known, rest estimated proportionally):
 *   failures  11.88%  Walc   4.72%  Medu   3.88%
 *   higher     6.70%  free   4.30%  goout  3.86%
 *   school     6.31%  Fedu   4.15%  Dalc   3.67%
 *   absences   5.78%  age    4.04%  Mjob   2.81%
 *   famrel     4.89%  health 3.93%  reason 2.79%
 */

// ── Option lists ────────────────────────────────────────────────
export const SCHOOL_OPTIONS   = [{ label: 'Gabriel Pereira (GP)', value: 'GP' }, { label: 'Mousinho da Silveira (MS)', value: 'MS' }];
export const SEX_OPTIONS      = [{ label: 'Female', value: 'F' }, { label: 'Male', value: 'M' }];
export const ADDRESS_OPTIONS  = [{ label: 'Urban', value: 'U' }, { label: 'Rural', value: 'R' }];
export const FAMSIZE_OPTIONS  = [{ label: 'Greater than 3', value: 'GT3' }, { label: '3 or less', value: 'LE3' }];
export const PSTATUS_OPTIONS  = [{ label: 'Living Together', value: 'T' }, { label: 'Apart', value: 'A' }];
export const GUARDIAN_OPTIONS = [{ label: 'Mother', value: 'mother' }, { label: 'Father', value: 'father' }, { label: 'Other', value: 'other' }];
export const JOB_OPTIONS      = [
  { label: 'Teacher', value: 'teacher' },
  { label: 'Health', value: 'health' },
  { label: 'Civil Services', value: 'services' },
  { label: 'At Home', value: 'at_home' },
  { label: 'Other', value: 'other' },
];
export const REASON_OPTIONS   = [
  { label: 'Close to Home', value: 'home' },
  { label: 'School Reputation', value: 'reputation' },
  { label: 'Course Preference', value: 'course' },
  { label: 'Other', value: 'other' },
];
export const EDU_OPTIONS = [
  { label: '0 — None',               value: 0 },
  { label: '1 — Primary (4th grade)', value: 1 },
  { label: '2 — 5th to 9th grade',   value: 2 },
  { label: '3 — Secondary',          value: 3 },
  { label: '4 — Higher Education',   value: 4 },
];
export const TRAVEL_OPTIONS = [
  { label: '1 — < 15 min',  value: 1 },
  { label: '2 — 15-30 min', value: 2 },
  { label: '3 — 30-60 min', value: 3 },
  { label: '4 — > 1 hour',  value: 4 },
];
export const STUDY_OPTIONS = [
  { label: '1 — < 2 hours',   value: 1 },
  { label: '2 — 2 to 5 hours', value: 2 },
  { label: '3 — 5 to 10 hours', value: 3 },
  { label: '4 — > 10 hours',  value: 4 },
];
export const SCALE_1_5 = [1, 2, 3, 4, 5];
export const YES_NO    = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];

// ── Feature config (all 30 scored features) ─────────────────────
// weight > 0: higher value → better chance of passing
// weight < 0: higher value → worse chance
const FEATURE_WEIGHTS = {
  // Strongly predictive
  failures:    { w: -0.1188, ref: 0.33 },
  higher:      { w:  0.0670, ref: 1.0  },   // yes=1 no=0
  school:      { w:  0.0631, ref: 0.5  },   // GP=1 MS=0
  absences:    { w: -0.0578, ref: 5.71 },
  famrel:      { w:  0.0489, ref: 3.9  },
  Walc:        { w: -0.0472, ref: 2.29 },
  freetime:    { w:  0.0430, ref: 3.23 },
  Fedu:        { w:  0.0415, ref: 2.52 },
  age:         { w: -0.0404, ref: 16.7 },
  health:      { w:  0.0393, ref: 3.55 },
  Medu:        { w:  0.0388, ref: 2.75 },
  goout:       { w: -0.0386, ref: 3.11 },
  Dalc:        { w: -0.0367, ref: 1.48 },
  Mjob:        { w:  0.0281, ref: 0.5  },   // teacher/health=1 else=0
  reason:      { w:  0.0279, ref: 0.5  },   // reputation/course=1
  studytime:   { w:  0.0250, ref: 1.93 },
  traveltime:  { w: -0.0200, ref: 1.57 },
  internet:    { w:  0.0180, ref: 0.66 },   // yes=1
  famsup:      { w:  0.0160, ref: 0.61 },   // yes=1
  activities:  { w:  0.0150, ref: 0.51 },   // yes=1
  schoolsup:   { w: -0.0140, ref: 0.30 },   // yes=1 (extra school support = struggling)
  paid:        { w:  0.0120, ref: 0.39 },   // yes=1
  sex:         { w:  0.0100, ref: 0.5  },   // M=1 F=0
  Pstatus:     { w:  0.0090, ref: 0.8  },   // Together=1
  famsize:     { w: -0.0080, ref: 0.6  },   // GT3=1
  address:     { w:  0.0070, ref: 0.77 },   // Urban=1
  romantic:    { w: -0.0070, ref: 0.35 },   // yes=1
  nursery:     { w:  0.0060, ref: 0.82 },   // yes=1
  Fjob:        { w:  0.0050, ref: 0.5  },   // teacher/health=1
  guardian:    { w:  0.0040, ref: 0.5  },   // mother=1
};

function encodeInput(inputs) {
  return {
    failures:   Number(inputs.failures),
    higher:     inputs.higher === 'yes' ? 1 : 0,
    school:     inputs.school === 'GP'  ? 1 : 0,
    absences:   Number(inputs.absences),
    famrel:     Number(inputs.famrel),
    Walc:       Number(inputs.Walc),
    freetime:   Number(inputs.freetime),
    Fedu:       Number(inputs.Fedu),
    age:        Number(inputs.age),
    health:     Number(inputs.health),
    Medu:       Number(inputs.Medu),
    goout:      Number(inputs.goout),
    Dalc:       Number(inputs.Dalc),
    Mjob:       ['teacher','health'].includes(inputs.Mjob) ? 1 : 0,
    reason:     ['reputation','course'].includes(inputs.reason) ? 1 : 0,
    studytime:  Number(inputs.studytime),
    traveltime: Number(inputs.traveltime),
    internet:   inputs.internet === 'yes' ? 1 : 0,
    famsup:     inputs.famsup === 'yes' ? 1 : 0,
    activities: inputs.activities === 'yes' ? 1 : 0,
    schoolsup:  inputs.schoolsup === 'yes' ? 1 : 0,
    paid:       inputs.paid === 'yes' ? 1 : 0,
    sex:        inputs.sex === 'M' ? 1 : 0,
    Pstatus:    inputs.Pstatus === 'T' ? 1 : 0,
    famsize:    inputs.famsize === 'GT3' ? 1 : 0,
    address:    inputs.address === 'U' ? 1 : 0,
    romantic:   inputs.romantic === 'yes' ? 1 : 0,
    nursery:    inputs.nursery === 'yes' ? 1 : 0,
    Fjob:       ['teacher','health'].includes(inputs.Fjob) ? 1 : 0,
    guardian:   inputs.guardian === 'mother' ? 1 : 0,
  };
}

// Feature labels for breakdown display
const FEATURE_LABELS = {
  failures: 'Past Failures', higher: 'Higher Education', school: 'School',
  absences: 'Absences', famrel: 'Family Relationship', Walc: 'Weekend Alcohol',
  freetime: 'Free Time', Fedu: "Father's Education", age: 'Age',
  health: 'Health', Medu: "Mother's Education", goout: 'Going Out',
  Dalc: 'Daily Alcohol', Mjob: "Mother's Job", reason: 'School Reason',
  studytime: 'Study Time', traveltime: 'Travel Time', internet: 'Internet Access',
  famsup: 'Family Support', activities: 'Activities', schoolsup: 'School Support',
  paid: 'Paid Classes', sex: 'Gender', Pstatus: 'Parent Status',
  famsize: 'Family Size', address: 'Address', romantic: 'In Relationship',
  nursery: 'Attended Nursery', Fjob: "Father's Job", guardian: 'Guardian',
};
const FEATURE_ICONS = {
  failures:'❌', higher:'🎓', school:'🏫', absences:'📅', famrel:'👨‍👩‍👧',
  Walc:'🍺', freetime:'⏰', Fedu:'👨‍🎓', age:'🎂', health:'💊',
  Medu:'👩‍🎓', goout:'🚶', Dalc:'🍷', Mjob:'💼', reason:'🎯',
  studytime:'📚', traveltime:'🚌', internet:'🌐', famsup:'🤝', activities:'⚽',
  schoolsup:'📖', paid:'💳', sex:'👤', Pstatus:'👨‍👩‍👦', famsize:'🏠',
  address:'📍', romantic:'💕', nursery:'🍼', Fjob:'🔧', guardian:'🧑',
};

export function predictPerformance(inputs) {
  const encoded = encodeInput(inputs);
  let totalScore = 0;

  const breakdown = Object.keys(FEATURE_WEIGHTS).map((key) => {
    const { w, ref } = FEATURE_WEIGHTS[key];
    const val   = encoded[key] ?? ref;
    const norm  = ref !== 0 ? val / ref : val;
    const contrib = w * norm;
    totalScore += contrib;

    // Health = how "good" this feature is (0-100)
    let health;
    if (w > 0) {
      health = Math.round(Math.min(100, (val / (ref * 1.5 || 1)) * 100));
    } else {
      const worst = ref * 2;
      health = Math.round(Math.max(0, ((worst - val) / (worst || 1)) * 100));
    }

    return {
      key, label: FEATURE_LABELS[key], icon: FEATURE_ICONS[key],
      rawValue: val, encodedValue: val, weight: Math.abs(w) * 100,
      contrib, health: Math.min(100, Math.max(0, health)),
      contribPct: 0,
    };
  });

  // Sort by absolute contribution
  breakdown.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));

  const totalAbsContrib = breakdown.reduce((s, f) => s + Math.abs(f.contrib), 0);
  breakdown.forEach((f) => {
    f.contribPct = totalAbsContrib > 0 ? Math.round((Math.abs(f.contrib) / totalAbsContrib) * 100) : 0;
  });

  const THRESHOLD = -0.05;
  const isPass    = totalScore >= THRESHOLD;
  const distance  = (totalScore - THRESHOLD) * 80;
  const confidence = Math.round(50 + Math.max(-48, Math.min(48, distance)));

  return {
    result:     isPass ? 'Pass' : 'Fail',
    confidence: Math.max(1, Math.min(99, confidence)),
    score:      Math.round(totalScore * 1000) / 1000,
    threshold:  THRESHOLD,
    breakdown:  breakdown.slice(0, 10), // show top 10 in result
  };
}

// ── API integration ──────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Call the Render backend API.
 * Returns a result object shaped like predictPerformance() output.
 */
export async function predictPerformanceAPI(inputs) {
  if (!API_URL) throw new Error('No API URL configured');

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
    signal: AbortSignal.timeout(15000), // 15-second timeout (Render cold start)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }

  const data = await response.json();

  // Normalize API response to match the shape of predictPerformance()
  return {
    result:      data.result,
    confidence:  data.confidence,
    score:       data.probability?.pass / 100 ?? 0.5,
    threshold:   0.5,
    breakdown:   (data.breakdown || []).map((b) => ({
      key:        b.key,
      label:      b.label,
      icon:       FEATURE_ICONS[b.key] || '📊',
      rawValue:   b.value,
      encodedValue: b.value,
      weight:     b.importance,
      contrib:    b.importance > 0 ? b.importance / 100 : 0,
      health:     50,
      contribPct: b.importance,
    })),
    source: 'api',
  };
}

/**
 * Try the backend API first; fall back to local scoring if it fails.
 * This ensures the app always returns a result even on Render cold-starts.
 */
export async function predictWithFallback(inputs) {
  if (API_URL) {
    try {
      const apiResult = await predictPerformanceAPI(inputs);
      return { ...apiResult, source: 'api' };
    } catch (err) {
      console.warn('Backend API unavailable, using local model:', err.message);
    }
  }
  // Fallback: client-side scoring
  return { ...predictPerformance(inputs), source: 'local' };
}

/**
 * Ping the backend to wake it from Render's free-tier sleep.
 * Call this on app mount so the API is warm before the user submits.
 */
export function warmUpAPI() {
  if (!API_URL) return;
  fetch(`${API_URL}/health`).catch(() => {}); // fire-and-forget
}

// Sample: good student
export const SAMPLE_DATA = {
  school: 'GP', sex: 'F', age: '16', address: 'U', famsize: 'GT3',
  Pstatus: 'T', Medu: '3', Fedu: '3', Mjob: 'teacher', Fjob: 'services',
  reason: 'reputation', guardian: 'mother', traveltime: '1', studytime: '3',
  failures: '0', schoolsup: 'no', famsup: 'yes', paid: 'no', activities: 'yes',
  nursery: 'yes', higher: 'yes', internet: 'yes', romantic: 'no',
  famrel: '4', freetime: '3', goout: '2', Dalc: '1', Walc: '1',
  health: '4', absences: '2',
};
