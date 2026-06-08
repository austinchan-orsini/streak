import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import type { Task, WorkoutTag } from '../types';
import { ProgressRing } from './ProgressRing';

const accentColors = ['#C6E89E', '#FFCBA8', '#BACEF1', '#F4C7D2', '#C6E89E', '#FFCBA8'];

const icons: Record<string, (props: { color: string }) => JSX.Element> = {
  workout1: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 12h2M20 12h2M5 9v6M19 9v6M8 6v12M16 6v12M8 12h8" />
    </svg>
  ),
  workout2: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M3 21l4-7 5 4 4-6 5 9" />
    </svg>
  ),
  water: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 3s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z" />
    </svg>
  ),
  read: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z" />
    </svg>
  ),
  diet: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 21c5 0 9-4 9-9-4 0-9 4-9 9z M12 21c-5 0-9-4-9-9 4 0 9 4 9 9z" />
    </svg>
  ),
  photo: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 7h4l2-3h6l2 3h4v13H3z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  meditate: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M12 9v6M5 19c2-4 5-4 7-4s5 0 7 4M5 19l-2 3M19 19l2 3" />
    </svg>
  ),
  stretch: ({ color }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v5M8 22l4-10 4 10M5 12h14" />
    </svg>
  ),
};

const CheckIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M2 7l3 3 7-7" />
  </svg>
);

const CUSTOM_TAG_COLORS = [
  '#C6E89E', '#FFCBA8', '#BACEF1', '#F4C7D2', '#F9E4B7',
  '#B5E8E0', '#D4C5F9', '#FFD6A5', '#C9EDD6', '#F0D9FF',
];

interface TaskCardProps {
  task: Task;
  value: number | boolean;
  note?: string;
  photoCount?: number;
  done: boolean;
  idx: number;
  selectedTags?: string[];
  workoutTags?: WorkoutTag[];
  onToggle: (taskId: string, el: HTMLElement | null) => void;
  onSetValue?: (taskId: string, value: number) => void;
  onOpenNote?: (taskId: string) => void;
  onPhotoUpload?: (taskId: string, files: FileList) => void;
  onPhotoEdit?: (taskId: string) => void;
  onTagToggle?: (taskId: string, tagId: string) => void;
  onAddWorkoutTag?: (tag: Omit<WorkoutTag, 'id'>) => void;
}

export function TaskCard({
  task,
  value,
  note,
  photoCount,
  done,
  idx,
  selectedTags = [],
  workoutTags = [],
  onToggle,
  onSetValue,
  onOpenNote,
  onPhotoUpload,
  onPhotoEdit,
  onTagToggle,
  onAddWorkoutTag,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const numberInputRef = useRef<HTMLInputElement | null>(null);
  const tagDropdownRef = useRef<HTMLDivElement | null>(null);
  const addTagInputRef = useRef<HTMLInputElement | null>(null);
  const [showFloat, setShowFloat] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');

  const isPhoto = task.id === 'photo';
  const isTags = task.kind === 'tags';
  const accent = accentColors[idx % accentColors.length];
  const icon = icons[task.id] ?? icons.workout1;
  const isCheck = task.kind === 'check';
  const isNumber = task.kind === 'number';
  const current = (isCheck || isNumber || isTags) ? Number(done) : Number(value ?? 0);
  const pct = (isCheck || isNumber || isTags) ? (done ? 1 : 0) : Math.min(1, current / (task.target ?? 1));

  const [numberStr, setNumberStr] = useState(() => {
    if (!isNumber) return '';
    const v = Number(value ?? 0);
    return v > 0 ? String(v) : '';
  });

  useEffect(() => {
    if (isNumber) {
      const v = Number(value ?? 0);
      setNumberStr(v > 0 ? String(v) : '');
    }
  }, [isNumber, value]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showTagDropdown) return;
    const handleOutside = (e: globalThis.MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setShowTagDropdown(false);
        setShowAddTag(false);
        setNewTagLabel('');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showTagDropdown]);

  useEffect(() => {
    if (showAddTag && addTagInputRef.current) {
      addTagInputRef.current.focus();
    }
  }, [showAddTag]);

  // Label for subtitle
  const tagButtonLabel = selectedTags.length === 0
    ? 'Select'
    : selectedTags.length === 1
      ? (workoutTags.find((t) => t.id === selectedTags[0])?.label ?? 'Select')
      : `${selectedTags.length} logged`;

  const label = isPhoto
    ? done
      ? `${photoCount ?? 1} photo${(photoCount ?? 1) !== 1 ? 's' : ''} logged`
      : task.sub
    : isTags
      ? selectedTags.length > 0
        ? selectedTags
            .map((id) => workoutTags.find((t) => t.id === id)?.label ?? id)
            .join(', ')
        : task.sub
      : isNumber
        ? task.target != null && task.target > 0
          ? `${task.sub} -- goal ${task.target}${task.unit ? ' ' + task.unit : ''}`
          : task.sub
        : isCheck
          ? (done ? 'Done -- nice.' : task.sub)
          : `${current}/${task.target}${task.unit ? ` ${task.unit}` : ''}`;
  const labelColor = done ? 'rgba(245,239,228,0.55)' : '#8C7F6D';

  const fireCompletionEffects = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      confetti({
        particleCount: 24, spread: 55, startVelocity: 30,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ['#C6E89E', '#FFCBA8', '#3F3326'], scalar: 0.85, zIndex: 9999,
      });
    }
    setShowFloat(true);
    window.setTimeout(() => setShowFloat(false), 900);
  };

  const handleClick = () => {
    if (isTags) return;
    if (isPhoto) {
      if (done) onPhotoEdit?.(task.id);
      else fileRef.current?.click();
      return;
    }
    if (isNumber) {
      numberInputRef.current?.focus();
      return;
    }
    const numeric = Number(value ?? 0);
    const willComplete = isCheck ? !done : numeric + 1 >= (task.target ?? 0);
    onToggle(task.id, ref.current);
    if (willComplete && !done) {
      setShowFloat(true);
      window.setTimeout(() => setShowFloat(false), 900);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (!done) fireCompletionEffects();
    onPhotoUpload?.(task.id, files);
    event.target.value = '';
  };

  const handleNoteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenNote?.(task.id);
  };

  const handleBarClick = (event: MouseEvent<HTMLButtonElement>, value: number) => {
    event.stopPropagation();
    onSetValue?.(task.id, value);
  };

  const handleTagToggle = (e: MouseEvent, tagId: string) => {
    e.stopPropagation();
    const wasDone = selectedTags.length > 0;
    const willSelect = !selectedTags.includes(tagId);
    onTagToggle?.(task.id, tagId);
    if (!wasDone && willSelect) fireCompletionEffects();
  };

  const handleAddTag = (e: MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const trimmed = newTagLabel.trim();
    if (!trimmed) return;
    const colorIdx = workoutTags.length % CUSTOM_TAG_COLORS.length;
    onAddWorkoutTag?.({ label: trimmed, color: CUSTOM_TAG_COLORS[colorIdx] });
    setNewTagLabel('');
    setShowAddTag(false);
  };

  const renderTagDropdown = () => {
    if (!showTagDropdown) return null;
    return (
      <div
        className="absolute right-0 top-full z-50 mt-1.5 min-w-[220px] rounded-[18px] p-3 shadow-[0_8px_32px_rgba(63,51,38,0.18)]"
        style={{ background: '#FFFFFF', border: '1px solid rgba(63,51,38,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap gap-1.5">
          {workoutTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={(e) => handleTagToggle(e, tag.id)}
                className="rounded-full px-3 py-1 text-[11px] font-[700] transition-all"
                style={{
                  background: isSelected ? tag.color : 'rgba(63,51,38,0.06)',
                  color: '#3F3326',
                  border: isSelected ? `1.5px solid ${tag.color}` : '1.5px solid transparent',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2 border-t border-[rgba(63,51,38,0.07)] pt-2">
          {showAddTag ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={addTagInputRef}
                type="text"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag(e);
                  if (e.key === 'Escape') { setShowAddTag(false); setNewTagLabel(''); }
                }}
                placeholder="tag name"
                maxLength={20}
                className="w-24 rounded-full border border-[rgba(63,51,38,0.20)] bg-[#F7F4EB] px-2.5 py-1 text-[11px] font-[700] text-[#3F3326] placeholder:text-[#8C7F6D] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-full bg-[#C6E89E] px-2.5 py-1 text-[11px] font-[700] text-[#3F3326]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowAddTag(false); setNewTagLabel(''); }}
                className="rounded-full px-2 py-1 text-[11px] text-[#8C7F6D]"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowAddTag(true); }}
              className="rounded-full px-2.5 py-1 text-[11px] font-[600] text-[#8C7F6D] transition hover:text-ink"
              style={{ border: '1.5px dashed rgba(63,51,38,0.18)' }}
            >
              + new tag
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBarProgress = () => {
    if (task.kind !== 'counter' || typeof task.target !== 'number') return null;
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: task.target }, (_, index) => {
              const filled = index < Number(value ?? 0);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => handleBarClick(event, index + 1)}
                  title={`${index + 1}`}
                  className={`h-9 min-w-[30px] rounded-[12px] border px-2 text-[12px] font-[700] transition ${
                    filled ? 'border-ink bg-ink text-bg' : 'border-[rgba(63,51,38,0.12)] bg-[#F7F4EB] text-[#3F3326]'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-[#8C7F6D]">
            {task.unit ?? 'units'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      className="group relative w-full rounded-[22px] px-4 py-3 text-left shadow-card transition-all"
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      style={{
        background: done ? '#3F3326' : '#FFFFFF',
        color: done ? '#F8F1E4' : '#3F3326',
        boxShadow: done ? '0 4px 20px rgba(63,51,38,0.18)' : '0 1px 0 rgba(63,51,38,0.04), 0 2px 8px rgba(63,51,38,0.04)',
      }}
    >
      {isPhoto && (
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] transition-colors"
          style={{ background: done ? 'rgba(213,242,92,0.18)' : accent }}
        >
          {icon({ color: done ? '#C6E89E' : '#3F3326' })}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-[700] leading-5 tracking-[-0.2px]">{task.title}</div>
          <div className="mt-1 truncate text-[12px] font-[500] leading-4" style={{ color: labelColor }}>{label}</div>
        </div>

        <div className="flex items-center gap-2">
          {isPhoto ? (
            done ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPhotoEdit?.(task.id); }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-[700] transition"
                style={{ background: 'rgba(213,242,92,0.25)', color: '#C6E89E' }}
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 2l3 3-8 8H3v-3L11 2z" />
                </svg>
                Edit
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-[700]"
                style={{ background: '#BACEF1', color: '#3F3326' }}
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v8M5 5l3-3 3 3" />
                  <path d="M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1" />
                </svg>
                Upload
              </div>
            )
          ) : isNumber ? (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={numberInputRef}
                type="number"
                min={0}
                step={0.5}
                value={numberStr}
                onChange={(e) => {
                  setNumberStr(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed) && parsed >= 0) {
                    const wasNotDone = !done;
                    onSetValue?.(task.id, parsed);
                    if (wasNotDone && (task.target != null ? parsed >= task.target : parsed > 0)) {
                      setShowFloat(true);
                      window.setTimeout(() => setShowFloat(false), 900);
                    }
                  }
                }}
                onBlur={(e) => {
                  const parsed = parseFloat(e.target.value);
                  if (isNaN(parsed) || parsed < 0) {
                    setNumberStr('');
                    onSetValue?.(task.id, 0);
                  }
                }}
                placeholder="0"
                className={`w-14 rounded-[12px] border px-2 py-1.5 text-center text-[14px] font-[800] focus:outline-none transition ${
                  done
                    ? 'border-white/20 bg-transparent text-[#F8F1E4] placeholder:text-[#F8F1E4]/30'
                    : 'border-[rgba(63,51,38,0.15)] bg-[#F7F4EB] text-[#3F3326] placeholder:text-[#8C7F6D]'
                }`}
              />
              {task.unit && (
                <span className={`text-[11px] font-[700] ${done ? 'text-[#F8F1E4] opacity-60' : 'text-[#8C7F6D]'}`}>
                  {task.unit}
                </span>
              )}
            </div>
          ) : isTags ? (
            <div
              ref={tagDropdownRef}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowTagDropdown((v) => !v)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-[700] transition-all"
                style={{
                  background: done
                    ? 'rgba(198,232,158,0.20)'
                    : showTagDropdown
                      ? '#3F3326'
                      : '#F1EADC',
                  color: done ? '#C6E89E' : showTagDropdown ? '#F8F1E4' : '#3F3326',
                }}
              >
                {tagButtonLabel}
                <svg
                  viewBox="0 0 10 6"
                  className="h-2.5 w-2.5 transition-transform"
                  style={{ transform: showTagDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
              {renderTagDropdown()}
            </div>
          ) : isCheck ? (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
              style={{
                background: done ? '#C6E89E' : 'transparent',
                border: done ? 'none' : '2px solid rgba(63,51,38,0.10)',
                transform: done ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {done && <CheckIcon color="#3F3326" />}
            </div>
          ) : (
            <ProgressRing
              progress={pct}
              activeColor={done ? '#C6E89E' : '#3F3326'}
              trackColor={done ? 'rgba(213,242,92,0.18)' : 'rgba(63,51,38,0.10)'}
              label={done ? '✓' : `${Math.round(pct * 100)}%`}
            />
          )}

          {!isPhoto && (
            <button
              type="button"
              onClick={handleNoteClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(63,51,38,0.10)] bg-white text-[#3F3326] transition hover:border-ink"
              style={{ background: note ? '#FFF6DA' : 'white' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M4 4h16v12H5.5L4 17.5V4z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {renderBarProgress()}

      <AnimatePresence>
        {showFloat ? (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -24 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
            className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-transparent px-2 text-[22px] font-[800] text-[#3F3326]"
          >
            +1
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
