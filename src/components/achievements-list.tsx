'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { achievements } from '@/lib/achievements';
import type { UserProgress, CompletedTaskLog } from '@/lib/types';
import { Trophy } from 'lucide-react';

type AchievementsListProps = {
  unlockedAchievements: string[];
  progress: UserProgress;
  completedTasksLog: CompletedTaskLog[];
};

const AchievementsList: React.FC<AchievementsListProps> = ({
  unlockedAchievements,
  progress,
  completedTasksLog,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Trophy className="text-accent" />
          <span>الإنجازات</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {achievements.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              const Icon = ach.icon;
              return (
                <Tooltip key={ach.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center justify-center p-3 aspect-square rounded-full transition-all
                        ${
                          isUnlocked
                            ? 'bg-accent/20 text-accent border-2 border-accent'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{ach.name}</p>
                    <p>{ach.description}</p>
                    {isUnlocked ? (
                      <p className="text-green-500">مفتوح (+{ach.xp} XP)</p>
                    ) : (
                      <p className="text-muted-foreground">مغلق</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default AchievementsList;
