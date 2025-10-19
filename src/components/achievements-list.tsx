
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
import { cn } from '@/lib/utils';
import type { AchievementTier } from '@/lib/types';

type AchievementsListProps = {
  unlockedAchievements: string[];
};

const tierStyles: Record<AchievementTier, string> = {
    bronze: 'border-[#cd7f32]/80 bg-[#cd7f32]/20 text-[#cd7f32]',
    silver: 'border-[#c0c0c0]/80 bg-[#c0c0c0]/20 text-[#c0c0c0]',
    gold: 'border-yellow-500/80 bg-yellow-500/20 text-yellow-500',
    platinum: 'border-sky-400/80 bg-sky-400/20 text-sky-400',
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
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                {achievements.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                const Icon = ach.icon;
                const tierStyle = tierStyles[ach.tier] || tierStyles.bronze;

                return (
                    <Tooltip key={ach.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div
                        className={cn(`relative flex items-center justify-center p-2 aspect-square rounded-lg border-2 transition-all duration-300`,
                            isUnlocked
                                ? `${tierStyle} animate-in fade-in zoom-in-50`
                                : 'bg-muted/30 border-muted/50 text-muted-foreground'
                            )}
                        >
                        <Icon className="w-6 h-6" />
                        {!isUnlocked && <Lock className="w-2 h-2 absolute bottom-1 right-1 text-muted-foreground/50" />}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className={cn("border-2", isUnlocked ? tierStyle.split(' ')[0] : 'border-border')}>
                        <p className="font-bold text-base">{ach.name}</p>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                        {isUnlocked ? (
                        <p className={cn("font-semibold mt-1", tierStyle.split(' ')[2])}>+ {ach.xp} XP</p>
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

    