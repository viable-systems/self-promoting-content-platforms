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
