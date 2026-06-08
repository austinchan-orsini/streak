import { useMemo, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import type { DailyProgress, MealEntry, PhotoEntry, Task, TaskDayState, User, WorkoutTag } from './types';
import { TaskCard } from './components/TaskCard';
import { useDailyTasks } from './hooks/useDailyTasks';
import { useAuth } from './hooks/useAuth';
import { CORE_TASKS, DEFAULT_WORKOUT_TAGS } from './data/tasks';

type PageKey = 'today' | 'calendar' | 'profile';

// Parse a YYYY-MM-DD string as local midnight (not UTC) to avoid off-by-one on negative-offset timezones
function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const navItems: { key: PageKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'profile', label: 'Profile' },
];

const milestoneSteps = [1, 7, 14, 21, 30, 50, 75];

// ---------------------------------------------------------------------------
// Shared UI
// ---------------------------------------------------------------------------

function Pill({
  children,
  active = false,
  outline = false,
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  outline?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-[700] tracking-[0.2px] ${className}`}
      style={{
        background: active ? '#C6E89E' : outline ? 'transparent' : '#F1EADC',
        color: '#3F3326',
        border: outline ? '1.5px solid rgba(63,51,38,0.10)' : undefined,
      }}
    >
      {children}
    </span>
  );
}

function readFileAsDataUrl(file: File): Promise<PhotoEntry> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      resolve({
        id: `photo-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        type: file.type,
        dataUrl: e.target?.result as string,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PhotoModal({
  photos,
  onAddFiles,
  onDelete,
  onClose,
}: {
  photos: PhotoEntry[];
  onAddFiles: (files: FileList) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[18px] font-[800]">Progress photos</div>
            <div className="text-[12px] text-[#8C7F6D]">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} -- tap x to remove
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2 text-[12px] font-[700]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                onAddFiles(e.target.files);
                e.target.value = '';
              }
            }}
          />

          {photos.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#8C7F6D]">No photos yet -- add some below.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  {photo.type.startsWith('image/') ? (
                    <img src={photo.dataUrl} alt={photo.name} className="h-40 w-full rounded-[16px] object-cover" />
                  ) : (
                    <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-[#F1EADC]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-8 w-8 text-[#8C7F6D]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="15" height="10" rx="2" />
                        <path d="M17 9l5-2v10l-5-2" />
                      </svg>
                      <div className="max-w-full truncate px-2 text-[11px] text-[#8C7F6D]">{photo.name}</div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(photo.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 w-full rounded-[16px] border border-dashed border-[rgba(63,51,38,0.15)] bg-[#F7F4EB] px-4 py-2.5 text-[12px] font-[700] text-[#8C7F6D] transition hover:border-ink hover:text-ink"
          >
            + Add more photos
          </button>
        </div>

        <div className="p-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[16px] bg-ink py-3 text-[13px] font-[700] text-bg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_MEAL_NAMES = ['Breakfast', 'Lunch', 'Dinner'];

function makeMealId() {
  return `meal-${Math.random().toString(36).slice(2, 9)}`;
}

const GripIcon = () => (
  <svg viewBox="0 0 10 18" className="h-[18px] w-2.5" fill="currentColor">
    <circle cx="2.5" cy="3" r="1.5" />
    <circle cx="2.5" cy="9" r="1.5" />
    <circle cx="2.5" cy="15" r="1.5" />
    <circle cx="7.5" cy="3" r="1.5" />
    <circle cx="7.5" cy="9" r="1.5" />
    <circle cx="7.5" cy="15" r="1.5" />
  </svg>
);

function MealRow({
  meal,
  onUpdate,
  onRemove,
}: {
  meal: MealEntry;
  onUpdate: (id: string, field: 'name' | 'what', value: string) => void;
  onRemove: (id: string) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={meal} dragListener={false} dragControls={controls} style={{ listStyle: 'none' }}>
      <div className="flex items-start gap-2.5 rounded-[16px] bg-[#F1EADC] px-3 py-2.5">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="mt-0.5 flex-none cursor-grab touch-none select-none text-[#8C7F6D] active:cursor-grabbing"
        >
          <GripIcon />
        </div>
        <div className="min-w-0 flex-1">
          <input
            value={meal.name}
            onChange={(e) => onUpdate(meal.id, 'name', e.target.value)}
            placeholder="Meal name"
            className="w-full bg-transparent text-[13px] font-[700] text-[#3F3326] focus:outline-none"
          />
          <textarea
            value={meal.what}
            rows={1}
            onChange={(e) => {
              onUpdate(meal.id, 'what', e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="What did you eat?"
            className="mt-0.5 w-full resize-none overflow-hidden bg-transparent text-[13px] leading-5 text-[#3F3326] placeholder:text-[#8C7F6D]/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(meal.id)}
          className="mt-0.5 flex-none text-[#8C7F6D] transition hover:text-[#E8A48E]"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>
    </Reorder.Item>
  );
}

function DietMealModal({
  initialMeals,
  onSave,
  onClose,
}: {
  initialMeals: MealEntry[] | undefined;
  onSave: (meals: MealEntry[]) => void;
  onClose: () => void;
}) {
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    if (initialMeals && initialMeals.length > 0) return initialMeals;
    return DEFAULT_MEAL_NAMES.map((name) => ({ id: makeMealId(), name, what: '' }));
  });

  const update = (id: string, field: 'name' | 'what', value: string) =>
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const remove = (id: string) => setMeals((prev) => prev.filter((m) => m.id !== id));

  const add = () => setMeals((prev) => [...prev, { id: makeMealId(), name: '', what: '' }]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[18px] font-[800]">Meal log</div>
            <div className="text-[12px] text-[#8C7F6D]">Drag to reorder -- tap x to remove</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2 text-[12px] font-[700]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <Reorder.Group
            axis="y"
            values={meals}
            onReorder={setMeals}
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {meals.map((meal) => (
              <MealRow key={meal.id} meal={meal} onUpdate={update} onRemove={remove} />
            ))}
          </Reorder.Group>

          <button
            type="button"
            onClick={add}
            className="mt-2 w-full rounded-[16px] border border-dashed border-[rgba(63,51,38,0.15)] bg-[#F7F4EB] px-4 py-2.5 text-[12px] font-[700] text-[#8C7F6D] transition hover:border-ink hover:text-ink"
          >
            + Add meal
          </button>
        </div>

        <div className="flex justify-end gap-3 p-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2.5 text-[12px] font-[700]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(meals);
              onClose();
            }}
            className="rounded-[16px] bg-ink px-4 py-2.5 text-[12px] font-[700] text-bg"
          >
            Save log
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth pages
// ---------------------------------------------------------------------------

function LandingPage({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
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

function LoginPage({
  onLogin,
  onBack,
}: {
  onLogin: (username: string, password: string) => string | null;
  onBack: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const err = onLogin(username.trim(), password);
    if (err) setError(err);
  };

  const inputClass =
    'w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-5 py-4 text-[14px] focus:border-ink focus:outline-none bg-white';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[12px] font-[700] text-[#8C7F6D] transition hover:text-ink"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back
        </button>

        <div className="text-[11px] font-[700] uppercase tracking-[2.5px] text-[#8C7F6D]">streak</div>
        <div className="mt-3 text-[32px] font-[800] tracking-[-0.8px]">Welcome back.</div>
        <div className="mt-1 text-[14px] text-[#8C7F6D]">Log in to pick up your streak.</div>

        <div className="mt-8 flex flex-col gap-3">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="Username"
            className={inputClass}
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            className={inputClass}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && (
            <div className="rounded-[14px] bg-[#FFCBA8] px-4 py-3 text-[13px] font-[700]">{error}</div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

function SignupWizard({
  onSignup,
  onBack,
}: {
  onSignup: (data: Omit<User, 'id'>) => string | null;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isPastStart = startDate < todayStr;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleStep1 = () => {
    if (!username.trim()) { setError('Please enter a username.'); return; }
    if (username.trim().length < 2) { setError('Username must be at least 2 characters.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setStep(2);
  };

  const handleFinish = () => {
    const err = onSignup({
      username: username.trim(),
      password,
      startDate,
      avatarDataUrl,
    });
    if (err) setError(err);
  };

  const inputClass =
    'w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] bg-white px-5 py-4 text-[14px] focus:border-ink focus:outline-none';

  const BackChevron = () => (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3L5 8l5 5" />
    </svg>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={() => {
            if (step === 1) onBack();
            else { setStep(step - 1); setError(''); }
          }}
          className="mb-6 flex items-center gap-2 text-[12px] font-[700] text-[#8C7F6D] transition hover:text-ink"
        >
          <BackChevron />
          {step === 1 ? 'Back' : 'Previous step'}
        </button>

        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-ink' : 'bg-hair'}`}
            />
          ))}
        </div>

        <div className="text-[11px] font-[700] uppercase tracking-[2.5px] text-[#8C7F6D]">
          streak -- step {step} of 3
        </div>

        {step === 1 && (
          <div>
            <div className="mt-3 text-[32px] font-[800] tracking-[-0.8px]">Create account.</div>
            <div className="mt-1 text-[14px] text-[#8C7F6D]">Pick a username and password.</div>
            <div className="mt-8 flex flex-col gap-3">
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Username"
                className={inputClass}
                autoComplete="username"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                className={inputClass}
                autoComplete="new-password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Confirm password"
                className={inputClass}
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
              />
              {error && (
                <div className="rounded-[14px] bg-[#FFCBA8] px-4 py-3 text-[13px] font-[700]">{error}</div>
              )}
              <button
                type="button"
                onClick={handleStep1}
                className="mt-2 w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mt-3 text-[32px] font-[800] tracking-[-0.8px]">Your challenge.</div>
            <div className="mt-1 text-[14px] text-[#8C7F6D]">When did you start? We will track from this date.</div>
            <div className="mt-8 flex flex-col gap-5">
              <div>
                <div className="mb-2 text-[11px] font-[700] uppercase tracking-[1px] text-[#8C7F6D]">
                  Challenge start date
                </div>
                <input
                  type="date"
                  value={startDate}
                  max={todayStr}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
                {isPastStart && (
                  <div className="mt-2 flex items-center gap-2 rounded-[14px] bg-[#FFCBA8] px-4 py-2.5">
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 flex-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 5v3M8 10.5v.5" />
                    </svg>
                    <span className="text-[12px] font-[700]">
                      You can add past data from your profile page.
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 text-[11px] font-[700] uppercase tracking-[1px] text-[#8C7F6D]">
                  Daily core habits
                </div>
                <div className="space-y-2">
                  {CORE_TASKS.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3"
                    >
                      <div className="h-2 w-2 flex-none rounded-full bg-lime" />
                      <div>
                        <div className="text-[13px] font-[700]">{task.title}</div>
                        <div className="text-[11px] text-[#8C7F6D]">{task.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setError(''); setStep(3); }}
                className="w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mt-3 text-[32px] font-[800] tracking-[-0.8px]">Profile photo.</div>
            <div className="mt-1 text-[14px] text-[#8C7F6D]">Optional -- you can always add one later.</div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-lime text-[32px] font-[800] text-ink transition hover:opacity-90"
              >
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  username[0]?.toUpperCase() ?? '?'
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7h4l2-3h6l2 3h4v13H3z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-[13px] font-[700] text-[#8C7F6D] transition hover:text-ink"
              >
                {avatarDataUrl ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-[14px] bg-[#FFCBA8] px-4 py-3 text-[13px] font-[700]">{error}</div>
            )}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90"
              >
                Start my streak
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="text-center text-[12px] font-[700] text-[#8C7F6D] transition hover:text-ink"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seed data modal
// ---------------------------------------------------------------------------

function SeedDataModal({
  startDate,
  history,
  tasks,
  onSeedDay,
  onClearDay,
  onClose,
}: {
  startDate: string;
  history: Record<string, DailyProgress>;
  tasks: Task[];
  onSeedDay: (date: Date) => void;
  onClearDay: (date: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor < today) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const isDayDone = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    const day = history[key];
    if (!day || tasks.length === 0) return false;
    return tasks.every((t) => isTaskDone(t, day[t.id]));
  };

  if (days.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
          <div className="text-[18px] font-[800]">No past data to add</div>
          <p className="mt-2 text-[13px] text-[#8C7F6D]">
            Your challenge starts today -- check back tomorrow.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-[18px] bg-ink py-3 text-[13px] font-[700] text-bg"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[18px] font-[800]">Add past data</div>
            <div className="text-[12px] text-[#8C7F6D]">
              Tap a day to mark all tasks complete. Tap again to clear.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2 text-[12px] font-[700]"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
            {days.map((date, i) => {
              const done = isDayDone(date);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => (done ? onClearDay(date) : onSeedDay(date))}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-[16px] px-1 py-3 text-center transition ${
                    done
                      ? 'bg-[#3F3326] text-[#F8F1E4] hover:opacity-80'
                      : 'bg-panel text-[#3F3326] hover:bg-[#FFCBA8]'
                  }`}
                >
                  <span className={`text-[10px] font-[700] ${done ? 'opacity-50' : 'opacity-60'}`}>
                    D{i + 1}
                  </span>
                  <span className="text-[14px] font-[800] leading-tight">{date.getDate()}</span>
                  <span className={`text-[9px] font-[700] ${done ? 'opacity-50' : 'opacity-60'}`}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[18px] bg-ink py-3 text-[13px] font-[700] text-bg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App pages
// ---------------------------------------------------------------------------

function TodayPage({
  tasks,
  coreTasks,
  customTasks,
  progress,
  doneCount,
  total,
  coreDoneCount,
  customDoneCount,
  coreTotal,
  customTotal,
  isDone,
  toggleTask,
  setTaskNote,
  setTaskValue,
  addCustomTask,
  setTaskMeals,
  setTaskPhotos,
  handlePhotoUpload,
  workoutTags,
  setTaskTags,
  addWorkoutTag,
}: {
  tasks: Task[];
  coreTasks: Task[];
  customTasks: Task[];
  progress: DailyProgress;
  doneCount: number;
  total: number;
  coreDoneCount: number;
  customDoneCount: number;
  coreTotal: number;
  customTotal: number;
  isDone: (task: Task) => boolean;
  toggleTask: (taskId: string, el: HTMLElement | null) => void;
  setTaskNote: (taskId: string, note: string) => void;
  setTaskValue: (taskId: string, value: number | boolean) => void;
  addCustomTask: (task: Omit<Task, 'id' | 'custom'>) => void;
  setTaskMeals: (taskId: string, meals: MealEntry[]) => void;
  setTaskPhotos: (taskId: string, photos: PhotoEntry[]) => void;
  handlePhotoUpload: (taskId: string, files: FileList) => void;
  workoutTags: WorkoutTag[];
  setTaskTags: (taskId: string, tags: string[]) => void;
  addWorkoutTag: (tag: Omit<WorkoutTag, 'id'>) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    sub: '',
    kind: 'check' as Task['kind'],
    target: 1,
    unit: '',
  });
  const [filter, setFilter] = useState<'all' | 'core' | 'custom'>('all');
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handleOpenNote = (taskId: string) => {
    if (taskId === 'diet') {
      setDietModalOpen(true);
    } else {
      setNoteTaskId(taskId);
      setNoteText(progress[taskId]?.note ?? '');
    }
  };

  const handleTagToggle = (taskId: string, tagId: string) => {
    const current = progress[taskId]?.selectedTags ?? [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    setTaskTags(taskId, next);
  };

  const handleSaveNote = () => {
    if (!noteTaskId) return;
    setTaskNote(noteTaskId, noteText);
    setNoteTaskId(null);
  };

  const showCore = filter === 'all' || filter === 'core';
  const showCustom = filter === 'all' || filter === 'custom';
  const pct = total > 0 ? doneCount / total : 0;

  const handleAddCustom = () => {
    if (!newTask.title.trim()) return;
    addCustomTask({
      title: newTask.title.trim(),
      sub: newTask.sub.trim() || 'Custom habit',
      kind: newTask.kind,
      target:
        newTask.kind === 'check'
          ? undefined
          : newTask.target > 0
          ? newTask.target
          : undefined,
      unit: newTask.unit.trim() || (newTask.kind === 'counter' ? 'units' : undefined),
    });
    setNewTask({ title: '', sub: '', kind: 'check', target: 1, unit: '' });
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="soft-card p-5">
        <div className="flex items-center justify-between gap-3">
          <Pill className="bg-lime text-ink">YOUR TODAY</Pill>
          <span className="text-[12px] font-[700] text-[#8C7F6D]">{Math.round(pct * 100)}% complete</span>
        </div>
        <div className="mt-3 text-[28px] font-[800] leading-tight tracking-[-0.5px]">
          {doneCount === total && total > 0 ? 'all done. incredible.' : 'finish strong.'}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-hair">
          <div
            className="h-full rounded-full bg-lime transition-all duration-500"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] bg-[#3F3326] px-4 py-3 text-bg">
            <div className="text-[10px] font-[700] uppercase tracking-[1.4px] text-[#F5EFE4] opacity-70">
              Total done
            </div>
            <div className="mt-1 text-[22px] font-[800]">
              {doneCount}
              <span className="text-[14px] opacity-50">/{total}</span>
            </div>
          </div>
          <div className="rounded-[18px] bg-panel px-4 py-3">
            <div className="text-[10px] font-[700] uppercase tracking-[1.4px] text-[#8C7F6D]">Core habits</div>
            <div className="mt-1 text-[22px] font-[800]">
              {coreDoneCount}
              <span className="text-[14px] text-[#8C7F6D]">/{coreTotal}</span>
            </div>
          </div>
          <div className="rounded-[18px] bg-panel px-4 py-3">
            <div className="text-[10px] font-[700] uppercase tracking-[1.4px] text-[#8C7F6D]">Custom</div>
            <div className="mt-1 text-[22px] font-[800]">
              {customDoneCount}
              <span className="text-[14px] text-[#8C7F6D]">/{customTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="panel-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(63,51,38,0.10)] pb-4">
          <div className="text-[20px] font-[800] tracking-[-0.4px]">today's checklist</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFilter('all')}>
              <Pill active={filter === 'all'}>ALL</Pill>
            </button>
            <button type="button" onClick={() => setFilter('core')}>
              <Pill active={filter === 'core'} outline={filter !== 'core'}>CORE</Pill>
            </button>
            <button type="button" onClick={() => setFilter('custom')}>
              <Pill active={filter === 'custom'} outline={filter !== 'custom'}>CUSTOM</Pill>
            </button>
          </div>
        </div>
        <div className={`mt-4 ${filter === 'all' ? 'grid gap-4 lg:grid-cols-2' : 'space-y-4'}`}>
          {showCore && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-[17px] font-[800]">Core habits</div>
                <div className="text-[12px] font-[700] text-[#8C7F6D]">{coreDoneCount}/{coreTotal} done</div>
              </div>
              <div className="space-y-2">
                {coreTasks.map((task, index) => (
                  <div key={task.id} className="rounded-[22px] bg-panel p-2">
                    <TaskCard
                      task={task}
                      value={progress[task.id]?.value ?? (task.kind === 'check' ? false : 0)}
                      note={progress[task.id]?.note}
                      done={isDone(task)}
                      idx={index}
                      selectedTags={progress[task.id]?.selectedTags}
                      workoutTags={workoutTags}
                      onToggle={toggleTask}
                      onSetValue={setTaskValue}
                      onOpenNote={handleOpenNote}
                      onPhotoUpload={handlePhotoUpload}
                      onPhotoEdit={() => setPhotoModalOpen(true)}
                      photoCount={progress[task.id]?.photos?.length}
                      onTagToggle={handleTagToggle}
                      onAddWorkoutTag={addWorkoutTag}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showCustom && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-[17px] font-[800]">Your tasks</div>
                <div className="text-[12px] font-[700] text-[#8C7F6D]">{customDoneCount}/{customTotal} done</div>
              </div>
              <div className="space-y-2">
                {customTasks.map((task, index) => (
                  <div key={task.id} className="rounded-[22px] bg-panel p-2">
                    <TaskCard
                      task={task}
                      value={progress[task.id]?.value ?? (task.kind === 'check' ? false : 0)}
                      note={progress[task.id]?.note}
                      done={isDone(task)}
                      idx={coreTasks.length + index}
                      selectedTags={progress[task.id]?.selectedTags}
                      workoutTags={workoutTags}
                      onToggle={toggleTask}
                      onSetValue={setTaskValue}
                      onOpenNote={handleOpenNote}
                      onPhotoUpload={handlePhotoUpload}
                      onPhotoEdit={() => setPhotoModalOpen(true)}
                      photoCount={progress[task.id]?.photos?.length}
                      onTagToggle={handleTagToggle}
                      onAddWorkoutTag={addWorkoutTag}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filter === 'all' && <div className="lg:col-span-2" />}
          <div className={`rounded-[20px] border border-dashed border-[rgba(63,51,38,0.10)] bg-white p-4 ${filter === 'all' ? 'lg:col-span-2' : ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[14px] font-[700]">Add custom task</div>
                <div className="text-[12px] text-[#8C7F6D]">Track an extra goal for today.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm((current) => !current)}
                className="rounded-[16px] bg-ink px-4 py-2.5 text-[13px] font-[700] text-bg"
              >
                {showAddForm ? 'Close' : '+ Add task'}
              </button>
            </div>

            {showAddForm && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  value={newTask.title}
                  onChange={(event) => setNewTask((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Task title"
                  className="w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] focus:border-ink focus:outline-none"
                />
                <input
                  value={newTask.sub}
                  onChange={(event) => setNewTask((current) => ({ ...current, sub: event.target.value }))}
                  placeholder="Short description"
                  className="w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] focus:border-ink focus:outline-none"
                />
                <select
                  value={newTask.kind}
                  onChange={(event) =>
                    setNewTask((current) => ({ ...current, kind: event.target.value as Task['kind'] }))
                  }
                  className="w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] bg-white px-4 py-3 text-[13px] focus:border-ink focus:outline-none"
                >
                  <option value="check">Check (done / not done)</option>
                  <option value="counter">Counter (tap to count)</option>
                  <option value="number">Number (enter a value)</option>
                </select>
                {(newTask.kind === 'counter' || newTask.kind === 'number') && (
                  <>
                    <input
                      type="number"
                      min={0}
                      max={newTask.kind === 'counter' ? 10 : undefined}
                      step={newTask.kind === 'number' ? 0.5 : 1}
                      value={newTask.target}
                      onChange={(event) =>
                        setNewTask((current) => ({
                          ...current,
                          target:
                            newTask.kind === 'counter'
                              ? Math.min(10, Number(event.target.value))
                              : Number(event.target.value),
                        }))
                      }
                      placeholder={
                        newTask.kind === 'number' ? 'Goal (optional, e.g. 8)' : 'Target (max 10)'
                      }
                      className="w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] focus:border-ink focus:outline-none"
                    />
                    <input
                      value={newTask.unit}
                      onChange={(event) =>
                        setNewTask((current) => ({ ...current, unit: event.target.value }))
                      }
                      placeholder={newTask.kind === 'number' ? 'Unit (hrs, lbs, km...)' : 'Unit (pages, cups...)'}
                      className="w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] focus:border-ink focus:outline-none"
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full rounded-[18px] bg-lime px-4 py-3 text-[13px] font-[700] text-ink md:col-span-2"
                >
                  Save task
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {photoModalOpen && (
        <PhotoModal
          photos={progress['photo']?.photos ?? []}
          onAddFiles={(files) => handlePhotoUpload('photo', files)}
          onDelete={(id) =>
            setTaskPhotos('photo', (progress['photo']?.photos ?? []).filter((p) => p.id !== id))
          }
          onClose={() => setPhotoModalOpen(false)}
        />
      )}

      {dietModalOpen && (
        <DietMealModal
          initialMeals={progress['diet']?.meals}
          onSave={(meals) => setTaskMeals('diet', meals)}
          onClose={() => setDietModalOpen(false)}
        />
      )}

      {noteTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[20px] font-[800]">Task notes</div>
                <div className="mt-1 text-[13px] text-[#8C7F6D]">Edit notes for the selected habit.</div>
              </div>
              <button
                type="button"
                onClick={() => setNoteTaskId(null)}
                className="rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] font-[700]"
              >
                Close
              </button>
            </div>
            <div className="mt-4 rounded-[22px] bg-[#F7F4EB] p-4 text-[14px] font-[700] text-[#3F3326]">
              {tasks.find((task) => task.id === noteTaskId)?.title}
            </div>
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Write or update your note for this task..."
              rows={6}
              className="mt-4 w-full rounded-[22px] border border-[rgba(63,51,38,0.10)] px-4 py-4 text-[13px] leading-6 text-[#3F3326] focus:border-ink focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNoteTaskId(null)}
                className="rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] font-[700]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="rounded-[18px] bg-ink px-4 py-3 text-[13px] font-[700] text-bg"
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isTaskDone(task: Task, entry: TaskDayState | undefined): boolean {
  if (!entry) return false;
  if (task.kind === 'check') return Boolean(entry.value);
  if (task.kind === 'tags') return Boolean(entry.selectedTags && entry.selectedTags.length > 0);
  if (task.kind === 'number') {
    const v = Number(entry.value);
    return task.target != null ? v >= task.target : v > 0;
  }
  return Number(entry.value) >= (task.target ?? 0);
}

function CalendarPage({
  tasks,
  history,
  getDayProgress,
}: {
  tasks: Task[];
  history: Record<string, DailyProgress>;
  getDayProgress: (date: Date) => DailyProgress;
}) {
  const today = useMemo(() => new Date(), []);
  const todayKey = today.toISOString().slice(0, 10);

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - firstDow + i));
  }, [viewDate]);

  const dayStatus = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    const record = history[key];
    if (!record) return 'empty';
    const done = tasks.filter((t) => isTaskDone(t, record[t.id])).length;
    if (tasks.length > 0 && done === tasks.length) return 'full';
    if (done > 0) return 'partial';
    return 'empty';
  };

  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const selectedProgress = getDayProgress(selectedDate);
  const selectedDone = tasks.filter((t) => isTaskDone(t, selectedProgress[t.id])).length;

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(new Date(date));
    setFocusedTaskId(null);
    setExpandedPhoto(null);
  };

  const handleTaskClick = (taskId: string) => {
    setExpandedPhoto(null);
    setFocusedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const focusedTask = focusedTaskId ? tasks.find((t) => t.id === focusedTaskId) : null;
  const focusedEntry = focusedTaskId ? selectedProgress[focusedTaskId] : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <div className="soft-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-panel text-[#3F3326] transition hover:bg-ink hover:text-bg"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 3L5 8l5 5" />
                </svg>
              </button>
              <div className="min-w-[160px] text-center text-[20px] font-[800] tracking-[-0.4px]">
                {monthLabel}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-panel text-[#3F3326] transition hover:bg-ink hover:text-bg"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={goToday}
              className="rounded-full bg-lime px-4 py-1.5 text-[12px] font-[700] text-ink transition hover:opacity-80"
            >
              Today
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[11px] font-[700] uppercase tracking-[0.8px] text-[#8C7F6D]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((date, i) => {
              const key = date.toISOString().slice(0, 10);
              const inMonth = date.getMonth() === viewDate.getMonth();
              const isToday = key === todayKey;
              const isSelected = key === selectedKey;
              const status = dayStatus(date);

              let bg = 'bg-white border border-[rgba(63,51,38,0.07)]';
              let fg = 'text-[#3F3326]';
              if (!inMonth) { bg = 'bg-transparent'; fg = 'text-[#8C7F6D] opacity-30'; }
              else if (status === 'full') { bg = 'bg-[#3F3326]'; fg = 'text-[#F8F1E4]'; }
              else if (status === 'partial') { bg = 'bg-[#FFCBA8]'; fg = 'text-[#3F3326]'; }
              else if (isToday) { bg = 'bg-lime'; fg = 'text-[#3F3326]'; }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  className={`flex flex-col items-center justify-center rounded-[16px] py-3.5 transition ${bg} ${fg} ${
                    isSelected
                      ? 'ring-2 ring-[#3F3326] ring-offset-1'
                      : 'hover:ring-1 hover:ring-[rgba(63,51,38,0.20)] hover:ring-offset-1'
                  }`}
                >
                  <span className="text-[15px] font-[800] leading-none">{date.getDate()}</span>
                  {isToday && (
                    <span className="mt-1.5 text-[8px] font-[700] uppercase tracking-[0.5px] opacity-70">
                      today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-[700] text-[#8C7F6D]">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[5px] bg-[#3F3326]" />All done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[5px] bg-[#FFCBA8]" />Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[5px] bg-lime" />Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[5px] border border-[rgba(63,51,38,0.15)] bg-white" />No data
            </span>
          </div>
        </div>

        {focusedTask && (
          <div className="soft-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-[800] tracking-[-0.4px]">{focusedTask.title}</div>
                <div className="mt-1 text-[13px] text-[#8C7F6D]">{focusedTask.sub}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFocusedTaskId(null);
                  setExpandedPhoto(null);
                }}
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-panel text-[#8C7F6D] transition hover:bg-ink hover:text-bg"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {focusedTask.id === 'photo' &&
              focusedEntry?.photos &&
              focusedEntry.photos.length > 0 && (
                <div className="mt-5">
                  {expandedPhoto ? (
                    <div>
                      <img
                        src={expandedPhoto}
                        alt=""
                        className="max-h-[480px] w-full rounded-[18px] object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setExpandedPhoto(null)}
                        className="mt-3 text-[12px] font-[700] text-[#8C7F6D] transition hover:text-ink"
                      >
                        back to all photos
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {focusedEntry.photos.map((photo) =>
                        photo.type.startsWith('image/') ? (
                          <img
                            key={photo.id}
                            src={photo.dataUrl}
                            alt=""
                            className="aspect-square w-full cursor-pointer rounded-[14px] object-cover transition hover:opacity-80"
                            onClick={() => setExpandedPhoto(photo.dataUrl)}
                          />
                        ) : (
                          <div
                            key={photo.id}
                            className="flex aspect-square w-full items-center justify-center rounded-[14px] bg-panel"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-7 w-7 text-[#8C7F6D]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="2" y="7" width="15" height="10" rx="2" />
                              <path d="M17 9l5-2v10l-5-2" />
                            </svg>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

            {focusedEntry?.note?.trim() && (
              <div className="mt-4 rounded-[18px] bg-panel px-5 py-4 text-[14px] leading-6 text-[#3F3326]">
                {focusedEntry.note}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="soft-card flex flex-col p-6">
        <div className="border-b border-[rgba(63,51,38,0.08)] pb-5">
          <div className="text-[20px] font-[800] tracking-[-0.4px]">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="mt-1.5 text-[13px] text-[#8C7F6D]">
            {selectedDone}/{tasks.length} tasks complete
          </div>
          {tasks.length > 0 && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-hair">
              <div
                className="h-full rounded-full bg-lime transition-all duration-300"
                style={{ width: `${(selectedDone / tasks.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {tasks.map((task) => {
            const entry = selectedProgress[task.id];
            const done = isTaskDone(task, entry);
            const isFocused = focusedTaskId === task.id;
            const hasNote = Boolean(entry?.note?.trim());
            const isPhotoTask = task.id === 'photo';
            const photos = entry?.photos ?? [];
            const hasDetails = hasNote || (isPhotoTask && photos.length > 0);

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => hasDetails && handleTaskClick(task.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[18px] px-4 py-3.5 text-left transition ${
                  done ? 'bg-[#3F3326] text-[#F8F1E4]' : 'bg-panel'
                } ${isFocused ? 'ring-2 ring-[#3F3326] ring-offset-1' : ''} ${
                  hasDetails ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-[700]">{task.title}</div>
                  {hasDetails && (
                    <div
                      className={`mt-0.5 text-[11px] ${
                        done ? 'text-[#F8F1E4] opacity-50' : 'text-[#8C7F6D]'
                      }`}
                    >
                      {isPhotoTask && photos.length > 0
                        ? `${photos.length} photo${photos.length !== 1 ? 's' : ''}`
                        : ''}
                      {hasNote && isPhotoTask && photos.length > 0 ? ' -- ' : ''}
                      {hasNote ? 'note' : ''}
                    </div>
                  )}
                </div>
                <div
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                    done ? 'bg-lime' : 'bg-hair'
                  }`}
                >
                  {done && (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="#3F3326"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 7l3 3 7-7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({
  currentUser,
  customTasks,
  tasks,
  history,
  addCustomTask,
  removeCustomTask,
  updateCustomTask,
  onLogout,
  onUpdateUser,
  seedDayComplete,
  clearDay,
}: {
  currentUser: User;
  customTasks: Task[];
  tasks: Task[];
  history: Record<string, DailyProgress>;
  addCustomTask: (task: Omit<Task, 'id' | 'custom'>) => void;
  removeCustomTask: (taskId: string) => void;
  updateCustomTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'custom'>>) => void;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<Omit<User, 'id'>>) => void;
  seedDayComplete: (date: Date) => void;
  clearDay: (date: Date) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStartDate, setEditingStartDate] = useState(false);
  const [startDateDraft, setStartDateDraft] = useState(currentUser.startDate);
  const [newTask, setNewTask] = useState({
    title: '',
    sub: '',
    kind: 'check' as Task['kind'],
    target: 1,
    unit: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    sub: '',
    kind: 'check' as Task['kind'],
    target: 1,
    unit: '',
  });
  const [showSeedModal, setShowSeedModal] = useState(false);

  const msPerDay = 1000 * 60 * 60 * 24;
  const dayNum = Math.max(
    1,
    Math.floor((Date.now() - parseLocalDate(currentUser.startDate).getTime()) / msPerDay) + 1,
  );

  const perfectDays = Object.values(history).filter(
    (day) => tasks.length > 0 && tasks.every((t) => isTaskDone(t, day[t.id])),
  ).length;

  const taskCompletions = (taskId: string) =>
    Object.values(history).filter((day) => {
      const t = tasks.find((task) => task.id === taskId);
      return t ? isTaskDone(t, day[t.id]) : false;
    }).length;

  const totalTasksDone = Object.values(history).reduce(
    (acc, day) => acc + tasks.filter((t) => isTaskDone(t, day[t.id])).length,
    0,
  );

  const startDateFormatted = parseLocalDate(currentUser.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    addCustomTask({
      title: newTask.title.trim(),
      sub: newTask.sub.trim() || 'Custom habit',
      kind: newTask.kind,
      target:
        newTask.kind === 'check'
          ? undefined
          : newTask.target > 0
          ? newTask.target
          : undefined,
      unit: newTask.unit.trim() || (newTask.kind === 'counter' ? 'units' : undefined),
    });
    setNewTask({ title: '', sub: '', kind: 'check', target: 1, unit: '' });
    setShowAddForm(false);
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      sub: task.sub,
      kind: task.kind,
      target: task.target ?? 1,
      unit: task.unit ?? '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm.title.trim()) return;
    updateCustomTask(editingId, {
      title: editForm.title.trim(),
      sub: editForm.sub.trim() || 'Custom habit',
      kind: editForm.kind,
      target:
        editForm.kind === 'check'
          ? undefined
          : editForm.target > 0
          ? editForm.target
          : undefined,
      unit: editForm.unit.trim() || (editForm.kind === 'counter' ? 'units' : undefined),
    });
    setEditingId(null);
  };

  const inputClass =
    'w-full rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] focus:border-ink focus:outline-none';

  return (
    <div className="grid gap-6">
      {/* Profile header */}
      <div className="soft-card p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {currentUser.avatarDataUrl ? (
              <img
                src={currentUser.avatarDataUrl}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-white"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime text-[32px] font-[800] text-ink">
                {currentUser.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-[44px] font-[800] tracking-[-0.8px]">{currentUser.username}</div>
              <div className="mt-2 flex items-center gap-2">
                {editingStartDate ? (
                  <>
                    <input
                      type="date"
                      value={startDateDraft}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setStartDateDraft(e.target.value)}
                      className="rounded-[12px] border border-[rgba(63,51,38,0.15)] bg-white px-3 py-1.5 text-[13px] font-[700] text-[#3F3326] focus:border-ink focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateUser({ startDate: startDateDraft });
                        setEditingStartDate(false);
                      }}
                      className="rounded-full bg-lime px-3 py-1 text-[11px] font-[700] text-ink"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStartDateDraft(currentUser.startDate); setEditingStartDate(false); }}
                      className="rounded-full border border-[rgba(63,51,38,0.12)] px-3 py-1 text-[11px] font-[700] text-[#8C7F6D]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[13px] text-[#8C7F6D]">Started {startDateFormatted}</span>
                    <button
                      type="button"
                      onClick={() => { setStartDateDraft(currentUser.startDate); setEditingStartDate(true); }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-panel text-[#8C7F6D] transition hover:bg-[#BACEF1] hover:text-ink"
                    >
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 2l3 3-8 8H3v-3L11 2z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-[22px] bg-lime px-4 py-3 text-[12px] font-[800]">
              DAY {Math.min(dayNum, 75)} OF 75
            </span>
            <button
              type="button"
              onClick={() => setShowSeedModal(true)}
              className="rounded-[22px] bg-panel px-4 py-3 text-[12px] font-[700] transition hover:bg-[#FFCBA8]"
            >
              Add past data
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-[22px] border border-[rgba(63,51,38,0.10)] bg-white px-4 py-3 text-[12px] font-[700] transition hover:border-ink"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {[
          { title: `DAY ${Math.min(dayNum, 75)}`, tone: 'bg-lime' },
          { title: `PERFECT ${perfectDays}`, tone: 'bg-orange' },
          { title: `TASKS ${totalTasksDone}`, tone: 'bg-blue' },
          { title: `${Math.min(100, Math.round((perfectDays / 75) * 100))}% DONE`, tone: 'bg-pink' },
        ].map((item) => (
          <div key={item.title} className={`rounded-[24px] ${item.tone} p-6 text-ink`}>
            <div className="text-[13px] font-[700] uppercase tracking-[1.4px] opacity-90">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Totals + milestones */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="soft-card p-8">
          <div className="text-[22px] font-[800] tracking-[-0.6px]">this run -- totals</div>
          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 rounded-[18px] bg-panel px-4 py-4"
              >
                <div className="text-[13px] font-[700]">{task.title}</div>
                <div className="text-[20px] font-[800]">{taskCompletions(task.id)}</div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-4 text-center text-[13px] text-[#8C7F6D]">No data yet -- start checking off tasks.</div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="soft-card p-8">
            <div className="text-[22px] font-[800] tracking-[-0.6px]">milestones</div>
            <div className="mt-5 space-y-3">
              {milestoneSteps.map((step) => {
                const reached = perfectDays >= step;
                return (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-[18px] bg-panel px-4 py-3"
                  >
                    <div className={`h-5 w-5 rounded-full ${reached ? 'bg-lime' : 'bg-hair'}`} />
                    <div className="text-[13px] font-[700]">
                      Day {step} -- {reached ? 'complete' : 'up next'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[24px] bg-ink p-6 text-card">
            <div className="text-[13px] font-[700] uppercase tracking-[1.4px] opacity-90">
              Challenge rules
            </div>
            <div className="mt-4 space-y-2.5">
              {CORE_TASKS.map((task) => (
                <div key={task.id} className="flex items-start gap-2.5">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-lime" />
                  <div className="text-[13px] leading-6 text-[#F5EFE4] opacity-80">{task.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom tasks */}
      <div className="soft-card p-6">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <div className="text-[22px] font-[800] tracking-[-0.6px]">custom tasks</div>
            <div className="text-[13px] text-[#8C7F6D]">Add or remove your personal habits.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="rounded-[18px] bg-ink px-4 py-2.5 text-[13px] font-[700] text-bg"
          >
            {showAddForm ? 'Close' : '+ Add task'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 grid gap-3 rounded-[20px] bg-panel p-4 md:grid-cols-2">
            <input
              value={newTask.title}
              onChange={(e) => setNewTask((c) => ({ ...c, title: e.target.value }))}
              placeholder="Task title"
              className={inputClass}
            />
            <input
              value={newTask.sub}
              onChange={(e) => setNewTask((c) => ({ ...c, sub: e.target.value }))}
              placeholder="Short description"
              className={inputClass}
            />
            <select
              value={newTask.kind}
              onChange={(e) => setNewTask((c) => ({ ...c, kind: e.target.value as Task['kind'] }))}
              className={`${inputClass} bg-white`}
            >
              <option value="check">Check (done / not done)</option>
              <option value="counter">Counter (tap to count)</option>
              <option value="number">Number (enter a value)</option>
            </select>
            {(newTask.kind === 'counter' || newTask.kind === 'number') && (
              <>
                <input
                  type="number"
                  min={0}
                  max={newTask.kind === 'counter' ? 10 : undefined}
                  step={newTask.kind === 'number' ? 0.5 : 1}
                  value={newTask.target}
                  onChange={(e) =>
                    setNewTask((c) => ({
                      ...c,
                      target:
                        newTask.kind === 'counter'
                          ? Math.min(10, Number(e.target.value))
                          : Number(e.target.value),
                    }))
                  }
                  placeholder={newTask.kind === 'number' ? 'Goal (optional, e.g. 8)' : 'Target (max 10)'}
                  className={inputClass}
                />
                <input
                  value={newTask.unit}
                  onChange={(e) => setNewTask((c) => ({ ...c, unit: e.target.value }))}
                  placeholder={newTask.kind === 'number' ? 'Unit (hrs, lbs, km...)' : 'Unit (pages, cups...)'}
                  className={inputClass}
                />
              </>
            )}
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-[18px] bg-lime px-4 py-3 text-[13px] font-[700] text-ink md:col-span-2"
            >
              Save task
            </button>
          </div>
        )}

        {customTasks.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-[#8C7F6D]">
            No custom tasks yet -- add one above.
          </div>
        ) : (
          <div className="space-y-2">
            {customTasks.map((task) => (
              <div key={task.id}>
                {editingId === task.id ? (
                  <div className="grid gap-3 rounded-[20px] border border-ink/10 bg-panel p-4 md:grid-cols-2">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm((c) => ({ ...c, title: e.target.value }))}
                      placeholder="Task title"
                      className={inputClass}
                    />
                    <input
                      value={editForm.sub}
                      onChange={(e) => setEditForm((c) => ({ ...c, sub: e.target.value }))}
                      placeholder="Short description"
                      className={inputClass}
                    />
                    <select
                      value={editForm.kind}
                      onChange={(e) =>
                        setEditForm((c) => ({ ...c, kind: e.target.value as Task['kind'] }))
                      }
                      className={`${inputClass} bg-white`}
                    >
                      <option value="check">Check (done / not done)</option>
                      <option value="counter">Counter (tap to count)</option>
                      <option value="number">Number (enter a value)</option>
                    </select>
                    {(editForm.kind === 'counter' || editForm.kind === 'number') && (
                      <>
                        <input
                          type="number"
                          min={0}
                          max={editForm.kind === 'counter' ? 10 : undefined}
                          step={editForm.kind === 'number' ? 0.5 : 1}
                          value={editForm.target}
                          onChange={(e) =>
                            setEditForm((c) => ({
                              ...c,
                              target:
                                editForm.kind === 'counter'
                                  ? Math.min(10, Number(e.target.value))
                                  : Number(e.target.value),
                            }))
                          }
                          placeholder={editForm.kind === 'number' ? 'Goal (optional, e.g. 8)' : 'Target (max 10)'}
                          className={inputClass}
                        />
                        <input
                          value={editForm.unit}
                          onChange={(e) => setEditForm((c) => ({ ...c, unit: e.target.value }))}
                          placeholder={editForm.kind === 'number' ? 'Unit (hrs, lbs, km...)' : 'Unit (pages, cups...)'}
                          className={inputClass}
                        />
                      </>
                    )}
                    <div className="flex gap-2 md:col-span-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-[18px] border border-[rgba(63,51,38,0.10)] py-3 text-[13px] font-[700]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="flex-1 rounded-[18px] bg-lime py-3 text-[13px] font-[700] text-ink"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : deleteConfirmId === task.id ? (
                  <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#FFCBA8] px-4 py-3">
                    <div className="text-[13px] font-[700]">Delete "{task.title}"?</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="rounded-[14px] border border-[rgba(63,51,38,0.15)] bg-white px-3 py-1.5 text-[12px] font-[700]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeCustomTask(task.id);
                          setDeleteConfirmId(null);
                        }}
                        className="rounded-[14px] bg-ink px-3 py-1.5 text-[12px] font-[700] text-bg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-[18px] bg-panel px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-[700]">{task.title}</div>
                      <div className="text-[12px] text-[#8C7F6D]">
                        {task.sub}
                        {task.kind === 'counter' ? ` -- target ${task.target}` : ''}
                      </div>
                    </div>
                    <div className="flex flex-none gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(task)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8C7F6D] transition hover:bg-[#BACEF1] hover:text-ink"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 2l3 3-8 8H3v-3L11 2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(task.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8C7F6D] transition hover:bg-[#FFCBA8] hover:text-ink"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M3 3l10 10M13 3L3 13" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showSeedModal && (
        <SeedDataModal
          startDate={currentUser.startDate}
          history={history}
          tasks={tasks}
          onSeedDay={seedDayComplete}
          onClearDay={clearDay}
          onClose={() => setShowSeedModal(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Authenticated app shell
// ---------------------------------------------------------------------------

function MainApp({
  currentUser,
  logout,
  updateCurrentUser,
}: {
  currentUser: User;
  logout: () => void;
  updateCurrentUser: (updates: Partial<Omit<User, 'id'>>) => void;
}) {
  const [page, setPage] = useState<PageKey>('today');
  const todayDate = useMemo(() => new Date(), []);

  const {
    tasks,
    coreTasks,
    customTasks,
    progress,
    doneCount,
    total,
    coreDoneCount,
    customDoneCount,
    coreTotal,
    customTotal,
    isDone,
    toggleTask,
    setTaskValue,
    setTaskNote,
    setTaskTags,
    addCustomTask,
    removeCustomTask,
    updateCustomTask,
    setTaskMeals,
    setTaskPhotos,
    addTaskPhotos,
    getDayProgress,
    history,
    workoutTags,
    addWorkoutTag,
    seedDayComplete,
    clearDay,
  } = useDailyTasks(CORE_TASKS, [], todayDate, currentUser.id, DEFAULT_WORKOUT_TAGS);

  const handlePhotoUpload = async (taskId: string, files: FileList) => {
    const newEntries = await Promise.all(Array.from(files).map(readFileAsDataUrl));
    addTaskPhotos(taskId, newEntries);
  };

  return (
    <div className="min-h-screen bg-bg px-5 py-5 text-ink md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <header className="flex flex-col gap-6 rounded-[32px] bg-card p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[13px] font-[700] uppercase tracking-[1.6px] text-[#8C7F6D]">streak</div>
            <div className="mt-3 text-[32px] font-[800] tracking-[-1px]">75 Hard -- daily progress</div>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPage(item.key)}
                className={`rounded-[24px] px-5 py-3 text-[13px] font-[800] transition ${
                  page === item.key ? 'bg-ink text-bg shadow-lifted' : 'bg-panel text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        {page === 'today' && (
          <TodayPage
            tasks={tasks}
            coreTasks={coreTasks}
            customTasks={customTasks}
            progress={progress}
            doneCount={doneCount}
            total={total}
            coreDoneCount={coreDoneCount}
            coreTotal={coreTotal}
            customDoneCount={customDoneCount}
            customTotal={customTotal}
            isDone={isDone}
            toggleTask={toggleTask}
            setTaskNote={setTaskNote}
            setTaskValue={setTaskValue}
            addCustomTask={addCustomTask}
            setTaskMeals={setTaskMeals}
            setTaskPhotos={setTaskPhotos}
            handlePhotoUpload={handlePhotoUpload}
            workoutTags={workoutTags}
            setTaskTags={setTaskTags}
            addWorkoutTag={addWorkoutTag}
          />
        )}
        {page === 'calendar' && (
          <CalendarPage tasks={tasks} history={history} getDayProgress={getDayProgress} />
        )}
        {page === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            customTasks={customTasks}
            tasks={tasks}
            history={history}
            addCustomTask={addCustomTask}
            removeCustomTask={removeCustomTask}
            updateCustomTask={updateCustomTask}
            onLogout={logout}
            onUpdateUser={updateCurrentUser}
            seedDayComplete={seedDayComplete}
            clearDay={clearDay}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root: auth router
// ---------------------------------------------------------------------------

function App() {
  const { currentUser, login, signup, logout, updateCurrentUser } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');

  if (!currentUser) {
    return (
      <>
        {authView === 'landing' && (
          <LandingPage
            onLogin={() => setAuthView('login')}
            onSignup={() => setAuthView('signup')}
          />
        )}
        {authView === 'login' && (
          <LoginPage onLogin={login} onBack={() => setAuthView('landing')} />
        )}
        {authView === 'signup' && (
          <SignupWizard onSignup={signup} onBack={() => setAuthView('landing')} />
        )}
      </>
    );
  }

  return (
    <MainApp currentUser={currentUser} logout={logout} updateCurrentUser={updateCurrentUser} />
  );
}

export default App;
