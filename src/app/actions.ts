'use server';

import {
  generateSupplyChainSummary,
  type GenerateSupplyChainSummaryInput,
} from '@/ai/flows/generate-supply-chain-summary';
import { suggestProcessImprovement } from '@/ai/flows/suggest-process-improvement';

function getErrorMessage(error: unknown): string {
  // Log the full error to the server console for debugging
  console.error('An error occurred:', error);

  // If it's a standard Error object, provide detailed info
  if (error instanceof Error) {
    return `[${error.name}] ${error.message}\n\nStack Trace:\n${error.stack}`;
  }

  // If it's not an Error object, try to serialize it to JSON
  try {
    return `An unexpected error occurred. Full error details:\n\n${JSON.stringify(
      error,
      null,
      2
    )}`;
  } catch (e) {
    // If serialization fails (e.g., circular references)
    return `An unknown and non-serializable error occurred. Please check the server logs for the full error object.`;
  }
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

export async function checkApiKeyAction(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const result = await generateSupplyChainSummary({ linkDetails: "This is a test to validate the API key." });
    if (result.summary) {
        return { success: true, error: null };
    }
    return { success: false, error: 'AI model returned an empty response.' };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}
