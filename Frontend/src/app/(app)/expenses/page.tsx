import { Metadata } from 'next';
import { SITE } from '@/shared/config/site';
import { ExpensesPageClient } from './ExpensesPageClient';

export const metadata: Metadata = {
  title: 'Expenses | TrueSplit',
  description: 'View and manage all your shared expenses, track pending amounts, and settle bills with friends.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE.url}/expenses`,
  },
  openGraph: {
    title: 'Expenses | TrueSplit',
    description: 'View and manage all your shared expenses, track pending amounts, and settle bills with friends.',
    url: `${SITE.url}/expenses`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expenses | TrueSplit',
    description: 'View and manage all your shared expenses, track pending amounts, and settle bills with friends.',
  },
};

export default function ExpensesPage() {
  return <ExpensesPageClient />;
}