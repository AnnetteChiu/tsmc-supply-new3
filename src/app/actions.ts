'use server';

import {
  generateSupplyChainSummary,
  type GenerateSupplyChainSummaryInput,
} from '@/ai/flows/generate-supply-chain-summary';
import { suggestProcessImprovement } from '@/ai/flows/suggest-process-improvement';

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

export async function suggestImprovementAction(data: GenerateSupplyChainSummaryInput): Promise<{
  suggestion: string | null;
  error: string | null;
}> {
  try {
    const result = await suggestProcessImprovement(data);
    return { suggestion: result.suggestion, error: null };
  } catch (error) {
    console.error(error);
    return { suggestion: null, error: 'Failed to generate suggestion. Please try again.' };
  }
}
