
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
  CalendarDays,
  Target,
  Gem,
  Medal,
  Activity,
  Dumbbell,
  NotebookText,
  PartyPopper,
  Sandwich,
  Layers3,
  Rocket
} from 'lucide-react';
import type { Achievement, CompletedTaskLog, UserProgress } from './types';

function hasConsecutiveDays(logs: CompletedTaskLog[], days: number): boolean {
    if (logs.length < days) return false;

    const uniqueDates = [...new Set(logs.map(log => {
        const date = new Date(log.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }))].sort((a, b) => b - a);

    if (uniqueDates.length < days) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDay = new Date(uniqueDates[0]);
    const dayDiff = (today.getTime() - firstDay.getTime()) / (1000 * 3600 * 24);

    if (dayDiff > 1) return false;

    for (let i = 0; i < days - 1; i++) {
        const currentDay = new Date(uniqueDates[i]);
        const nextDay = new Date(uniqueDates[i+1]);
        const diff = (currentDay.getTime() - nextDay.getTime()) / (1000 * 3600 * 24);
        if (diff !== 1) {
            return false;
        }
    }
    return true;
}


export const achievements: Achievement[] = [
  // Task Completion Milestones
  {
    id: 'first_step',
    name: 'الخطوة الأولى',
    description: 'أكمل مهمتك الأولى!',
    xp: 20,
    tier: 'bronze',
    icon: Award,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 1,
  },
  {
    id: 'five_tasks',
    name: 'خمسة مهام',
    description: 'أكمل 5 مهام.',
    xp: 50,
    tier: 'bronze',
    icon: Star,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 5,
  },
  {
    id: 'ten_tasks',
    name: 'عشرة مهام',
    description: 'أكمل 10 مهام.',
    xp: 100,
    tier: 'silver',
    icon: Trophy,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 10,
  },
  {
    id: 'unstoppable',
    name: 'لا يمكن إيقافه',
    description: 'أكمل 25 مهمة.',
    xp: 150,
    tier: 'silver',
    icon: Rocket,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 25,
  },
  {
    id: 'goal_getter',
    name: 'محقق الأهداف',
    description: 'أكمل 50 مهمة.',
    xp: 200,
    tier: 'gold',
    icon: Target,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 50,
  },
  {
    id: 'centurion',
    name: 'المئوي',
    description: 'أكمل 100 مهمة.',
    xp: 500,
    tier: 'gold',
    icon: Shield,
    isUnlocked: (progress) => progress.totalTasksCompleted >= 100,
  },

  // Level Milestones
  {
    id: 'level_5',
    name: 'لا يمكن إيقافك',
    description: 'الوصول إلى المستوى 5.',
    xp: 100,
    tier: 'bronze',
    icon: Zap,
    isUnlocked: (progress) => progress.level >= 5,
  },
  {
    id: 'level_10',
    name: 'محترف',
    description: 'الوصول إلى المستوى 10.',
    xp: 200,
    tier: 'silver',
    icon: Crown,
    isUnlocked: (progress) => progress.level >= 10,
  },
    {
    id: 'level_15',
    name: 'خبير',
    description: 'الوصول إلى المستوى 15.',
    xp: 300,
    tier: 'gold',
    icon: Medal,
    isUnlocked: (progress) => progress.level >= 15,
  },
  {
    id: 'level_20',
    name: 'أسطورة',
    description: 'الوصول إلى المستوى 20.',
    xp: 500,
    tier: 'platinum',
    icon: Gem,
    isUnlocked: (progress) => progress.level >= 20,
  },

  // Streaks
  {
    id: 'hot_streak_3',
    name: 'سلسلة انتصارات (3 أيام)',
    description: 'أكمل مهمة كل يوم لمدة 3 أيام متتالية.',
    xp: 75,
    tier: 'silver',
    icon: Flame,
    isUnlocked: (_, logs) => hasConsecutiveDays(logs, 3),
  },
  {
    id: 'week_streak',
    name: 'محارب الأسبوع',
    description: 'أكمل مهمة كل يوم لمدة 7 أيام متتالية.',
    xp: 200,
    tier: 'gold',
    icon: CalendarDays,
    isUnlocked: (_, logs) => hasConsecutiveDays(logs, 7),
  },

  // Time-based
  {
    id: 'early_bird',
    name: 'الطائر المبكر',
    description: 'أكمل مهمة قبل الساعة 8 صباحًا.',
    xp: 25,
    tier: 'bronze',
    icon: Sunrise,
    isUnlocked: (_, logs) => {
        const now = new Date();
        const latestLog = logs[logs.length-1];
        if (!latestLog) return false;
        return new Date(latestLog.date).getDate() === now.getDate() && now.getHours() < 8;
    },
  },
  {
    id: 'lunch_break_hero',
    name: 'بطل استراحة الغداء',
    description: 'أكمل مهمة بين 12 مساءً و 2 مساءً.',
    xp: 25,
    tier: 'bronze',
    icon: Sandwich,
    isUnlocked: (_, logs) => {
        const now = new Date();
        const latestLog = logs[logs.length-1];
        if (!latestLog) return false;
        return new Date(latestLog.date).getDate() === now.getDate() && now.getHours() >= 12 && now.getHours() < 14;
    },
  },
  {
    id: 'night_owl',
    name: 'بومة الليل',
    description: 'أكمل مهمة بعد الساعة 10 مساءً.',
    xp: 25,
    tier: 'bronze',
    icon: Moon,
    isUnlocked: (_, logs) => {
        const now = new Date();
        const latestLog = logs[logs.length-1];
        if (!latestLog) return false;
        return new Date(latestLog.date).getDate() === now.getDate() && now.getHours() >= 22;
    },
  },

  // Category-specific
  {
    id: 'work_novice',
    name: 'عامل مجتهد',
    description: 'أكمل 5 مهام عمل.',
    xp: 30,
    tier: 'bronze',
    icon: Briefcase,
    isUnlocked: (progress) => (progress.categoryCounts['work'] || 0) >= 5,
  },
  {
    id: 'work_pro',
    name: 'خبير عمل',
    description: 'أكمل 15 مهمة عمل.',
    xp: 150,
    tier: 'silver',
    icon: NotebookText,
    isUnlocked: (progress) => (progress.categoryCounts['work'] || 0) >= 15,
  },
  {
    id: 'learning_adept',
    name: 'طالب علم',
    description: 'أكمل 5 مهام تعليمية.',
    xp: 30,
    tier: 'bronze',
    icon: BrainCircuit,
    isUnlocked: (progress) => (progress.categoryCounts['learning'] || 0) >= 5,
  },
  {
    id: 'learning_master',
    name: 'باحث نهم',
    description: 'أكمل 15 مهمة تعليمية.',
    xp: 150,
    tier: 'silver',
    icon: BookOpen,
    isUnlocked: (progress) => (progress.categoryCounts['learning'] || 0) >= 15,
  },
  {
    id: 'sport_enthusiast',
    name: 'رياضي نشيط',
    description: 'أكمل 5 مهام رياضية.',
    xp: 30,
    tier: 'bronze',
    icon: Bike,
    isUnlocked: (progress) => (progress.categoryCounts['sport'] || 0) >= 5,
  },
  {
    id: 'sport_champion',
    name: 'بطل رياضي',
    description: 'أكمل 15 مهمة رياضية.',
    xp: 150,
    tier: 'silver',
    icon: Dumbbell,
    isUnlocked: (progress) => (progress.categoryCounts['sport'] || 0) >= 15,
  },
  {
    id: 'personal_growth',
    name: 'نمو شخصي',
    description: 'أكمل 5 مهام شخصية.',
    xp: 30,
    tier: 'bronze',
    icon: UserIcon,
    isUnlocked: (progress) => (progress.categoryCounts['personal'] || 0) >= 5,
  },
   {
    id: 'self_improver',
    name: 'محسن الذات',
    description: 'أكمل 15 مهمة شخصية.',
    xp: 150,
    tier: 'silver',
    icon: Activity,
    isUnlocked: (progress) => (progress.categoryCounts['personal'] || 0) >= 15,
  },
  {
    id: 'leisure_lover',
    name: 'وقت مستقطع',
    description: 'أكمل 5 مهام ترفيهية.',
    xp: 30,
    tier: 'bronze',
    icon: Coffee,
    isUnlocked: (progress) => (progress.categoryCounts['leisure'] || 0) >= 5,
  },
   {
    id: 'relaxation_expert',
    name: 'خبير الاسترخاء',
    description: 'أكمل 15 مهمة ترفيهية.',
    xp: 150,
    tier: 'silver',
    icon: PartyPopper,
    isUnlocked: (progress) => (progress.categoryCounts['leisure'] || 0) >= 15,
  },
  
  // Variety
  {
    id: 'jack_of_all_trades',
    name: 'متعدد المواهب',
    description: 'أكمل مهمة واحدة على الأقل من 3 فئات مختلفة.',
    xp: 50,
    tier: 'silver',
    icon: Layers3,
    isUnlocked: (progress) => Object.keys(progress.categoryCounts).length >= 3,
  },
  {
    id: 'master_of_all',
    name: 'سيد الجميع',
    description: 'أكمل مهمة واحدة على الأقل من كل الفئات الخمس.',
    xp: 150,
    tier: 'gold',
    icon: Layers3,
    isUnlocked: (progress) => Object.keys(progress.categoryCounts).length >= 5,
  },
  {
    id: 'perfect_day',
    name: 'يوم مثالي',
    description: 'أكمل جميع مهامك في يوم واحد.',
    xp: 100,
    tier: 'silver',
    icon: Sun,
    isUnlocked: (progress, logs, routine) => {
        if (!routine || routine.length === 0) return false;
        const today = new Date().toISOString().split('T')[0];
        const todaysCompletedTasks = new Set(logs.filter(l => l.date === today).map(l => l.taskId));
        return routine.every(task => todaysCompletedTasks.has(task.id));
    }
  },
  {
    id: 'first_routine',
    name: 'بداية جديدة',
    description: 'أنشئ خطتك الأولى.',
    xp: 10,
    tier: 'bronze',
    icon: NotebookText,
    isUnlocked: (progress, logs, routine) => (routine?.length ?? 0) > 0,
  },
  {
    id: 'weekend_warrior',
    name: 'محارب نهاية الأسبوع',
    description: 'أكمل مهمة في يوم سبت أو أحد.',
    xp: 25,
    tier: 'bronze',
    icon: CalendarDays,
    isUnlocked: (_, logs) => {
        const latestLog = logs[logs.length-1];
        if (!latestLog) return false;
        const day = new Date(latestLog.date).getUTCDay(); // Sunday = 0, Saturday = 6
        return day === 0 || day === 6;
    },
  },
];

    