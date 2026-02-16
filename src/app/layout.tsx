import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Self-promoting Content Platforms',
  description: 'Product derived from radar signal: Self-promoting Content Platforms. Source: agent.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
