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
