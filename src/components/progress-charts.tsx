'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { CompletedTaskLog } from '@/lib/types';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';
import { TrendingUp } from 'lucide-react';

type ProgressChartsProps = {
  completedTasksLog: CompletedTaskLog[];
};

type ChartData = {
  date: string;
  [key: string]: number | string;
};

const categoryColors: Record<string, string> = {
    learning: 'hsl(var(--chart-1))',
    sport: 'hsl(var(--chart-2))',
    work: 'hsl(var(--chart-3))',
    leisure: 'hsl(var(--chart-4))',
    personal: 'hsl(var(--chart-5))',
};

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
    Object.keys(categoryColors).forEach(cat => {
      entry[cat] = dataByDate[date]?.[cat] || 0;
    });
    return entry;
  });
};


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-3 border rounded-lg shadow-lg">
          <p className="label font-bold text-lg mb-2">{`${label}`}</p>
          {payload.filter((p: any) => p.value > 0).map((pld: any) => (
             <div key={pld.dataKey} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: pld.fill }} />
                <p style={{ color: 'hsl(var(--foreground))' }} className="capitalize font-medium">{`${pld.dataKey}: ${pld.value}`}</p>
             </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

const ProgressChart: React.FC<{ data: ChartData[], categories: string[] }> = ({ data, categories }) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }}/>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--primary)/0.1)'}} />
                {categories.map(cat => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat] || 'hsl(var(--primary))'} radius={[6, 6, 0, 0]} barSize={20} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

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
    return processData(completedTasksLog, start, end, 'd');
  }, [completedTasksLog]);
  
  const allCategories = useMemo(() => 
      [...new Set(completedTasksLog.map(log => log.category))]
      .filter(cat => Object.keys(categoryColors).includes(cat)), 
  [completedTasksLog]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <TrendingUp className="text-primary"/>
            <span>تتبع التقدم</span>
        </CardTitle>
        <CardDescription>
          شاهد إنجازاتك والمهام المكتملة بمرور الوقت.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {completedTasksLog.length > 0 ? (
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
              <TabsTrigger value="monthly">شهري</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <ProgressChart data={weeklyData} categories={allCategories} />
            </TabsContent>
            <TabsContent value="monthly">
              <ProgressChart data={monthlyData} categories={allCategories} />
            </TabsContent>
          </Tabs>
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
    </Card>
  );
};

export default ProgressCharts;
