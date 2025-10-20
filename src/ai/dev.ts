'use client';
import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/daily-personalized-motivation.ts';
import '@/ai/flows/generate-daily-routine.ts';
