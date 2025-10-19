'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, UserState, RoutineTask, Task, CompletedTaskLog } from '@/lib/types';
import { getXPForNextLevel, XP_PER_TASK } from '@/lib/constants';
import { achievements } from '@/lib/achievements';
import { getDailyMotivationAction, generateRoutineAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const initialProgress = {
  xp: 0,
  level: 1,
  totalTasksCompleted: 0,
  categoryCounts: {},
};

const getInitialState = (): UserState => ({
  user: null,
  routine: [],
  progress: initialProgress,
  unlockedAchievements: [],
  lastMotivationDate: null,
  dailyMotivation: null,
  completedTasksLog: [],
  lastRoutineResetDate: null,
});

export function useUserState() {
  const [state, setState] = useState<UserState>(getInitialState());
  const [loading, setLoading] = useState(true);
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const { toast } = useToast();
  const [toastsToShow, setToastsToShow] = useState<any[]>([]);

  useEffect(() => {
    if (toastsToShow.length > 0) {
      toastsToShow.forEach(t => toast(t));
      setToastsToShow([]);
    }
  }, [toastsToShow, toast]);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem('supercharge_state');
      if (storedState) {
        const parsedState = JSON.parse(storedState) as UserState;
        
        // Data migration/validation could happen here
        if (!parsedState.progress) parsedState.progress = initialProgress;
        if (!parsedState.completedTasksLog) parsedState.completedTasksLog = [];
        if (!parsedState.lastRoutineResetDate) parsedState.lastRoutineResetDate = null;
        
        setState(parsedState);

        const today = new Date().toISOString().split('T')[0];
        // Fetch daily motivation if it's a new day
        if (parsedState.user && parsedState.lastMotivationDate !== today) {
          fetchDailyMotivation(parsedState.user, today);
        }
        // Reset routine if it's a new day
        if (parsedState.lastRoutineResetDate !== today) {
            resetRoutine(today);
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
      localStorage.removeItem('supercharge_state');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateState = (updater: (prevState: UserState) => UserState) => {
    setState(prevState => {
      const newState = updater(prevState);
      localStorage.setItem('supercharge_state', JSON.stringify(newState));
      return newState;
    });
  };

  const fetchDailyMotivation = async (user: User, today: string) => {
    try {
      const result = await getDailyMotivationAction({
        userName: user.name,
        userAge: user.age,
        userGoal: user.goal,
      });
      updateState(s => ({
        ...s,
        dailyMotivation: result.motivationalMessage,
        lastMotivationDate: today,
      }));
    } catch (error) {
      console.error('Failed to fetch daily motivation', error);
    }
  };

  const setUser = (user: User) => {
    const today = new Date().toISOString().split('T')[0];
    updateState(s => ({ ...getInitialState(), user, lastRoutineResetDate: today }));
    fetchDailyMotivation(user, today);
  };
  
  const resetRoutine = (today: string) => {
    updateState(s => ({
        ...s,
        routine: s.routine.map(task => ({ ...task, completed: false, completedDate: undefined })),
        lastRoutineResetDate: today
    }));
  };

  const generateRoutine = async () => {
    if (!state.user) return;
    setIsGeneratingRoutine(true);
    try {
      const result = await generateRoutineAction({
        name: state.user.name,
        age: state.user.age,
        goal: state.user.goal,
      });
      const newRoutine = result.routine.map((task: Task) => ({
        ...task,
        id: uuidv4(),
        completed: false,
      }));
      updateState(s => ({ ...s, routine: newRoutine }));
      setToastsToShow(toasts => [...toasts, {
        title: "تم إنشاء خطتك!",
        description: "تم إنشاء خطتك اليومية الجديدة بنجاح.",
      }]);
    } catch (error) {
      console.error('Failed to generate routine', error);
      setToastsToShow(toasts => [...toasts, {
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء خطتك. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      }]);
    } finally {
      setIsGeneratingRoutine(false);
    }
  };

  const completeTask = (taskId: string) => {
    let completedTask: RoutineTask | undefined;
    const newToasts: any[] = [];

    updateState(s => {
      const newRoutine = s.routine.map(task => {
        if (task.id === taskId && !task.completed) {
          completedTask = { ...task, completed: true, completedDate: new Date().toISOString().split('T')[0] };
          return completedTask;
        }
        return task;
      });

      if (!completedTask) return s;

      const today = new Date().toISOString().split('T')[0];
      const newCompletedTasksLog: CompletedTaskLog[] = [...s.completedTasksLog, { taskId, date: today, category: completedTask.category }];
      const newCategoryCounts = { ...s.progress.categoryCounts, [completedTask.category]: (s.progress.categoryCounts[completedTask.category] || 0) + 1 };
      
      let newXp = s.progress.xp + XP_PER_TASK;
      let newLevel = s.progress.level;
      let xpForNextLevel = getXPForNextLevel(newLevel);
      
      let leveledUp = false;
      while (newXp >= xpForNextLevel) {
        newXp -= xpForNextLevel;
        newLevel++;
        leveledUp = true;
        xpForNextLevel = getXPForNextLevel(newLevel);
      }

      if (leveledUp) {
        newToasts.push({
            title: `🎉 وصلت إلى المستوى ${newLevel}!`,
            description: `رائع! استمر في التقدم.`,
        });
      } else {
        newToasts.push({
            title: `+${XP_PER_TASK} XP!`,
            description: `"${completedTask.task}" مكتمل. عمل رائع!`,
        });
      }

      const newProgress = {
        xp: newXp,
        level: newLevel,
        totalTasksCompleted: s.progress.totalTasksCompleted + 1,
        categoryCounts: newCategoryCounts,
      };

      // Check for new achievements
      const newlyUnlocked: string[] = [];
      let achievementXp = 0;
      achievements.forEach(ach => {
        if (!s.unlockedAchievements.includes(ach.id) && ach.isUnlocked(newProgress, newCompletedTasksLog)) {
          newlyUnlocked.push(ach.id);
          achievementXp += ach.xp;
          newToasts.push({
            title: `🏆 تم فتح إنجاز!`,
            description: `${ach.name} (+${ach.xp} XP)`,
          });
        }
      });
      
      newProgress.xp += achievementXp;
      // Re-check for level up after achievement XP
      xpForNextLevel = getXPForNextLevel(newProgress.level);
      while (newProgress.xp >= xpForNextLevel) {
          newProgress.xp -= xpForNextLevel;
          newProgress.level++;
          newToasts.push({
              title: `🎉 وصلت إلى المستوى ${newProgress.level}!`,
              description: `مكافأة الإنجاز دفعتك للأعلى!`,
          });
          xpForNextLevel = getXPForNextLevel(newProgress.level);
      }
      
      if (newToasts.length > 0) {
        setToastsToShow(currentToasts => [...currentToasts, ...newToasts]);
      }
      
      return {
        ...s,
        routine: newRoutine,
        progress: newProgress,
        unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked],
        completedTasksLog: newCompletedTasksLog,
      };
    });
  };

  const resetState = () => {
    localStorage.removeItem('supercharge_state');
    setState(getInitialState());
    setToastsToShow(toasts => [...toasts, {
        title: "تم البدء من جديد!",
        description: "تمت إعادة ضبط تقدمك. رحلة جديدة تبدأ الآن!",
    }]);
  };

  // Need to add this to fix uuid not being available on server.
  useEffect(() => {
    if (!loading && state.routine.some(task => !task.id)) {
        updateState(s => ({
            ...s,
            routine: s.routine.map(task => ({ ...task, id: task.id || uuidv4() }))
        }));
    }
  }, [loading, state.routine]);


  return {
    state,
    loading,
    setUser,
    generateRoutine,
    completeTask,
    isGeneratingRoutine,
    resetState,
  };
}
