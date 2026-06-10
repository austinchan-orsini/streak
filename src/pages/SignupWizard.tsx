import { useRef, useState } from 'react';
import type { SignupData } from '../types';
import { CORE_TASKS } from '../data/tasks';

export function SignupWizard({
  onSignup,
  onBack,
}: {
  onSignup: (data: SignupData) => Promise<string | null>;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    if (!username.trim()) { setError('Please enter a display name.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    const err = await onSignup({
      email: email.trim(),
      username: username.trim(),
      password,
      startDate,
      avatarDataUrl,
    });
    setLoading(false);
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
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Email"
                className={inputClass}
                autoComplete="email"
              />
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Display name"
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
                disabled={loading}
                className="w-full rounded-[22px] bg-ink py-4 text-[14px] font-[800] text-bg transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Creating account…' : 'Start my streak'}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="text-center text-[12px] font-[700] text-[#8C7F6D] transition hover:text-ink disabled:opacity-50"
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
