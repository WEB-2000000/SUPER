'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';
import { Sparkles } from 'lucide-react';

type DailyMotivationProps = {
  user: User | null;
  dailyMotivation: string | null;
};

const DailyMotivation: React.FC<DailyMotivationProps> = ({ dailyMotivation }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Sparkles className="text-accent"/>
          <span>رسالتك التحفيزية اليومية</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dailyMotivation ? (
          <blockquote className="border-r-4 border-primary pr-4 italic text-lg">
            {dailyMotivation}
          </blockquote>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyMotivation;
