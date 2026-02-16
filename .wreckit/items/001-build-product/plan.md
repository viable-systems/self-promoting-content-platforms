# Build Self-promoting Content Platforms Implementation Plan

## Implementation Plan Title

Content Repurposing Generator - AI-powered tool that transforms a single piece of content into platform-specific social media posts

## Overview

We will build a **Content Repurposing Generator** - a web tool that allows content creators to input their original content (blog post, article, or text) and automatically generate optimized versions for multiple social media platforms. The tool uses Anthropic's Claude AI to intelligently adapt content tone, length, formatting, and hashtags for each platform's unique requirements.

**Core Value Proposition**: Content creators spend hours manually adapting their work for different platforms. This tool eliminates that friction by generating ready-to-post content for LinkedIn, Twitter/X, Instagram, and email newsletters in seconds.

## Current State

The project is a blank Next.js 15 application with minimal setup:

- **Dependencies**: Only Next.js 15.4.0, React 19.1.0, and TypeScript are installed (`package.json:10-20`)
- **Application Structure**:
  - Root layout exists with basic metadata (`src/app/layout.tsx:1-15`)
  - Placeholder page displays "Building..." (`src/app/page.tsx:1-3`)
  - Tailwind CSS configured but no custom styles (`src/app/globals.css:1-4`)
- **Missing Components**:
  - No API routes in `src/app/api/`
  - No components directory
  - No type definitions
  - No Anthropic SDK integration
  - No utility functions or helpers
- **Configuration**:
  - TypeScript strict mode enabled (`tsconfig.json:11`)
  - Path alias `@/*` configured (`tsconfig.json:25-29`)
  - Tailwind scanning `src/**/*.{ts,tsx}` (`tailwind.config.ts:4`)

**Key Constraint**: The tool MUST follow INPUT → TRANSFORM → OUTPUT architecture as specified in `CLAUDE.md:6-22`. No hardcoded data arrays, no catalogs, no static dashboards.

## Desired End State

A fully functional, production-ready web tool where users can:

1. **Input**: Paste their content (up to 10,000 characters) into a text area, select target platforms (LinkedIn, Twitter/X, Instagram, Newsletter), and optionally specify tone preference
2. **Transform**: Submit to API route which uses Anthropic Claude to analyze content and generate platform-optimized versions with appropriate hashtags, formatting, and character limits
3. **Output**: View generated content in a tabbed interface, copy individual platform content to clipboard, or download all results as JSON file

**Verification Criteria**:
- User can visit the site and generate platform-specific content within 30 seconds
- Every output is unique to the user's input (no hardcoded results)
- `npm run build` succeeds with zero errors
- All API routes handle errors gracefully
- Mobile-responsive design works on devices 375px and wider

### Key Discoveries:

- **Anthropic API Key Requirement**: The API key will be available via `process.env.ANTHROPIC_API_KEY` in production (research.md:92). Must implement clear error message if missing.
- **No Database Required**: This is a stateless transformation tool - no authentication, no persistence, no file storage needed (research.md:127-129)
- **Platform-Specific Prompts**: Each platform requires unique formatting - LinkedIn (1300-3000 chars, professional), Twitter (<280 chars, thread support), Instagram (visual-first, hashtag-heavy), Newsletter (storytelling, CTA-focused) (research.md:254-258)
- **Build Success Critical**: The absolute requirement is `npm run build` with zero errors (CLAUDE.md:46)
- **Anti-Pattern Prohibition**: Must NOT create arrays of 5+ hardcoded objects for display grids (CLAUDE.md:25-32)

## What We're NOT Doing

- **URL Content Fetching**: Not supporting blog post URL scraping in MVP (too complex with CORS, paywalls, rate limiting). User must paste text content directly.
- **Streaming Responses**: Using non-streaming Anthropic API for simplicity. Can upgrade to streaming if UX feels sluggish.
- **Platform Previews**: Not showing visual previews of how content looks on each platform (too complex to maintain accuracy).
- **User Accounts/Authentication**: No database, no login, no usage tracking. Completely anonymous stateless tool.
- **Rate Limiting**: No per-user request limits in MVP. Can add if abuse becomes an issue.
- **Multiple Language Support**: Prompts are English-optimized. Will preserve input language but won't translate.
- **Content Calendar/Scheduling**: Not building scheduling features - just generate and export.
- **Analytics/Metrics**: Not tracking usage or showing analytics dashboards.

## Implementation Approach

**High-Level Strategy**: Build a minimal viable product that demonstrates clear value in the simplest possible way. Focus on the core INPUT → TRANSFORM → OUTPUT flow with one primary use case: transform text content into platform-specific social posts.

**Technical Approach**:
1. **Incremental Phases**: Each phase is independently testable and builds on the previous
2. **Type-Safe Development**: Leverage TypeScript strict mode to catch errors early
3. **Server Component First**: Use Server Components by default, only mark interactive components with `'use client'`
4. **Error Handling**: Implement graceful error handling at API and UI layers from the start
5. **Mobile-First Design**: Build responsive UI using Tailwind utility classes

**Key Decisions Made**:
- **Package Selection**: Using `lucide-react` (lightweight icons), `clsx` + `tailwind-merge` (standard Tailwind pattern), NOT adding `react-hot-toast` (will use simple inline notifications to minimize dependencies)
- **Input Limit**: 10,000 character max to prevent API abuse while accommodating long-form content
- **Non-Streaming API**: Simpler implementation, acceptable for MVP given typical response times <5 seconds
- **Text Input Only**: No URL fetching or file upload to keep scope manageable
- **Four Platforms**: LinkedIn, Twitter/X, Instagram, Newsletter - all available in MVP, user selects which to generate

---

## Phases

### Phase 1: Foundation Setup

#### Overview

Install required dependencies, establish type system, and configure Anthropic client. This phase creates the groundwork for all subsequent development.

#### Changes Required:

##### 1. Install Dependencies

**File**: `package.json`
**Changes**: Add required npm packages for AI features, icons, and utilities

```json
{
  "dependencies": {
    "next": "^15.4.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "lucide-react": "^0.468.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  }
}
```

Run `npm install` and verify `npm run build` succeeds.

##### 2. Create Type Definitions

**File**: `src/types/index.ts` (NEW)
**Changes**: Define TypeScript interfaces for entire application

```typescript
export enum Platform {
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  NEWSLETTER = 'newsletter',
}

export interface GenerateRequest {
  content: string;
  platforms: Platform[];
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

export interface PlatformContent {
  platform: Platform;
  content: string;
  hashtags: string[];
  characterCount: number;
  suggestions: string[];
}

export interface GenerateResponse {
  success: boolean;
  data?: Record<Platform, PlatformContent>;
  error?: string;
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
}
```

##### 3. Setup Anthropic Client

**File**: `src/lib/anthropic.ts` (NEW)
**Changes**: Initialize Anthropic SDK with error handling

```typescript
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    'ANTHROPIC_API_KEY environment variable is not set. ' +
    'Please add it to your .env.local file.'
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
```

##### 4. Create Platform Prompts

**File**: `src/lib/prompts.ts` (NEW)
**Changes**: Define system prompts for each platform

```typescript
import { Platform } from '@/types';

export const PLATFORM_PROMPTS: Record<Platform, string> = {
  [Platform.LINKEDIN]: `You are a LinkedIn content expert. Transform the given content into an engaging LinkedIn post that:
- Is 1300-3000 characters (LinkedIn's optimal range)
- Uses professional but conversational tone
- Includes 3-5 relevant hashtags
- Has a clear hook in the first 2 lines
- Ends with a question or call-to-action
- Uses proper formatting (short paragraphs, bullet points)
- Focuses on actionable insights and professional value
- Avoids overly promotional language

Return JSON with: { content, hashtags (array), suggestions (array of 3 posting tips) }`,

  [Platform.TWITTER]: `You are a Twitter/X content expert. Transform the given content into a compelling tweet that:
- Is under 280 characters (or create a thread with 2-3 tweets if content is substantial)
- Uses concise, punchy language
- Includes 2-3 relevant hashtags
- Has a clear hook or insight
- Uses appropriate emoji (1-2 max)
- Is formatted for easy reading

If creating a thread, format as: "Tweet 1:\\n\\n[Tweet 1 content]\\n\\n---\\n\\nTweet 2:\\n\\n[Tweet 2 content]"

Return JSON with: { content, hashtags (array), suggestions (array of 3 posting tips) }`,

  [Platform.INSTAGRAM]: `You are an Instagram content expert. Transform the given content into an engaging Instagram caption that:
- Is 150-300 characters (Instagram's optimal range for captions)
- Has visual-first language (describe what image/video would accompany)
- Uses 10-15 relevant hashtags (mix of broad and niche)
- Includes appropriate emoji (3-5 max)
- Has a clear hook and call-to-action
- Uses line breaks for readability
- Feels personal and authentic

Return JSON with: { content, hashtags (array), suggestions (array of 3 posting tips) }`,

  [Platform.NEWSLETTER]: `You are a newsletter writing expert. Transform the given content into an engaging newsletter section that:
- Is 200-500 words
- Uses personal, conversational tone
- Tells a story or shares an insight
- Has a clear narrative flow
- Includes a strong call-to-action
- Uses "you" to address the reader directly
- Feels like advice from a knowledgeable friend
- Has a compelling subject line (first line)

Return JSON with: { content, hashtags (empty array), suggestions (array of 3 tips for newsletter engagement) }`,
};

export function getSystemPrompt(platform: Platform): string {
  return PLATFORM_PROMPTS[platform];
}
```

##### 5. Create Utility Functions

**File**: `src/lib/utils.ts` (NEW)
**Changes**: Helper functions for class names and platform info

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform, PlatformInfo } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLATFORM_INFO: Record<Platform, PlatformInfo> = {
  [Platform.LINKEDIN]: {
    id: Platform.LINKEDIN,
    name: 'LinkedIn',
    icon: 'Linkedin',
    color: 'bg-blue-600',
    description: 'Professional post (1300-3000 chars)',
  },
  [Platform.TWITTER]: {
    id: Platform.TWITTER,
    name: 'Twitter/X',
    icon: 'X',
    color: 'bg-black',
    description: 'Concise tweet or thread (<280 chars)',
  },
  [Platform.INSTAGRAM]: {
    id: Platform.INSTAGRAM,
    name: 'Instagram',
    icon: 'Instagram',
    color: 'bg-gradient-to-br from-purple-600 to-pink-600',
    description: 'Visual caption with hashtags (150-300 chars)',
  },
  [Platform.NEWSLETTER]: {
    id: Platform.NEWSLETTER,
    name: 'Newsletter',
    icon: 'Mail',
    color: 'bg-emerald-600',
    description: 'Personal, storytelling (200-500 words)',
  },
};

export function getCharacterCount(text: string): number {
  return text.length;
}
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build` (after package installation)
- [ ] Type checking passes: No TypeScript errors in new files
- [ ] Imports resolve: Path alias `@/` works correctly
- [ ] Environment variable check: Code throws clear error if ANTHROPIC_API_KEY missing

##### Manual Verification:

- [ ] Packages install without conflicts
- [ ] New files follow TypeScript strict mode
- [ ] Anthropic client initializes correctly when API key is present
- [ ] Type definitions cover all planned use cases

**Note**: Complete all automated verification, then pause for manual confirmation before proceeding to Phase 2.

---

### Phase 2: API Implementation

#### Overview

Build the POST endpoint that processes user content and generates platform-specific versions using Anthropic's Claude API. This is the core TRANSFORM layer.

#### Changes Required:

##### 1. Create Generate API Route

**File**: `src/app/api/generate/route.ts` (NEW)
**Changes**: Implement POST handler for content generation

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { anthropic, validateInput } from '@/lib/anthropic';
import { getSystemPrompt } from '@/lib/prompts';
import { Platform, GenerateRequest, PlatformContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
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
          model: 'claude-3-5-sonnet-20241022',
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
```

##### 2. Add API Type Safety

**File**: `src/types/api.ts` (NEW)
**Changes**: Additional API-specific types

```typescript
export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: Record<string, import('./index').PlatformContent>;
}

export type ApiResponse = ApiErrorResponse | ApiSuccessResponse;
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: API route types are correct
- [ ] Route compiles: No TypeScript errors in route.ts

##### Manual Verification:

- [ ] Test with curl: `curl -X POST http://localhost:3000/api/generate -H "Content-Type: application/json" -d '{"content":"Test content","platforms":["linkedin"]}'`
- [ ] Error handling works: Missing API key shows clear error
- [ ] Validation works: Empty content returns 400 error
- [ ] Anthropic API integration: Successful request generates platform content
- [ ] JSON parsing: Response correctly extracts and parses JSON from AI response

**Note**: Complete all automated verification, then pause for manual confirmation before proceeding to Phase 3.

---

### Phase 3: User Interface - Input Components

#### Overview

Build the input form and supporting UI components. This creates the INPUT layer where users provide their content and select options.

#### Changes Required:

##### 1. Create Platform Selector Component

**File**: `src/components/PlatformSelector.tsx` (NEW)
**Changes**: Checkbox group for platform selection

```typescript
'use client';

import { Platform } from '@/types';
import { PLATFORM_INFO } from '@/lib/utils';
import { Linkedin, X as TwitterIcon, Instagram, Mail } from 'lucide-react';

const iconMap = {
  [Platform.LINKEDIN]: Linkedin,
  [Platform.TWITTER]: TwitterIcon,
  [Platform.INSTAGRAM]: Instagram,
  [Platform.NEWSLETTER]: Mail,
};

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  function togglePlatform(platform: Platform) {
    if (selected.includes(platform)) {
      onChange(selected.filter(p => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Platforms
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(Platform).map((platform) => {
          const info = PLATFORM_INFO[platform];
          const Icon = iconMap[platform];
          const isSelected = selected.includes(platform);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => togglePlatform(platform)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${info.color} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {info.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {info.description}
                </div>
              </div>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

##### 2. Create Content Form Component

**File**: `src/components/ContentForm.tsx` (NEW)
**Changes**: Main input form with content area and options

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { Platform } from '@/types';
import { PlatformSelector } from './PlatformSelector';
import { Loader2, Sparkles } from 'lucide-react';

interface ContentFormProps {
  onSubmit: (data: { content: string; platforms: Platform[]; tone: string }) => void;
  isLoading: boolean;
}

export function ContentForm({ onSubmit, isLoading }: ContentFormProps) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.LINKEDIN,
    Platform.TWITTER,
  ]);
  const [tone, setTone] = useState<'professional' | 'casual' | 'enthusiastic'>('professional');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (content.trim() && selectedPlatforms.length > 0) {
      onSubmit({ content, platforms: selectedPlatforms, tone });
    }
  }

  function loadExample() {
    setContent(`# 5 Ways AI is Transforming Content Marketing

AI is revolutionizing how marketers create, distribute, and optimize content. Here are the key changes:

1. **Personalized Content at Scale** - AI analyzes user behavior to create tailored content for different segments
2. **Automated Repurposing** - Turn one blog post into social posts, emails, and more automatically
3. **Data-Driven Insights** - AI identifies trending topics and optimal posting times
4. **Enhanced Creativity** - AI generates ideas and drafts that humans refine and personalize
5. **Performance Optimization** - Machine learning optimizes headlines, images, and CTAs

The future isn't AI replacing marketers - it's marketers who leverage AI outperforming those who don't.`);
  }

  const isValid = content.trim().length > 0 && selectedPlatforms.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Content Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Content
          </label>
          <button
            type="button"
            onClick={loadExample}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            Load Example
          </button>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your blog post, article, or any content you want to repurpose..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          maxLength={10000}
        />
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {content.length} / 10,000 characters
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tone
        </label>
        <div className="flex gap-3">
          {(['professional', 'casual', 'enthusiastic'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tone"
                value={t}
                checked={tone === t}
                onChange={(e) => setTone(e.target.value as typeof tone)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <PlatformSelector selected={selectedPlatforms} onChange={setSelectedPlatforms} />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-white
          transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          ${isValid && !isLoading
            ? 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Platform Content
          </>
        )}
      </button>
    </form>
  );
}
```

##### 3. Create Copy Button Component

**File**: `src/components/CopyButton.tsx` (NEW)
**Changes**: Reusable copy-to-clipboard button

```typescript
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
        ${copied
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }
      `}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: All component props are correctly typed
- [ ] No client component hydration errors

##### Manual Verification:

- [ ] Platform selector toggles platforms correctly
- [ ] Content area accepts text input and shows character count
- [ ] "Load Example" button populates textarea
- [ ] Submit button enables/disables based on form validity
- [ ] Copy button changes state when clicked

**Note**: Complete all automated verification, then pause for manual confirmation before proceeding to Phase 4.

---

### Phase 4: User Interface - Results Display

#### Overview

Build the results display component that shows generated content with copy functionality. This creates the OUTPUT layer.

#### Changes Required:

##### 1. Create Results Display Component

**File**: `src/components/ResultsDisplay.tsx` (NEW)
**Changes**: Tabbed interface showing generated content per platform

```typescript
'use client';

import { useState } from 'react';
import { Platform, PlatformContent } from '@/types';
import { PLATFORM_INFO } from '@/lib/utils';
import { CopyButton } from './CopyButton';
import { Download, Lightbulb, Hash } from 'lucide-react';

interface ResultsDisplayProps {
  results: Record<string, PlatformContent>;
  onRegenerate: () => void;
}

export function ResultsDisplay({ results, onRegenerate }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<Platform>(
    Object.keys(results)[0] as Platform
  );

  const platforms = Object.keys(results) as Platform[];
  const activeContent = results[activeTab];

  function downloadAll() {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-repurposing-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Generated Content
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors"
          >
            Regenerate
          </button>
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {platforms.map((platform) => {
          const info = PLATFORM_INFO[platform];
          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`
                px-4 py-2 font-medium transition-colors border-b-2 -mb-px
                ${activeTab === platform
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {info.name}
            </button>
          );
        })}
      </div>

      {/* Content Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${PLATFORM_INFO[activeTab].color} text-white`}>
              <span className="font-bold text-lg">
                {PLATFORM_INFO[activeTab].name[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {PLATFORM_INFO[activeTab].name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeContent.characterCount} characters
              </p>
            </div>
          </div>
          <CopyButton text={activeContent.content} />
        </div>

        {/* Generated Content */}
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {activeContent.content}
          </p>
        </div>

        {/* Hashtags */}
        {activeContent.hashtags.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Hash className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Suggested Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeContent.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {activeContent.suggestions.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Pro Tips
              </h4>
              <ul className="space-y-1">
                {activeContent.suggestions.map((tip, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

##### 2. Create Loading Spinner Component

**File**: `src/components/LoadingSpinner.tsx` (NEW)
**Changes**: Animated loading indicator

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        Generating your content...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        This may take 10-30 seconds
      </p>
    </div>
  );
}
```

##### 3. Create Error Message Component

**File**: `src/components/ErrorMessage.tsx` (NEW)
**Changes**: Styled error display

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-1">
            Something went wrong
          </h3>
          <p className="text-red-700 dark:text-red-400 mb-3">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: All props correctly typed
- [ ] No console errors

##### Manual Verification:

- [ ] Results display shows platform tabs correctly
- [ ] Tab switching updates displayed content
- [ ] Copy button copies content to clipboard
- [ ] Download button creates JSON file
- [ ] Hashtags and suggestions display when present
- [ ] Loading spinner displays during generation
- [ ] Error message shows on API failure

**Note**: Complete all automated verification, then pause for manual confirmation before proceeding to Phase 5.

---

### Phase 5: Main Page Integration

#### Overview

Integrate all components into the main page, add styling, and implement the complete user flow from INPUT → TRANSFORM → OUTPUT.

#### Changes Required:

##### 1. Rebuild Main Page

**File**: `src/app/page.tsx`
**Changes**: Complete rewrite as Server Component with client-side interactivity

```typescript
'use client';

import { useState } from 'react';
import { ContentForm } from '@/components/ContentForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Platform, PlatformContent } from '@/types';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [state, setState] = useState<AppState>('idle');
  const [results, setResults] = useState<Record<string, PlatformContent> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<{ content: string; platforms: Platform[]; tone: string } | null>(null);

  async function handleSubmit(data: { content: string; platforms: Platform[]; tone: string }) {
    setState('loading');
    setError(null);
    setLastInput(data);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate content');
      }

      setResults(result.data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  }

  function handleReset() {
    setState('idle');
    setResults(null);
    setError(null);
  }

  function handleRegenerate() {
    if (lastInput) {
      handleSubmit(lastInput);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Content Repurposing Generator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Transform your content into platform-specific social media posts in seconds
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {state === 'idle' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <ContentForm onSubmit={handleSubmit} isLoading={false} />
            </div>

            {/* How It Works */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Paste Your Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your blog post, article, or any text up to 10,000 characters
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Select Platforms</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose which platforms to generate content for
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Copy & Post</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get optimized content ready to post immediately
                </p>
              </div>
            </div>
          </div>
        )}

        {state === 'loading' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <LoadingSpinner />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <ErrorMessage message={error || 'Unknown error'} onRetry={handleReset} />
            </div>
          </div>
        )}

        {state === 'success' && results && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <ResultsDisplay results={results} onRegenerate={handleRegenerate} />
            </div>

            {/* New Content Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Create New Content
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by Anthropic Claude • Built with Next.js 15 & React 19</p>
        </div>
      </footer>
    </div>
  );
}
```

##### 2. Update Root Layout

**File**: `src/app/layout.tsx`
**Changes**: Add better metadata and dark mode support

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Repurposing Generator | Transform Content for Social Media',
  description: 'AI-powered tool that transforms your content into platform-specific posts for LinkedIn, Twitter, Instagram, and newsletters. Copy and post in seconds.',
  openGraph: {
    title: 'Content Repurposing Generator',
    description: 'Transform one piece of content into multiple platform-specific social media posts instantly',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

##### 3. Add Global Styles

**File**: `src/app/globals.css`
**Changes**: Add custom utilities and dark mode support

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200 dark:border-gray-700;
  }

  body {
    @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build` (ZERO ERRORS - this is critical)
- [ ] Type checking passes: No TypeScript errors
- [ ] No console warnings in development mode

##### Manual Verification:

- [ ] Complete user flow works: input → submit → results → copy
- [ ] Page displays correctly at mobile viewport (375px)
- [ ] Dark mode styling looks correct
- [ ] "Load Example" button populates form
- [ ] Platform selection works
- [ ] Loading state displays during generation
- [ ] Results display with tabs works
- [ ] Copy buttons copy content to clipboard
- [ ] Download button generates JSON file
- [ ] Error handling works (try without API key)
- [ ] "Create New Content" button resets form

**Note**: Complete all automated and manual verification. This is the final phase.

---

## Testing Strategy

### Unit Tests:

- **Not implementing unit tests for MVP**: The focus is on getting a working tool quickly. Unit tests can be added post-MVP if needed.
- **TypeScript as validation**: Strict TypeScript mode provides compile-time type safety.

### Integration Tests:

- **Manual API testing**: Use curl or Postman to test `/api/generate` endpoint directly
- **End-to-end user flow**: Test complete path from form submission to content generation

### Manual Testing Steps:

1. **Setup Verification**:
   - Run `npm install` - verify no dependency conflicts
   - Run `npm run build` - verify zero errors
   - Run `npm run dev` - verify dev server starts
   - Set `ANTHROPIC_API_KEY` in `.env.local`

2. **Input Form Testing**:
   - Try submitting empty content - should show validation error
   - Try submitting with no platforms selected - should show validation error
   - Click "Load Example" - should populate textarea
   - Type content and verify character count updates
   - Select/deselect platforms - checkboxes should update

3. **API Testing**:
   - Test with curl: `curl -X POST http://localhost:3000/api/generate -H "Content-Type: application/json" -d '{"content":"Test post about AI","platforms":["linkedin","twitter"],"tone":"professional"}'`
   - Verify response includes `success: true`
   - Verify response includes generated content for both platforms
   - Test error case: send empty content - should return 400
   - Test error case: send without API key - should return 500 with clear error

4. **Results Display Testing**:
   - Submit valid content and wait for generation
   - Verify results display with platform tabs
   - Click each tab - verify content switches
   - Click copy button - verify content is copied to clipboard
   - Verify hashtags display for LinkedIn/Twitter/Instagram
   - Verify suggestions display
   - Click download button - verify JSON file downloads
   - Click "Regenerate" - should regenerate with same input

5. **Error Handling Testing**:
   - Temporarily remove `ANTHROPIC_API_KEY` and try submitting - should show clear error
   - Submit very long content (>10,000 chars) - should show validation error
   - Disconnect internet and submit - should show network error

6. **Responsive Design Testing**:
   - Open browser DevTools and set viewport to 375px (iPhone SE)
   - Verify form stacks vertically on mobile
   - Verify platform selector becomes single column
   - Verify results tabs wrap on small screens
   - Test on 768px (tablet) and 1024px (desktop)

7. **Cross-Browser Testing**:
   - Test in Chrome (primary)
   - Test in Firefox (if available)
   - Test in Safari (if on Mac)
   - Verify copy button works in all browsers

8. **Production Build Testing**:
   - Run `npm run build` - verify zero errors
   - Run `npm run start` - verify production build works
   - Test all user flows in production mode

## Migration Notes

No migration required - this is a greenfield project with no existing data or systems to migrate.

## References

- Research: `/private/tmp/vaos-builds/self-promoting-content-platforms/.wreckit/items/001-build-product/research.md`
- Architecture Guidelines: `/private/tmp/vaos-builds/self-promoting-content-platforms/CLAUDE.md:6-22`
- Current Dependencies: `/private/tmp/vaos-builds/self-promoting-content-platforms/package.json:10-20`
- TypeScript Config: `/private/tmp/vaos-builds/self-promoting-content-platforms/tsconfig.json:11` (strict mode)
- Tailwind Config: `/private/tmp/vaos-builds/self-promoting-content-platforms/tailwind.config.ts:4` (content paths)
- Path Aliases: `/private/tmp/vaos-builds/self-promoting-content-platforms/tsconfig.json:25-29`
