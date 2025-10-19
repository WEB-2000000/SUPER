'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getXPForNextLevel } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import { Star, Shield, Gem } from 'lucide-react';

type GamificationSummaryProps = {
  progress: UserProgress;
};

const LevelIcon = ({ level }: { level: number }) => {
    if (level < 5) return <Shield className="w-12 h-12 text-yellow-500" />;
    if (level < 10) return <Star className="w-12 h-12 text-amber-400" />;
    return <Gem className="w-12 h-12 text-cyan-400" />;
};


const GamificationSummary: React.FC<GamificationSummaryProps> = ({ progress }) => {
  const { level, xp } = progress;
  const xpForNextLevel = getXPForNextLevel(level);
  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <Card className="bg-gradient-to-tr from-primary/10 to-transparent">
      <CardContent className="p-6 flex items-center gap-6">
        <div className="relative">
            <LevelIcon level={level} />
            <span className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm border-2 border-background">
                {level}
            </span>
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">المستوى {level}</h3>
                <div className="text-muted-foreground font-mono text-sm">
                    {xp} / {xpForNextLevel} XP
                </div>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Progress value={progressPercentage} aria-label={`Progress to next level: ${progressPercentage.toFixed(0)}%`} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{xpForNextLevel - xp} نقطة خبرة متبقية للمستوى التالي!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

// We need to add TooltipProvider and Tooltip to this component.
// Let's import them.
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  
export default GamificationSummary;
