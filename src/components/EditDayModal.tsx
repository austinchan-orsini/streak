import { useState } from 'react';
import type { DailyProgress, Task, TaskDayState, WorkoutTag } from '../types';
import { TaskCard } from './TaskCard';
import { PhotoModal } from './PhotoModal';
import { DietMealModal } from './DietMealModal';
import { readFileAsDataUrl } from '../utils/files';
import { isTaskDone } from '../utils/tasks';

function defaultTaskState(task: Task): TaskDayState {
  return {
    value: task.kind === 'check' || task.kind === 'tags' ? false : 0,
    note: '',
  };
}

export function EditDayModal({
  date,
  tasks,
  initialProgress,
  workoutTags,
  onAddWorkoutTag,
  onSave,
  onClose,
}: {
  date: Date;
  tasks: Task[];
  initialProgress: DailyProgress;
  workoutTags: WorkoutTag[];
  onAddWorkoutTag: (tag: Omit<WorkoutTag, 'id'>) => void;
  onSave: (progress: DailyProgress) => void;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState<DailyProgress>(() => {
    const copy: DailyProgress = {};
    for (const task of tasks) {
      copy[task.id] = initialProgress[task.id]
        ? { ...initialProgress[task.id] }
        : defaultTaskState(task);
    }
    return copy;
  });
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [dietModalOpen, setDietModalOpen] = useState(false);

  const updateTask = (taskId: string, updates: Partial<TaskDayState>) => {
    setProgress((current) => {
      const task = tasks.find((t) => t.id === taskId);
      const existing = current[taskId] ?? (task ? defaultTaskState(task) : { value: false, note: '' });
      return { ...current, [taskId]: { ...existing, ...updates } };
    });
  };

  const isDone = (task: Task) => isTaskDone(task, progress[task.id]);

  const handleToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const current = progress[taskId] ?? defaultTaskState(task);
    if (task.kind === 'check') {
      updateTask(taskId, { value: !current.value });
    } else {
      const numeric = Number(current.value || 0);
      if (numeric >= (task.target ?? 0)) updateTask(taskId, { value: 0 });
      else updateTask(taskId, { value: numeric + 1 });
    }
  };

  const handleSetValue = (taskId: string, value: number) => {
    updateTask(taskId, { value });
  };

  const handleTagToggle = (taskId: string, tagId: string) => {
    const current = progress[taskId]?.selectedTags ?? [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    updateTask(taskId, { selectedTags: next, value: next.length > 0 });
  };

  const handlePhotoUpload = async (taskId: string, files: FileList) => {
    const newEntries = await Promise.all(Array.from(files).map(readFileAsDataUrl));
    const existing = progress[taskId]?.photos ?? [];
    const all = [...existing, ...newEntries];
    updateTask(taskId, { photos: all, value: all.length > 0 });
  };

  const handleOpenNote = (taskId: string) => {
    if (taskId === 'diet') {
      setDietModalOpen(true);
    } else {
      setNoteTaskId(taskId);
      setNoteText(progress[taskId]?.note ?? '');
    }
  };

  const handleSaveNote = () => {
    if (!noteTaskId) return;
    updateTask(noteTaskId, { note: noteText });
    setNoteTaskId(null);
  };

  const handleSave = () => {
    onSave(progress);
    onClose();
  };

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <div className="text-[20px] font-[800]">Edit day</div>
            <div className="mt-1 text-[13px] text-[#8C7F6D]">{dateLabel}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] font-[700]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto px-6">
          {tasks.map((task, index) => {
            const entry = progress[task.id] ?? defaultTaskState(task);
            return (
              <div key={task.id} className="rounded-[18px] bg-panel p-1.5">
                <TaskCard
                  task={task}
                  value={entry.value}
                  note={entry.note}
                  done={isDone(task)}
                  idx={index}
                  selectedTags={entry.selectedTags}
                  workoutTags={workoutTags}
                  onToggle={handleToggle}
                  onSetValue={handleSetValue}
                  onOpenNote={handleOpenNote}
                  onPhotoUpload={handlePhotoUpload}
                  onPhotoEdit={() => setPhotoModalOpen(true)}
                  photoCount={entry.photos?.length}
                  onTagToggle={handleTagToggle}
                  onAddWorkoutTag={onAddWorkoutTag}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[18px] border border-[rgba(63,51,38,0.10)] px-4 py-3 text-[13px] font-[700]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-[18px] bg-lime px-4 py-3 text-[13px] font-[700] text-ink"
          >
            Save day
          </button>
        </div>
      </div>

      {photoModalOpen && (
        <PhotoModal
          photos={progress['photo']?.photos ?? []}
          onAddFiles={(files) => handlePhotoUpload('photo', files)}
          onDelete={(id) =>
            updateTask('photo', {
              photos: (progress['photo']?.photos ?? []).filter((p) => p.id !== id),
            })
          }
          onClose={() => setPhotoModalOpen(false)}
        />
      )}

      {dietModalOpen && (
        <DietMealModal
          initialMeals={progress['diet']?.meals}
          onSave={(meals) => updateTask('diet', { meals })}
          onClose={() => setDietModalOpen(false)}
        />
      )}

      {noteTaskId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
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
