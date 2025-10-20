'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import type { CompletedTaskLog } from '@/lib/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';
import { TrendingUp, Award, CalendarCheck, Activity } from 'lucide-react';
import { Badge } from './ui/badge';

type ProgressChartsProps = {
  completedTasksLog: CompletedTaskLog[];
};

type ChartData = {
  date: string;
  [key: string]: number | string;
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


const processData = (
  logs: CompletedTaskLog[],
  startDate: Date,
  endDate: Date,
  formatString: string
): ChartData[] => {
  const dataByDate: Record<string, Record<string, number>> = {};

  const intervalDays = eachDayOfInterval({ start: startDate, end: endDate });
  intervalDays.forEach(day => {
    const formattedDate = format(day, formatString, { locale: ar });
    dataByDate[formattedDate] = {};
  });

  logs.forEach(log => {
    const logDate = new Date(log.date);
    if (logDate >= startDate && logDate <= endDate) {
      const formattedDate = format(logDate, formatString, { locale: ar });
      if (!dataByDate[formattedDate]) {
        dataByDate[formattedDate] = {};
      }
      dataByDate[formattedDate][log.category] = (dataByDate[formattedDate][log.category] || 0) + 1;
    }
  });

  return Object.keys(dataByDate).map(date => {
    const entry: ChartData = { date };
    Object.keys(chartConfig).forEach(cat => {
        if (cat !== 'tasks') {
            entry[cat] = dataByDate[date]?.[cat] || 0;
        }
    });
    return entry;
  });
};


const ProgressChart: React.FC<{ data: ChartData[], categories: string[] }> = ({ data, categories }) => {
    return (
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                {categories.map(cat => (
                    <Bar key={cat} dataKey={cat} fill={chartConfig[cat as keyof typeof chartConfig]?.color} stackId="a" radius={6} />
                ))}
            </BarChart>
        </ChartContainer>
    );
};

type StatCardProps = {
    icon: React.ElementType;
    title: string;
    value: string | number;
    unit?: string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, unit, color }) => (
    <Card className="flex flex-col justify-between p-4" style={{borderColor: color}}>
        <CardHeader className="p-0 flex-row items-center gap-3 space-y-0">
            <Icon className="w-6 h-6" style={{color: color}}/>
            <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-3">
            <p className="text-3xl font-bold font-headline">{value} <span className="text-lg font-body font-medium text-muted-foreground">{unit}</span></p>
        </CardContent>
    </Card>
);


const ProgressCharts: React.FC<ProgressChartsProps> = ({ completedTasksLog }) => {
  const now = new Date();

  const weeklyData = useMemo(() => {
    const start = startOfWeek(now, { weekStartsOn: 6 }); // Saturday
    const end = endOfWeek(now, { weekStartsOn: 6 });
    return processData(completedTasksLog, start, end, 'EEE');
  }, [completedTasksLog]);

  const monthlyData = useMemo(() => {
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return processData(completedTasksLog, start, end, 'd MMM');
  }, [completedTasksLog]);
  
  const allCategories = useMemo(() => 
      [...new Set(completedTasksLog.map(log => log.category))]
      .filter(cat => Object.keys(chartConfig).includes(cat)), 
  [completedTasksLog]);

  const stats = useMemo(() => {
    const total = completedTasksLog.length;
    
    const categoryCounts = completedTasksLog.reduce((acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostFrequentCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    const tasksByDay = completedTasksLog.reduce((acc, log) => {
        acc[log.date] = (acc[log.date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const bestDay = Object.entries(tasksByDay).sort((a, b) => b[1] - a[1])[0];

    return {
        total,
        mostFrequentCategory: mostFrequentCategory ? { name: mostFrequentCategory[0], count: mostFrequentCategory[1] } : null,
        bestDay: bestDay ? { date: bestDay[0], count: bestDay[1] } : null,
    }
  }, [completedTasksLog]);


  return (
    <div className="space-y-6">

        {completedTasksLog.length > 0 && (
             <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Activity} title="إجمالي المهام المكتملة" value={stats.total} unit="مهمة" color="hsl(var(--primary))" />
                {stats.mostFrequentCategory && (
                    <StatCard 
                        icon={Award} 
                        title="الفئة الأكثر تركيزًا" 
                        value={chartConfig[stats.mostFrequentCategory.name as keyof typeof chartConfig]?.label || stats.mostFrequentCategory.name}
                        unit={`(${stats.mostFrequentCategory.count} مرة)`}
                        color={chartConfig[stats.mostFrequentCategory.name as keyof typeof chartConfig]?.color}
                    />
                )}
                {stats.bestDay && (
                     <StatCard 
                        icon={CalendarCheck} 
                        title="أفضل يوم إنتاجية" 
                        value={format(new Date(stats.bestDay.date), "d MMM", { locale: ar })}
                        unit={`(${stats.bestDay.count} مهام)`}
                        color="hsl(var(--accent))"
                    />
                )}
            </div>
        )}

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <TrendingUp className="text-primary"/>
                    <span>تحليل الأداء الأسبوعي</span>
                </CardTitle>
                <CardDescription>
                شاهد توزيع المهام المكتملة حسب الفئة خلال هذا الأسبوع.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {completedTasksLog.length > 0 ? (
                <ProgressChart data={weeklyData} categories={allCategories} />
                ) : (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl">
                    <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-bold">لا توجد بيانات حتى الآن</h3>
                    <p className="text-muted-foreground mt-2">
                        أكمل بعض المهام لتبدأ في رؤية تقدمك هنا.
                    </p>
                </div>
                )}
            </CardContent>
            {completedTasksLog.length > 0 && <CardFooter>
                 <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            تحليل: <span className="font-normal text-muted-foreground">أداؤك هذا الأسبوع يظهر تركيزك على فئات معينة.</span>
                        </div>
                    </div>
                </div>
            </CardFooter>}
        </Card>
    </div>
  );
};

export default ProgressCharts;
