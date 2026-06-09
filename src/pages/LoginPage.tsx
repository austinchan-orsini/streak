import { useState } from 'react';

export function LoginPage({
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
