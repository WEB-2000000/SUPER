
'use client';

import React from 'react';
import { useUserState } from '@/hooks/use-user-state';
import ProgressCharts from '@/components/progress-charts';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import GamificationSummary from '@/components/gamification-summary';
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
import { Trash2, Settings, Home, TrendingUp, ListTodo } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import OnboardingForm from '@/components/onboarding-form';

export default function ProgressPage() {
  const {
    state,
    loading,
    resetState,
    setUser,
    generateRoutine,
    isGeneratingRoutine,
  } = useUserState();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-4xl font-headline font-black text-primary tracking-wider uppercase">Super Charge</h1>
        <p className="text-muted-foreground mt-2">جاري تحميل رحلتك الملحمية...</p>
      </div>
    );
  }

  if (!state.user) {
    return (
       <OnboardingForm
        open={true}
        setUser={setUser}
        generateRoutine={generateRoutine}
        isGeneratingRoutine={isGeneratingRoutine}
      />
    )
  }
  
  return (
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
              <Link href="/" passHref>
                <SidebarMenuButton tooltip="الرئيسية">
                    <Home />
                    <span className="group-data-[collapsible=icon]:hidden">الرئيسية</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/routine" passHref>
                <SidebarMenuButton tooltip="خطتي اليومية">
                    <ListTodo />
                    <span className="group-data-[collapsible=icon]:hidden">خطتي اليومية</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="تتبع التقدم" isActive>
                    <TrendingUp />
                    <span className="group-data-[collapsible=icon]:hidden">تتبع التقدم</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
                تحليل التقدم
            </h1>
            <SidebarTrigger />
            </div>
        </header>
        
        <div className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
            <ProgressCharts completedTasksLog={state.completedTasksLog} />
        </div>
      </main>
    </SidebarProvider>
  );
}

    