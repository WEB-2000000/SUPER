
'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompletedTaskLog } from '@/lib/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { arSA } from 'date-fns/locale';

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
  },
  sport: {
    label: "رياضة",
    color: "hsl(var(--chart-2))",
  },
  work: {
    label: "عمل",
    color: "hsl(var(--chart-3))",
  },
  leisure: {
    label: "ترفيه",
    color: "hsl(var(--chart-4))",
  },
  personal: {
    label: "شخصي",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const ProgressCharts: React.FC<ProgressChartsProps> = ({ completedTasksLog }) => {
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
      const logDate = new Date(log.date);
      if (logDate >= start && logDate <= end) {
        const dayIndex = (logDate.getDay() - start.getDay() + 7) % 7;
        if (data[dayIndex] && Object.hasOwnProperty.call(data[dayIndex], log.category)) {
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
        const logDate = new Date(log.date);
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
    <Card>
      <CardHeader>
        <CardTitle>تحليل التقدم</CardTitle>
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
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-4">
                <BarChart accessibilityLayer data={weeklyData} margin={{ top: 20 }}>
                    <CartesianGrid vertical={false} />
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
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-4">
                <BarChart accessibilityLayer data={monthlyData} margin={{ top: 20 }}>
                    <CartesianGrid vertical={false} />
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
