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
import { subDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ar } from 'date-fns/locale';

type ProgressChartsProps = {
  completedTasksLog: CompletedTaskLog[];
};

type ChartData = {
  date: string;
  [key: string]: number | string;
};

const processData = (
  logs: CompletedTaskLog[],
  startDate: Date,
  endDate: Date,
  formatString: string
): ChartData[] => {
  const categories = [...new Set(logs.map(log => log.category))];
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
    categories.forEach(cat => {
      entry[cat] = dataByDate[date][cat] || 0;
    });
    return entry;
  });
};

const categoryColors: Record<string, string> = {
    learning: 'hsl(var(--chart-1))',
    sport: 'hsl(var(--chart-2))',
    work: 'hsl(var(--chart-3))',
    leisure: 'hsl(var(--chart-4))',
    personal: 'hsl(var(--chart-5))',
};


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.fill }} className="capitalize">{`${pld.dataKey}: ${pld.value}`}</p>
          ))}
        </div>
      );
    }
  
    return null;
  };

const ProgressChart: React.FC<{ data: ChartData[], categories: string[] }> = ({ data, categories }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }}/>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--muted-foreground)/0.1)'}} />
                {categories.map(cat => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat] || 'hsl(var(--primary))'} radius={[4, 4, 0, 0]} />
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
  }, [completedTasksLog, now]);

  const monthlyData = useMemo(() => {
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return processData(completedTasksLog, start, end, 'd');
  }, [completedTasksLog, now]);
  
  const allCategories = useMemo(() => [...new Set(completedTasksLog.map(log => log.category))], [completedTasksLog]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">تتبع التقدم</CardTitle>
        <CardDescription>
          شاهد إنجازاتك بمرور الوقت.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
