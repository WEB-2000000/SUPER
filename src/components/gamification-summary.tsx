'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getXPForNextLevel } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type GamificationSummaryProps = {
  progress: UserProgress;
};

const GamificationSummary: React.FC<GamificationSummaryProps> = ({ progress }) => {
  const { level, xp } = progress;
  const xpForNextLevel = getXPForNextLevel(level);
  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <div className="bg-primary/10 rounded-lg p-4 w-full group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative group-data-[collapsible=icon]:size-10 flex items-center justify-center">
                            <svg className="size-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary) / 0.2)"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="3"
                                    strokeDasharray={`${progressPercentage}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                             <span className="absolute text-sm font-bold text-primary">{level}</span>
                        </div>
                        <div className="w-full group-data-[collapsible=icon]:hidden">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-md font-bold">المستوى {level}</h3>
                                <div className="text-muted-foreground font-mono text-xs">
                                    {xp} / {xpForNextLevel}
                                </div>
                            </div>
                            <Progress value={progressPercentage} aria-label={`Progress to next level: ${progressPercentage.toFixed(0)}%`} className="h-2" />
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>{xpForNextLevel - xp} نقطة خبرة متبقية للمستوى التالي!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
};
  
export default GamificationSummary;
