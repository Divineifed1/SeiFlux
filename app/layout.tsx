import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SeiFlux',
    template: '%s · SeiFlux',
  },
  description:
    'The platform where maintainers building on the Sei blockchain onboard projects and attract contributors.',
  keywords: ['Sei', 'blockchain', 'builders', 'contributors', 'open source', 'web3'],
  authors: [{ name: 'SeiFlux' }],
  openGraph: {
    type: 'website',
    title: 'SeiFlux',
    description: 'Connect, build, and contribute on the Sei blockchain.',
    siteName: 'SeiFlux',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeiFlux',
    description: 'Connect, build, and contribute on the Sei blockchain.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
