'use server';

import {
  generateSupplyChainSummary,
  type GenerateSupplyChainSummaryInput,
} from '@/ai/flows/generate-supply-chain-summary';
import { suggestProcessImprovement } from '@/ai/flows/suggest-process-improvement';

function getErrorMessage(error: unknown): string {
  console.error('An error occurred:', error);
  if (error instanceof Error) {
    if (error.message) {
      if (/API key not valid/i.test(error.message)) {
        return 'Failed to call the AI model. The Google API Key seems to be invalid. Please verify the key in Google AI Studio and update the GOOGLE_API_KEY secret.';
      }
      if (/permission denied/i.test(error.message) && /billing/i.test(error.message)) {
        return 'Billing is not enabled for this project. Please go to the Google Cloud Console, enable billing for the "business-website-deployer" project, and try again.';
      }
      if (/permission denied/i.test(error.message)) {
        return 'The application does not have permission to access the required Google Cloud service (e.g., Secret Manager or the AI API). Please check the IAM permissions in the Google Cloud Console.';
      }
      return error.message;
    }
  }
  try {
    return `A non-standard error occurred: ${JSON.stringify(error, null, 2)}`;
  } catch {
    return 'An unknown and non-serializable error occurred. Please check the server logs for more details.';
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
