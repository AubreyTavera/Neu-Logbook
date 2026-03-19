'use server';
/**
 * @fileOverview A Genkit flow for generating a summary report of visitor activity.
 *
 * - generateUsageInsightsReport - A function that handles the generation of visitor insights reports.
 * - GenerateUsageInsightsReportInput - The input type for the generateUsageInsightsReport function.
 * - GenerateUsageInsightsReportOutput - The return type for the generateUsageInsightsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisitRecordSchema = z.object({
  timestamp: z.string().describe('ISO string format of the visit timestamp.'),
  department: z.string().describe('The college department of the visitor.'),
  reasonForVisit: z.string().describe('The reason for the visit.'),
});

const GenerateUsageInsightsReportInputSchema = z.object({
  visitRecords: z.array(VisitRecordSchema).describe('An array of historical visit records.'),
});
export type GenerateUsageInsightsReportInput = z.infer<
  typeof GenerateUsageInsightsReportInputSchema
>;

const GenerateUsageInsightsReportOutputSchema = z.object({
  summaryReport:
    z.string().describe('A summary report of visitor activity, including busiest hours and most common reasons for visits.'),
});
export type GenerateUsageInsightsReportOutput = z.infer<
  typeof GenerateUsageInsightsReportOutputSchema
>;

export async function generateUsageInsightsReport(
  input: GenerateUsageInsightsReportInput
): Promise<GenerateUsageInsightsReportOutput> {
  return generateUsageInsightsReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUsageInsightsReportPrompt',
  input: {schema: GenerateUsageInsightsReportInputSchema},
  output: {schema: GenerateUsageInsightsReportOutputSchema},
  prompt: `You are an AI assistant tasked with generating a summary report of visitor activity.
Analyze the provided historical visit records and identify the busiest hours of the day and the most common reasons for visits.

Based on the data, provide a concise summary report. The report should clearly state the busiest hours of the day and list the most common reasons for visits, along with any other notable trends you observe.

Historical Visit Data:
{{#each visitRecords}}
- Timestamp: {{this.timestamp}}, Department: {{this.department}}, Reason: {{this.reasonForVisit}}
{{/each}}
`,
});

const generateUsageInsightsReportFlow = ai.defineFlow(
  {
    name: 'generateUsageInsightsReportFlow',
    inputSchema: GenerateUsageInsightsReportInputSchema,
    outputSchema: GenerateUsageInsightsReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
