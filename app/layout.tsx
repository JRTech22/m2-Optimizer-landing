import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Shell } from '@/components/shell'
import { COPY } from '@/lib/copy'
import { SITE } from '@/lib/seo'
import { DOWNLOAD_URL } from '@/server/store'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], display: 'swap' })

const logo = `${SITE}/logo.png`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'M2Dominican RD',
      url: SITE,
      logo,
      email: 'contacto@m2dominicanrd.com',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'M2 Optimizer',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows 10, Windows 11',
      url: SITE,
      image: logo,
      inLanguage: ['es', 'en', 'fr', 'pt'],
      description: COPY.es.pages.home.lede,
      offers: [
        { '@type': 'Offer', name: 'Gratis', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Básica', price: '4.99', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Completa', price: '19.99', priceCurrency: 'USD' },
      ],
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'M2 Optimizer', template: '%s' },
  description: COPY.es.pages.home.lede,
  applicationName: 'M2 Optimizer',
  authors: [{ name: 'M2Dominican RD', url: SITE }],
  creator: 'M2Dominican RD',
  robots: { index: true, follow: true },
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'M2 Optimizer',
    images: [{ url: '/logo.png', alt: 'M2 Optimizer' }],
  },
  twitter: {
    card: 'summary',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body className={outfit.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=location.pathname.split('/')[1];if(p==='en'||p==='fr'||p==='pt')document.documentElement.lang=p;})();`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Shell downloadHref={DOWNLOAD_URL}>{children}</Shell>
      </body>
    </html>
  )
}
