import Anthropic from '@anthropic-ai/sdk';

export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is not set. ' +
      'Please add it to your .env.local file.'
    );
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export const MAX_INPUT_LENGTH = 10000;

export function validateInput(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Content cannot be empty' };
  }
  if (content.length > MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: `Content exceeds ${MAX_INPUT_LENGTH} character limit`
    };
  }
  return { valid: true };
}
