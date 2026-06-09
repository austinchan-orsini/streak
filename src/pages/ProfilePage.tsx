import { useState } from 'react';
import type { DailyProgress, Task, User } from '../types';
import { CORE_TASKS } from '../data/tasks';
import { isTaskDone } from '../utils/tasks';
import { parseLocalDate } from '../utils/dates';
import { SeedDataModal } from '../components/SeedDataModal';

const milestoneSteps = [1, 7, 14, 21, 30, 50, 75];

export function ProfilePage({
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
