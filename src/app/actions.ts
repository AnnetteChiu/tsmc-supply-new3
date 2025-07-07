'use server';

import {
  generateSupplyChainSummary,
  type GenerateSupplyChainSummaryInput,
} from '@/ai/flows/generate-supply-chain-summary';

export async function generateSummaryAction(data: GenerateSupplyChainSummaryInput): Promise<{
  summary: string | null;
  error: string | null;
}> {
  try {
    const result = await generateSupplyChainSummary(data);
    return {summary: result.summary, error: null};
  } catch (error) {
    console.error(error);
    return {summary: null, error: 'Failed to generate summary. Please try again.'};
  }
}
