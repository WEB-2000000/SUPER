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
      className="w-24 h-24 mb-4 text-accent"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M72.2,84.4H27.8c-3.3,0-6-2.7-6-6V21.6c0-3.3,2.7-6,6-6h44.4c3.3,0,6,2.7,6,6v56.7C78.2,81.7,75.5,84.4,72.2,84.4z M27.8,17.6c-2.2,0-4,1.8-4,4v56.7c0,2.2,1.8,4,4,4h44.4c2.2,0,4-1.8,4-4V21.6c0-2.2-1.8-4-4-4H27.8z" />
      <path d="M60.1,62.1c-1.1,0-2.2-0.4-3-1.2L50,53.8l-7.1,7.1c-1.7,1.7-4.4,1.7-6.1,0c-1.7-1.7-1.7-4.4,0-6.1l7.1-7.1l-7.1-7.1c-1.7-1.7-1.7-4.4,0-6.1s4.4-1.7,6.1,0l7.1,7.1l7.1-7.1c1.7-1.7,4.4-1.7,6.1,0s1.7,4.4,0,6.1l-7.1,7.1l7.1,7.1c1.7,1.7,1.7,4.4,0,6.1C62.3,61.7,61.2,62.1,60.1,62.1z" />
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
        <h1 className="text-4xl font-headline font-black text-primary tracking-wider uppercase">Super Charge</h1>
        <p className="text-muted-foreground mt-2">جاري تحميل رحلتك الملحمية...</p>
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
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto flex items-center justify-between p-4">
              <h1 className="text-2xl font-headline font-black text-primary tracking-wider uppercase">
                Super Charge
              </h1>
              <p className="text-lg font-medium text-foreground">
                مرحباً <span className="font-bold text-primary">{state.user.name}</span>!
              </p>
            </div>
          </header>
          
          <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                
                <div className="md:col-span-3 lg:col-span-4">
                    <GamificationSummary progress={state.progress} />
                </div>

                <div className="lg:col-span-3 space-y-6 xl:space-y-8">
                    <DailyRoutine
                        routine={state.routine}
                        completeTask={completeTask}
                        generateRoutine={generateRoutine}
                        isGeneratingRoutine={isGeneratingRoutine}
                        today={today}
                    />
                    <ProgressCharts completedTasksLog={state.completedTasksLog} />
                </div>

                <div className="lg:col-span-1 space-y-6 xl:space-y-8">
                    <DailyMotivation
                        user={state.user}
                        dailyMotivation={state.dailyMotivation}
                    />
                    <AchievementsList
                        unlockedAchievements={state.unlockedAchievements}
                    />
                </div>

             </div>
          </main>
        </div>
      )}
    </>
  );
}
