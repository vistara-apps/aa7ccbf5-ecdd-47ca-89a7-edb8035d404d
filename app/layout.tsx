import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PantryChef AI - Your Personal AI Chef',
  description: 'Generate personalized recipes from your ingredients using AI. Built on Base blockchain with secure payments.',
  keywords: 'AI, recipes, cooking, blockchain, Base, USDC, ingredients, chef, food',
  authors: [{ name: 'PantryChef AI Team' }],
  openGraph: {
    title: 'PantryChef AI - Your Personal AI Chef',
    description: 'Generate personalized recipes from your ingredients using AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PantryChef AI - Your Personal AI Chef',
    description: 'Generate personalized recipes from your ingredients using AI',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#8B5CF6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
