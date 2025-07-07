'use server';

import {
  generateSupplyChainSummary,
  type GenerateSupplyChainSummaryInput,
} from '@/ai/flows/generate-supply-chain-summary';
import { suggestProcessImprovement } from '@/ai/flows/suggest-process-improvement';

function getErrorMessage(error: unknown): string {
  console.error(error);
  if (error instanceof Error && error.message) {
    if (/API key not valid|permission denied|billing/i.test(error.message)) {
      return 'Failed to call the AI model. The Google API Key seems to be invalid, not enabled, or missing billing information. Please verify your setup in the Google Cloud Console and check the `/check-secret` page.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

export async function generateSummaryAction(data: GenerateSupplyChainSummaryInput): Promise<{
  summary: string | null;
  error: string | null;
}> {
  try {
    const result = await generateSupplyChainSummary(data);
    return {summary: result.summary, error: null};
  } catch (error) {
    return {summary: null, error: getErrorMessage(error)};
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
    return { suggestion: null, error: getErrorMessage(error) };
  }
}
