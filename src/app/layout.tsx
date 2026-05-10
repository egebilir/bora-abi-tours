import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { JsonLdScript, generateOrganizationJsonLd } from '@/lib/seo';
import { CurrencyProvider } from '@/lib/currency';
import { UserAuthProvider } from '@/lib/user-auth';
import { AdminStoreProvider } from '@/lib/admin-store';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://weareshorex.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <JsonLdScript data={generateOrganizationJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CurrencyProvider>
          <UserAuthProvider>
            <AdminStoreProvider>
              <PostHogProvider>
                {children}
              </PostHogProvider>
            </AdminStoreProvider>
          </UserAuthProvider>
        </CurrencyProvider>

        {/* WORK IN PROGRESS BADGE */}
        <div className="fixed bottom-4 left-4 z-[9999] pointer-events-none">
          <div className="bg-yellow-400/90 backdrop-blur-md text-yellow-900 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg border border-yellow-500/30 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-700"></span>
            </span>
            Work In Progress
          </div>
        </div>
      </body>
    </html>
  );
}
