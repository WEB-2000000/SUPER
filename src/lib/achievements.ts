import {
  Award,
  Trophy,
  BrainCircuit,
  Bike,
  Briefcase,
  Star,
  Zap,
  Flame,
  Sunrise,
  Crown,
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
    id: 'early_bird',
    name: 'الطائر المبكر',
    description: 'أكمل مهمة قبل الساعة 8 صباحًا.',
    xp: 25,
    icon: Sunrise,
    isUnlocked: () => {
        const now = new Date();
        return now.getHours() < 8;
    },
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
    id: 'level_10',
    name: 'محترف',
    description: 'الوصول إلى المستوى 10.',
    xp: 200,
    icon: Crown,
    isUnlocked: (progress) => progress.level >= 10,
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
    id: 'hot_streak',
    name: 'سلسلة انتصارات',
    description: 'أكمل مهمة كل يوم لمدة 3 أيام متتالية.',
    xp: 75,
    icon: Flame,
    isUnlocked: (_, completedTasksLog) => {
        const today = new Date();
        const dates = new Set(completedTasksLog.map(log => log.date));
        for (let i = 0; i < 3; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            if (!dates.has(d.toISOString().split('T')[0])) {
                return false;
            }
        }
        return true;
    },
  },
];
