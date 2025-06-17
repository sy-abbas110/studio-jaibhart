'use server';

/**
 * @fileOverview A student status determination AI agent.
 *
 * - determineStudentStatus - A function that determines the student's status.
 * - DetermineStudentStatusInput - The input type for the determineStudentStatus function.
 * - DetermineStudentStatusOutput - The return type for the determineStudentStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineStudentStatusInputSchema = z.object({
  enrollmentDate: z
    .string()
    .describe('The date the student enrolled in the course.'),
  courseDuration: z
    .string()
    .describe('The duration of the course in months or years.'),
  graduationDate: z
    .string()
    .nullable()
    .describe('The date the student graduated, if applicable. Null if not graduated.'),
  currentDate: z.string().describe('The current date.'),
  courseName: z.string().describe('The name of the course the student is enrolled in.'),
});
export type DetermineStudentStatusInput = z.infer<typeof DetermineStudentStatusInputSchema>;

const DetermineStudentStatusOutputSchema = z.object({
  status: z
    .string()
    .describe(
      "The student's status, which should be 'Completed' if graduated, or 'Ongoing' if not."
    ),
});
export type DetermineStudentStatusOutput = z.infer<typeof DetermineStudentStatusOutputSchema>;

export async function determineStudentStatus(input: DetermineStudentStatusInput): Promise<DetermineStudentStatusOutput> {
  return determineStudentStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineStudentStatusPrompt',
  input: {schema: DetermineStudentStatusInputSchema},
  output: {schema: DetermineStudentStatusOutputSchema},
  prompt: `You are an expert in determining student status based on enrollment date, course duration, graduation date, and the current date.

  Given the following information, determine whether the student's status is 'Completed' or 'Ongoing'.

  Enrollment Date: {{{enrollmentDate}}}
  Course Duration: {{{courseDuration}}}
  Graduation Date: {{{graduationDate}}}
  Current Date: {{{currentDate}}}
  Course Name: {{{courseName}}}

  Consider the course duration and enrollment date to estimate the expected graduation date if the graduation date is not explicitly provided.
  If the graduation date is provided and is before the current date, the status should be 'Completed'.
  If the graduation date is not provided, or is in the future, the status should be 'Ongoing'.

  Return the status as accurately as possible.
  `,
});

const determineStudentStatusFlow = ai.defineFlow(
  {
    name: 'determineStudentStatusFlow',
    inputSchema: DetermineStudentStatusInputSchema,
    outputSchema: DetermineStudentStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
