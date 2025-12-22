import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { PageLoader } from '@/components/page-loader';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Baseline',
  description: 'Your Personal Basketball Training App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} style={{ colorScheme: 'dark' }}>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <Providers>
          <PageLoader />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
