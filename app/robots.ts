import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dma', '/DMA', '/api/'],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
