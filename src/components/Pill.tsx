export function Pill({
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
