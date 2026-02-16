# Research: Build Self-promoting Content Platforms

**Date**: 2025-06-17
**Item**: 001-build-product

## Research Question

Build a production-ready web TOOL called "Self-promoting Content Platforms".

Product derived from radar signal: Self-promoting Content Platforms. Source: agent.

## Product Spec (YOU MUST DESIGN THIS)
Before writing any code, decide:
1. What does the user INPUT? (text, URL, file, form data)
2. What does the app DO with it? (analyze, generate, convert, extract)
3. What does the user GET back? (report, score, download, visualization)

The product "Self-promoting Content Platforms" must be a TOOL, not a dashboard. The user must be able to:
- Provide their own data as input
- Get a unique, useful output based on that input
- Export or use the result immediately

Additional features:
- Simple and focused
- Built by AI agents
- Free and open source

## Architecture Requirements
1. MUST have a form/input on the main page where the user provides data
2. MUST have at least one API route (src/app/api/) that processes the input
3. MUST display results that change based on user input
4. MUST have a way to copy/download/export the output
5. MUST NOT have hardcoded data arrays with 5+ items displayed in grids — if you're tempted to create a catalog, STOP and build a tool instead

## What NOT to Build
- Static dashboards with fake metrics
- Technology catalogs with hardcoded entries
- Comparison grids with pre-filled data
- Landing pages without working tools

## Tech Stack (already configured)
Next.js 15, React 19, TypeScript, Tailwind CSS. Add npm packages as needed.
For AI features: use Anthropic SDK with process.env.ANTHROPIC_API_KEY

After implementation, `npm run build` must succeed with zero errors.

## Summary

The project is a blank Next.js 15 application with React 19, TypeScript, and Tailwind CSS configured. The current implementation consists of only a skeleton structure with a placeholder page (`src/app/page.tsx:1-3`) that displays "Building...". No API routes, components, or business logic exist yet.

Based on the product name "Self-promoting Content Platforms," I propose building a **Content Repurposing Generator** - a tool that helps content creators transform a single piece of content into multiple platform-specific formats. This aligns with the concept of "self-promoting content" by enabling creators to efficiently promote their work across multiple channels.

**Product Design:**
- **INPUT**: User provides source content (blog post URL, text paste, or topic description) and selects target platforms (LinkedIn, Twitter/X, Instagram, Email Newsletter)
- **TRANSFORM**: AI analyzes the content and generates platform-optimized versions with appropriate tone, length, formatting, and hashtags
- **OUTPUT**: Downloadable/copyable content package with platform-specific variations, hashtag suggestions, and posting recommendations

The tool will use the Anthropic API via `@anthropic-ai/sdk` to intelligently adapt content for different social media platforms' unique requirements and best practices.

## Current State Analysis

### Existing Implementation

The project is in its initial state with minimal setup:

**Configuration Files:**
- `package.json:1-21` - Standard Next.js 15.4.0 and React 19.1.0 setup with TypeScript dependencies
- `tsconfig.json:1-40` - TypeScript configuration with strict mode enabled and path aliases (`@/*` → `./src/*`)
- `tailwind.config.ts:1-10` - Basic Tailwind CSS configuration scanning `src/**/*.{ts,tsx}`
- `next.config.ts:1-6` - Empty Next.js configuration (no customizations)
- `postcss.config.mjs:1-10` - PostCSS configuration with Tailwind and Autoprefixer plugins

**Application Structure:**
- `src/app/layout.tsx:1-15` - Root layout with basic metadata (title: "Self-promoting Content Platforms")
- `src/app/page.tsx:1-3` - Placeholder home page with "Building..." text
- `src/app/globals.css:1-4` - Tailwind CSS directives only

**Documentation:**
- `CLAUDE.md:1-67` - Comprehensive build guidelines emphasizing the INPUT → TRANSFORM → OUTPUT architecture pattern and explicitly prohibiting static dashboards, catalogs, and hardcoded data arrays

**Project State:**
- No API routes exist in `src/app/api/`
- No components directory
- No utility functions or helpers
- No state management setup
- No API client configurations
- No error handling patterns established
- No loading state patterns
- Git repository initialized with initial commit

**Integration Points:**
- Anthropic API key will be available via `process.env.ANTHROPIC_API_KEY` (not yet configured)
- No external integrations currently set up
- No database or persistence layer required (stateless tool)

## Key Files

- `package.json:1-21` - Current dependencies include Next.js 15.4.0, React 19.1.0, and TypeScript. Need to add: `@anthropic-ai/sdk` for AI features
- `src/app/page.tsx:1-3` - Current placeholder. Will become main tool interface with input form and results display
- `src/app/layout.tsx:4-7` - Basic metadata already configured. May need enhancement with Open Graph tags
- `tsconfig.json:25-29` - Path alias `@/*` configured. Should use this for cleaner imports (`@/components/...`, `@/lib/...`)
- `CLAUDE.md:6-22` - Critical architecture requirements. Must follow INPUT → TRANSFORM → OUTPUT pattern strictly
- `src/app/globals.css:1-4` - Only Tailwind directives. Will need custom styles for the tool interface

**Files to Create:**
- `src/app/api/generate/route.ts` - POST endpoint to process content and generate platform-specific versions
- `src/components/ContentForm.tsx` - Input form for source content and platform selection
- `src/components/ResultsDisplay.tsx` - Display generated content with copy/download functionality
- `src/lib/anthropic.ts` - Anthropic client initialization and utilities
- `src/types/index.ts` - TypeScript interfaces for platform types, content formats, API responses

## Technical Considerations

### Dependencies

**Required New Packages:**
1. `@anthropic-ai/sdk` - Official Anthropic SDK for AI-powered content generation
2. `react-icons` or `lucide-react` - Icons for platform selection and UI elements (lightweight option)
3. `react-hot-toast` or similar - User-friendly notifications for copy/download actions
4. `clsx` and `tailwind-merge` - Conditional class name utilities (standard Tailwind pattern)

**Optional Considerations:**
- `zod` - Runtime type validation for API inputs
- `@types/react` - Already in devDependencies (v19.0.0), verify compatibility

**No Additional Infrastructure:**
- No database needed (stateless transformation tool)
- No authentication required (public tool)
- No file storage needed (results displayed/downloaded immediately)

### Patterns to Follow

**Next.js 15 App Router Patterns:**
- API routes as Route Handlers in `src/app/api/*/route.ts`
- Server Components by default, Client Components marked with `'use client'` directive
- Async Server Components for data fetching
- Form submissions via native `fetch` API or `useFormState` hook

**TypeScript Patterns:**
- Strict mode already enabled in `tsconfig.json:11`
- Define interfaces for all API request/response shapes
- Use generic types for reusable components
- Export types from `src/types/index.ts` for consistency

**Tailwind CSS Patterns:**
- Use utility classes for layout (flex, grid, spacing)
- Implement responsive design with `md:`, `lg:` breakpoints
- Dark mode support optional but recommended for developer tools
- Custom component styles in `src/components/` with consistent naming

**State Management Patterns:**
- React 19 state management: `useState`, `useReducer`, or `useFormState`
- Loading states during API calls
- Error boundaries for graceful error handling
- Optimistic UI updates where applicable

**Component Architecture:**
```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # POST endpoint for content generation
│   ├── layout.tsx                # Root layout (exists)
│   ├── page.tsx                  # Main tool page (to be rebuilt)
│   └── globals.css               # Global styles (exists)
├── components/
│   ├── ContentForm.tsx           # Input form (Client Component)
│   ├── PlatformSelector.tsx      # Platform selection checkboxes
│   ├── ResultsDisplay.tsx        # Generated content display
│   └── CopyButton.tsx            # Reusable copy-to-clipboard button
├── lib/
│   ├── anthropic.ts              # Anthropic client setup
│   ├── prompts.ts                # System prompts for different platforms
│   └── utils.ts                  # Helper functions
└── types/
    └── index.ts                  # TypeScript interfaces
```

**API Route Pattern:**
```typescript
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    // Process with Anthropic
    // Return generated content
  } catch (error) {
    // Handle errors
  }
}
```

**Error Handling:**
- API errors returned with proper HTTP status codes (400, 500, etc.)
- User-friendly error messages displayed in UI
- Loading indicators during processing
- Client-side validation before API calls

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Anthropic API key not available in environment** | High - Tool cannot function | 1) Implement graceful error message if API key missing. 2) Add environment variable validation on startup. 3) Document required `.env.local` setup in README. 4) Provide fallback mock mode for development if needed. |
| **API rate limiting or cost overruns** | Medium - Tool becomes unavailable or expensive | 1) Implement request caching for identical inputs. 2) Add rate limiting on API route. 3) Show clear pricing/usage warnings. 4) Implement retry logic with exponential backoff. 5) Consider adding input length limits. |
| **Poor quality generated content** | Medium - User dissatisfaction | 1) Carefully craft system prompts for each platform. 2) Test with various input types (blog posts, articles, topics). 3) Provide examples/sample inputs to guide users. 4) Allow users to regenerate or tweak results. 5) Add option to specify tone/style preferences. |
| **TypeScript type errors after adding new dependencies** | Low - Build fails | 1) Install `@types/*` packages for all dependencies. 2) Run `npm run build` after each package addition. 3) Use strict type checking and fix all errors before proceeding. |
| **Tailwind CSS not purging correctly** | Low - Larger bundle size | 1) Verify `tailwind.config.ts:4` content path includes all component directories. 2) Test production build size. 3) Use dynamic class names sparingly. |
| **Client component hydration issues** | Medium - UI glitches | 1) Properly mark interactive components with `'use client'`. 2) Avoid server/client data structure mismatches. 3) Test in development mode for hydration warnings. |
| **Browser clipboard API restrictions** | Low - Copy functionality fails | 1) Use Clipboard API with proper error handling. 2) Provide fallback for older browsers. 3) Show success/failure feedback to user. |
| **Mobile responsiveness issues** | Medium - Poor UX on mobile devices | 1) Use Tailwind's responsive utilities. 2) Test on actual mobile devices. 3) Ensure touch targets are appropriately sized (min 44x44px). 4) Use mobile-first CSS approach. |
| **Build fails due to missing dependencies** | High - Cannot deploy | 1) Run `npm run build` after adding each package. 2) Verify all imports resolve correctly. 3) Check peer dependency warnings. 4) Ensure Node.js version compatibility. |
| **Prompt injection or malicious input handling** | Medium - Security/abuse concern | 1) Sanitize user input before sending to AI. 2) Set strict system prompts that cannot be overridden. 3) Limit input length to prevent abuse. 4) Implement rate limiting per IP. 5) Add content moderation if needed. |

## Recommended Approach

### Phase 1: Foundation Setup (30 minutes)

1. **Install Dependencies**
   - Add `@anthropic-ai/sdk`, `lucide-react` (lightweight icons), `clsx`, `tailwind-merge`
   - Run `npm install` and verify no conflicts
   - Run `npm run build` to confirm baseline build succeeds

2. **Create Type Definitions**
   - Define `Platform` enum (LINKEDIN, TWITTER, INSTAGRAM, NEWSLETTER)
   - Define `GenerateRequest` interface (content, platforms, options)
   - Define `GenerateResponse` interface (platform-specific content with metadata)
   - Define `PlatformContent` interface (text, hashtags, characterCount, suggestions)

3. **Setup Anthropic Client**
   - Create `src/lib/anthropic.ts` with client initialization
   - Add environment variable check for `ANTHROPIC_API_KEY`
   - Create helper function for content generation
   - Define system prompts for each platform type

### Phase 2: API Implementation (45 minutes)

4. **Build API Route**
   - Create `src/app/api/generate/route.ts`
   - Implement POST handler with:
     - Request body validation (content not empty, at least one platform selected)
     - Input sanitization (length limits, strip dangerous characters)
     - Anthropic API call with streaming or non-streaming response
     - Error handling with appropriate HTTP status codes
     - Response format matching TypeScript interfaces
   - Test API route with curl or Postman
   - Verify error cases (missing API key, invalid input)

5. **Platform-Specific Prompt Engineering**
   - Create `src/lib/prompts.ts` with system prompts:
     - LinkedIn: Professional tone, 1300-3000 chars, hashtags encouraged
     - Twitter/X: Concise, <280 chars, hashtag optimization, thread support
     - Instagram: Visual-first description, hashtag-heavy, emoji usage
     - Newsletter: Personal, storytelling, call-to-action focused
   - Test prompts with sample content to verify quality

### Phase 3: User Interface (60 minutes)

6. **Main Page Structure**
   - Rebuild `src/app/page.tsx` as Server Component
   - Add page title and description
   - Import and arrange Client Components
   - Add basic layout with Tailwind (container, spacing)

7. **Input Form Component** (`src/components/ContentForm.tsx`)
   - Content source selector (Text Input / URL / Topic)
   - Large text area for content pasting
   - Platform selection checkboxes with icons
   - Optional: Tone selector (professional, casual, enthusiastic)
   - Submit button with loading state
   - Client-side validation before submission
   - Error display for validation failures

8. **Results Display Component** (`src/components/ResultsDisplay.tsx`)
   - Tabbed interface for each platform's result
   - Display generated text with proper formatting
   - Show metadata (character count, hashtag suggestions)
   - Copy-to-clipboard button for each platform
   - Download all as JSON/TXT option
   - Regenerate button
   - Empty state when no results

9. **Supporting Components**
   - `CopyButton.tsx` - Reusable copy button with success feedback
   - `PlatformSelector.tsx` - Checkbox group with platform icons
   - `LoadingSpinner.tsx` - Animated loading indicator
   - `ErrorMessage.tsx` - Styled error display

### Phase 4: Polish & Testing (45 minutes)

10. **Styling & UX**
   - Apply consistent color scheme (purple/blue gradient for modern tech feel)
   - Add smooth transitions and hover effects
   - Ensure mobile responsiveness (stack layout on small screens)
   - Add tooltips or help text for clarity
   - Implement keyboard shortcuts (Ctrl+Enter to submit)

11. **Error Handling**
   - Add error boundary component
   - Display user-friendly error messages
   - Implement retry logic for failed API calls
   - Show loading states during processing
   - Add toast notifications for copy/download actions

12. **Testing & Validation**
   - Test with various content types (short, long, technical, casual)
   - Verify each platform's output format
   - Test error cases (empty input, API failure, timeout)
   - Check mobile responsiveness
   - Verify `npm run build` succeeds with zero errors
   - Test production build locally with `npm run start`

13. **Documentation**
   - Update CLAUDE.md with usage instructions if needed
   - Add example inputs/prompts for users
   - Document API route contract
   - Add comments to complex logic

### Product Definition Rationale

**Why "Content Repurposing Generator"?**

The name "Self-promoting Content Platforms" suggests a tool that helps content creators promote their own work across multiple platforms. A content repurposing tool directly addresses this pain point:

1. **Real User Need**: Content creators struggle to adapt their work for different platforms (blog → LinkedIn → Twitter → Instagram)
2. **Clear Input → Transform → Output Flow**:
   - Input: Original content + platform selection
   - Transform: AI adapts tone, length, format for each platform
   - Output: Ready-to-post content for each selected platform
3. **Immediate Value**: Users can copy and paste results directly to social media
4. **AI-Powered**: Leverages Anthropic's language models for intelligent adaptation
5. **Exportable**: Copy buttons + JSON download for batch posting tools
6. **Not a Catalog**: Every output is unique to the user's input content

**Alternative Rejected Ideas:**
- *Platform comparison dashboard* - Violates "no catalog" rule, would have hardcoded platform data
- *Content calendar tool* - Too complex, requires database/storage
- *Analytics viewer* - Would require fake metrics or API integrations
- *Platform directory* - Explicitly prohibited by requirements

## Open Questions

1. **Should we support URL fetching?**
   - Allow users to input a blog post URL and automatically fetch content?
   - Requires web scraping or URL metadata fetching
   - Complexity: Medium. Need to handle CORS, rate limiting, paywalls
   - Recommendation: Start with text input only, add URL fetching as enhancement if time permits

2. **What should the free tier limits be?**
   - Anthropic API costs money per token
   - Should we limit requests per user/per day?
   - Recommendation: No limits for MVP (assume low traffic), add rate limiting if abused

3. **Should we support content regeneration?**
   - Allow users to click "regenerate" to get different variations?
   - Increases API costs but improves user satisfaction
   - Recommendation: Yes, include regeneration button in results display

4. **How to handle very long input content?**
   - Blog posts can be 2000+ words
   - Need to summarize or truncate before platform adaptation
   - Recommendation: Implement intelligent summarization in the prompt, limit input to 10,000 characters

5. **Should we include preview mode?**
   - Show how content will look on each platform?
   - Complex to maintain accurate platform previews
   - Recommendation: No, focus on text generation. Platform UI changes frequently

6. **Which platforms to prioritize?**
   - LinkedIn, Twitter/X are most valuable for B2B self-promotion
   - Instagram requires visual-first thinking
   - Email newsletters are high-value but different format
   - Recommendation: Support all 4 in MVP, allow user to select which to generate

7. **Error handling for missing API key**
   - Should we show a helpful setup message or fail silently?
   - Recommendation: Show clear error: "Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local"

8. **Should we add example/sample content?**
   - Help users understand what to input
   - Recommendation: Yes, add "Load Example" button that pre-fills the form with sample blog post text

9. **Streaming vs non-streaming API responses?**
   - Anthropic supports streaming responses
   - Streaming provides better UX but more complex state management
   - Recommendation: Start with non-streaming for simplicity, add streaming if UX feels sluggish

10. **Should we support multiple languages?**
    - Input might be in non-English languages
    - Platform-specific content might need language detection
    - Recommendation: Detect input language and preserve it in generated content. Add note that prompts are English-optimized
