// dir-a-screens.jsx — Direction A: "GRIND/75"
// Brutalist black. Archivo Black + IBM Plex Mono. Red accent. No softness.

const A = {
  bg: '#0A0A0A',
  card: '#111111',
  panel: '#161616',
  border: '#222222',
  ink: '#F4F1EC',
  dim: '#6A6560',
  red: '#FF3B30',
  yellow: '#FFD60A',
  white: '#FFFFFF',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  display: '"Archivo Black", "Impact", sans-serif',
  sans: '"Geist", system-ui, sans-serif',
};

function ABar({ pct = 0, color = A.red, track = A.border, height = 4 }) {
  return (
    <div style={{ width: '100%', height, background: track, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: `${Math.min(100, pct * 100)}%`,
        background: color,
        transition: 'width .3s cubic-bezier(.2,.8,.3,1)',
      }} />
    </div>
  );
}

function ALabel({ children, accent = A.red, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px',
      background: 'transparent',
      border: `1px solid ${accent}`,
      color: accent,
      fontFamily: A.mono, fontSize: 10, fontWeight: 600, letterSpacing: 1.4,
      textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

function AIcon(props) {
  return null; // placeholder — icons are defined inline per component
}

const AIconSet = {
  workout: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2M20 12h2M5 9v6M19 9v6M8 6v12M16 6v12M8 12h8"/>
    </svg>
  ),
  outdoor: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M3 21l4-7 5 4 4-6 5 9"/>
    </svg>
  ),
  water: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/>
    </svg>
  ),
  read: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/>
    </svg>
  ),
  diet: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c5 0 9-4 9-9-4 0-9 4-9 9z M12 21c-5 0-9-4-9-9 4 0 9 4 9 9z"/>
    </svg>
  ),
  photo: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  meditate: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="2.5"/><path d="M12 9v6M5 19c2-4 5-4 7-4s5 0 7 4M5 19l-2 3M19 19l2 3"/>
    </svg>
  ),
  stretch: ({ size = 22, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><path d="M12 7v5M8 22l4-10 4 10M5 12h14"/>
    </svg>
  ),
  check: ({ size = 14, color = A.red }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l3 3 7-7"/>
    </svg>
  ),
  plus: ({ size = 18, color = A.ink }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 4v16M4 12h16"/>
    </svg>
  ),
};

const iconForTaskA = (id) => ({
  workout1: AIconSet.workout,
  workout2: AIconSet.outdoor,
  water: AIconSet.water,
  read: AIconSet.read,
  diet: AIconSet.diet,
  photo: AIconSet.photo,
  meditate: AIconSet.meditate,
  stretch: AIconSet.stretch,
}[id] || AIconSet.workout);

function ATaskRow({ t, value, done, onTap, idx }) {
  const ref = React.useRef(null);
  const [pulse, setPulse] = React.useState(false);
  const pct = t.kind === 'check' ? (done ? 1 : 0) : Math.min(1, (value || 0) / t.target);
  const Icon = iconForTaskA(t.id);

  const tap = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
    onTap?.(t, ref.current, 'a');
  };

  return (
    <button
      ref={ref}
      onClick={tap}
      style={{
        all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
        background: done ? A.red : A.card,
        borderBottom: `1px solid ${A.border}`,
        padding: '14px 16px',
        transition: 'background .15s, transform .12s',
        transform: pulse ? 'scaleX(0.995)' : 'scaleX(1)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 4, height: 40, flexShrink: 0,
          background: done ? A.ink : A.dim,
          transition: 'background .15s',
        }} />
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: done ? A.ink : A.dim,
        }}>
          <Icon size={20} color={done ? A.ink : A.dim} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: A.display, fontSize: 13, letterSpacing: 0.2,
            color: done ? A.ink : A.ink,
            textTransform: 'uppercase',
          }}>{t.title}</div>
          <div style={{
            fontFamily: A.mono, fontSize: 10, color: done ? 'rgba(244,241,236,0.65)' : A.dim,
            marginTop: 3, letterSpacing: 0.8,
          }}>
            {done ? 'COMPLETE' : t.sub}{t.kind !== 'check' && !done && ` · ${value || 0}/${t.target}`}
          </div>
        </div>
        {t.kind === 'check' ? (
          <div style={{
            width: 24, height: 24, border: done ? 'none' : `1px solid ${A.dim}`,
            background: done ? 'rgba(244,241,236,0.15)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>
            {done && <AIconSet.check size={13} color={A.ink} />}
          </div>
        ) : (
          <div style={{ width: 44, textAlign: 'right' }}>
            <div style={{ fontFamily: A.mono, fontSize: 12, fontWeight: 600, color: done ? A.ink : A.red, letterSpacing: 0.5 }}>
              {done ? '✓' : `${Math.round(pct * 100)}%`}
            </div>
          </div>
        )}
      </div>
      {t.kind !== 'check' && (
        <div style={{ marginTop: 10, paddingLeft: 54 }}>
          <ABar pct={pct} color={done ? A.ink : A.red} track={done ? 'rgba(244,241,236,0.2)' : A.border} height={2} />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ATodayMobile — GRIND · Today · mobile
// ─────────────────────────────────────────────────────────────
function ATodayMobile() {
  const { progress, doneCount, total, allDone, isDone, toggle, all } = useDailyTasks();
  const rootRef = React.useRef(null);
  const [celebrated, setCelebrated] = React.useState(false);

  React.useEffect(() => {
    if (allDone && !celebrated) { setCelebrated(true); setTimeout(() => bigCelebration(rootRef.current, 'a'), 100); }
    else if (!allDone) setCelebrated(false);
  }, [allDone]);

  const pct = doneCount / total;

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '60px 0 0' }}>
        <div style={{ padding: '0 16px 16px', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 2, marginBottom: 4 }}>GRIND/75 · DAY 32</div>
          <div style={{ fontFamily: A.display, fontSize: 28, letterSpacing: -0.5, lineHeight: 1, textTransform: 'uppercase' }}>
            MONDAY<br />MAY 19
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1 }}>TODAY</span>
                <span style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 1 }}>{doneCount}/{total}</span>
              </div>
              <ABar pct={pct} height={6} />
            </div>
            <div style={{ fontFamily: A.display, fontSize: 36, color: A.red, letterSpacing: -1, lineHeight: 1 }}>
              {Math.round(pct * 100)}
              <span style={{ fontSize: 14, color: A.dim }}>%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: `1px solid ${A.border}` }}>
          {[
            ['STREAK', '31 DAYS'],
            ['COMPLETE', '43%'],
            ['DAYS LEFT', '43'],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1 }}>{l}</div>
              <div style={{ fontFamily: A.mono, fontSize: 13, fontWeight: 600, color: A.ink, letterSpacing: 0.5, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px 6px', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.5 }}>DAILY TASKS</div>
        </div>
        {all.map((t, i) => (
          <ATaskRow key={t.id} t={t} idx={i} value={progress[t.id]} done={isDone(t)} onTap={toggle} />
        ))}
        <button style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '14px 16px', borderBottom: `1px solid ${A.border}`,
          fontFamily: A.mono, fontSize: 11, color: A.dim, letterSpacing: 1,
        }}>
          <AIconSet.plus size={14} color={A.dim} /> ADD CUSTOM TASK
        </button>
      </div>

      <div style={{ borderTop: `1px solid ${A.border}`, padding: '12px 16px 32px', display: 'flex', justifyContent: 'space-around' }}>
        {[['TODAY', true], ['GRID', false], ['STATS', false], ['YOU', false]].map(([l, active]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ width: 4, height: 4, background: active ? A.red : A.dim, margin: '0 auto 6px', transition: 'background .15s' }} />
            <div style={{ fontFamily: A.mono, fontSize: 9, letterSpacing: 1.5, color: active ? A.ink : A.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ATodayDesktop — GRIND · Today · desktop
// ─────────────────────────────────────────────────────────────
function ATodayDesktop() {
  const { progress, doneCount, total, allDone, isDone, toggle, all } = useDailyTasks();
  const rootRef = React.useRef(null);
  const [celebrated, setCelebrated] = React.useState(false);
  React.useEffect(() => {
    if (allDone && !celebrated) { setCelebrated(true); setTimeout(() => bigCelebration(rootRef.current, 'a'), 100); }
    else if (!allDone) setCelebrated(false);
  }, [allDone]);

  const pct = doneCount / total;

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: `1px solid ${A.border}`, padding: '28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 22px 22px', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: A.display, fontSize: 22, letterSpacing: -0.3, textTransform: 'uppercase', lineHeight: 1 }}>
            GRIND<span style={{ color: A.red }}>/75</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {[['TODAY', true], ['THE GRID', false], ['SETUP', false], ['STATS', false], ['CUSTOM', false], ['PROFILE', false]].map(([l, active]) => (
            <div key={l} style={{
              padding: '10px 22px',
              background: active ? A.red : 'transparent',
              color: active ? A.ink : A.dim,
              fontFamily: A.mono, fontSize: 11, letterSpacing: 1.5, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background .12s, color .12s',
            }}>
              {active && <div style={{ width: 2, height: 14, background: A.ink, marginRight: 2 }} />}
              {l}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px 22px', borderTop: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1.5, marginBottom: 6 }}>CURRENT STREAK</div>
          <div style={{ fontFamily: A.display, fontSize: 52, color: A.red, lineHeight: 0.9, letterSpacing: -1 }}>31</div>
          <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, marginTop: 4, letterSpacing: 1 }}>DAYS</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header banner */}
        <div style={{ padding: '20px 28px', borderBottom: `1px solid ${A.border}`, display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 2, marginBottom: 6 }}>DAY 32 OF 75 · MONDAY MAY 19</div>
            <div style={{ fontFamily: A.display, fontSize: 48, letterSpacing: -1, lineHeight: 0.9, textTransform: 'uppercase' }}>
              EXECUTE.<br />
              <span style={{ color: A.dim, fontSize: 36 }}>NO EXCUSES.</span>
            </div>
          </div>
          <div style={{ width: 320 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.2 }}>TODAY'S PROGRESS</span>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 1 }}>{doneCount} OF {total} DONE</span>
            </div>
            <ABar pct={pct} height={8} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {[['OVERALL', '43%'], ['STREAK', '31D'], ['LEFT', '43D']].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1 }}>{l}</div>
                  <div style={{ fontFamily: A.mono, fontSize: 14, color: A.ink, fontWeight: 600, letterSpacing: 0.5 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', overflow: 'hidden' }}>
          {/* Task list */}
          <div style={{ borderRight: `1px solid ${A.border}`, overflowY: 'auto' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.5, color: A.dim }}>DAILY TASKS</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['ALL', 'CORE', 'CUSTOM'].map((f, i) => (
                  <button key={f} style={{
                    all: 'unset', cursor: 'pointer',
                    fontFamily: A.mono, fontSize: 9, letterSpacing: 1.2,
                    padding: '3px 8px',
                    border: `1px solid ${i === 0 ? A.red : A.border}`,
                    color: i === 0 ? A.red : A.dim,
                  }}>{f}</button>
                ))}
              </div>
            </div>
            {all.map((t, i) => (
              <ATaskRow key={t.id} t={t} idx={i} value={progress[t.id]} done={isDone(t)} onTap={toggle} />
            ))}
            <button style={{
              all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '14px 18px', borderBottom: `1px solid ${A.border}`,
              fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.2,
            }}>
              <AIconSet.plus size={14} color={A.dim} /> ADD CUSTOM TASK
            </button>
          </div>

          {/* Side panels */}
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Mini grid */}
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${A.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.5, color: A.dim }}>75-DAY GRID</div>
                <ALabel>DAY 32</ALabel>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 3 }}>
                {HEATMAP.map((v, i) => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    background: v === 1 ? A.red : v === 2 ? '#FF6B35' : v === 3 ? '#3A1F1F' : A.border,
                    border: i === 31 ? `1px solid ${A.ink}` : 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10, fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1 }}>
                {[['DONE', A.red], ['TODAY', '#FF6B35'], ['FAIL', '#3A1F1F']].map(([l, c]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${A.border}` }}>
              <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.5, color: A.dim, marginBottom: 12 }}>THIS RUN</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, border: `1px solid ${A.border}` }}>
                {[['WORKOUTS', '62'], ['GALLONS', '31'], ['PAGES', '324'], ['PHOTOS', '31']].map(([l, v], i) => (
                  <div key={l} style={{ padding: '14px 12px', background: A.panel, borderRight: i % 2 === 0 ? `1px solid ${A.border}` : 'none', borderBottom: i < 2 ? `1px solid ${A.border}` : 'none' }}>
                    <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontFamily: A.display, fontSize: 36, color: A.ink, letterSpacing: -0.5, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div style={{ padding: '16px 18px', flex: 1 }}>
              <div style={{ borderLeft: `2px solid ${A.red}`, paddingLeft: 14 }}>
                <div style={{ fontFamily: A.display, fontSize: 16, lineHeight: 1.3, color: A.ink, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  "THE ONLY EASY DAY WAS YESTERDAY."
                </div>
                <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1, marginTop: 8 }}>NAVY SEALS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALanding — GRIND · Landing · desktop
// ─────────────────────────────────────────────────────────────
function ALanding() {
  return (
    <div style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 36px', borderBottom: `1px solid ${A.border}` }}>
        <div style={{ fontFamily: A.display, fontSize: 22, letterSpacing: -0.3, textTransform: 'uppercase' }}>
          GRIND<span style={{ color: A.red }}>/75</span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontFamily: A.mono, fontSize: 11, color: A.dim, letterSpacing: 1.2 }}>
          <span style={{ cursor: 'pointer', transition: 'color .12s' }}>THE RULES</span>
          <span style={{ cursor: 'pointer' }}>HOW IT WORKS</span>
          <span style={{ cursor: 'pointer' }}>STORIES</span>
          <span style={{ cursor: 'pointer' }}>FAQ</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, color: A.dim, letterSpacing: 1 }}>LOG IN</span>
          <button style={{
            all: 'unset', cursor: 'pointer',
            background: A.red, color: A.ink,
            padding: '10px 20px',
            fontFamily: A.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
          }}>START NOW →</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ padding: '48px 48px 36px', display: 'flex', flexDirection: 'column', borderRight: `1px solid ${A.border}` }}>
          <ALabel style={{ alignSelf: 'flex-start', marginBottom: 20 }}>NEW · BUILD YOUR 75</ALabel>
          <div style={{ fontFamily: A.display, fontSize: 88, lineHeight: 0.92, letterSpacing: -2, textTransform: 'uppercase', flex: 1 }}>
            75<br />
            DAYS.<br />
            <span style={{ color: A.red }}>SIX</span><br />
            HABITS.
          </div>
          <div style={{ marginTop: 28 }}>
            <p style={{ fontFamily: A.sans, fontSize: 15, color: A.dim, maxWidth: 460, lineHeight: 1.6, margin: '0 0 24px' }}>
              The no-excuses 75-day mental toughness protocol. Track the six core rules, no deviations, no modifications. Miss one — start over from day 1. That's the deal.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button style={{
                all: 'unset', cursor: 'pointer',
                background: A.red, color: A.ink,
                padding: '16px 28px',
                fontFamily: A.display, fontSize: 16, letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}>START DAY ONE →</button>
              <button style={{
                all: 'unset', cursor: 'pointer',
                border: `1px solid ${A.border}`,
                color: A.dim,
                padding: '15px 20px',
                fontFamily: A.mono, fontSize: 11, letterSpacing: 1.5,
              }}>RULES ↗</button>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1 }}>FREE · LOCAL-FIRST</span>
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Stats bar */}
          <div style={{ borderBottom: `1px solid ${A.border}`, padding: '18px 28px', display: 'flex', gap: 0, justifyContent: 'space-between' }}>
            {[['12,847', 'ON STREAK NOW'], ['482K', 'DAYS LOGGED'], ['1,204', 'COMPLETIONS'], ['0', 'ADS. EVER.']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: A.display, fontSize: 30, color: A.ink, letterSpacing: -0.8, lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Live preview card */}
          <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 1.5, marginBottom: 14 }}>LIVE PREVIEW — YOUR TODAY</div>
            {[
              { title: 'WORKOUT 1 — 45 MIN', done: true, sub: 'INDOOR' },
              { title: 'WORKOUT 2 — 45 MIN', done: false, sub: 'OUTDOOR · 32 MIN DONE' },
              { title: 'GALLON OF WATER', done: false, sub: '5 OF 8 CUPS' },
              { title: 'READ 10 PAGES', done: true, sub: 'NON-FICTION' },
              { title: 'STICK TO YOUR DIET', done: false, sub: 'NO CHEAT MEALS' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: `1px solid ${A.border}`,
              }}>
                <div style={{ width: 3, height: 32, background: item.done ? A.red : A.dim, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: A.display, fontSize: 12, letterSpacing: 0.3, textTransform: 'uppercase', color: item.done ? A.red : A.ink }}>{item.title}</div>
                  <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 0.8, marginTop: 2 }}>{item.sub}</div>
                </div>
                {item.done && <AIconSet.check size={14} color={A.red} />}
              </div>
            ))}

            {/* Mini heatmap */}
            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1, marginBottom: 8 }}>75-DAY GRID · WEEK 5 EXAMPLE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(25, 1fr)', gap: 2 }}>
                {HEATMAP.slice(0, 50).map((v, i) => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    background: v === 1 ? A.red : v === 2 ? '#FF6B35' : v === 3 ? '#3A1F1F' : A.border,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AOnboarding — GRIND · Onboarding · mobile
// ─────────────────────────────────────────────────────────────
function AOnboarding() {
  return (
    <div style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, display: 'flex', flexDirection: 'column', paddingTop: 64, overflow: 'hidden' }}>
      <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: `1px solid ${A.border}`, paddingBottom: 12 }}>
        <span style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.5 }}>STEP 2 OF 4</span>
        <span style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 1, cursor: 'pointer' }}>SKIP</span>
      </div>

      <div style={{ display: 'flex', gap: 0, padding: '0 20px 20px', marginBottom: 28, borderBottom: `1px solid ${A.border}` }}>
        {[1, 1, 0, 0].map((v, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: v ? A.red : A.border, marginRight: i < 3 ? 3 : 0 }} />
        ))}
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 2, marginBottom: 12 }}>DIET PROTOCOL</div>
        <h2 style={{ fontFamily: A.display, fontSize: 40, letterSpacing: -0.5, lineHeight: 0.95, margin: '0 0 12px', textTransform: 'uppercase' }}>
          DEFINE<br />YOUR DIET.
        </h2>
        <p style={{ fontFamily: A.sans, fontSize: 13, color: A.dim, lineHeight: 1.55, marginBottom: 22 }}>
          Choose a diet you can sustain for 75 days. No modifications, no cheat days. You commit — you keep it.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: `1px solid ${A.border}` }}>
          {[
            { l: 'LOW CARB', s: 'UNDER 50G NET PER DAY', active: false },
            { l: 'WHOLE FOODS', s: 'NOTHING PROCESSED', active: true },
            { l: 'PLANT-BASED', s: 'PLANT ONLY', active: false },
            { l: 'CUSTOM RULE', s: 'DEFINE YOUR OWN', active: false },
          ].map((o, i) => (
            <div key={o.l} style={{
              padding: '16px 14px',
              background: o.active ? A.red : A.card,
              color: o.active ? A.ink : A.ink,
              display: 'flex', alignItems: 'center', gap: 14,
              borderTop: i === 0 ? 'none' : `1px solid ${A.border}`,
            }}>
              <div style={{ width: 3, height: 38, background: o.active ? A.ink : A.dim }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: A.display, fontSize: 14, letterSpacing: 0.3, textTransform: 'uppercase' }}>{o.l}</div>
                <div style={{ fontFamily: A.mono, fontSize: 9, color: o.active ? 'rgba(244,241,236,0.7)' : A.dim, letterSpacing: 1, marginTop: 3 }}>{o.s}</div>
              </div>
              {o.active && <AIconSet.check size={14} color={A.ink} />}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '20px 0 36px' }}>
          <button style={{
            all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
            textAlign: 'center', background: A.red, color: A.ink,
            padding: '16px', fontFamily: A.display, fontSize: 16,
            letterSpacing: 0.3, textTransform: 'uppercase',
          }}>
            CONTINUE →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ASetup — GRIND · Setup · desktop
// ─────────────────────────────────────────────────────────────
function ASetup() {
  return (
    <div style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, display: 'flex', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', borderRight: `1px solid ${A.border}` }}>
        <ALabel style={{ marginBottom: 16 }}>BUILD YOUR CHALLENGE</ALabel>
        <h2 style={{ fontFamily: A.display, fontSize: 52, letterSpacing: -1, lineHeight: 0.92, margin: '0 0 10px', textTransform: 'uppercase' }}>
          SET YOUR<br />PROTOCOL.
        </h2>
        <p style={{ fontFamily: A.sans, fontSize: 14, color: A.dim, marginBottom: 28, lineHeight: 1.6 }}>
          Choose your length, lock in your rules. No renegotiating once you start.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, border: `1px solid ${A.border}`, marginBottom: 24 }}>
          <div style={{ padding: '18px', background: A.panel, borderRight: `1px solid ${A.border}` }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.5, marginBottom: 14 }}>LENGTH (DAYS)</div>
            <div style={{ display: 'flex', gap: 1 }}>
              {['30', '50', '75', '100'].map((d) => (
                <div key={d} style={{
                  flex: 1, padding: '12px 0', textAlign: 'center',
                  background: d === '75' ? A.red : A.card,
                  fontFamily: A.display, fontSize: 22, letterSpacing: -0.5,
                  cursor: 'pointer',
                  border: d !== '75' ? `1px solid ${A.border}` : 'none',
                }}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{ padding: '18px', background: A.panel }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1.5, marginBottom: 14 }}>START DATE</div>
            <div style={{ display: 'flex', gap: 1 }}>
              {['TODAY', 'TOMORROW', 'MONDAY'].map((d, i) => (
                <div key={d} style={{
                  flex: 1, padding: '12px 4px', textAlign: 'center',
                  background: i === 1 ? A.red : A.card,
                  fontFamily: A.mono, fontSize: 10, letterSpacing: 1,
                  cursor: 'pointer',
                  border: i !== 1 ? `1px solid ${A.border}` : 'none',
                }}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ border: `1px solid ${A.border}`, marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: A.panel }}>
            <div style={{ fontFamily: A.display, fontSize: 18, textTransform: 'uppercase', letterSpacing: 0.3 }}>CORE HABITS</div>
            <ALabel accent={A.yellow}>ALL REQUIRED</ALabel>
          </div>
          {CORE_TASKS.map((t, i) => {
            const Icon = iconForTaskA(t.id);
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px',
                borderTop: i === 0 ? 'none' : `1px solid ${A.border}`,
                background: A.card,
              }}>
                <div style={{ width: 3, height: 32, background: A.red }} />
                <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={A.red} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: A.display, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.3 }}>{t.title}</div>
                  <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 0.8, marginTop: 2 }}>{t.sub}</div>
                </div>
                <AIconSet.check size={14} color={A.red} />
              </div>
            );
          })}
        </div>

        <div style={{ border: `1px solid ${A.border}` }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: A.panel }}>
            <div style={{ fontFamily: A.display, fontSize: 18, textTransform: 'uppercase', letterSpacing: 0.3 }}>CUSTOM HABITS</div>
            <button style={{ all: 'unset', cursor: 'pointer', fontFamily: A.mono, fontSize: 10, color: A.red, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AIconSet.plus size={12} color={A.red} /> ADD HABIT
            </button>
          </div>
          {SAMPLE_CUSTOM.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              borderTop: i === 0 ? 'none' : `1px solid ${A.border}`,
              background: A.card,
            }}>
              <div style={{ width: 3, height: 32, background: A.dim }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: A.display, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.3 }}>{t.title}</div>
                <div style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 0.8, marginTop: 2 }}>{t.sub} · {t.freq.toUpperCase()}</div>
              </div>
              <ALabel accent={A.dim}>{t.freq.toUpperCase()}</ALabel>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar summary */}
      <div style={{ width: 300, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ background: A.red, padding: 24, marginBottom: 1 }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(244,241,236,0.7)', marginBottom: 8 }}>YOUR CHALLENGE</div>
          <div style={{ fontFamily: A.display, fontSize: 96, lineHeight: 0.85, letterSpacing: -2, textTransform: 'uppercase' }}>75</div>
          <div style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1, marginTop: 4, color: 'rgba(244,241,236,0.8)' }}>DAYS</div>
        </div>
        <div style={{ background: A.panel, border: `1px solid ${A.border}`, borderTop: 'none', padding: '18px 20px', flex: 1 }}>
          {[
            ['ENDS ON', 'JUN 30'],
            ['HABITS / DAY', '8'],
            ['TOTAL CHECK-INS', '600'],
            ['EST TIME / DAY', '2H 15M'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${A.border}` }}>
              <span style={{ fontFamily: A.mono, fontSize: 9, color: A.dim, letterSpacing: 1 }}>{l}</span>
              <span style={{ fontFamily: A.mono, fontSize: 13, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 14, border: `1px solid ${A.yellow}`, background: 'rgba(255,214,10,0.06)' }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.yellow, letterSpacing: 1, marginBottom: 6 }}>WARNING</div>
            <div style={{ fontFamily: A.sans, fontSize: 12, lineHeight: 1.5, color: A.dim }}>Miss any habit and your day resets to 1. That's what makes the streak mean something.</div>
          </div>
          <button style={{
            all: 'unset', cursor: 'pointer', marginTop: 18, display: 'block', width: '100%',
            textAlign: 'center', background: A.red, color: A.ink,
            padding: '16px', fontFamily: A.display, fontSize: 15, letterSpacing: 0.3, textTransform: 'uppercase',
          }}>
            START TOMORROW →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACalendar — GRIND · Grid · desktop
// ─────────────────────────────────────────────────────────────
function ACalendar() {
  return (
    <div style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, padding: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${A.border}` }}>
        <div>
          <ALabel style={{ marginBottom: 10 }}>RUN · APR 17 → JUN 30</ALabel>
          <h2 style={{ fontFamily: A.display, fontSize: 56, letterSpacing: -1, lineHeight: 0.9, margin: 0, textTransform: 'uppercase' }}>
            THE<br /><span style={{ color: A.red }}>GRID.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 1 }}>
          {[['STREAK', '31', A.red], ['RESETS', '1', '#3A1F1F'], ['DAYS LEFT', '43', A.panel]].map(([l, v, bg]) => (
            <div key={l} style={{ background: bg, border: `1px solid ${A.border}`, padding: '16px 20px', minWidth: 100, textAlign: 'center' }}>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: bg === A.red ? 'rgba(244,241,236,0.7)' : A.dim, letterSpacing: 1.2, marginBottom: 6 }}>{l}</div>
              <div style={{ fontFamily: A.display, fontSize: 40, letterSpacing: -1, lineHeight: 1, color: A.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, border: `1px solid ${A.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${A.border}`, background: A.panel, display: 'flex', gap: 18, fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1 }}>
          {[['DONE', A.red], ['TODAY', '#FF6B35'], ['RESET', '#3A1F1F'], ['FUTURE', A.border]].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: c, display: 'inline-block' }} />{l}
            </span>
          ))}
        </div>
        <div style={{ flex: 1, padding: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4, height: '100%' }}>
            {HEATMAP.map((v, i) => {
              const day = i + 1;
              const bg = v === 1 ? A.red : v === 2 ? '#FF6B35' : v === 3 ? '#3A1F1F' : A.panel;
              return (
                <div key={i} style={{
                  background: bg,
                  border: day === 32 ? `2px solid ${A.ink}` : `1px solid ${A.border}`,
                  padding: 8,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'opacity .12s',
                }}>
                  <span style={{ fontFamily: A.mono, fontSize: 9, color: v === 1 || v === 3 ? 'rgba(244,241,236,0.55)' : A.dim, letterSpacing: 0.5 }}>
                    {String(day).padStart(2, '0')}
                  </span>
                  {v === 1 && <AIconSet.check size={9} color={A.ink} />}
                  {v === 3 && <span style={{ fontFamily: A.mono, fontSize: 12, color: 'rgba(244,241,236,0.6)' }}>✕</span>}
                  {day === 32 && <span style={{ fontFamily: A.mono, fontSize: 9, color: A.ink, letterSpacing: 0.5 }}>NOW</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AProfile — GRIND · Profile · desktop
// ─────────────────────────────────────────────────────────────
function AProfile() {
  return (
    <div style={{ width: '100%', height: '100%', background: A.bg, color: A.ink, fontFamily: A.sans, padding: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${A.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, background: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: A.display, fontSize: 40 }}>A</div>
          <div>
            <ALabel style={{ marginBottom: 8 }}>DAY 32 · ON STREAK</ALabel>
            <h2 style={{ fontFamily: A.display, fontSize: 44, letterSpacing: -0.8, lineHeight: 0.9, margin: 0, textTransform: 'uppercase' }}>ALEX MORENO</h2>
            <div style={{ fontFamily: A.mono, fontSize: 10, color: A.dim, letterSpacing: 1, marginTop: 6 }}>STARTED APR 17, 2026 · @AMORENO</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ all: 'unset', cursor: 'pointer', border: `1px solid ${A.border}`, padding: '10px 16px', fontFamily: A.mono, fontSize: 10, letterSpacing: 1, color: A.dim }}>EDIT PROFILE</button>
          <button style={{ all: 'unset', cursor: 'pointer', background: A.red, color: A.ink, padding: '10px 16px', fontFamily: A.mono, fontSize: 10, letterSpacing: 1 }}>SHARE PROGRESS ↗</button>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 20, border: `1px solid ${A.border}` }}>
        {[['DAY', '32', A.red], ['STREAK', '31', A.panel], ['RESETS', '1', A.panel], ['COMPLETE', '42%', A.panel]].map(([l, v, bg], i) => (
          <div key={l} style={{ background: bg, padding: '18px 20px', borderRight: i < 3 ? `1px solid ${A.border}` : 'none' }}>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: bg === A.red ? 'rgba(244,241,236,0.7)' : A.dim, letterSpacing: 1.5, marginBottom: 6 }}>{l}</div>
            <div style={{ fontFamily: A.display, fontSize: 52, letterSpacing: -1, lineHeight: 0.9, color: A.ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, flex: 1, overflow: 'hidden' }}>
        <div style={{ border: `1px solid ${A.border}`, overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${A.border}`, background: A.panel }}>
            <div style={{ fontFamily: A.display, fontSize: 20, textTransform: 'uppercase', letterSpacing: 0.3 }}>THIS RUN · TOTALS</div>
          </div>
          {[
            ['Workouts', '62', AIconSet.workout],
            ['Outdoor workouts', '31', AIconSet.outdoor],
            ['Gallons of water', '31', AIconSet.water],
            ['Pages read', '324', AIconSet.read],
            ['Days on diet', '31', AIconSet.diet],
            ['Photos taken', '31', AIconSet.photo],
            ['Meditations', '24', AIconSet.meditate],
            ['Stretch sessions', '18', AIconSet.stretch],
          ].map(([l, v, Icon], i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: `1px solid ${A.border}` }}>
              <div style={{ width: 3, height: 28, background: i % 2 === 0 ? A.red : A.dim }} />
              <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={A.dim} />
              </div>
              <span style={{ flex: 1, fontFamily: A.sans, fontSize: 13, color: A.ink }}>{l}</span>
              <span style={{ fontFamily: A.display, fontSize: 28, color: A.ink, letterSpacing: -0.5 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <div style={{ border: `1px solid ${A.border}`, flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${A.border}`, background: A.panel }}>
              <div style={{ fontFamily: A.display, fontSize: 18, textTransform: 'uppercase', letterSpacing: 0.3 }}>MILESTONES</div>
            </div>
            {[
              ['DAY 1 — STARTED', true],
              ['DAY 7 — FIRST WEEK', true],
              ['DAY 14 — FAILURE & RESTART', true],
              ['DAY 21 — HABIT FORMED', true],
              ['DAY 30 — ONE THIRD', true],
              ['DAY 50 — TWO THIRDS', false],
              ['DAY 75 — COMPLETE', false],
            ].map(([l, hit], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: `1px solid ${A.border}` }}>
                <div style={{ width: 16, height: 16, background: hit ? A.red : 'transparent', border: hit ? 'none' : `1px solid ${A.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {hit && <AIconSet.check size={10} color={A.ink} />}
                </div>
                <span style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 0.8, color: hit ? A.ink : A.dim }}>{l}</span>
              </div>
            ))}
          </div>

          <div style={{ background: A.red, padding: 20 }}>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: 'rgba(244,241,236,0.7)', letterSpacing: 1.5, marginBottom: 8 }}>FAILURE LOG</div>
            <div style={{ fontFamily: A.display, fontSize: 18, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 8 }}>DAY 14 — MISSED AN OUTDOOR WORKOUT.</div>
            <div style={{ fontFamily: A.sans, fontSize: 12, color: 'rgba(244,241,236,0.75)', lineHeight: 1.5 }}>Started over from day 1. The second run is always the strongest one.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  A, ATaskRow, ATodayMobile, ATodayDesktop, ALanding, AOnboarding, ACalendar, ASetup, AProfile,
});
