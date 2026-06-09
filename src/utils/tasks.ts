import type { Task, TaskDayState } from '../types';

export function isTaskDone(task: Task, entry: TaskDayState | undefined): boolean {
  if (!entry) return false;
  if (task.kind === 'check') return Boolean(entry.value);
  if (task.kind === 'tags') return Boolean(entry.selectedTags && entry.selectedTags.length > 0);
  if (task.kind === 'number') {
    const v = Number(entry.value);
    return task.target != null ? v >= task.target : v > 0;
  }
  return Number(entry.value) >= (task.target ?? 0);
}
