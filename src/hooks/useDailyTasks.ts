import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { DailyProgress, MealEntry, PhotoEntry, Task, TaskDayState, TaskHistory, WorkoutTag } from '../types';

function burstAt(el: HTMLElement | null) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  confetti({
    particleCount: 24,
    spread: 55,
    startVelocity: 30,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: ['#C6E89E', '#FFCBA8', '#3F3326'],
    scalar: 0.85,
    zIndex: 9999,
  });
}

function bigCelebration() {
  confetti({ particleCount: 80, spread: 70, startVelocity: 45, colors: ['#C6E89E', '#FFCBA8', '#FFFFFF', '#3F3326'], zIndex: 9999 });
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#C6E89E', '#FFCBA8', '#FFFFFF', '#3F3326'], zIndex: 9999 });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#C6E89E', '#FFCBA8', '#FFFFFF', '#3F3326'], zIndex: 9999 });
  }, 200);
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 120, startVelocity: 35, colors: ['#C6E89E', '#FFCBA8', '#FFFFFF', '#3F3326'], scalar: 1.2, zIndex: 9999 });
  }, 450);
}

const todayKey = (date: Date) => date.toISOString().slice(0, 10);

function defaultTaskState(task: Task): TaskDayState {
  return {
    value: task.kind === 'check' || task.kind === 'tags' ? false : 0,
    note: '',
  };
}

function ensureDayProgress(tasks: Task[], progress: DailyProgress = {}): DailyProgress {
  return tasks.reduce((acc, task) => {
    acc[task.id] = progress[task.id] ?? defaultTaskState(task);
    return acc;
  }, {} as DailyProgress);
}

type StoredState = {
  customTasks: Task[];
  history: TaskHistory;
  workoutTags: WorkoutTag[];
};

export function useDailyTasks(
  initialTasks: Task[],
  initialCustomTasks: Task[] = [],
  selectedDate: Date,
  userId = 'anonymous',
  initialWorkoutTags: WorkoutTag[] = [],
) {
  const photosKey = `streak-75hard-photos-${userId}`;

  const [state, setState] = useState<StoredState>({
    customTasks: initialCustomTasks,
    history: {},
    workoutTags: initialWorkoutTags,
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const hasLoadedRef = useRef(false);

  const tasks = useMemo(() => [...initialTasks, ...state.customTasks], [initialTasks, state.customTasks]);
  const dateKey = useMemo(() => todayKey(selectedDate), [selectedDate]);

  // Load from Firestore on mount, retrying on failure so a transient
  // read error never falls through to "no data" and gets saved over
  // the user's real data.
  useEffect(() => {
    let cancelled = false;
    let attempt = 0;

    async function load() {
      try {
        const snap = await getDoc(doc(db, 'users', userId, 'data', 'main'));
        if (cancelled) return;
        if (snap.exists()) {
          const data = snap.data();
          const history: TaskHistory = data.history ?? {};
          // Rehydrate photos from localStorage
          try {
            const raw = window.localStorage.getItem(photosKey);
            if (raw) {
              const photoMap = JSON.parse(raw) as Record<string, PhotoEntry[]>;
              for (const [date, photos] of Object.entries(photoMap)) {
                if (history[date]?.['photo']) {
                  history[date]['photo'] = { ...history[date]['photo'], photos, value: photos.length > 0 };
                }
              }
            }
          } catch { /* ignore */ }
          setState({
            customTasks: data.customTasks ?? initialCustomTasks,
            history,
            workoutTags: data.workoutTags ?? initialWorkoutTags,
          });
        }
        hasLoadedRef.current = true;
        setLoadError(false);
        setDataLoading(false);
      } catch {
        if (cancelled) return;
        attempt += 1;
        if (attempt <= 5) {
          setTimeout(load, Math.min(1000 * attempt, 5000));
        } else {
          // Give up, but keep saves disabled so we never overwrite
          // real data with the empty default state.
          setLoadError(true);
          setDataLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  // Save to Firestore on state change (debounced 500ms)
  useEffect(() => {
    if (dataLoading || !hasLoadedRef.current) return;
    const timer = setTimeout(() => {
      const leanHistory = Object.fromEntries(
        Object.entries(state.history).map(([date, day]) => [
          date,
          Object.fromEntries(Object.entries(day).map(([id, s]) => [id, { ...s, photos: undefined }])),
        ])
      );
      // Firestore rejects `undefined` field values, so strip them before saving
      const payload = JSON.parse(JSON.stringify({
        customTasks: state.customTasks,
        workoutTags: state.workoutTags,
        history: leanHistory,
      }));
      setDoc(doc(db, 'users', userId, 'data', 'main'), payload).catch(() => {});
      // Photos stay in localStorage
      try {
        const photoMap: Record<string, PhotoEntry[]> = {};
        for (const [date, day] of Object.entries(state.history)) {
          const photos = day['photo']?.photos;
          if (photos && photos.length > 0) photoMap[date] = photos;
        }
        window.localStorage.setItem(photosKey, JSON.stringify(photoMap));
      } catch { /* quota exceeded */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [state, dataLoading, userId]);

  const getDayProgress = (date: Date) => {
    const existing = state.history[todayKey(date)] || {};
    return ensureDayProgress(tasks, existing);
  };

  const progress = useMemo(() => getDayProgress(selectedDate), [selectedDate, state.history, tasks]);

  const coreTasks = useMemo(() => tasks.filter((task) => !task.custom), [tasks]);
  const customTasks = useMemo(() => tasks.filter((task) => task.custom), [tasks]);

  const isDone = (task: Task) => {
    const entry = progress[task.id] ?? defaultTaskState(task);
    if (task.kind === 'check') return Boolean(entry.value);
    if (task.kind === 'tags') return Boolean(entry.selectedTags && entry.selectedTags.length > 0);
    if (task.kind === 'number') {
      const v = Number(entry.value);
      return task.target != null ? v >= task.target : v > 0;
    }
    return Number(entry.value) >= (task.target ?? 0);
  };

  const doneCount = tasks.filter(isDone).length;
  const total = tasks.length;
  const coreDoneCount = coreTasks.filter(isDone).length;
  const customDoneCount = customTasks.filter(isDone).length;
  const coreTotal = coreTasks.length;
  const customTotal = customTasks.length;
  const allDone = doneCount === total;

  useEffect(() => {
    if (allDone && total > 0) {
      bigCelebration();
    }
  }, [allDone, total]);

  const toggleTask = (taskId: string, el: HTMLElement | null) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;

      const currentState = progressForDay[taskId] || defaultTaskState(task);
      const nextState = { ...currentState };
      let becameDone = false;

      if (task.kind === 'check') {
        nextState.value = !Boolean(currentState.value);
        becameDone = Boolean(nextState.value);
      } else {
        const numeric = Number(currentState.value || 0);
        if (numeric >= (task.target ?? 0)) {
          nextState.value = 0;
        } else {
          nextState.value = numeric + 1;
          becameDone = nextState.value >= (task.target ?? 0);
        }
      }

      progressForDay[taskId] = nextState;
      if (becameDone) burstAt(el);

      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const setTaskNote = (taskId: string, note: string) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      progressForDay[taskId] = { ...taskState, note };
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const setTaskValue = (taskId: string, value: number | boolean) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      const nextState = { ...taskState, value };
      const becameDone = task.kind === 'check'
        ? Boolean(nextState.value)
        : Number(nextState.value) >= (task.target ?? 0);
      if (becameDone) burstAt(null);
      progressForDay[taskId] = nextState;
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const setTaskTags = (taskId: string, tags: string[]) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      const wasDone = Boolean(taskState.selectedTags && taskState.selectedTags.length > 0);
      const nowDone = tags.length > 0;
      progressForDay[taskId] = { ...taskState, selectedTags: tags, value: nowDone };
      if (!wasDone && nowDone) burstAt(null);
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const setTaskPhotos = (taskId: string, photos: PhotoEntry[]) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      progressForDay[taskId] = { ...taskState, photos, value: photos.length > 0 };
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const addTaskPhotos = (taskId: string, newPhotos: PhotoEntry[]) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      const allPhotos = [...(taskState.photos ?? []), ...newPhotos];
      progressForDay[taskId] = { ...taskState, photos: allPhotos, value: allPhotos.length > 0 };
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const setTaskMeals = (taskId: string, meals: MealEntry[]) => {
    setState((current) => {
      const currentTasks = [...initialTasks, ...current.customTasks];
      const existing = current.history[dateKey] || {};
      const progressForDay = ensureDayProgress(currentTasks, existing);
      const task = currentTasks.find((item) => item.id === taskId);
      if (!task) return current;
      const taskState = progressForDay[taskId] || defaultTaskState(task);
      progressForDay[taskId] = { ...taskState, meals };
      return { ...current, history: { ...current.history, [dateKey]: progressForDay } };
    });
  };

  const addCustomTask = (task: Omit<Task, 'id' | 'custom'>) => {
    const nextTask: Task = { ...task, id: `custom-${Date.now()}`, custom: true };
    setState((current) => ({ ...current, customTasks: [...current.customTasks, nextTask] }));
  };

  const removeCustomTask = (taskId: string) => {
    setState((current) => ({
      ...current,
      customTasks: current.customTasks.filter((t) => t.id !== taskId),
    }));
  };

  const updateCustomTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'custom'>>) => {
    setState((current) => ({
      ...current,
      customTasks: current.customTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  const addWorkoutTag = (tag: Omit<WorkoutTag, 'id'>) => {
    const newTag: WorkoutTag = { ...tag, id: `tag-${Date.now()}` };
    setState((current) => ({ ...current, workoutTags: [...current.workoutTags, newTag] }));
  };

  const removeWorkoutTag = (tagId: string) => {
    setState((current) => ({
      ...current,
      workoutTags: current.workoutTags.filter((t) => t.id !== tagId),
    }));
  };

  const setDayProgress = (date: Date, dayProgress: DailyProgress) => {
    const key = todayKey(date);
    setState((current) => ({ ...current, history: { ...current.history, [key]: dayProgress } }));
  };

  return {
    tasks,
    coreTasks,
    customTasks,
    progress,
    history: state.history,
    workoutTags: state.workoutTags,
    doneCount,
    total,
    coreDoneCount,
    customDoneCount,
    coreTotal,
    customTotal,
    allDone,
    isDone,
    toggleTask,
    setTaskValue,
    setTaskNote,
    setTaskTags,
    addCustomTask,
    removeCustomTask,
    updateCustomTask,
    setTaskMeals,
    setTaskPhotos,
    addTaskPhotos,
    addWorkoutTag,
    removeWorkoutTag,
    getDayProgress,
    setDayProgress,
    dataLoading,
    loadError,
  };
}
