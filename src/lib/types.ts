import type { UserProgress, CompletedTaskLog } from './types';

export interface User {
  name: string;
  age: number;
  goal: string;
}

export interface Task {
  task: string;
  description: string;
  category: string;
  suggestedTime: string;
}

export interface RoutineTask extends Task {
  id: string;
  completed: boolean;
  completedDate?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: (progress: UserProgress, completedTasksLog: CompletedTaskLog[]) => boolean;
}

export interface UserState {
  user: User | null;
  routine: RoutineTask[];
  progress: UserProgress;
  unlockedAchievements: string[];
  lastMotivationDate: string | null;
  dailyMotivation: string | null;
  completedTasksLog: CompletedTaskLog[];
  lastRoutineResetDate: string | null;
}

export interface UserProgress {
  xp: number;
  level: number;
  totalTasksCompleted: number;
  categoryCounts: Record<string, number>;
}

export interface CompletedTaskLog {
  taskId: string;
  date: string; // YYYY-MM-DD
  category: string;
}
