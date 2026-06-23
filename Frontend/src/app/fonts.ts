import { Commissioner, Outfit, Plus_Jakarta_Sans } from 'next/font/google';

export const commissioner = Commissioner({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-commissioner',
  display: 'swap',
  preload: true,
});

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
});