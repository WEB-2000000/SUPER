
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
  ChevronDown,
  PartyPopper,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';

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

const TaskItem: React.FC<{ task: RoutineTask; onComplete: (id: string) => void, today: string }> = React.memo(({
  task,
  onComplete,
  today,
}) => {
  const Icon = categoryIcons[task.category] || ListTodo;
  const isCompletedToday = task.completed && task.completedDate === today;

  return (
    <Collapsible asChild>
        <div className={cn(
            "rounded-lg transition-all duration-300 border-2",
            isCompletedToday ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'
        )}>
            <div className="flex items-center gap-4 p-4">
                <Checkbox
                id={task.id}
                checked={isCompletedToday}
                onCheckedChange={() => !isCompletedToday && onComplete(task.id)}
                aria-label={`Mark ${task.task} as complete`}
                className="h-6 w-6 rounded-md"
                />
                <div className="flex-1 text-right cursor-pointer" onClick={() => !isCompletedToday && onComplete(task.id)}>
                <label
                    htmlFor={task.id}
                    className={cn(
                    "font-bold text-lg leading-none transition-colors cursor-pointer",
                    isCompletedToday ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}
                >
                    {task.task}
                </label>
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mt-1.5">
                    <Badge variant={isCompletedToday ? "default" : "secondary"} className="capitalize">{task.category}</Badge>
                    <span>{task.suggestedTime}</span>
                    <Icon className="w-4 h-4" />
                </div>
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                        <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        <span className="sr-only">Toggle task details</span>
                    </Button>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
                <div className="pb-4 px-6 text-muted-foreground text-base text-right border-t border-border/50 pt-3 mx-4">
                    {task.description}
                </div>
            </CollapsibleContent>
        </div>
    </Collapsible>
  );
});

TaskItem.displayName = 'TaskItem';


const DailyRoutine: React.FC<DailyRoutineProps> = ({
  routine,
  completeTask,
  generateRoutine,
  isGeneratingRoutine,
  today,
}) => {
    const allTasksCompleted = routine.length > 0 && routine.every(task => task.completed && task.completedDate === today);

  return (
    <Card className="bg-transparent border-0 shadow-none md:border md:shadow-sm md:bg-card">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">خطة اليوم</CardTitle>
        <CardDescription className="text-base">
          أكمل مهامك اليومية لكسب نقاط الخبرة والارتقاء في مستواك.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {routine.length > 0 ? (
            allTasksCompleted ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-accent/50 rounded-xl bg-accent/10">
                    <PartyPopper className="mx-auto h-16 w-16 text-accent animate-in fade-in zoom-in" />
                    <h3 className="mt-4 text-2xl font-bold text-accent font-headline">أحسنت! لقد أكملت كل شيء!</h3>
                    <p className="text-foreground mt-2 mb-6 text-base max-w-prose mx-auto">
                        لقد أنجزت جميع مهامك لهذا اليوم. استرح جيداً واستعد لتحديات جديدة غداً. أنت تقوم بعمل رائع!
                    </p>
                </div>
            ) : (
                <div className="w-full space-y-3">
                    {routine.map((task) => (
                    <TaskItem key={task.id} task={task} onComplete={completeTask} today={today} />
                    ))}
                </div>
            )
        ) : (
          <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl">
            <ListTodo className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-bold">خطتك اليومية فارغة</h3>
            <p className="text-muted-foreground mt-2 mb-6 text-base">
              أنشئ خطة مخصصة لمساعدتك في تحقيق هدفك والبدء في رحلتك.
            </p>
            <Button size="lg" onClick={generateRoutine} disabled={isGeneratingRoutine}>
              {isGeneratingRoutine ? (
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="ml-2 h-5 w-5" />
              )}
              إنشاء خطتي الأولى
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRoutine;
