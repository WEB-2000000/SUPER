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
import { Trophy, Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type AchievementsListProps = {
  unlockedAchievements: string[];
};

const AchievementsList: React.FC<AchievementsListProps> = ({
  unlockedAchievements,
}) => {
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Trophy className="text-accent" />
                <span>الإنجازات</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{unlockedCount}/{totalCount}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {achievements.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                const Icon = ach.icon;
                return (
                    <Tooltip key={ach.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div
                        className={`relative flex items-center justify-center p-3 aspect-square rounded-lg border-2 transition-all duration-300
                            ${
                            isUnlocked
                                ? 'bg-accent/20 border-accent text-accent animate-in fade-in zoom-in-50'
                                : 'bg-muted/30 border-muted/50 text-muted-foreground'
                            }`}
                        >
                        <Icon className="w-8 h-8" />
                        {!isUnlocked && <Lock className="w-3 h-3 absolute bottom-1 right-1 text-muted-foreground/50" />}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold text-base">{ach.name}</p>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                        {isUnlocked ? (
                        <p className="text-green-400 font-semibold mt-1">+ {ach.xp} XP</p>
                        ) : (
                        <p className="text-red-400 font-semibold mt-1">مغلق</p>
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
