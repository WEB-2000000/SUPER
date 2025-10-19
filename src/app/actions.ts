'use server';

import {
  generateDailyMotivation,
  DailyMotivationInput,
} from '@/ai/flows/daily-personalized-motivation';
import {
  generateDailyRoutine,
  GenerateDailyRoutineInput,
} from '@/ai/flows/generate-daily-routine';
import { z } from 'zod';

export async function getDailyMotivationAction(input: DailyMotivationInput) {
  // Although the flow already has schema validation, it's a good practice
  // to validate inputs at the action boundary as well.
  const schema = z.object({
    userName: z.string(),
    userAge: z.number(),
    userGoal: z.string(),
  });
  const validatedInput = schema.parse(input);
  return await generateDailyMotivation(validatedInput);
}

export async function generateRoutineAction(input: GenerateDailyRoutineInput) {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
    goal: z.string(),
  });
  const validatedInput = schema.parse(input);
  return await generateDailyRoutine(validatedInput);
}
