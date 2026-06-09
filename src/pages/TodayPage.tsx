import { useState } from 'react';
import type { DailyProgress, MealEntry, PhotoEntry, Task, WorkoutTag } from '../types';
import { TaskCard } from '../components/TaskCard';
import { Pill } from '../components/Pill';
import { PhotoModal } from '../components/PhotoModal';
import { DietMealModal } from '../components/DietMealModal';

export function TodayPage({
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
