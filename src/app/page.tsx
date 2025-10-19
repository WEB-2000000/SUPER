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
import { Trash2, Settings, User as UserIcon, Zap } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const Logo = () => (
  <div className="bg-primary/10 p-4 rounded-full mb-6">
    <Zap className="w-16 h-16 text-primary" />
  </div>
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
                <SidebarHeader className="items-center text-center p-4 border-b">
                    <Avatar className="size-24 mb-3 border-4 border-accent shadow-md">
                        <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                            {state.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <h2 className="text-2xl font-bold font-headline">{state.user.name}</h2>
                        <p className="text-sm text-muted-foreground truncate max-w-full">{state.user.goal}</p>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-4 flex flex-col gap-4">
                    <div className="group-data-[collapsible=icon]:p-0">
                        <GamificationSummary progress={state.progress} />
                    </div>
                    <AchievementsList
                        unlockedAchievements={state.unlockedAchievements}
                    />
                </SidebarContent>
                <SidebarFooter className="border-t p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="الإعدادات">
                                <Settings />
                                <span className="group-data-[collapsible=icon]:hidden">الإعدادات</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuButton tooltip="البدء من جديد" className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive">
                                        <Trash2 />
                                        <span className="group-data-[collapsible=icon]:hidden">البدء من جديد</span>
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
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-2xl font-headline font-black text-primary tracking-wider uppercase">
                    Super Charge
                </h1>
                <SidebarTrigger />
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
