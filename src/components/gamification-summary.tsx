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
import { cn } from '@/lib/utils';

type GamificationSummaryProps = {
  progress: UserProgress;
};

const GamificationSummary: React.FC<GamificationSummaryProps> = ({ progress }) => {
  const { level, xp } = progress;
  const xpForNextLevel = getXPForNextLevel(level);
  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <div className="w-full">
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div className={cn("flex flex-col items-center gap-2", 
                        "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-0"
                    )}>
                        <div className="relative size-20 group-data-[collapsible=icon]:size-12 flex items-center justify-center">
                            <svg className="size-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary) / 0.2)"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="4"
                                    strokeDasharray={`${progressPercentage}, 100`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            </svg>
                             <span className="absolute text-xl group-data-[collapsible=icon]:text-sm font-bold text-primary">{level}</span>
                        </div>
                        <div className="w-full text-center group-data-[collapsible=icon]:hidden">
                            <h3 className="text-lg font-bold">المستوى {level}</h3>
                            <div className="text-muted-foreground font-mono text-xs">
                                {xp} / {xpForNextLevel} XP
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="group-data-[collapsible=icon]:hidden">
                    <p>{xpForNextLevel - xp} نقطة خبرة متبقية للمستوى التالي!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
};
  
export default GamificationSummary;
