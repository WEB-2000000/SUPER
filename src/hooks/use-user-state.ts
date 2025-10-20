
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
  const [achievementToasts, setAchievementToasts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    try {
      const storedState = localStorage.getItem('supercharge_state');
      if (storedState) {
        const parsedState = JSON.parse(storedState) as UserState;
        
        if (!parsedState.progress) parsedState.progress = initialProgress;
        if (!parsedState.unlockedAchievements) parsedState.unlockedAchievements = [];
        if (!parsedState.completedTasksLog) parsedState.completedTasksLog = [];
        if (!Array.isArray(parsedState.routine)) parsedState.routine = [];
        
        const today = new Date().toISOString().split('T')[0];
        
        if (parsedState.lastRoutineResetDate !== today) {
            parsedState.routine = parsedState.routine.map(task => ({ ...task, completed: false, completedDate: undefined }));
            parsedState.lastRoutineResetDate = today;
        }
        
        setState(parsedState);

        if (parsedState.user && parsedState.lastMotivationDate !== today) {
          fetchDailyMotivation(parsedState.user, today);
        }
      } else {
        setState(getInitialState());
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
      localStorage.removeItem('supercharge_state');
      setState(getInitialState());
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
    const newState: UserState = {
      ...getInitialState(),
      user,
      lastRoutineResetDate: today,
    };
    setState(newState);
    
    // Avoid re-fetching if motivation for today already exists (less likely here, but good practice)
    if (state.lastMotivationDate !== today) {
        fetchDailyMotivation(user, today);
    }
  }, [state.lastMotivationDate]);
  
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
  }, [state.user, toast]);

  const checkAchievements = useCallback((currentState: UserState) => {
    const newToasts: any[] = [];
    let achievementXp = 0;

    const newlyUnlocked = achievements.filter(ach => 
      !currentState.unlockedAchievements.includes(ach.id) && 
      ach.isUnlocked(currentState.progress, currentState.completedTasksLog, currentState.routine)
    ).map(ach => {
      achievementXp += ach.xp;
      newToasts.push({
        title: `🏆 تم فتح إنجاز!`,
        description: `${ach.name} (+${ach.xp} XP)`,
      });
      return ach.id;
    });

    if (newlyUnlocked.length > 0) {
      setAchievementToasts(newToasts);

      setState(s => {
        let newXp = s.progress.xp + achievementXp;
        let newLevel = s.progress.level;
        let xpForNextLevel = getXPForNextLevel(newLevel);
        
        while (newXp >= xpForNextLevel) {
            newXp -= xpForNextLevel;
            newLevel++;
            setAchievementToasts(prev => [...prev, {
                title: `🎉 وصلت إلى المستوى ${newLevel}!`,
                description: `مكافأة الإنجاز دفعتك للأعلى!`,
            }]);
            xpForNextLevel = getXPForNextLevel(newLevel);
        }
        
        return {
          ...s,
          unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked],
          progress: {
            ...s.progress,
            xp: newXp,
            level: newLevel,
          }
        };
      });
    }
  }, []);
  
  useEffect(() => {
    if (achievementToasts.length > 0) {
      achievementToasts.forEach(t => toast(t));
      setAchievementToasts([]);
    }
  }, [achievementToasts, toast]);

  useEffect(() => {
    if (!loading) {
      checkAchievements(state);
    }
  }, [state.progress.totalTasksCompleted, state.progress.level, loading, state.routine, checkAchievements]);


  const completeTask = useCallback((taskId: string) => {
    setState(s => {
      let completedTask: RoutineTask | undefined;
      const today = new Date().toISOString().split('T')[0];
      const newRoutine = s.routine.map(task => {
        if (task.id === taskId) {
          if (task.completed && task.completedDate === today) return task;
          completedTask = { ...task, completed: true, completedDate: today };
          return completedTask;
        }
        return task;
      });

      if (!completedTask) return s;

      let leveledUp = false;
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

      return newState;
    });
  }, [toast]);

  const resetState = useCallback(() => {
    localStorage.removeItem('supercharge_state');
    setState(getInitialState());
    setLoading(false); // Make sure loading is false
    toast({
        title: "تم البدء من جديد!",
        description: "تمت إعادة ضبط تقدمك. رحلة جديدة تبدأ الآن!",
    });
  }, [toast]);

  useEffect(() => {
    if (!loading && Array.isArray(state.routine) && state.routine.some(task => !task.id)) {
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
