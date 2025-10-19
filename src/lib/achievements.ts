
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
  Moon,
  Shield,
  Sun,
  Coffee,
  User as UserIcon,
  BookOpen,
} from 'lucide-react';
import type { Achievement, CompletedTaskLog, UserProgress } from './types';

export const achievements: Achievement[] = [
  // Task Completion Milestones
  {
    id: 'first_step',
    name: 'الخطوة الأولى',
    description: 'أكمل مهمتك الأولى!',
    xp: 20,
    icon: Award,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 1,
  },
  {
    id: 'five_tasks',
    name: 'خمسة مهام',
    description: 'أكمل 5 مهام.',
    xp: 50,
    icon: Star,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 5,
  },
  {
    id: 'ten_tasks',
    name: 'عشرة مهام',
    description: 'أكمل 10 مهام.',
    xp: 100,
    icon: Trophy,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 10,
  },

  // Level Milestones
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
    id: 'level_20',
    name: 'أسطورة',
    description: 'الوصول إلى المستوى 20.',
    xp: 500,
    icon: Shield,
    isUnlocked: (progress) => progress.level >= 20,
  },

  // Streaks
  {
    id: 'hot_streak_3',
    name: 'سلسلة انتصارات (3 أيام)',
    description: 'أكمل مهمة كل يوم لمدة 3 أيام متتالية.',
    xp: 75,
    icon: Flame,
    isUnlocked: (_, completedTasksLog) => {
        if (completedTasksLog.length < 3) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const uniqueDates = [...new Set(completedTasksLog.map(log => {
            const date = new Date(log.date);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }))].sort((a, b) => b - a);

        if (uniqueDates.length < 3) return false;

        const firstDay = new Date(uniqueDates[0]);
        // Adjust for timezone differences by checking if it's "today" or "yesterday" relative to client
        const dayDiff = (today.getTime() - firstDay.getTime()) / (1000 * 3600 * 24);
        if (dayDiff > 1) return false; // Must have completed a task today or yesterday to count

        for (let i = 0; i < 2; i++) {
            const currentDay = new Date(uniqueDates[i]);
            const nextDay = new Date(uniqueDates[i+1]);
            const diff = (currentDay.getTime() - nextDay.getTime()) / (1000 * 3600 * 24);
            if (diff !== 1) {
                return false;
            }
        }
        return true;
    },
  },

  // Time-based
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
    id: 'night_owl',
    name: 'بومة الليل',
    description: 'أكمل مهمة بعد الساعة 10 مساءً.',
    xp: 25,
    icon: Moon,
    isUnlocked: () => {
        const now = new Date();
        return now.getHours() >= 22;
    },
  },

  // Category-specific
  // Work
  {
    id: 'work_novice',
    name: 'عامل مجتهد',
    description: 'أكمل 5 مهام عمل.',
    xp: 30,
    icon: Briefcase,
    isUnlocked: (progress) => (progress.categoryCounts['work'] || 0) >= 5,
  },
  {
    id: 'work_pro',
    name: 'خبير عمل',
    description: 'أكمل 25 مهمة عمل.',
    xp: 150,
    icon: Briefcase,
    isUnlocked: (progress) => (progress.categoryCounts['work'] || 0) >= 25,
  },
  
  // Learning
  {
    id: 'learning_adept',
    name: 'طالب علم',
    description: 'أكمل 5 مهام تعليمية.',
    xp: 30,
    icon: BrainCircuit,
    isUnlocked: (progress) => (progress.categoryCounts['learning'] || 0) >= 5,
  },
    {
    id: 'learning_master',
    name: 'باحث نهم',
    description: 'أكمل 25 مهمة تعليمية.',
    xp: 150,
    icon: BookOpen,
    isUnlocked: (progress) => (progress.categoryCounts['learning'] || 0) >= 25,
  },

  // Sport
  {
    id: 'sport_enthusiast',
    name: 'رياضي نشيط',
    description: 'أكمل 5 مهام رياضية.',
    xp: 30,
    icon: Bike,
    isUnlocked: (progress) => (progress.categoryCounts['sport'] || 0) >= 5,
  },
  {
    id: 'sport_champion',
    name: 'بطل رياضي',
    description: 'أكمل 25 مهمة رياضية.',
    xp: 150,
    icon: Bike,
    isUnlocked: (progress) => (progress.categoryCounts['sport'] || 0) >= 25,
  },
  
  // Personal
  {
    id: 'personal_growth',
    name: 'نمو شخصي',
    description: 'أكمل 5 مهام شخصية.',
    xp: 30,
    icon: UserIcon,
    isUnlocked: (progress) => (progress.categoryCounts['personal'] || 0) >= 5,
  },
  
  // Leisure
  {
    id: 'leisure_lover',
    name: 'وقت مستقطع',
    description: 'أكمل 5 مهام ترفيهية.',
    xp: 30,
    icon: Coffee,
    isUnlocked: (progress) => (progress.categoryCounts['leisure'] || 0) >= 5,
  },
  
  // Variety
  {
    id: 'well_rounded',
    name: 'شخص متوازن',
    description: 'أكمل مهمة واحدة على الأقل من 3 فئات مختلفة في يوم واحد.',
    xp: 100,
    icon: Sun,
    isUnlocked: (_, completedTasksLog) => {
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = completedTasksLog.filter(log => log.date === today);
        const categoriesToday = new Set(todayLogs.map(log => log.category));
        return categoriesToday.size >= 3;
    }
  }
];
