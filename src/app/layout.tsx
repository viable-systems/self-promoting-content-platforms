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
