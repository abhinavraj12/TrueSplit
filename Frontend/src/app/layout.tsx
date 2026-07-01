import type { Metadata } from 'next';
import { commissioner, outfit, plusJakartaSans } from './fonts';
import '../shared/styles/globals.css';
import { RootLayoutClient } from '@/providers';

export const metadata: Metadata = {
  title: 'TrueSplit',
  description: 'Modern expense-sharing and bill-splitting application',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${commissioner.variable} ${outfit.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}