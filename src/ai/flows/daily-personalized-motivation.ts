'use server';

/**
 * @fileOverview Generates a personalized daily motivational message in Arabic.
 *
 * - generateDailyMotivation - A function that generates a personalized daily motivational message.
 * - DailyMotivationInput - The input type for the generateDailyMotivation function.
 * - DailyMotivationOutput - The return type for the generateDailyMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyMotivationInputSchema = z.object({
  userName: z.string().describe('The user\'s name.'),
  userAge: z.number().describe('The user\'s age.'),
  userGoal: z.string().describe('The user\'s primary goal.'),
});
export type DailyMotivationInput = z.infer<typeof DailyMotivationInputSchema>;

const DailyMotivationOutputSchema = z.object({
  motivationalMessage: z.string().describe('A personalized daily motivational message in Arabic.'),
});
export type DailyMotivationOutput = z.infer<typeof DailyMotivationOutputSchema>;

export async function generateDailyMotivation(
  input: DailyMotivationInput
): Promise<DailyMotivationOutput> {
  return dailyMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyMotivationPrompt',
  input: {schema: DailyMotivationInputSchema},
  output: {schema: DailyMotivationOutputSchema},
  prompt: `أنت خبير في تقديم رسائل تحفيزية مخصصة.

  قم بإنشاء رسالة تحفيزية يومية باللغة العربية للمستخدم:
  اسم المستخدم: {{userName}}
  عمر المستخدم: {{userAge}}
  هدف المستخدم الأساسي: {{userGoal}}

  يجب أن تكون الرسالة ملهمة ومشجعة لمساعدة المستخدم على تحقيق هدفه.
  `,
});

const dailyMotivationFlow = ai.defineFlow(
  {
    name: 'dailyMotivationFlow',
    inputSchema: DailyMotivationInputSchema,
    outputSchema: DailyMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
