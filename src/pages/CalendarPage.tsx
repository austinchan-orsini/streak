import { useMemo, useState } from 'react';
import type { DailyProgress, Task } from '../types';
import { isTaskDone } from '../utils/tasks';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPage({
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
