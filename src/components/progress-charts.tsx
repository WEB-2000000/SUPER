
'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompletedTaskLog } from '@/lib/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Trophy, CalendarCheck, Zap, BrainCircuit, Bike, Briefcase, Coffee, User as UserIcon } from 'lucide-react';
import { Badge } from './ui/badge';

type ProgressChartsProps = {
  completedTasksLog: CompletedTaskLog[];
};

const chartConfig = {
  tasks: {
    label: "المهام",
  },
  learning: {
    label: "تعلم",
    color: "hsl(var(--chart-1))",
    icon: BrainCircuit,
  },
  sport: {
    label: "رياضة",
    color: "hsl(var(--chart-2))",
    icon: Bike,
  },
  work: {
    label: "عمل",
    color: "hsl(var(--chart-3))",
    icon: Briefcase,
  },
  leisure: {
    label: "ترفيه",
    color: "hsl(var(--chart-4))",
    icon: Coffee,
  },
  personal: {
    label: "شخصي",
    color: "hsl(var(--chart-5))",
    icon: UserIcon,
  },
} satisfies ChartConfig;

const ProgressCharts: React.FC<ProgressChartsProps> = ({ completedTasksLog }) => {
  const {
    totalTasksCompleted,
    currentStreak,
    mostProductiveDay,
    favoriteCategory
  } = useMemo(() => {
    if (!completedTasksLog || completedTasksLog.length === 0) {
      return {
        totalTasksCompleted: 0,
        currentStreak: 0,
        mostProductiveDay: 'لا يوجد',
        favoriteCategory: { name: 'لا يوجد', count: 0 },
      };
    }

    const logsByDate: { [key: string]: CompletedTaskLog[] } = {};
    completedTasksLog.forEach(log => {
      const date = log.date;
      if (!logsByDate[date]) {
        logsByDate[date] = [];
      }
      logsByDate[date].push(log);
    });

    const mostProductiveDay = Object.entries(logsByDate).reduce(
      (max, [date, logs]) => logs.length > max.count ? { date: format(parseISO(date), 'eeee', { locale: arSA }), count: logs.length } : max,
      { date: 'لا يوجد', count: 0 }
    ).date;
    
    const categoryCounts: { [key: string]: number } = {};
    completedTasksLog.forEach(log => {
      categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
    });

    const favoriteCategory = Object.entries(categoryCounts).reduce(
        (max, [category, count]) => count > max.count ? { name: (chartConfig as any)[category]?.label || category, count } : max,
        { name: 'لا يوجد', count: 0 }
    );
    
    const uniqueDates = [...new Set(completedTasksLog.map(log => log.date))].sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());
    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastLogDate = parseISO(uniqueDates[0]);
      lastLogDate.setHours(0,0,0,0);
      
      const diffDays = (today.getTime() - lastLogDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays <= 1) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = parseISO(uniqueDates[i]);
          const previous = parseISO(uniqueDates[i + 1]);
          const dayDiff = (current.getTime() - previous.getTime()) / (1000 * 3600 * 24);
          if (dayDiff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalTasksCompleted: completedTasksLog.length,
      currentStreak: streak,
      mostProductiveDay,
      favoriteCategory,
    };
  }, [completedTasksLog]);


  const weeklyData = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now, { locale: arSA });
    const end = endOfWeek(now, { locale: arSA });
    const days = eachDayOfInterval({ start, end });

    const data = days.map(day => ({
      date: format(day, 'EEE', { locale: arSA }),
      learning: 0,
      sport: 0,
      work: 0,
      leisure: 0,
      personal: 0,
    }));

    completedTasksLog.forEach(log => {
      const logDate = parseISO(log.date);
      if (logDate >= start && logDate <= end) {
        const dayIndex = days.findIndex(d => d.getDay() === logDate.getDay());
        if (dayIndex !== -1 && Object.hasOwnProperty.call(data[dayIndex], log.category)) {
          (data[dayIndex] as any)[log.category]++;
        }
      }
    });
    return data;
  }, [completedTasksLog]);
  
  const monthlyData = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    const data = days.map(day => ({
      date: format(day, 'd'),
      learning: 0,
      sport: 0,
      work: 0,
      leisure: 0,
      personal: 0,
    }));

    completedTasksLog.forEach(log => {
        const logDate = parseISO(log.date);
        if (logDate >= start && logDate <= end) {
          const dayIndex = logDate.getDate() - 1;
          if (data[dayIndex] && Object.hasOwnProperty.call(data[dayIndex], log.category)) {
            (data[dayIndex] as any)[log.category]++;
          }
        }
    });

    return data;
  }, [completedTasksLog]);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المهام المكتملة</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasksCompleted}</div>
            <p className="text-xs text-muted-foreground">مجموع المهام المنجزة حتى الآن</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">السلسلة الحالية</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} أيام</div>
            <p className="text-xs text-muted-foreground">أيام متتالية من الإنجاز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اليوم الأكثر إنتاجية</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{mostProductiveDay}</div>
            <p className="text-xs text-muted-foreground">اليوم الذي تنجز فيه أكثر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الفئة المفضلة</CardTitle>
            {favoriteCategory.name !== 'لا يوجد' && React.createElement((chartConfig as any)[favoriteCategory.name.toLowerCase()]?.icon || Zap, { className: "h-4 w-4 text-muted-foreground" })}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteCategory.name}</div>
            <p className="text-xs text-muted-foreground">أكثر فئة تركز عليها</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>توزيع المهام المكتملة</CardTitle>
          <CardDescription>
            عرض تفصيلي للمهام المكتملة أسبوعياً وشهرياً.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
              <TabsTrigger value="monthly">شهري</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <ChartContainer config={chartConfig} className="w-full h-[250px] md:h-[300px]">
                  <BarChart accessibilityLayer data={weeklyData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid vertical={false} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={4}/>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      />
                      <Bar dataKey="learning" fill="var(--color-learning)" radius={4} stackId="a" />
                      <Bar dataKey="sport" fill="var(--color-sport)" radius={4} stackId="a" />
                      <Bar dataKey="work" fill="var(--color-work)" radius={4} stackId="a" />
                      <Bar dataKey="leisure" fill="var(--color-leisure)" radius={4} stackId="a" />
                      <Bar dataKey="personal" fill="var(--color-personal)" radius={4} stackId="a" />
                  </BarChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="monthly">
              <ChartContainer config={chartConfig} className="w-full h-[250px] md:h-[300px]">
                  <BarChart accessibilityLayer data={monthlyData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid vertical={false} />
                       <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={4}/>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      />
                      <Bar dataKey="learning" fill="var(--color-learning)" radius={4} stackId="a" />
                      <Bar dataKey="sport" fill="var(--color-sport)" radius={4} stackId="a" />
                      <Bar dataKey="work" fill="var(--color-work)" radius={4} stackId="a" />
                      <Bar dataKey="leisure" fill="var(--color-leisure)" radius={4} stackId="a" />
                      <Bar dataKey="personal" fill="var(--color-personal)" radius={4} stackId="a" />
                  </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
         <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            هل لديك فضول حول فئة معينة؟
          </div>
          <div className="leading-none text-muted-foreground">
            مرر فوق الأشرطة في الرسم البياني لرؤية تفاصيل المهام لكل فئة.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProgressCharts;

    
    