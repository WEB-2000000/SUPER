
'use client';

import React, { useMemo } from 'react';
import { useUserState } from '@/hooks/use-user-state';
import OnboardingForm from '@/components/onboarding-form';
import GamificationSummary from '@/components/gamification-summary';
import DailyMotivation from '@/components/daily-motivation';
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
import { Trash2, Settings, ListTodo, TrendingUp, Zap } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';


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
    isGeneratingRoutine,
    resetState,
  } = useUserState();

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
                    <Avatar className="mb-3 border-4 border-accent shadow-md transition-all duration-300 size-24 group-data-[collapsible=icon]:size-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold transition-all duration-300 text-4xl group-data-[collapsible=icon]:text-2xl">
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
                     <SidebarMenu>
                       <SidebarMenuItem>
                         <Link href="/routine" passHref>
                            <SidebarMenuButton tooltip="خطتي اليومية">
                                <ListTodo />
                                <span className="group-data-[collapsible=icon]:hidden">خطتي اليومية</span>
                            </SidebarMenuButton>
                         </Link>
                       </SidebarMenuItem>
                       <SidebarMenuItem>
                         <Link href="/progress" passHref>
                            <SidebarMenuButton tooltip="تتبع التقدم">
                                <TrendingUp />
                                <span className="group-data-[collapsible=icon]:hidden">تتبع التقدم</span>
                            </SidebarMenuButton>
                         </Link>
                       </SidebarMenuItem>
                     </SidebarMenu>
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

          <main className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-2xl font-headline font-black text-primary tracking-wider uppercase">
                    Super Charge
                </h1>
                <SidebarTrigger />
                </div>
            </header>
            
            <div className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
                    
                    <div className="lg:col-span-3 space-y-6 xl:space-y-8">
                        <DailyMotivation
                            user={state.user}
                            dailyMotivation={state.dailyMotivation}
                        />
                    </div>

                </div>
            </div>
          </main>
        </SidebarProvider>
      )}
    </>
  );
}
