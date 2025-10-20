
'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';
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
import type { CompletedTaskLog } from '@/lib/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';

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
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    const days = eachDayOfInterval({ start, end });

    const data: { [key: string]: string | number }[] = days.map(day => ({
      date: format(day, 'EEE'),
      learning: 0,
      sport: 0,
      work: 0,
      leisure: 0,
      personal: 0,
    }));

    completedTasksLog.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= start && logDate <= end) {
        const dayIndex = logDate.getDay();
        if (data[dayIndex]) {
          data[dayIndex][log.category] = (data[dayIndex][log.category] as number) + 1;
        }
      }
    });

    return data;
  }, [completedTasksLog]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>التقدم الأسبوعي</CardTitle>
        <CardDescription>
          المهام المكتملة هذا الأسبوع حسب الفئة.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={weeklyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="learning" fill="var(--color-learning)" radius={4} />
                <Bar dataKey="sport" fill="var(--color-sport)" radius={4} />
                <Bar dataKey="work" fill="var(--color-work)" radius={4} />
                <Bar dataKey="leisure" fill="var(--color-leisure)" radius={4} />
                <Bar dataKey="personal" fill="var(--color-personal)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
