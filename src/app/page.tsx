'use client';

import React, { useMemo } from 'react';
import { useUserState } from '@/hooks/use-user-state';
import OnboardingForm from '@/components/onboarding-form';
import GamificationSummary from '@/components/gamification-summary';
import DailyMotivation from '@/components/daily-motivation';
import DailyRoutine from '@/components/daily-routine';
import ProgressCharts from '@/components/progress-charts';
import AchievementsList from '@/components/achievements-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Trash2, Settings, User as UserIcon } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const Logo = () => (
    <svg
      className="w-24 h-24 mb-4 text-accent"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M50 15C36.2 15 25 26.2 25 40C25 53.8 36.2 65 50 65C63.8 65 75 53.8 75 40C75 26.2 63.8 15 50 15ZM50 61C38.4 61 29 51.6 29 40C29 28.4 38.4 19 50 19C61.6 19 71 28.4 71 40C71 51.6 61.6 61 50 61Z" />
      <path d="M50 70C44.5 70 40 74.5 40 80C40 85.5 44.5 90 50 90C55.5 90 60 85.5 60 80C60 74.5 55.5 70 50 70ZM50 86C46.7 86 44 83.3 44 80C44 76.7 46.7 74 50 74C53.3 74 56 76.7 56 80C56 83.3 53.3 86 50 86Z" />
      <path d="M80 45C74.5 45 70 49.5 70 55C70 60.5 74.5 65 80 65C85.5 65 90 60.5 90 55C90 49.5 85.5 45 80 45ZM80 61C76.7 61 74 58.3 74 55C74 51.7 76.7 49 80 49C83.3 49 86 51.7 86 55C86 58.3 83.3 61 80 61Z" />
      <path d="M20 45C14.5 45 10 49.5 10 55C10 60.5 14.5 65 20 65C25.5 65 30 60.5 30 55C30 49.5 25.5 45 20 45ZM20 61C16.7 61 14 58.3 14 55C14 51.7 16.7 49 20 49C23.3 49 26 51.7 26 55C26 58.3 23.3 61 20 61Z" />
      <path d="M50 0C44.5 0 40 4.5 40 10C40 15.5 44.5 20 50 20C55.5 20 60 15.5 60 10C60 4.5 55.5 0 50 0ZM50 16C46.7 16 44 13.3 44 10C44 6.7 46.7 4 50 4C53.3 4 56 6.7 56 10C56 13.3 53.3 16 50 16Z" />
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
    resetState,
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
        <SidebarProvider>
            <Sidebar side="right" variant='sidebar' collapsible="icon">
                <SidebarHeader className="items-center text-center">
                    <Avatar className="size-20 mt-4 border-2 border-accent">
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                            {state.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <h2 className="text-2xl font-bold font-headline">{state.user.name}</h2>
                        <p className="text-sm text-muted-foreground">{state.user.goal}</p>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <div className="group-data-[collapsible=icon]:p-0 p-2">
                        <GamificationSummary progress={state.progress} />
                    </div>
                    <AchievementsList
                        unlockedAchievements={state.unlockedAchievements}
                    />
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="الإعدادات">
                                <Settings />
                                <span>الإعدادات</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuButton tooltip="البدء من جديد" className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive">
                                        <Trash2 />
                                        <span>البدء من جديد</span>
                                    </SidebarMenuButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        سيؤدي هذا الإجراء إلى حذف جميع بياناتك وتقدمك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={resetState}>
                                        نعم، ابدأ من جديد
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

          <SidebarInset>
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-2xl font-headline font-black text-primary tracking-wider uppercase">
                    Super Charge
                </h1>
                <SidebarTrigger className="md:hidden" />
                </div>
            </header>
            
            <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
                    
                    <div className="lg:col-span-2 space-y-6 xl:space-y-8">
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
                    </div>

                </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
