import type { FC } from 'react';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number;
  activeColor: string;
  trackColor: string;
  label: string;
}

export const ProgressRing: FC<ProgressRingProps> = ({ size = 36, strokeWidth = 4, progress, activeColor, trackColor, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex h-[36px] w-[36px] items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .4s cubic-bezier(.2,.7,.3,1)' }}
        />
      </svg>
      <span className="absolute text-[10px] font-[800] leading-none text-[#3F3326]">{label}</span>
    </div>
  );
};
