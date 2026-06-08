// shared.jsx — confetti, particle bursts, mock data, tweaks defaults

// ─────────────────────────────────────────────────────────────
// Mock data — the 75 Hard daily checklist
// ─────────────────────────────────────────────────────────────
const CORE_TASKS = [
  { id: 'workout1', title: 'Workout 1 — 45 min', sub: 'Indoor', kind: 'timer', target: 45 },
  { id: 'workout2', title: 'Workout 2 — 45 min', sub: 'Outdoor (required)', kind: 'timer', target: 45 },
  { id: 'water',    title: 'Drink a gallon of water', sub: '128 oz', kind: 'counter', target: 8, unit: 'cups' },
  { id: 'read',     title: 'Read 10 pages', sub: 'Non-fiction', kind: 'counter', target: 10, unit: 'pages' },
  { id: 'diet',     title: 'Stick to your diet', sub: 'No cheat meals · No alcohol', kind: 'check' },
  { id: 'photo',    title: 'Progress photo', sub: 'One per day', kind: 'check' },
];

const SAMPLE_CUSTOM = [
  { id: 'meditate', title: 'Meditate', sub: '10 min', kind: 'timer', target: 10, custom: true, freq: 'daily' },
  { id: 'stretch',  title: 'Stretch', sub: 'Mobility flow', kind: 'check', custom: true, freq: 'weekday' },
];

// 75-day grid: 1 = done, 0 = none, 2 = partial, 3 = failed. Day 32 is today.
const HEATMAP = (() => {
  const out = [];
  const today = 32;
  for (let i = 1; i <= 75; i++) {
    if (i < today) {
      // mostly done with a couple partials & one failure
      if (i === 14) out.push(3); // failed → reset would have happened
      else if (i === 21 || i === 27) out.push(2);
      else out.push(1);
    } else if (i === today) {
      out.push(2);
    } else out.push(0);
  }
  return out;
})();

// ─────────────────────────────────────────────────────────────
// Confetti & particle helpers
// ─────────────────────────────────────────────────────────────
function burstAt(el, opts = {}) {
  if (!el || !window.confetti) return;
  const r = el.getBoundingClientRect();
  const w = window.innerWidth, h = window.innerHeight;
  window.confetti({
    particleCount: opts.count ?? 28,
    spread: opts.spread ?? 55,
    startVelocity: opts.velocity ?? 30,
    origin: { x: (r.left + r.width / 2) / w, y: (r.top + r.height / 2) / h },
    colors: opts.colors ?? ['#FF3B30', '#FFCC00', '#34C759', '#5AC8FA', '#AF52DE'],
    scalar: opts.scalar ?? 0.85,
    disableForReducedMotion: false,
    zIndex: 99999,
  });
}

function bigCelebration(el, theme = 'a') {
  if (!window.confetti) return;
  const palettes = {
    a: ['#FF3B30', '#FFFFFF', '#FFD60A'],
    b: ['#D5F25C', '#FF8C42', '#FFFFFF', '#3E2C1E'],
  };
  const colors = palettes[theme] || palettes.a;
  const origin = el ? (() => {
    const r = el.getBoundingClientRect();
    return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  })() : { x: 0.5, y: 0.5 };

  // burst 1
  window.confetti({ particleCount: 80, spread: 70, startVelocity: 45, origin, colors, zIndex: 99999 });
  // sides
  setTimeout(() => {
    window.confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors, zIndex: 99999 });
    window.confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors, zIndex: 99999 });
  }, 200);
  // big finale
  setTimeout(() => {
    window.confetti({ particleCount: 120, spread: 120, startVelocity: 35, origin, colors, scalar: 1.2, zIndex: 99999 });
  }, 450);
}

// Spawn a quick floating "+1" text element near the source
function floatPlus(el, text = '+1', color = '#FF3B30') {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const span = document.createElement('div');
  span.textContent = text;
  span.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top}px;
    transform:translate(-50%,-50%);font-weight:800;font-size:22px;color:${color};
    pointer-events:none;z-index:99998;text-shadow:0 2px 8px rgba(0,0,0,.25);
    transition:transform .9s cubic-bezier(.2,.7,.3,1),opacity .9s ease-out;`;
  document.body.appendChild(span);
  requestAnimationFrame(() => {
    span.style.transform = 'translate(-50%,-180%)';
    span.style.opacity = '0';
  });
  setTimeout(() => span.remove(), 950);
}

// ─────────────────────────────────────────────────────────────
// Hook: useDailyTasks — manages task state with completion + animation hooks
// ─────────────────────────────────────────────────────────────
function useDailyTasks(initial = CORE_TASKS, customs = SAMPLE_CUSTOM) {
  const all = [...initial, ...customs];
  const [progress, setProgress] = React.useState(() => {
    const m = {};
    for (const t of all) m[t.id] = t.kind === 'counter' || t.kind === 'timer' ? 0 : false;
    return m;
  });

  const isDone = (t) => {
    const p = progress[t.id];
    if (t.kind === 'check') return !!p;
    return (p || 0) >= t.target;
  };

  const doneCount = all.filter(isDone).length;
  const total = all.length;
  const allDone = doneCount === total;

  const toggle = (t, el, theme) => {
    let nextDone = false;
    setProgress((p) => {
      const cur = p[t.id];
      let nv;
      if (t.kind === 'check') {
        nv = !cur;
        nextDone = nv;
      } else {
        // tap increments by 1; if already at/over target, reset
        if ((cur || 0) >= t.target) nv = 0;
        else { nv = (cur || 0) + 1; nextDone = nv >= t.target; }
      }
      return { ...p, [t.id]: nv };
    });
    // celebration
    if (nextDone && el) {
      burstAt(el, { count: 24, colors: theme === 'b'
        ? ['#D5F25C', '#FF8C42', '#3E2C1E']
        : ['#FF3B30', '#FFFFFF', '#FFD60A'] });
      floatPlus(el, '+1', theme === 'b' ? '#3E2C1E' : '#FF3B30');
    }
  };

  return { progress, setProgress, doneCount, total, allDone, isDone, toggle, all };
}

// quick utility — clamp text to N chars
const clamp = (s, n) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s);

Object.assign(window, {
  CORE_TASKS, SAMPLE_CUSTOM, HEATMAP,
  burstAt, bigCelebration, floatPlus,
  useDailyTasks, clamp,
});
