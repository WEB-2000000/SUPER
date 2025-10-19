'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { RoutineTask } from '@/lib/types';
import {
  BrainCircuit,
  Bike,
  Briefcase,
  Coffee,
  User as UserIcon,
  Loader2,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type DailyRoutineProps = {
  routine: RoutineTask[];
  completeTask: (taskId: string) => void;
  generateRoutine: () => Promise<void>;
  isGeneratingRoutine: boolean;
  today: string;
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  learning: BrainCircuit,
  sport: Bike,
  work: Briefcase,
  leisure: Coffee,
  personal: UserIcon,
};

const TaskItem: React.FC<{ task: RoutineTask; onComplete: (id: string) => void, today: string }> = ({
  task,
  onComplete,
  today,
}) => {
  const Icon = categoryIcons[task.category] || ListTodo;
  const isCompletedToday = task.completed && task.completedDate === today;

  return (
    <AccordionItem value={task.id} className="border-b-0">
      <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${isCompletedToday ? 'bg-muted/50' : 'bg-card'}`}>
        <Checkbox
          id={task.id}
          checked={isCompletedToday}
          onCheckedChange={() => !isCompletedToday && onComplete(task.id)}
          aria-label={`Mark ${task.task} as complete`}
          className="h-6 w-6"
        />
        <AccordionTrigger className="flex-1 p-0 hover:no-underline">
          <div className="flex-1 text-right">
            <label
              htmlFor={task.id}
              className={`font-medium text-base leading-none ${
                isCompletedToday ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.task}
            </label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Icon className="w-4 h-4" />
              <Badge variant="secondary" className="capitalize">{task.category}</Badge>
              <span>{task.suggestedTime}</span>
            </div>
          </div>
        </AccordionTrigger>
      </div>
      <AccordionContent className="p-4 pt-0 pl-14">
        <p className="text-muted-foreground">{task.description}</p>
      </AccordionContent>
    </AccordionItem>
  );
};


const DailyRoutine: React.FC<DailyRoutineProps> = ({
  routine,
  completeTask,
  generateRoutine,
  isGeneratingRoutine,
  today,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">خطة اليوم</CardTitle>
        <CardDescription>
          أكمل مهامك اليوم لكسب نقاط الخبرة والارتقاء بالمستوى.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {routine.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {routine.map((task) => (
              <TaskItem key={task.id} task={task} onComplete={completeTask} today={today} />
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">خطتك اليومية فارغة</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              أنشئ خطة مخصصة لمساعدتك في الوصول إلى هدفك.
            </p>
            <Button onClick={generateRoutine} disabled={isGeneratingRoutine}>
              {isGeneratingRoutine ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="ml-2 h-4 w-4" />
              )}
              إنشاء خطتي
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRoutine;
