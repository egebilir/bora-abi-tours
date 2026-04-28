import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLdScript, generateOrganizationJsonLd } from '@/lib/seo';
import { CurrencyProvider } from '@/lib/currency';
import { UserAuthProvider } from '@/lib/user-auth';
import { AdminStoreProvider } from '@/lib/admin-store';
import AuthModal from '@/components/auth/AuthModal';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Bora Abi Tours — Kuşadası Tur Rezervasyonu',
    template: '%s | Bora Abi Tours',
  },
  description:
    'Kuşadası ve çevresindeki en iyi turları keşfedin. Efes, Pamukkale, tekne turları, doğa yürüyüşleri ve daha fazlası. Profesyonel rehberler, uygun fiyatlar.',
  keywords: [
    'Kuşadası turları',
    'Efes turu',
    'Pamukkale günübirlik',
    'Kuşadası tekne turu',
    'Kuşadası gezi',
    'Ege turları',
    'Kuşadası excursions',
    'Ephesus tour',
  ],
  authors: [{ name: 'Bora Abi Tours' }],
  creator: 'Bora Abi Tours',
  metadataBase: new URL('https://boraabitours.com'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://boraabitours.com',
    siteName: 'Bora Abi Tours',
    title: 'Bora Abi Tours — Kuşadası Tur Rezervasyonu',
    description:
      'Kuşadası ve çevresindeki en iyi turları keşfedin. Profesyonel rehberler eşliğinde unutulmaz deneyimler.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bora Abi Tours — Ege\'nin Kalbinde Unutulmaz Deneyimler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bora Abi Tours — Kuşadası Tur Rezervasyonu',
    description:
      'Kuşadası ve çevresindeki en iyi turları keşfedin.',
    images: ['/images/og-image.jpg'],
  },
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
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <JsonLdScript data={generateOrganizationJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CurrencyProvider>
          <UserAuthProvider>
            <AdminStoreProvider>
              {children}
              <AuthModal />
            </AdminStoreProvider>
          </UserAuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
