'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized daily routine.
 *
 * The flow takes user information (name, age, goal) as input and returns a structured daily routine.
 * - generateDailyRoutine - The main function to generate a daily routine.
 * - GenerateDailyRoutineInput - The input type for the generateDailyRoutine function.
 * - GenerateDailyRoutineOutput - The output type for the generateDailyRoutine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyRoutineInputSchema = z.object({
  name: z.string().describe('The user\'s name.'),
  age: z.number().describe('The user\'s age.'),
  goal: z.string().describe('The user\'s primary goal.'),
});

export type GenerateDailyRoutineInput = z.infer<typeof GenerateDailyRoutineInputSchema>;

const GenerateDailyRoutineOutputSchema = z.object({
  routine: z.array(
    z.object({
      task: z.string().describe('The name of the task.'),
      description: z.string().describe('A detailed description of the task.'),
      category: z.string().describe('The category of the task (e.g., learning, sport, work).'),
      suggestedTime: z.string().describe('The suggested time for the task (e.g., 9:00 AM).'),
    })
  ).describe('A list of tasks for the daily routine.'),
});

export type GenerateDailyRoutineOutput = z.infer<typeof GenerateDailyRoutineOutputSchema>;

export async function generateDailyRoutine(input: GenerateDailyRoutineInput): Promise<GenerateDailyRoutineOutput> {
  return generateDailyRoutineFlow(input);
}

const generateDailyRoutinePrompt = ai.definePrompt({
  name: 'generateDailyRoutinePrompt',
  input: {schema: GenerateDailyRoutineInputSchema},
  output: {schema: GenerateDailyRoutineOutputSchema},
  prompt: `You are an AI assistant designed to create personalized daily routines.

  Create a detailed daily routine for a user with the following information:
  Name: {{{name}}}
  Age: {{{age}}}
  Goal: {{{goal}}}

  The routine should include a list of tasks with descriptions, categories (e.g., learning, sport, work), and suggested times.
  The routine must be realistic and actionable.

  Format the output as a JSON array of tasks, each with a task name, description, category, and suggested time.
  The category should be one of: learning, sport, work, leisure, or personal.
  The suggested time should be in 12-hour format (e.g., 9:00 AM).
  `,
});

const generateDailyRoutineFlow = ai.defineFlow(
  {
    name: 'generateDailyRoutineFlow',
    inputSchema: GenerateDailyRoutineInputSchema,
    outputSchema: GenerateDailyRoutineOutputSchema,
  },
  async input => {
    const {output} = await generateDailyRoutinePrompt(input);
    return output!;
  }
);
