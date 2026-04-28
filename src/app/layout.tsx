import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLdScript, generateOrganizationJsonLd } from '@/lib/seo';
import { CurrencyProvider } from '@/lib/currency';
import { UserAuthProvider } from '@/lib/user-auth';
import { AdminStoreProvider } from '@/lib/admin-store';

const inter = Inter({
  variable: '--font-inter',
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
    <html className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <JsonLdScript data={generateOrganizationJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CurrencyProvider>
          <UserAuthProvider>
            <AdminStoreProvider>
              {children}
            </AdminStoreProvider>
          </UserAuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
