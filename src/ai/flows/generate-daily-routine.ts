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
  prompt: `أنت مساعد ذكاء اصطناعي مصمم لإنشاء إجراءات يومية مخصصة باللغة العربية.

  أنشئ روتينًا يوميًا مفصلاً باللغة العربية للمستخدم بالمعلومات التالية:
  الاسم: {{{name}}}
  العمر: {{{age}}}
  الهدف: {{{goal}}}

  يجب أن يتضمن الروتين قائمة بالمهام مع الأوصاف والفئات (على سبيل المثال، تعلم، رياضة، عمل)، والأوقات المقترحة.
  يجب أن يكون الروتين واقعيًا وقابل للتنفيذ.

  نسق الإخراج كمصفوفة JSON من المهام، لكل منها اسم المهمة والوصف والفئة والوقت المقترح.
  يجب أن تكون الفئة واحدة من: "تعلم"، "رياضة"، "عمل"، "ترفيه"، أو "شخصي".
  يجب أن يكون الوقت المقترح بتنسيق 12 ساعة (على سبيل المثال، 9:00 صباحًا).
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
