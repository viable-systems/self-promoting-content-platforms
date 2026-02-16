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
