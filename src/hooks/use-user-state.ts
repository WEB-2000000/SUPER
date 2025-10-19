
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

  useEffect(() => {
    setLoading(true);
    try {
      const storedState = localStorage.getItem('supercharge_state');
      if (storedState) {
        const parsedState = JSON.parse(storedState) as UserState;
        
        // Data migration/validation
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
            resetRoutine(parsedState, today);
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
      localStorage.removeItem('supercharge_state');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('supercharge_state', JSON.stringify(state));
    }
  }, [state, loading]);


  const fetchDailyMotivation = async (user: User, today: string) => {
    try {
      const result = await getDailyMotivationAction({
        userName: user.name,
        userAge: user.age,
        userGoal: user.goal,
      });
      setState(s => ({
        ...s,
        dailyMotivation: result.motivationalMessage,
        lastMotivationDate: today,
      }));
    } catch (error) {
      console.error('Failed to fetch daily motivation', error);
    }
  };

  const setUser = useCallback((user: User) => {
    const today = new Date().toISOString().split('T')[0];
    setState(s => {
      const newState = { ...getInitialState(), user, lastRoutineResetDate: today };
      if (!s.dailyMotivation || s.lastMotivationDate !== today) {
          fetchDailyMotivation(user, today);
      } else {
        newState.dailyMotivation = s.dailyMotivation;
        newState.lastMotivationDate = s.lastMotivationDate;
      }
      return newState;
    });
  }, []);
  
  const resetRoutine = (currentState: UserState, today: string) => {
    setState({
        ...currentState,
        routine: currentState.routine.map(task => ({ ...task, completed: false, completedDate: undefined })),
        lastRoutineResetDate: today
    });
  };

  const generateRoutine = useCallback(async () => {
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
      setState(s => ({ ...s, routine: newRoutine }));
      toast({
        title: "تم إنشاء خطتك!",
        description: "تم إنشاء خطتك اليومية الجديدة بنجاح.",
      });
      checkAchievements({ ...state, routine: newRoutine });
    } catch (error) {
      console.error('Failed to generate routine', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء خطتك. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingRoutine(false);
    }
  }, [state.user, toast, state]);

  const checkAchievements = useCallback((newState: UserState) => {
    const newToasts: any[] = [];
    let achievementXp = 0;

    const newlyUnlocked = achievements.filter(ach => 
      !newState.unlockedAchievements.includes(ach.id) && 
      ach.isUnlocked(newState.progress, newState.completedTasksLog, newState.routine)
    ).map(ach => {
      achievementXp += ach.xp;
      newToasts.push({
        title: `🏆 تم فتح إنجاز!`,
        description: `${ach.name} (+${ach.xp} XP)`,
      });
      return ach.id;
    });

    if (newlyUnlocked.length > 0) {
      let newXp = newState.progress.xp + achievementXp;
      let newLevel = newState.progress.level;
      let xpForNextLevel = getXPForNextLevel(newLevel);
      
      while (newXp >= xpForNextLevel) {
          newXp -= xpForNextLevel;
          newLevel++;
          newToasts.push({
              title: `🎉 وصلت إلى المستوى ${newLevel}!`,
              description: `مكافأة الإنجاز دفعتك للأعلى!`,
          });
          xpForNextLevel = getXPForNextLevel(newLevel);
      }

      setState(s => ({
        ...s,
        unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked],
        progress: {
          ...s.progress,
          xp: newXp,
          level: newLevel,
        }
      }));

      newToasts.forEach(t => toast(t));
    }

  }, [toast]);

  const completeTask = useCallback((taskId: string) => {
    let completedTask: RoutineTask | undefined;
    let leveledUp = false;

    setState(s => {
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
      
      while (newXp >= xpForNextLevel) {
        newXp -= xpForNextLevel;
        newLevel++;
        leveledUp = true;
        xpForNextLevel = getXPForNextLevel(newLevel);
      }

      if (leveledUp) {
        toast({
            title: `🎉 وصلت إلى المستوى ${newLevel}!`,
            description: `رائع! استمر في التقدم.`,
        });
      } else {
        toast({
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

      const newState = {
        ...s,
        routine: newRoutine,
        progress: newProgress,
        completedTasksLog: newCompletedTasksLog,
      };
      
      // We call this separately to avoid being in the setState callback
      setTimeout(() => checkAchievements(newState), 0);

      return newState;
    });
  }, [toast, checkAchievements]);

  const resetState = useCallback(() => {
    localStorage.removeItem('supercharge_state');
    setState(getInitialState());
    setLoading(false);
    toast({
        title: "تم البدء من جديد!",
        description: "تمت إعادة ضبط تقدمك. رحلة جديدة تبدأ الآن!",
    });
  }, [toast]);

  useEffect(() => {
    if (!loading && state.routine.some(task => !task.id)) {
        setState(s => ({
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
