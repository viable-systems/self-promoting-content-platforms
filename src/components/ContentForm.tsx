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
