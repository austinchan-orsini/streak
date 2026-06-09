import type { DailyProgress, Task } from '../types';
import { isTaskDone } from '../utils/tasks';

export function SeedDataModal({
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
