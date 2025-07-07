'use server';

/**
 * @fileOverview An AI agent that suggests process improvements for a supply chain link.
 *
 * - suggestProcessImprovement - A function that suggests improvements for a supply chain link.
 * - SuggestProcessImprovementInput - The input type for the suggestProcessImprovement function.
 * - SuggestProcessImprovementOutput - The return type for the suggestProcessImprovement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProcessImprovementInputSchema = z.object({
  linkDetails: z
    .string()
    .describe('Details of the specific link in the supply chain to analyze.'),
  quantitativeData: z
    .string()
    .optional()
    .describe('Quantitative data related to the supply chain link.'),
});
export type SuggestProcessImprovementInput = z.infer<typeof SuggestProcessImprovementInputSchema>;

const SuggestProcessImprovementOutputSchema = z.object({
  suggestion: z.string().describe('An actionable suggestion for process improvement.'),
});
export type SuggestProcessImprovementOutput = z.infer<typeof SuggestProcessImprovementOutputSchema>;

export async function suggestProcessImprovement(input: SuggestProcessImprovementInput): Promise<SuggestProcessImprovementOutput> {
  return suggestProcessImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProcessImprovementPrompt',
  input: {schema: SuggestProcessImprovementInputSchema},
  output: {schema: SuggestProcessImprovementOutputSchema},
  prompt: `You are an expert in supply chain optimization and process improvement.

  Analyze the following supply chain link details and quantitative data.
  Based on this information, provide a concise, actionable suggestion for process improvement.
  Focus on potential bottlenecks, inefficiencies, or areas for cost reduction.

  Link Details: {{{linkDetails}}}
  {{#if quantitativeData}}
  Quantitative Data: {{{quantitativeData}}}
  {{/if}}
  `,
});

const suggestProcessImprovementFlow = ai.defineFlow(
  {
    name: 'suggestProcessImprovementFlow',
    inputSchema: SuggestProcessImprovementInputSchema,
    outputSchema: SuggestProcessImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
