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
  setTaskMeals: (taskId: string, meals: MealEntry[]) => void;
  setTaskPhotos: (taskId: string, photos: PhotoEntry[]) => void;
  handlePhotoUpload: (taskId: string, files: FileList) => void;
  workoutTags: WorkoutTag[];
  setTaskTags: (taskId: string, tags: string[]) => void;
  addWorkoutTag: (tag: Omit<WorkoutTag, 'id'>) => void;
}) {
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

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <div className="flex items-center gap-3">
          <div className="text-[22px] font-[800] tracking-[-0.5px]">
            {doneCount === total && total > 0 ? 'all done. incredible.' : 'daily progress'}
          </div>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hair">
            <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${pct * 100}%` }} />
          </div>
          <span className="text-[12px] font-[700] text-[#8C7F6D]">{doneCount}/{total}</span>
        </div>
      </div>

      <section className="panel-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(63,51,38,0.10)] pb-2">
          <div className="text-[16px] font-[800] tracking-[-0.4px]">today's checklist</div>
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
        <div className={`mt-3 ${filter === 'all' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
          {showCore && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[15px] font-[800]">Core tasks</div>
                <div className="text-[12px] font-[700] text-[#8C7F6D]">{coreDoneCount}/{coreTotal} done</div>
              </div>
              <div className="space-y-1">
                {coreTasks.map((task, index) => (
                  <div key={task.id} className="rounded-[18px] bg-panel p-1.5">
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
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[15px] font-[800]">Your tasks</div>
                <div className="text-[12px] font-[700] text-[#8C7F6D]">{customDoneCount}/{customTotal} done</div>
              </div>
              <div className="space-y-1">
                {customTasks.map((task, index) => (
                  <div key={task.id} className="rounded-[18px] bg-panel p-1.5">
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
