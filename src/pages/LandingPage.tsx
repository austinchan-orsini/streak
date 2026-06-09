import { CORE_TASKS } from '../data/tasks';

export function LandingPage({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="text-[11px] font-[700] uppercase tracking-[2.5px] text-[#8C7F6D]">streak</div>
          <div className="mt-4 text-[52px] font-[800] leading-tight tracking-[-1.5px]">
            build the habit.
            <br />
            <span className="text-[#8C7F6D]">every single day.</span>
          </div>
          <div className="mt-5 text-[15px] leading-7 text-[#8C7F6D]">
            Track your 75 Hard challenge with a clean, focused app built for consistency.
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSignup}
            className="w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90"
          >
            Start your streak
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-[22px] border border-[rgba(63,51,38,0.12)] bg-white py-4 text-[14px] font-[800] text-ink transition hover:bg-panel"
          >
            I already have an account
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {['2 workouts / day', 'Gallon of water', '10 pages', 'No cheat meals', 'Progress photo'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-lime" />
              <span className="text-[12px] font-[700] text-[#8C7F6D]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
