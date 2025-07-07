'use server';

/**
 * @fileOverview A supply chain link summarization AI agent.
 *
 * - generateSupplyChainSummary - A function that handles the supply chain link summarization process.
 * - GenerateSupplyChainSummaryInput - The input type for the generateSupplyChainSummary function.
 * - GenerateSupplyChainSummaryOutput - The return type for the generateSupplyChainSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupplyChainSummaryInputSchema = z.object({
  linkDetails: z
    .string()
    .describe('Details of the specific link in the supply chain to summarize.'),
  quantitativeData: z
    .string()
    .optional()
    .describe('Quantitative data related to the supply chain link.'),
});
export type GenerateSupplyChainSummaryInput = z.infer<typeof GenerateSupplyChainSummaryInputSchema>;

const GenerateSupplyChainSummaryOutputSchema = z.object({
  summary: z.string().describe('AI-generated summary of the supply chain link.'),
});
export type GenerateSupplyChainSummaryOutput = z.infer<typeof GenerateSupplyChainSummaryOutputSchema>;

export async function generateSupplyChainSummary(input: GenerateSupplyChainSummaryInput): Promise<GenerateSupplyChainSummaryOutput> {
  return generateSupplyChainSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupplyChainSummaryPrompt',
  input: {schema: GenerateSupplyChainSummaryInputSchema},
  output: {schema: GenerateSupplyChainSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in supply chain management.

  You are provided with details about a specific link in the supply chain and asked to create a concise summary.
  If available, incorporate quantitative data to enhance the summary. The quantitative data should be use to augment the summary.

  Link Details: {{{linkDetails}}}
  {{#if quantitativeData}}
  Quantitative Data: {{{quantitativeData}}}
  {{/if}}
  `,
});

const generateSupplyChainSummaryFlow = ai.defineFlow(
  {
    name: 'generateSupplyChainSummaryFlow',
    inputSchema: GenerateSupplyChainSummaryInputSchema,
    outputSchema: GenerateSupplyChainSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
