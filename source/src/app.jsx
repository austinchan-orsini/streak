// app.jsx — DesignCanvas wiring + Tweaks panel
// Renders both directions side by side: GRIND (brutalist) and STREAK (warm/dopamine).

// ─────────────────────────────────────────────────────────────
// Mobile frame wrapper — uses IOSDevice but lets us pass dark
// ─────────────────────────────────────────────────────────────
function MobileFrame({ children, dark = false }) {
  return (
    <div style={{ width: '100%', height: '100%', background: dark ? '#000' : '#F5EFE4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxSizing: 'border-box' }}>
      <IOSDevice width={390} height={840} dark={dark}>
        {children}
      </IOSDevice>
    </div>
  );
}

// Light browser chrome — simple top bar for desktop artboards
function DesktopChrome({ url = 'streak.app', dark, children }) {
  const barBg = dark ? '#1a1a1a' : '#EFEAE0';
  const dim = dark ? 'rgba(255,255,255,0.5)' : '#7A6E5E';
  const text = dark ? '#F4F1EC' : '#2A1F14';
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: barBg, borderBottom: `1px solid ${dark ? '#2A2622' : 'rgba(42,31,20,0.08)'}` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ flex: 1, height: 24, borderRadius: 6, background: dark ? '#0a0a0a' : '#fff', display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: 'ui-monospace, monospace', fontSize: 11, color: dim }}>
          {url}
        </div>
        <div style={{ width: 18, height: 4, borderRadius: 2, background: dim, opacity: 0.4 }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level app — DesignCanvas with both directions
// ─────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = (window.useTweaks || (() => [null, () => {}]))(/*EDITMODE-BEGIN*/{
    "showHints": true,
    "celebration": "max"
  }/*EDITMODE-END*/);

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="75 HARD · Two design directions" subtitle="Pick the energy that matches you. Tap any task — checkboxes celebrate, finishing the day rains confetti.">
          {/* Intro card */}
          <DCArtboard id="brief" label="The brief" width={620} height={420}>
            <div style={{ width: '100%', height: '100%', background: '#FBF7EE', padding: '32px 36px', fontFamily: '"Manrope", system-ui, sans-serif', color: '#2A1F14', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: '"Manrope", system-ui', fontWeight: 800, fontSize: 44, lineHeight: 1, letterSpacing: -1.2 }}>two ways to run<br/>the 75-day challenge.</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#7A6E5E', marginTop: 18, maxWidth: 480 }}>
                Both directions cover the same screens — landing, today, calendar, setup, profile, onboarding — across mobile and desktop. Tasks are live: tap a row to mark it done, the row springs and a burst fires. Finish the whole day and the canvas rains confetti.
              </p>
              <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#0A0A0A', color: '#F4F1EC', padding: 18, borderRadius: 0 }}>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, letterSpacing: -0.4 }}>GRIND/<span style={{ color: '#FF3B30' }}>75</span></div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#8A8580', marginTop: 8, letterSpacing: 1.2 }}>BRUTALIST · BLACK · RED · MONO</div>
                </div>
                <div style={{ background: '#fff', padding: 18, borderRadius: 18, border: '1.5px solid rgba(42,31,20,0.10)' }}>
                  <div style={{ fontFamily: '"Manrope", system-ui', fontWeight: 800, fontSize: 26, letterSpacing: -0.7 }}>streak.</div>
                  <div style={{ fontFamily: '"Manrope", system-ui', fontSize: 11, fontWeight: 700, color: '#7A6E5E', marginTop: 6, letterSpacing: 1 }}>PASTEL · MINT · PEACH · CHUNKY</div>
                </div>
              </div>
            </div>
          </DCArtboard>
        </DCSection>

        {/* ─── Direction A: GRIND ─── */}
        <DCSection id="a-landing" title="A · GRIND — Landing" subtitle="Brutalist black/red. Archivo Black + IBM Plex Mono. No softness.">
          <DCArtboard id="a-land" label="Landing — desktop" width={1280} height={820}>
            <DesktopChrome url="grind75.app" dark>
              <ALanding />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="a-today" title="A · GRIND — Today" subtitle="The heart of the loop. Tap any row to celebrate. Finish all 8 → big confetti.">
          <DCArtboard id="a-today-mobile" label="Today — mobile" width={420} height={870}>
            <MobileFrame dark>
              <ATodayMobile />
            </MobileFrame>
          </DCArtboard>
          <DCArtboard id="a-today-desktop" label="Today — desktop" width={1280} height={820}>
            <DesktopChrome url="grind75.app/today" dark>
              <ATodayDesktop />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="a-rest" title="A · GRIND — Onboarding · Setup · Calendar · Profile">
          <DCArtboard id="a-onboard" label="Onboarding — mobile" width={420} height={870}>
            <MobileFrame dark>
              <AOnboarding />
            </MobileFrame>
          </DCArtboard>
          <DCArtboard id="a-setup" label="Challenge setup — desktop" width={1280} height={820}>
            <DesktopChrome url="grind75.app/setup" dark>
              <ASetup />
            </DesktopChrome>
          </DCArtboard>
          <DCArtboard id="a-cal" label="The Grid — desktop" width={1280} height={820}>
            <DesktopChrome url="grind75.app/grid" dark>
              <ACalendar />
            </DesktopChrome>
          </DCArtboard>
          <DCArtboard id="a-profile" label="Profile / stats — desktop" width={1280} height={820}>
            <DesktopChrome url="grind75.app/you" dark>
              <AProfile />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>

        {/* ─── Direction B: STREAK ─── */}
        <DCSection id="b-landing" title="B · STREAK — Landing" subtitle="Soft pastel palette · Manrope display. Friendly, dopamine-forward.">
          <DCArtboard id="b-land" label="Landing — desktop" width={1280} height={820}>
            <DesktopChrome url="streak.app">
              <BLanding />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="b-today" title="B · STREAK — Today" subtitle="Same loop, softer surfaces. Springs + bursts + a giant progress ring.">
          <DCArtboard id="b-today-mobile" label="Today — mobile" width={420} height={870}>
            <MobileFrame>
              <BTodayMobile />
            </MobileFrame>
          </DCArtboard>
          <DCArtboard id="b-today-desktop" label="Today — desktop" width={1280} height={820}>
            <DesktopChrome url="streak.app/today">
              <BTodayDesktop />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="b-rest" title="B · STREAK — Onboarding · Setup · Calendar · Profile">
          <DCArtboard id="b-onboard" label="Onboarding — mobile" width={420} height={870}>
            <MobileFrame>
              <BOnboarding />
            </MobileFrame>
          </DCArtboard>
          <DCArtboard id="b-setup" label="Challenge setup — desktop" width={1280} height={820}>
            <DesktopChrome url="streak.app/setup">
              <BSetup />
            </DesktopChrome>
          </DCArtboard>
          <DCArtboard id="b-cal" label="The map — desktop" width={1280} height={820}>
            <DesktopChrome url="streak.app/map">
              <BCalendar />
            </DesktopChrome>
          </DCArtboard>
          <DCArtboard id="b-profile" label="Profile / stats — desktop" width={1280} height={820}>
            <DesktopChrome url="streak.app/you">
              <BProfile />
            </DesktopChrome>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {t && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="Animation">
            <TweakRadio label="Celebration" value={t.celebration}
              options={[
                { value: 'subtle', label: 'Subtle' },
                { value: 'mid',    label: 'Mid' },
                { value: 'max',    label: 'Max' },
              ]}
              onChange={(v) => setTweak('celebration', v)} />
            <TweakToggle label="Show hint notes" value={t.showHints}
              onChange={(v) => setTweak('showHints', v)} />
          </TweakSection>
          <TweakSection label="Try it">
            <div style={{ fontSize: 12, lineHeight: 1.5, color: '#6f655a', padding: '0 4px 6px' }}>
              Tap any task row in either direction. Finish all 8 in a "Today" artboard for a full confetti finale. Click ⤢ on any artboard to focus it.
            </div>
            <TweakButton label="Fire STREAK celebration"
              onClick={() => bigCelebration(document.body, 'b')} />
            <TweakButton label="Fire GRIND celebration" secondary
              onClick={() => bigCelebration(document.body, 'a')} />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
