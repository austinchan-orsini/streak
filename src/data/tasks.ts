import type { Task, WorkoutTag } from '../types';

export const DEFAULT_WORKOUT_TAGS: WorkoutTag[] = [
  { id: 'run',      label: 'Run',      color: '#C6E89E' },
  { id: 'walk',     label: 'Walk',     color: '#FFCBA8' },
  { id: 'gym',      label: 'Gym',      color: '#BACEF1' },
  { id: 'yoga',     label: 'Yoga',     color: '#F4C7D2' },
  { id: 'cycling',  label: 'Cycling',  color: '#F9E4B7' },
  { id: 'swim',     label: 'Swim',     color: '#B5E8E0' },
  { id: 'climb',    label: 'Climb',    color: '#D4C5F9' },
  { id: 'hiit',     label: 'HIIT',     color: '#FFD6A5' },
  { id: 'hike',     label: 'Hike',     color: '#C9EDD6' },
];

export const CORE_TASKS: Task[] = [
  { id: 'workout1', title: 'Workout 1 — 45 min', sub: 'Indoor', kind: 'tags' },
  { id: 'workout2', title: 'Workout 2 — 45 min', sub: 'Outdoor (required)', kind: 'tags' },
  { id: 'water', title: 'Drink a gallon of water', sub: '128 oz / 8 cups', kind: 'check' },
  { id: 'read', title: 'Read 10 pages', sub: 'Non-fiction', kind: 'check' },
  { id: 'diet', title: 'Stick to your diet', sub: 'No cheat meals · No alcohol', kind: 'check' },
  { id: 'photo', title: 'Progress photo', sub: 'One per day', kind: 'check' },
];

