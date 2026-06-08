# Handoff: 75 Hard — STREAK web app

## Overview
A web app for the **75 Hard** mental-toughness challenge. Users follow 6 core daily rules for 75 consecutive days; missing any one resets the counter to day 1. The app lets each user run their own challenge locally (no real auth in this design — single local profile), check off daily tasks, add their own custom tasks with type + frequency, and track progress via a 75-day grid/heatmap. Completing tasks fires celebratory animations (confetti, springs, "+1" floaters); finishing the whole day fires a big multi-burst confetti finale.

## About the design files
The HTML / JSX files bundled here are **design references** — interactive prototypes created in plain React + Babel + inline styles to show the intended look, feel, and animation behavior. They are **not** production code to ship as-is.

Your task: **recreate this design in the target codebase's existing environment** (Next.js, Remix, SvelteKit, Vite + React, etc.) using that codebase's established conventions — its component library, styling system (CSS Modules / Tailwind / styled-components / vanilla-extract), router, state manager, animation library, and testing setup. If the codebase doesn't exist yet, choose modern, well-supported defaults (Next.js + Tailwind + Framer Motion + Zustand or React Query is a sensible baseline).

The HTML prototypes are **pixel-perfect references** for visual design and motion. Match colors, spacing, typography, radii, and interaction feel precisely; rebuild the rest however the target codebase wants components built.

## Fidelity
**High-fidelity.** All colors, type, spacing, radii, and interactions are deliberate. Reproduce them precisely.

## Direction summary
Codename **STREAK**. Soft pastel palette, warm cream background, rounded chunky cards, Manrope ExtraBold display, dopamine-forward motion (springs + confetti).

## Design tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `bg` | `#F8F1E4` | App background — warm pastel cream |
| `card` | `#FFFFFF` | Card surface |
| `panel` | `#F1EADC` | Secondary surface (e.g. checklist inner panel) |
| `ink` | `#3F3326` | Primary text + inverted card background (soft warm dark) |
| `dim` | `#8C7F6D` | Secondary text |
| `hair` | `rgba(63,51,38,0.10)` | Hairline borders, track colors |
| `lime` | `#C6E89E` | Primary accent — pastel mint-lime. Use for highlights, active state, primary CTA on dark surfaces |
| `limeDeep` | `#A8D278` | Hover/active variant of lime |
| `orange` | `#FFCBA8` | Soft peach — secondary accent / today marker on calendar |
| `blue` | `#BACEF1` | Soft sky — tertiary accent / stat cards |
| `pink` | `#F4C7D2` | Soft rose — tertiary accent |
| `lilac` | `#D9C7E8` | Soft lavender — optional extra |
| `terracotta` | `#E8A48E` | Reset / failure marker on calendar |

Notes:
- All accent pastels are roughly equiluminant — they read as a family.
- Text on pastel chips/cards is always `ink` (dark on light).
- Text on `ink` surfaces uses `bg` for primary, and `rgba(245,239,228,0.6)` or `rgba(245,239,228,0.7)` for secondary (i.e., translucent cream).
- The `lime` accent on a dark ink card is the dopamine pop — use it sparingly for primary affordance.

### Typography
Family: **Manrope** (Google Fonts), weights 400/500/600/700/800.

Display headlines use Manrope ExtraBold (800) with negative letter-spacing (`-0.5` to `-1.2`) to mimic display-font character. There is **no italic** and no serif anywhere — earlier drafts used Instrument Serif italic, but the final direction explicitly dropped it.

| Role | Family | Weight | Size | Line height | Letter-spacing |
|---|---|---|---|---|---|
| H1 (hero / landing) | Manrope | 800 | 92px | 0.95 | -2 |
| H2 (page title) | Manrope | 800 | 44–56px | 0.95–1.0 | -1 to -1.5 |
| H3 (section) | Manrope | 800 | 22–28px | 1.0 | -0.6 |
| Big number (day counter, stat value) | Manrope | 800 | 36–84px | 0.85–0.9 | -0.6 |
| Body | Manrope | 500–600 | 13–15px | 1.55–1.6 | normal |
| Label / caption | Manrope | 700–800 | 10–11px | 1.2 | +1.2 to +1.6 (UPPERCASE) |
| Pill | Manrope | 700 | 11px | 1 | +0.2 |
| Button | Manrope | 700–800 | 13–15px | 1 | normal |

### Spacing
4-based scale. Common values: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 44.

### Radii
- Pills: `999` (fully rounded)
- Small chips / tags: `999` (pill) or `12–14` (rounded rect)
- Task cards: `18–22`
- Larger cards / panels: `24–28`
- Hero card / big surfaces: `28–32`
- Calendar day cells: `5` (heatmap), `12` (calendar grid)

### Shadows
- Default card: `0 1px 0 rgba(63,51,38,0.04), 0 2px 8px rgba(63,51,38,0.04)`
- Done (lifted) task card: `0 4px 20px rgba(63,51,38,0.18)`
- Active selection on onboarding: `0 6px 20px rgba(63,51,38,0.18)`

## Screens / views

### 1. Landing page (desktop)
**Purpose**: marketing — convince a new user to start the challenge.

**Layout**: full-bleed, three rows.
- Top nav row (logo + nav + auth buttons), padding `20px 36px`.
- Hero row, 2-column grid `1.2fr 1fr`, gap `22px`, both columns are large rounded cards (`32px` radius).
  - **Left card** (`card` bg): "NEW · BUILD YOUR 75" lime pill → H1 headline (`75 days. / SIX HABITS. / one new you.` — the middle line is uppercase Manrope 800, letter-spacing -3; surrounding lines are normal display weight) → ~3-line description → CTA row ("Start day one →" dark pill button, "See the rules" outline ghost, fine-print caption). Bottom-right corner: decorative 15×4 grid of small heatmap squares.
  - **Right card** (`lime` bg, `#C6E89E`): "YOUR TODAY" dark pill → H2 "finish strong." → small phone-mockup-style task list with 4 sample rows (Workout 1 done, Workout 2 outdoor in-progress, Drink a gallon in-progress, Read 10 pages done). Done rows have dark background + lime accent dot.
- Stats row at bottom — dark `ink` card with 4 metric columns ("12,847 on streak today" / "482K days logged" / "1,204 full completions" / "— no ads. ever.").

**Copy** (exact):
- Eyebrow pill: `NEW · BUILD YOUR 75`
- H1: `75 days. SIX HABITS. one new you.`
- Body: `A friendlier place to run the 75-day mental toughness challenge. Track the six core rules, add your own habits, and watch the dopamine grid fill in — one square at a time.`
- CTAs: `Start day one →`, `See the rules`, `Free · local-first · no card.`

### 2. Today (desktop) — the main screen
**Purpose**: today's checklist with celebrations.

**Layout**: 2-column app shell.
- **Left sidebar** (`220px` wide): logo, nav (Today active, Calendar, Setup, Stats, Custom tasks, Profile), streak card pinned to bottom.
- **Main area**: two stacked rows.
  - **Hero row** (~`160px` tall): split 1fr `240px`. Left = dark `ink` card with big progress ring (140px, 11px stroke, lime fill, translucent track), big greeting H2 "good morning, alex.", body line. Right = `lime` card with "NEXT MILESTONE / day 50."
  - **Below-hero**: 2-col grid `1.4fr 1fr`.
    - **Left (checklist)**: `panel` bg card, padded. Header row: "today's checklist" H3 + filter pills (ALL active, CORE outline, CUSTOM outline). Followed by 8 task cards (see Task card spec below). Footer: "+ Add custom task" dashed outline button.
    - **Right (right rail)**: stack of two cards.
      - `card` bg "75-day map" — 15×5 grid of small day squares colored by status, with legend below.
      - `card` bg "this run" — 2×2 grid of stat squares each on its own pastel (lime/peach/sky/pink).

### 3. Today (mobile)
**Purpose**: same as desktop, single column.

**Layout** (iOS frame, 390×844 visible):
- Status bar gap (top 60px).
- Greeting row: "Monday, May 19" small caption + H2 "good morning, alex" + circular A avatar.
- Hero card: dark `ink` rounded card with progress ring (140px) on left, streak label + headline "you're / 43% there" + 2 pills on right.
- Section title "today's checklist" + counter.
- 8 task cards stacked.
- "+ Add custom task" dashed button.
- Bottom tab bar: Today (active, lime pill behind icon), Calendar, Stats, You.

### 4. Onboarding (mobile)
**Purpose**: step 2/4 of the onboarding wizard — pick diet rule.

**Layout**:
- Step indicator: "Step 2 of 4" + "Skip" on top row.
- 4 progress segment pills (steps 1 and 2 filled in `ink`, 3 and 4 hairline).
- H2 "how will you / eat?" (two lines).
- Body subhead.
- 4 selectable rows (icon disc + title + sub + radio). One is selected (dark `ink` bg, lime pill radio with check).
- "Continue →" pill button at bottom.

### 5. Challenge setup (desktop)
**Purpose**: configure duration, start date, confirm core habits, add customs.

**Layout**: 2-col, main + `320px` summary sidebar.
- Main: eyebrow pill → H2 "let's set it up." → body. Two side-by-side picker cards (Length: 30/50/75/100, 75 selected with lime bg; Start: Today/Tomorrow/Monday, Tomorrow selected with `ink` bg). Then a "core habits" card listing all 6 with icon + pill "ALL REQUIRED". Then "your additions" card listing custom habits with frequency pills.
- Sidebar: dark `ink` summary card with giant "75 days" + key metrics. Soft peach warning block beneath: `Heads up — miss any habit and your day resets to 1.` Then big lime CTA button "Start tomorrow →" at the bottom.

### 6. Calendar / 75-day map (desktop)
**Purpose**: see the run at a glance.

**Layout**: header (left: eyebrow pill `RUN · APR 17 → JUN 30` + H2 "the map." | right: 3 stat chips: Streak, Resets, Days left). Below: large `card` containing a 15×5 grid of day squares (75 cells), each 1:1 aspect, `radius: 12`. Today cell (day 32) gets `2px solid ink` border + lime inner outline, "NOW" label. Below the grid: legend.

Day cell colors by status:
- Complete = `ink` bg, `bg` color check icon top-right
- Today (in progress) = `orange` bg, `ink` text
- Reset/failed = `terracotta` (`#E8A48E`) bg, `bg` × glyph
- Future = `hair` bg, no text

### 7. Profile / stats (desktop)
**Purpose**: lifetime totals + milestones + failure log.

**Layout**:
- Header row: large lime A avatar + name H2 "Alex Moreno" + handle + "DAY 32 · ON STREAK" pill; right side: edit/share buttons.
- 4 big stat cards (`DAY 32`, `STREAK 31`, `RESETS 1`, `COMPLETE 42%`) in pastel grid.
- Below: 2-col `1.3fr 1fr`.
  - Left: "this run · totals" `card` with 8 rows (Workouts, Outdoor workouts, Gallons, Pages, Days on diet, Photos, Meditations, Stretch). Each row: icon disc + label + big number.
  - Right: two stacked cards. Top: "milestones" — 7-item checklist (Day 1, 7, 14, 21, 30, 50, 75) with lime check circles for hit milestones, hair circles for upcoming. Bottom: dark `ink` "FAILURE LOG" card with the failure event.

## The task card (the core repeated component)

This is the most important visual element. Spec:

```
Size: full width of container, padding 14px 16px, border-radius 22, margin-bottom 10
Default state:
  background: card (#FFFFFF)
  color: ink
  shadow: 0 1px 0 rgba(63,51,38,0.04), 0 2px 8px rgba(63,51,38,0.04)
Done state:
  background: ink (#3F3326)
  color: bg
  shadow: 0 4px 20px rgba(63,51,38,0.18)

Internal layout: flex row, gap 14
  - Icon disc: 46×46, radius 14, flex-center
      default: background = pastel accent (mint/peach/sky/pink rotating by index)
      done: background = rgba(213,242,92,0.18), icon stroked in lime
  - Title block: flex 1
      title: Manrope 700, 15px, letter-spacing -0.2, no decoration
      sub: Manrope 500, 12px, dim color (or rgba(245,239,228,0.55) on done state)
  - Trailing control (right side):
      check tasks: 32×32 circle, lime bg + ink check when done, hairline-bordered transparent when undone
      counter/timer tasks: 36×36 circular progress ring (stroke 4), ink fill default / lime fill on done, % label inside
```

Tap animation:
- `transform: scale(0.97)` for 380ms, easing `cubic-bezier(.2, 1.4, .4, 1)` (snappy spring).
- Completion: row springs to scale 1, background transitions to ink, particle burst fires at the row's center, "+1" text floats up and fades.

## Interactions & motion

### Tap-to-complete
1. Task row scales down to 0.97 for 180ms (spring easing).
2. State commits; row background/colors transition (background 250ms, shadow 180ms).
3. If task transitioned from incomplete → complete:
   - Fire **canvas-confetti burst** at the row's center: 24 particles, spread 55°, velocity 30, colors `['#C6E89E', '#FFCBA8', '#3F3326']`, scalar 0.85.
   - Spawn a transient **"+1" floater** in `ink` color, 22px Manrope 800, starting at the row's top-center, animating `translateY(-180%)` + fading to 0 over 900ms.
4. Counter/timer tasks (water, reading): each tap increments by 1; ring/bar animates `stroke-dashoffset` over 400ms (`cubic-bezier(.2,.7,.3,1)`). When the value crosses the target, fire the same completion celebration.

### Day completion (all 8 tasks done)
Fire a multi-stage confetti finale:
1. T=0: center burst, 80 particles, spread 70, velocity 45, colors `['#C6E89E', '#FFCBA8', '#FFFFFF', '#3F3326']`.
2. T=200ms: two side bursts (60 particles each) from `{x:0, y:0.7}` (angle 60) and `{x:1, y:0.7}` (angle 120).
3. T=450ms: big finale burst, 120 particles, spread 120, velocity 35, scalar 1.2.

### General motion guidelines
- All hover-able elements get a 120ms `background` and 150ms `box-shadow` transition.
- Progress rings: 400ms `cubic-bezier(.2, .7, .3, 1)`.
- Springy controls (task tap, onboarding selection): `cubic-bezier(.2, 1.4, .4, 1)` for that overshoot feel.
- Respect `prefers-reduced-motion` — disable confetti and reduce transition durations to ~100ms.

## State (mock; replace with real persistence)

### Per-task progress (today)
```ts
type Progress = { [taskId: string]: number | boolean };
// counter/timer tasks store number, check tasks store boolean
```

### Core tasks (hard-coded, all required)
```ts
const CORE_TASKS = [
  { id: 'workout1', title: 'Workout 1 — 45 min', sub: 'Indoor',           kind: 'timer',   target: 45 },
  { id: 'workout2', title: 'Workout 2 — 45 min', sub: 'Outdoor (required)', kind: 'timer', target: 45 },
  { id: 'water',    title: 'Drink a gallon of water', sub: '128 oz',     kind: 'counter', target: 8, unit: 'cups' },
  { id: 'read',     title: 'Read 10 pages',       sub: 'Non-fiction',     kind: 'counter', target: 10, unit: 'pages' },
  { id: 'diet',     title: 'Stick to your diet',  sub: 'No cheat meals · No alcohol', kind: 'check' },
  { id: 'photo',    title: 'Progress photo',      sub: 'One per day',     kind: 'check' },
];
```

### Custom tasks
User-defined. Each has:
```ts
type CustomTask = {
  id: string;
  title: string;
  sub?: string;
  kind: 'check' | 'counter' | 'timer';
  target?: number;
  unit?: string;
  freq: 'daily' | 'weekday' | { everyN: number };
};
```

### Challenge config (set at start, immutable until reset)
```ts
type Challenge = {
  startDate: string; // ISO
  durationDays: number; // 75 default
  diet: 'low-carb' | 'whole-foods' | 'plant-based' | { custom: string };
  customTasks: CustomTask[];
};
```

### Day history (for the heatmap)
```ts
type DayStatus = 'complete' | 'partial' | 'failed' | 'future';
type History = DayStatus[]; // length = durationDays
```

A day flips to `failed` if any required task wasn't completed before midnight; this triggers a reset (history is reset, startDate updated, customTasks preserved).

## Files in this bundle

- `source/index.html` — entry point; loads React/Babel + the JSX files.
- `source/design-canvas.jsx`, `source/ios-frame.jsx`, `source/browser-window.jsx`, `source/tweaks-panel.jsx` — prototype scaffolding (not needed in your real app).
- `source/src/shared.jsx` — celebration helpers (`burstAt`, `bigCelebration`, `floatPlus`), mock data (`CORE_TASKS`, `HEATMAP`), `useDailyTasks` hook. The animation helpers are the canonical reference for how celebrations should feel.
- `source/src/dir-b-screens.jsx` — **the design**. Every STREAK screen lives here (`BTodayMobile`, `BTodayDesktop`, `BLanding`, `BOnboarding`, `BCalendar`, `BSetup`, `BProfile`, plus atoms `BPill`, `BCircleProgress`, `BTaskCard`, `BIcon`). The `B` palette object at the top is the source of truth for tokens.

> Direction A (GRIND — the brutalist black/red alternative) is excluded from this handoff. The user chose STREAK.

## Assets
- **Fonts**: Manrope (Google Fonts), weights 400–800.
- **Confetti**: `canvas-confetti` (npm, v1.9.x). MIT-licensed.
- **Icons**: hand-built inline SVG strokes in `BIcon` — re-implement using your icon library (Lucide, Phosphor, Heroicons) and match the stroke weight (`2`) and rounded line caps.

## Recommended implementation order
1. Set up tokens (colors, type, spacing, shadows) as CSS variables / Tailwind theme.
2. Build the **task card** in isolation — it's the most repeated and most animated component. Get the tap → spring → confetti loop feeling right before anything else.
3. Build the **Today** screen (mobile + desktop) using the task card.
4. Layer in the **heatmap/calendar** as a shared component (used in Today's right rail and the dedicated Calendar screen).
5. Build **Setup** and **Onboarding** flows; wire up the immutable-after-start challenge config.
6. Build **Profile / stats**.
7. Wire up real persistence (localStorage is fine for v1 — the design assumes a local-first profile).
8. Add the **midnight check** that flips incomplete days to `failed` and triggers reset.

## Things explicitly **out of scope** for the initial implementation
- Authentication / multi-device sync.
- Social / sharing features.
- Notifications.
- Real photo storage (the "Progress photo" task is just a check in this design).
