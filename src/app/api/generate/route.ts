import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, validateInput } from '@/lib/anthropic';
import { getSystemPrompt } from '@/lib/prompts';
import { Platform, GenerateRequest, PlatformContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const anthropic = getAnthropicClient();

    const body: GenerateRequest = await request.json();
    const { content, platforms, tone = 'professional' } = body;

    // Validate input
    const validation = validateInput(content);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one platform must be selected' },
        { status: 400 }
      );
    }

    // Generate content for each platform
    const results: Record<string, PlatformContent> = {};

    for (const platform of platforms) {
      try {
        const systemPrompt = getSystemPrompt(platform);

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Transform this content for ${platform} with a ${tone} tone:\n\n${content}`,
            },
          ],
        });

        // Parse the response (expecting JSON)
        const responseText = message.content[0].type === 'text'
          ? message.content[0].text
          : '{}';

        // Extract JSON from markdown code blocks if present
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                         responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error('No valid JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

        results[platform] = {
          platform,
          content: parsed.content || '',
          hashtags: parsed.hashtags || [],
          characterCount: parsed.content?.length || 0,
          suggestions: parsed.suggestions || [],
        };
      } catch (error) {
        console.error(`Error generating for ${platform}:`, error);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to generate content for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}