'use client';

import React, { useMemo } from 'react';
import { useUserState } from '@/hooks/use-user-state';
import OnboardingForm from '@/components/onboarding-form';
import GamificationSummary from '@/components/gamification-summary';
import DailyMotivation from '@/components/daily-motivation';
import DailyRoutine from '@/components/daily-routine';
import ProgressCharts from '@/components/progress-charts';
import AchievementsList from '@/components/achievements-list';
import { Skeleton } from '@/components/ui/skeleton';

const Logo = () => (
    <svg
      className="w-16 h-16 animate-pulse mb-4"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(205, 100%, 50%)' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(221, 83%, 43%)' }} />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="url(#blue-gradient)"
        strokeWidth="10"
        fill="none"
      />
      <path
        d="M58 35 L42 50 L52 50 L42 65 L68 45 L52 45 Z"
        fill="hsl(var(--accent))"
      />
    </svg>
  );

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
        <Logo />
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
