'use client';

import React from 'react';
import { getXPForNextLevel } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type GamificationSummaryProps = {
  progress: UserProgress;
};

const GamificationSummary: React.FC<GamificationSummaryProps> = ({ progress }) => {
  const { level, xp } = progress;
  const xpForNextLevel = getXPForNextLevel(level);
  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <div className="w-full group-data-[collapsible=icon]:hidden">
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-bold">المستوى {level}</h3>
                            <div className="text-muted-foreground font-mono text-xs">
                                {xp} / {xpForNextLevel} XP
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                    <p>{xpForNextLevel - xp} نقطة خبرة متبقية للمستوى التالي!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
};
  
export default GamificationSummary;
