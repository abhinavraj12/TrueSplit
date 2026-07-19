import { Metadata } from 'next';
import { SITE } from '@/shared/config';
import CreateExpense from './parts/CreateExpense';

export const metadata: Metadata = {
  title: `Create Expense | ${SITE.name}`,
  description: `Create a new expense, split bills with friends, and track shared costs on ${SITE.name}.`,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `Create Expense | ${SITE.name}`,
    description: `Create a new expense, split bills with friends, and track shared costs on ${SITE.name}.`,
    url: `${SITE.url}/expenses/create`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Create Expense | ${SITE.name}`,
    description: `Create a new expense, split bills with friends, and track shared costs on ${SITE.name}.`,
  },
};

export default function CreateExpensePage() {
  return <CreateExpense />;
}