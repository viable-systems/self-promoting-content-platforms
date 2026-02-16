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
