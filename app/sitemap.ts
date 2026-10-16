import type { MetadataRoute } from 'next'
import { LANGS } from '@/lib/copy'
import { absolute, pagePath, PUBLIC_PAGES } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.flatMap((page) =>
    LANGS.map((lang) => ({
      url: absolute(pagePath(lang, page)),
      lastModified: new Date('2026-10-16'),
      changeFrequency: page === 'home' || page === 'pricing' ? 'weekly' : 'monthly',
      priority: page === 'home' ? 1 : page === 'pricing' ? 0.8 : 0.5,
      alternates: {
        languages: Object.fromEntries([
          ...LANGS.map((item) => [item, absolute(pagePath(item, page))]),
          ['x-default', absolute(pagePath('es', page))],
        ]),
      },
    })),
  )
}
