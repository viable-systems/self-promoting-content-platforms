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
