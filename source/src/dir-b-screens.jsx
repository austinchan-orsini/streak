// dir-b-screens.jsx — Direction B: "STREAK"
// Soft pastel cream + mint/peach/sky/pink. Manrope display.
// Soft chunky cards, springy interactions, dopamine-forward.

const B = {
  bg: '#F8F1E4',           // warm pastel cream
  card: '#FFFFFF',
  panel: '#F1EADC',
  ink: '#3F3326',          // soft warm dark, not pure black
  dim: '#8C7F6D',
  hair: 'rgba(63,51,38,0.10)',
  // pastel palette — all desaturated, similar lightness so they read as a family
  lime: '#C6E89E',         // primary: pastel mint-lime
  limeDeep: '#A8D278',     // hover/active mint
  orange: '#FFCBA8',       // soft peach
  blue: '#BACEF1',         // soft sky
  pink: '#F4C7D2',         // soft rose
  lilac: '#D9C7E8',        // soft lavender (added)
  terracotta: '#E8A48E',   // soft terracotta for reset/failure
  sans: '"Manrope", system-ui, sans-serif',
};

function BPill({ children, accent = B.lime, dark, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: dark ? B.ink : accent,
      color: dark ? B.bg : B.ink,
      fontFamily: B.sans, fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
      ...style,
    }}>{children}</span>
  );
}

function BCircleProgress({ pct = 0, size = 48, stroke = 5, color = B.ink, track = B.hair, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset .4s cubic-bezier(.2,.7,.3,1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

const BIcon = {
  workout: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h2M20 12h2M5 9v6M19 9v6M8 6v12M16 6v12M8 12h8"/></svg>;
  },
  outdoor: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M3 21l4-7 5 4 4-6 5 9"/></svg>;
  },
  water: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/></svg>;
  },
  read: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>;
  },
  diet: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c5 0 9-4 9-9-4 0-9 4-9 9z M12 21c-5 0-9-4-9-9 4 0 9 4 9 9z"/></svg>;
  },
  photo: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/></svg>;
  },
  meditate: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="6" r="2.5"/><path d="M12 9v6M5 19c2-4 5-4 7-4s5 0 7 4M5 19l-2 3M19 19l2 3"/></svg>;
  },
  stretch: (props) => {
    const s = props.size || 22, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5M8 22l4-10 4 10M5 12h14"/></svg>;
  },
  plus: (props) => {
    const s = props.size || 18, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16M4 12h16"/></svg>;
  },
  check: (props) => {
    const s = props.size || 14, c = props.color || B.ink;
    return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3 3 7-7"/></svg>;
  },
};

const iconForTask = (id) => ({
  workout1: BIcon.workout, workout2: BIcon.outdoor,
  water: BIcon.water, read: BIcon.read, diet: BIcon.diet, photo: BIcon.photo,
  meditate: BIcon.meditate, stretch: BIcon.stretch,
}[id] || BIcon.workout);

function BTaskCard({ t, value, done, onTap, idx }) {
  const ref = React.useRef(null);
  const [pulse, setPulse] = React.useState(false);
  const pct = t.kind === 'check' ? (done ? 1 : 0) : Math.min(1, (value || 0) / t.target);
  const Icon = iconForTask(t.id);

  const tap = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 380);
    onTap?.(t, ref.current, 'b');
  };

  const colors = [B.lime, B.orange, B.blue, B.pink, B.lime, B.orange, B.blue, B.pink];
  const accent = colors[idx % colors.length];

  return (
    <button
      ref={ref}
      onClick={tap}
      style={{
        all: 'unset', cursor: 'pointer',
        display: 'block', width: '100%',
        background: done ? B.ink : B.card,
        color: done ? B.bg : B.ink,
        borderRadius: 22,
        padding: '14px 16px',
        marginBottom: 10,
        transition: 'transform .18s cubic-bezier(.2,1.4,.4,1), background .25s, box-shadow .18s',
        transform: pulse ? 'scale(0.97)' : 'scale(1)',
        boxShadow: done ? '0 4px 20px rgba(42,31,20,0.18)' : '0 1px 0 rgba(42,31,20,0.04), 0 2px 8px rgba(42,31,20,0.04)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: done ? 'rgba(213,242,92,0.18)' : accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .25s',
        }}>
          <Icon size={22} color={done ? B.lime : B.ink} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: B.sans, fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>{t.title}</div>
          <div style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 500, color: done ? 'rgba(245,239,228,0.55)' : B.dim, marginTop: 2 }}>
            {done ? 'Done — nice.' : t.sub}{t.kind !== 'check' && !done && ` · ${value || 0}/${t.target}`}
          </div>
        </div>
        {t.kind === 'check' ? (
          <div style={{
            width: 32, height: 32, borderRadius: 16, flexShrink: 0,
            background: done ? B.lime : 'transparent',
            border: done ? 'none' : `2px solid ${B.hair}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .2s cubic-bezier(.2,1.4,.4,1)',
            transform: done ? 'scale(1.05)' : 'scale(1)',
          }}>
            {done && <BIcon.check size={14} color={B.ink} />}
          </div>
        ) : (
          <BCircleProgress pct={pct} size={36} stroke={4} color={done ? B.lime : B.ink} track={done ? 'rgba(213,242,92,0.18)' : B.hair}>
            <span style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, color: done ? B.lime : B.ink }}>
              {done ? '✓' : Math.round(pct * 100) + '%'}
            </span>
          </BCircleProgress>
        )}
      </div>
    </button>
  );
}

function BTodayMobile() {
  const { progress, doneCount, total, allDone, isDone, toggle, all } = useDailyTasks();
  const rootRef = React.useRef(null);
  const [celebrated, setCelebrated] = React.useState(false);

  React.useEffect(() => {
    if (allDone && !celebrated) { setCelebrated(true); setTimeout(() => bigCelebration(rootRef.current, 'b'), 100); }
    else if (!allDone) setCelebrated(false);
  }, [allDone]);

  const pct = doneCount / total;

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '60px 20px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 600, color: B.dim, letterSpacing: 0.2 }}>Monday, May 19</div>
            <div style={{ fontFamily: B.sans, fontSize: 30, lineHeight: 1, marginTop: 2 }}>good morning, alex</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: B.ink, color: B.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B.sans, fontWeight: 800, fontSize: 14 }}>A</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: B.ink, color: B.bg, borderRadius: 24, padding: '18px 18px' }}>
          <BCircleProgress pct={pct} size={140} stroke={10} color={B.lime} track="rgba(255,255,255,0.12)">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: B.sans, fontSize: 52, lineHeight: 0.85, color: B.bg }}>32</div>
              <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 700, color: 'rgba(245,239,228,0.6)', letterSpacing: 1.4, marginTop: 4 }}>OF 75</div>
            </div>
          </BCircleProgress>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, color: B.lime, letterSpacing: 1.2 }}>STREAK · 31 DAYS</div>
            <div style={{ fontFamily: B.sans, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.05, marginTop: 6, marginBottom: 6 }}>you're<br/>43% there</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <BPill accent="rgba(245,239,228,0.16)" style={{ color: B.bg }}>43 LEFT</BPill>
              <BPill accent={B.lime}>{doneCount}/{total} TODAY</BPill>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 8px' }}>
          <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>today's checklist</div>
          <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, color: B.dim }}>{doneCount}/{total}</div>
        </div>
        {all.map((t, i) => (
          <BTaskCard key={t.id} t={t} idx={i} value={progress[t.id]} done={isDone(t)} onTap={toggle} />
        ))}
        <button style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', borderRadius: 22, padding: '14px 16px',
          border: `2px dashed ${B.hair}`, color: B.dim,
          fontFamily: B.sans, fontSize: 13, fontWeight: 700,
        }}>
          <BIcon.plus size={16} color={B.dim} /> Add custom task
        </button>
      </div>

      <div style={{ background: B.card, borderTop: `1px solid ${B.hair}`, padding: '12px 16px 32px', display: 'flex', justifyContent: 'space-around' }}>
        {[
          ['Today', true],
          ['Calendar', false],
          ['Stats', false],
          ['You', false],
        ].map(([l, active], i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: active ? B.lime : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: B.ink }} />
            </div>
            <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 700, color: active ? B.ink : B.dim, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BTodayDesktop() {
  const { progress, doneCount, total, allDone, isDone, toggle, all } = useDailyTasks();
  const rootRef = React.useRef(null);
  const [celebrated, setCelebrated] = React.useState(false);
  React.useEffect(() => {
    if (allDone && !celebrated) { setCelebrated(true); setTimeout(() => bigCelebration(rootRef.current, 'b'), 100); }
    else if (!allDone) setCelebrated(false);
  }, [allDone]);

  const pct = doneCount / total;

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 220, padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: B.ink }}/>
          </div>
          <div style={{ fontFamily: B.sans, fontSize: 24, fontWeight: 800, letterSpacing: -0.6, letterSpacing: -0.5 }}>streak</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
          {[
            ['Today', true],
            ['Calendar', false],
            ['Setup', false],
            ['Stats', false],
            ['Custom tasks', false],
            ['Profile', false],
          ].map(([l, active]) => (
            <div key={l} style={{
              padding: '10px 14px', borderRadius: 12,
              background: active ? B.ink : 'transparent',
              color: active ? B.bg : B.ink,
              fontFamily: B.sans, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              {l}
              {active && <BIcon.check size={12} color={B.lime} />}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', background: B.card, borderRadius: 18, padding: 14 }}>
          <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 700, color: B.dim, letterSpacing: 1.2 }}>STREAK</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontFamily: B.sans, fontSize: 44, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.9 }}>31</span>
            <span style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 700, color: B.dim }}>days</span>
          </div>
          <div style={{ fontFamily: B.sans, fontSize: 11, color: B.dim, marginTop: 4 }}>Best yet. Keep it.</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 28px 28px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 18, marginBottom: 22 }}>
          <div style={{ flex: 1, background: B.ink, color: B.bg, borderRadius: 28, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden' }}>
            <BCircleProgress pct={pct} size={140} stroke={11} color={B.lime} track="rgba(255,255,255,0.12)">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: B.sans, fontSize: 52, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.85, color: B.bg }}>32</div>
                <div style={{ fontFamily: B.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.4, color: 'rgba(245,239,228,0.55)', marginTop: 4 }}>OF 75</div>
              </div>
            </BCircleProgress>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: B.lime }}>MONDAY · MAY 19</div>
              <div style={{ fontFamily: B.sans, fontSize: 44, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1, marginTop: 6 }}>good morning, alex.</div>
              <div style={{ fontFamily: B.sans, fontSize: 13, color: 'rgba(245,239,228,0.7)', marginTop: 10, maxWidth: 360 }}>You're 43% of the way through your run. {total - doneCount} task{total - doneCount === 1 ? '' : 's'} left for today — finish strong.</div>
            </div>
            <div style={{ position: 'absolute', top: 24, right: 28, display: 'flex', gap: 8 }}>
              <BPill accent={B.lime}>{doneCount}/{total}</BPill>
              <BPill accent="rgba(255,255,255,0.12)" style={{ color: B.bg }}>STREAK · 31</BPill>
            </div>
          </div>
          <div style={{ width: 240, background: B.lime, borderRadius: 28, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, letterSpacing: 1.4 }}>NEXT MILESTONE</div>
              <div style={{ fontFamily: B.sans, fontSize: 64, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.9, marginTop: 8 }}>day<br/>50.</div>
            </div>
            <div style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 600 }}>18 days · ⅔ done</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, overflow: 'hidden' }}>
          <div style={{ background: B.panel, borderRadius: 24, padding: '20px 18px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 12px' }}>
              <div style={{ fontFamily: B.sans, fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>today's checklist</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <BPill accent={B.lime}>ALL</BPill>
                <BPill accent="transparent" style={{ border: `1.5px solid ${B.hair}`, background: 'transparent', color: B.dim }}>CORE</BPill>
                <BPill accent="transparent" style={{ border: `1.5px solid ${B.hair}`, background: 'transparent', color: B.dim }}>CUSTOM</BPill>
              </div>
            </div>
            {all.map((t, i) => (
              <BTaskCard key={t.id} t={t} idx={i} value={progress[t.id]} done={isDone(t)} onTap={toggle} />
            ))}
            <button style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', borderRadius: 22, padding: '14px 16px', border: `2px dashed ${B.hair}`, color: B.dim, fontFamily: B.sans, fontSize: 13, fontWeight: 700 }}>
              <BIcon.plus size={16} color={B.dim} /> Add custom task
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div style={{ background: B.card, borderRadius: 24, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>75-day map</div>
                <BPill accent={B.lime}>day 32</BPill>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4 }}>
                {HEATMAP.map((v, i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 5,
                    background: v === 1 ? B.ink : v === 2 ? B.orange : v === 3 ? '#E8A48E' : B.hair,
                    border: i === 31 ? `2px solid ${B.ink}` : 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, fontFamily: B.sans, fontSize: 10, fontWeight: 700, color: B.dim }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: B.ink, borderRadius: 2 }}/>DONE 30</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: B.orange, borderRadius: 2 }}/>TODAY</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#E8A48E', borderRadius: 2 }}/>RESET 1</span>
              </div>
            </div>

            <div style={{ background: B.card, borderRadius: 24, padding: 20 }}>
              <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6, marginBottom: 14 }}>this run</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  ['Workouts', '62', B.lime],
                  ['Gallons', '31', B.orange],
                  ['Pages read', '324', B.blue],
                  ['Photos', '31', B.pink],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: c, borderRadius: 16, padding: 14 }}>
                    <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{l.toUpperCase()}</div>
                    <div style={{ fontFamily: B.sans, fontSize: 36, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1, marginTop: 4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BLanding() {
  return (
    <div style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: B.ink }}/>
          </div>
          <div style={{ fontFamily: B.sans, fontSize: 26, fontWeight: 800, letterSpacing: -0.6, letterSpacing: -0.5 }}>streak</div>
        </div>
        <div style={{ display: 'flex', gap: 22, fontFamily: B.sans, fontSize: 13, fontWeight: 600, color: B.ink }}>
          <span>The rules</span><span>How it works</span><span>Stories</span><span>FAQ</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: B.sans, fontSize: 13, fontWeight: 600 }}>Log in</span>
          <button style={{ all: 'unset', cursor: 'pointer', background: B.ink, color: B.bg, padding: '10px 18px', borderRadius: 999, fontFamily: B.sans, fontSize: 13, fontWeight: 700 }}>Start free →</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 36px 0', display: 'flex', flexDirection: 'column', gap: 22, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, flex: 1 }}>
          <div style={{ background: B.card, borderRadius: 32, padding: '44px 44px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div>
              <BPill accent={B.lime}>NEW · BUILD YOUR 75</BPill>
              <h1 style={{ fontFamily: B.sans, fontSize: 92, lineHeight: 0.95, letterSpacing: -2, margin: '22px 0 0', maxWidth: 560 }}>
                75 days.<br/>
                <span style={{ fontStyle: 'normal', fontFamily: B.sans, fontWeight: 800, letterSpacing: -3 }}>SIX HABITS.</span><br/>
                one new you.
              </h1>
              <p style={{ fontFamily: B.sans, fontSize: 15, color: B.dim, maxWidth: 460, lineHeight: 1.6, marginTop: 18 }}>
                A friendlier place to run the 75-day mental toughness challenge. Track the six core rules, add your own habits, and watch the dopamine grid fill in — one square at a time.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button style={{ all: 'unset', cursor: 'pointer', background: B.ink, color: B.bg, padding: '16px 26px', borderRadius: 999, fontFamily: B.sans, fontSize: 14, fontWeight: 700 }}>Start day one →</button>
              <button style={{ all: 'unset', cursor: 'pointer', background: 'transparent', color: B.ink, padding: '14px 20px', borderRadius: 999, fontFamily: B.sans, fontSize: 13, fontWeight: 700, border: `1.5px solid ${B.hair}` }}>See the rules</button>
              <span style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 600, color: B.dim }}>Free · local-first · no card.</span>
            </div>

            <div style={{ position: 'absolute', bottom: 24, right: 24, display: 'grid', gridTemplateColumns: 'repeat(15, 10px)', gap: 4, opacity: 0.9 }}>
              {HEATMAP.slice(0, 60).map((v, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: v === 1 ? B.ink : v === 2 ? B.orange : v === 3 ? '#E8A48E' : 'rgba(42,31,20,0.08)',
                }} />
              ))}
            </div>
          </div>

          <div style={{ background: B.lime, borderRadius: 32, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden' }}>
            <BPill accent={B.ink} dark>YOUR TODAY</BPill>
            <div style={{ fontFamily: B.sans, fontSize: 36, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1 }}>finish<br/>strong.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {[
                ['Workout 1', 'Done', true, B.orange],
                ['Workout 2 · Outdoor', '32 min', false, B.blue],
                ['Drink a gallon', '5/8 cups', false, B.pink],
                ['Read 10 pages', 'Done', true, B.lime],
              ].map(([l, s, done, c]) => (
                <div key={l} style={{ background: done ? B.ink : B.card, color: done ? B.bg : B.ink, borderRadius: 18, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: done ? 'rgba(213,242,92,0.18)' : c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: done ? B.lime : B.ink }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: B.sans, fontSize: 13, fontWeight: 700 }}>{l}</div>
                    <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{s}</div>
                  </div>
                  {done && <BIcon.check size={14} color={B.lime} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, background: B.ink, color: B.bg, borderRadius: 24, padding: '20px 28px', alignItems: 'center', justifyContent: 'space-between' }}>
          {[
            ['12,847', 'on streak today'],
            ['482K', 'days logged'],
            ['1,204', 'full completions'],
            ['—', 'no ads. ever.'],
          ].map(([v, l]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: B.sans, fontSize: 36, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, color: 'rgba(245,239,228,0.6)', letterSpacing: 1, marginTop: 2 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BOnboarding() {
  return (
    <div style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, display: 'flex', flexDirection: 'column', paddingTop: 64 }}>
      <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 700, color: B.dim }}>Step 2 of 4</span>
        <span style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 700, color: B.dim }}>Skip</span>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 20px', marginBottom: 32 }}>
        {[1,1,0,0].map((v, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: v ? B.ink : B.hair }} />
        ))}
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: B.sans, fontSize: 44, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1, letterSpacing: -1, margin: '0 0 10px' }}>
          how will you<br/>eat?
        </h2>
        <p style={{ fontFamily: B.sans, fontSize: 13, color: B.dim, lineHeight: 1.55, marginBottom: 22 }}>
          Pick a diet you can keep for 75 days. You can't change it once you start, so be honest with yourself.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: 'Low carb', s: 'Under 50g net per day', c: B.orange, active: false },
            { l: 'Whole foods', s: 'Nothing processed', c: B.lime, active: true },
            { l: 'Plant-based', s: 'Plant only', c: B.blue, active: false },
            { l: 'My own rule', s: 'Define your own', c: B.pink, active: false },
          ].map((o) => (
            <div key={o.l} style={{
              padding: 14, borderRadius: 18,
              background: o.active ? B.ink : B.card,
              color: o.active ? B.bg : B.ink,
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: o.active ? '0 6px 20px rgba(42,31,20,0.18)' : '0 1px 3px rgba(42,31,20,0.04)',
              border: o.active ? 'none' : `1.5px solid ${B.hair}`,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: o.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BIcon.diet size={22} color={B.ink} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: B.sans, fontSize: 15, fontWeight: 700 }}>{o.l}</div>
                <div style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 500, color: o.active ? 'rgba(245,239,228,0.65)' : B.dim, marginTop: 2 }}>{o.s}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: o.active ? B.lime : 'transparent', border: o.active ? 'none' : `2px solid ${B.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {o.active && <BIcon.check size={12} color={B.ink} />}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '20px 0 36px' }}>
          <button style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center', background: B.ink, color: B.bg, padding: '18px', borderRadius: 999, fontFamily: B.sans, fontSize: 15, fontWeight: 700 }}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

function BCalendar() {
  return (
    <div style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, padding: 30, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <BPill accent={B.lime}>RUN · APR 17 → JUN 30</BPill>
          <h2 style={{ fontFamily: B.sans, fontSize: 56, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.95, margin: '10px 0 0' }}>the map.</h2>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            ['Streak', '31', B.lime],
            ['Resets', '1', B.orange],
            ['Days left', '43', B.blue],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: c, borderRadius: 18, padding: '14px 18px', minWidth: 100 }}>
              <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, letterSpacing: 1.2 }}>{l.toUpperCase()}</div>
              <div style={{ fontFamily: B.sans, fontSize: 36, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: B.card, borderRadius: 28, padding: 22, flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 6 }}>
          {HEATMAP.map((v, i) => {
            const day = i + 1;
            const bg = v === 1 ? B.ink : v === 2 ? B.orange : v === 3 ? '#E8A48E' : B.hair;
            const fg = v === 1 || v === 3 ? B.bg : B.ink;
            return (
              <div key={i} style={{
                aspectRatio: '1', background: bg, color: fg, padding: 8,
                borderRadius: 12,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                border: day === 32 ? `2px solid ${B.ink}` : 'none',
                outline: day === 32 ? `2px solid ${B.lime}` : 'none',
                outlineOffset: -4,
                position: 'relative',
              }}>
                <span style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 700, opacity: 0.65 }}>{String(day).padStart(2,'0')}</span>
                {v === 1 && <BIcon.check size={10} color={B.bg} />}
                {v === 3 && <span style={{ fontFamily: B.sans, fontSize: 14, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1 }}>×</span>}
                {day === 32 && <span style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800 }}>NOW</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, fontFamily: B.sans, fontSize: 11, fontWeight: 700, color: B.dim }}>
          {[
            ['Done', B.ink],
            ['Today', B.orange],
            ['Reset', '#E8A48E'],
            ['Future', B.hair],
          ].map(([l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: c, borderRadius: 3 }}/>{l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BSetup() {
  return (
    <div style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, display: 'flex', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        <BPill accent={B.lime}>BUILD YOUR CHALLENGE</BPill>
        <h2 style={{ fontFamily: B.sans, fontSize: 56, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.95, letterSpacing: -1.5, margin: '14px 0 8px' }}>let's set it up.</h2>
        <p style={{ fontFamily: B.sans, fontSize: 14, color: B.dim, marginBottom: 24 }}>Choose your length, pick your rules, add your own habits. Lock it in when you're ready.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
          <div style={{ background: B.card, borderRadius: 20, padding: 18 }}>
            <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: B.dim }}>LENGTH</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['30', '50', '75', '100'].map((d) => (
                <div key={d} style={{
                  flex: 1, padding: '14px 0', textAlign: 'center', borderRadius: 14,
                  background: d === '75' ? B.lime : B.panel,
                  fontFamily: B.sans, fontSize: 24, fontWeight: 800, letterSpacing: -0.6,
                  border: d === '75' ? 'none' : `1.5px solid ${B.hair}`,
                }}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{ background: B.card, borderRadius: 20, padding: 18 }}>
            <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: B.dim }}>START</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['Today', 'Tomorrow', 'Monday'].map((d, i) => (
                <div key={d} style={{
                  flex: 1, padding: '14px 0', textAlign: 'center', borderRadius: 14,
                  background: i === 1 ? B.ink : B.panel, color: i === 1 ? B.bg : B.ink,
                  fontFamily: B.sans, fontWeight: 700, fontSize: 13,
                  border: i === 1 ? 'none' : `1.5px solid ${B.hair}`,
                }}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: B.card, borderRadius: 20, padding: '18px 16px', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, padding: '0 4px 4px' }}>
            <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>core habits</div>
            <BPill accent={B.lime}>ALL REQUIRED</BPill>
          </div>
          {CORE_TASKS.map((t, i) => {
            const Icon = iconForTask(t.id);
            const c = [B.lime, B.orange, B.blue, B.pink, B.lime, B.orange][i];
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 6px', borderTop: i === 0 ? 'none' : `1px solid ${B.hair}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={B.ink} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: B.sans, fontSize: 14, fontWeight: 700 }}>{t.title}</div>
                  <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 500, color: B.dim, marginTop: 2 }}>{t.sub}</div>
                </div>
                <div style={{ width: 26, height: 26, borderRadius: 13, background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BIcon.check size={12} color={B.ink} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: B.card, borderRadius: 20, padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
            <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>your additions</div>
            <button style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, background: B.ink, color: B.bg, padding: '6px 12px', borderRadius: 999, fontFamily: B.sans, fontSize: 12, fontWeight: 700 }}>
              <BIcon.plus size={12} color={B.bg} /> Add habit
            </button>
          </div>
          {SAMPLE_CUSTOM.map((t, i) => {
            const Icon = iconForTask(t.id);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 6px', borderTop: i === 0 ? 'none' : `1px solid ${B.hair}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: B.pink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={B.ink} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: B.sans, fontSize: 14, fontWeight: 700 }}>{t.title}</div>
                  <div style={{ fontFamily: B.sans, fontSize: 11, fontWeight: 500, color: B.dim, marginTop: 2 }}>{t.sub} · {t.freq}</div>
                </div>
                <BPill accent="transparent" style={{ border: `1px solid ${B.hair}`, color: B.dim, background: 'transparent' }}>{t.freq.toUpperCase()}</BPill>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: 320, padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: B.ink, color: B.bg, borderRadius: 28, padding: 24 }}>
          <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: B.lime }}>YOUR CHALLENGE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontFamily: B.sans, fontSize: 84, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.9 }}>75</span>
            <span style={{ fontFamily: B.sans, fontSize: 14, fontWeight: 700, color: 'rgba(245,239,228,0.6)' }}>days</span>
          </div>
          <div style={{ height: 1, background: 'rgba(245,239,228,0.12)', margin: '18px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Ends on', 'Jun 30'],
              ['Habits/day', '8'],
              ['Total check-ins', '600'],
              ['Est time/day', '2h 15m'],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 600, color: 'rgba(245,239,228,0.6)' }}>{l}</span>
                <span style={{ fontFamily: B.sans, fontSize: 13, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 18, padding: 16, background: B.orange, borderRadius: 16, fontFamily: B.sans, fontSize: 11.5, lineHeight: 1.5, fontWeight: 600 }}>
          Heads up — miss any habit and your day resets to 1. That's what makes the streak mean something.
        </div>
        <button style={{ all: 'unset', cursor: 'pointer', marginTop: 'auto', textAlign: 'center', background: B.lime, color: B.ink, padding: '18px', borderRadius: 999, fontFamily: B.sans, fontSize: 15, fontWeight: 800 }}>
          Start tomorrow →
        </button>
      </div>
    </div>
  );
}

function BProfile() {
  return (
    <div style={{ width: '100%', height: '100%', background: B.bg, color: B.ink, fontFamily: B.sans, padding: 30, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B.sans, fontSize: 44, fontWeight: 800, letterSpacing: -0.6 }}>A</div>
          <div>
            <BPill accent={B.lime}>DAY 32 · ON STREAK</BPill>
            <h2 style={{ fontFamily: B.sans, fontSize: 48, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.95, margin: '8px 0 0' }}>Alex Moreno</h2>
            <div style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 600, color: B.dim, marginTop: 2 }}>Started Apr 17, 2026 · @amoreno</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ all: 'unset', cursor: 'pointer', background: B.card, padding: '10px 14px', borderRadius: 999, fontFamily: B.sans, fontSize: 12, fontWeight: 700, border: `1.5px solid ${B.hair}` }}>Edit profile</button>
          <button style={{ all: 'unset', cursor: 'pointer', background: B.ink, color: B.bg, padding: '10px 14px', borderRadius: 999, fontFamily: B.sans, fontSize: 12, fontWeight: 700 }}>Share progress</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {[
          ['DAY', '32', B.lime],
          ['STREAK', '31', B.orange],
          ['RESETS', '1', B.blue],
          ['COMPLETE', '42%', B.pink],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: c, borderRadius: 22, padding: 20 }}>
            <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, letterSpacing: 1.2 }}>{l}</div>
            <div style={{ fontFamily: B.sans, fontSize: 60, fontWeight: 800, letterSpacing: -0.6, lineHeight: 0.9, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, flex: 1, overflow: 'hidden' }}>
        <div style={{ background: B.card, borderRadius: 24, padding: 22, overflowY: 'auto' }}>
          <div style={{ fontFamily: B.sans, fontSize: 24, fontWeight: 800, letterSpacing: -0.6, marginBottom: 14 }}>this run · totals</div>
          {[
            ['Workouts', '62', BIcon.workout],
            ['Outdoor workouts', '31', BIcon.outdoor],
            ['Gallons of water', '31', BIcon.water],
            ['Pages read', '324', BIcon.read],
            ['Days on diet', '31', BIcon.diet],
            ['Photos taken', '31', BIcon.photo],
            ['Meditations', '24', BIcon.meditate],
            ['Stretch sessions', '18', BIcon.stretch],
          ].map(([l, v, Icon]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${B.hair}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: B.panel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={B.ink} />
              </div>
              <span style={{ flex: 1, fontFamily: B.sans, fontSize: 13, fontWeight: 600 }}>{l}</span>
              <span style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: B.card, borderRadius: 24, padding: 22, flex: 1 }}>
            <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6, marginBottom: 12 }}>milestones</div>
            {[
              ['Day 1 — started', true],
              ['Day 7 — first week', true],
              ['Day 14 — failure & restart', true],
              ['Day 21 — habit formed', true],
              ['Day 30 — one third', true],
              ['Day 50 — two thirds', false],
              ['Day 75 — done', false],
            ].map(([l, hit], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: hit ? B.lime : 'transparent', border: hit ? 'none' : `2px solid ${B.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {hit && <BIcon.check size={12} color={B.ink} />}
                </div>
                <span style={{ fontFamily: B.sans, fontSize: 13, fontWeight: 600, color: hit ? B.ink : B.dim }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ background: B.ink, color: B.bg, borderRadius: 24, padding: 22 }}>
            <div style={{ fontFamily: B.sans, fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: B.lime }}>FAILURE LOG</div>
            <div style={{ fontFamily: B.sans, fontSize: 22, fontWeight: 800, letterSpacing: -0.6, marginTop: 8 }}>Day 14 — missed an outdoor workout.</div>
            <div style={{ fontFamily: B.sans, fontSize: 12, fontWeight: 500, marginTop: 8, color: 'rgba(245,239,228,0.65)', lineHeight: 1.55 }}>You started over from day 1. The second start is always the strongest one.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  B, BTodayMobile, BTodayDesktop, BLanding, BOnboarding, BCalendar, BSetup, BProfile,
});
