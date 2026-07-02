import type { Metadata } from 'next';
import { SITE } from '@/shared/config';
import { organizationSchema, websiteSchema } from '@/shared/config/seo';
import { generateJsonLd } from '@/shared/lib/seo';
// import { Header } from '@/shared/_components/organisms/Header';
// import { Footer } from '@/shared/_components/organisms/Footer';

// Force static rendering for marketing pages (improves performance and SEO)
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
    locale: SITE.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Global JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd(websiteSchema) }}
      />

      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}