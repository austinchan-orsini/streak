export type TaskKind = 'check' | 'counter' | 'timer' | 'number' | 'tags';

export interface WorkoutTag {
  id: string;
  label: string;
  color: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarDataUrl?: string;
  startDate: string; // YYYY-MM-DD
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  startDate: string;
  avatarDataUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  sub: string;
  kind: TaskKind;
  target?: number;
  unit?: string;
  custom?: boolean;
  freq?: string;
}

export interface MealEntry {
  id: string;
  name: string;
  what: string;
}

export interface PhotoEntry {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export interface TaskDayState {
  value: number | boolean;
  note: string;
  meals?: MealEntry[];
  photos?: PhotoEntry[];
  selectedTags?: string[];
}

export type DailyProgress = Record<string, TaskDayState>;
export type TaskHistory = Record<string, DailyProgress>;
