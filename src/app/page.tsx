'use client';

import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useUserState } from '@/hooks/use-user-state';
import OnboardingForm from '@/components/onboarding-form';
import GamificationSummary from '@/components/gamification-summary';
import DailyMotivation from '@/components/daily-motivation';
import DailyRoutine from '@/components/daily-routine';
import ProgressCharts from '@/components/progress-charts';
import AchievementsList from '@/components/achievements-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuperChargePage() {
  const {
    state,
    loading,
    setUser,
    generateRoutine,
    completeTask,
    isGeneratingRoutine,
  } = useUserState();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Flame className="w-16 h-16 text-primary animate-pulse mb-4" />
        <h1 className="text-3xl font-headline text-primary">Super Charge</h1>
        <p className="text-muted-foreground">Loading your awesome journey...</p>
      </div>
    );
  }

  return (
    <>
      <OnboardingForm
        open={!state.user}
        setUser={setUser}
        generateRoutine={generateRoutine}
        isGeneratingRoutine={isGeneratingRoutine}
      />
      {state.user && (
        <main className="container mx-auto p-4 py-8 sm:p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-headline text-primary">
              Super Charge
            </h1>
            <p className="text-lg text-muted-foreground">
              مرحباً بعودتك، {state.user.name}! لنجعل اليوم استثنائياً.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <GamificationSummary progress={state.progress} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <DailyMotivation
                user={state.user}
                dailyMotivation={state.dailyMotivation}
              />
              <AchievementsList
                unlockedAchievements={state.unlockedAchievements}
                progress={state.progress}
                completedTasksLog={state.completedTasksLog}
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <DailyRoutine
                routine={state.routine}
                completeTask={completeTask}
                generateRoutine={generateRoutine}
                isGeneratingRoutine={isGeneratingRoutine}
                today={today}
              />
              <ProgressCharts completedTasksLog={state.completedTasksLog} />
            </div>
          </div>
        </main>
      )}
    </>
  );
}
