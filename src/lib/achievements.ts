import {
  Award,
  Trophy,
  BrainCircuit,
  Bike,
  Briefcase,
  Star,
  Zap,
} from 'lucide-react';
import type { Achievement, CompletedTaskLog, UserProgress } from './types';

export const achievements: Achievement[] = [
  {
    id: 'first_step',
    name: 'الخطوة الأولى',
    description: 'أكمل مهمتك الأولى!',
    xp: 20,
    icon: Award,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 1,
  },
  {
    id: 'level_2',
    name: 'ارتقاء!',
    description: 'الوصول إلى المستوى 2.',
    xp: 50,
    icon: Trophy,
    isUnlocked: (progress) => progress.level >= 2,
  },
  {
    id: 'level_5',
    name: 'لا يمكن إيقافك',
    description: 'الوصول إلى المستوى 5.',
    xp: 100,
    icon: Zap,
    isUnlocked: (progress) => progress.level >= 5,
  },
  {
    id: 'work_novice',
    name: 'عامل مجتهد',
    description: 'أكمل 5 مهام عمل.',
    xp: 30,
    icon: Briefcase,
    isUnlocked: (progress) => (progress.categoryCounts['work'] || 0) >= 5,
  },
  {
    id: 'learning_adept',
    name: 'طالب علم',
    description: 'أكمل 5 مهام تعليمية.',
    xp: 30,
    icon: BrainCircuit,
    isUnlocked: (progress) => (progress.categoryCounts['learning'] || 0) >= 5,
  },
  {
    id: 'sport_enthusiast',
    name: 'رياضي نشيط',
    description: 'أكمل 5 مهام رياضية.',
    xp: 30,
    icon: Bike,
    isUnlocked: (progress) => (progress.categoryCounts['sport'] || 0) >= 5,
  },
  {
    id: 'perfect_day',
    name: 'يوم مثالي',
    description: 'أكمل جميع المهام في يوم واحد.',
    xp: 75,
    icon: Star,
    isUnlocked: (_, completedTasksLog) => {
      // This is a simplified check. A more robust implementation would need to know the total tasks for a given day.
      // We'll check if a user has completed more than 5 tasks in a single day as a proxy.
      const tasksPerDay: Record<string, number> = {};
      completedTasksLog.forEach(log => {
        tasksPerDay[log.date] = (tasksPerDay[log.date] || 0) + 1;
      });
      return Object.values(tasksPerDay).some(count => count >= 5);
    },
  },
];
