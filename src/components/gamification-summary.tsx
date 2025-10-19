'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getXPForNextLevel } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import { Star } from 'lucide-react';

type GamificationSummaryProps = {
  progress: UserProgress;
};

const GamificationSummary: React.FC<GamificationSummaryProps> = ({ progress }) => {
  const { level, xp } = progress;
  const xpForNextLevel = getXPForNextLevel(level);
  const progressPercentage = (xp / xpForNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Star className="text-accent" />
            <span>ملخص تقدمك</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-lg">
          <div className="font-bold text-primary">
            المستوى {level}
          </div>
          <div className="text-muted-foreground font-mono">
            {xp} / {xpForNextLevel} XP
          </div>
        </div>
        <Progress value={progressPercentage} aria-label={`Progress to next level: ${progressPercentage.toFixed(0)}%`} />
      </CardContent>
    </Card>
  );
};

export default GamificationSummary;
