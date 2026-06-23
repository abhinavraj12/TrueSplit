import type { Metadata } from 'next';
import { commissioner, outfit, plusJakartaSans } from './fonts';
import './globals.css';

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
      data-theme="light"
    >
      <body>{children}</body>
    </html>
  );
}