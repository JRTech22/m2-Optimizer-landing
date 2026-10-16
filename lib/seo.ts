import type { Metadata } from 'next'
import { COPY, LANGS, type Lang } from '@/lib/copy'

export const SITE = 'https://optimizer.m2dominicanrd.com'

export const PUBLIC_PAGES = ['home', 'pricing', 'help', 'terms', 'privacy', 'contact'] as const
export type PublicPage = (typeof PUBLIC_PAGES)[number]

const PATH: Record<PublicPage, string> = {
  home: '/',
  pricing: '/pricing',
  help: '/help',
  terms: '/terms',
  privacy: '/privacy',
  contact: '/contact',
}

const OG_LOCALE: Record<Lang, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  pt: 'pt_BR',
}

export function pagePath(lang: Lang, page: PublicPage): string {
  const path = PATH[page]
  if (lang === 'es') return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

export function absolute(path: string): string {
  return new URL(path, SITE).toString()
}

export function pageMetadata(lang: Lang, page: PublicPage): Metadata {
  const copy = COPY[lang].pages[page]
  const path = pagePath(lang, page)
  const title = `M2 Optimizer | ${copy.title}`
  const languages = Object.fromEntries(LANGS.map((item) => [item, pagePath(item, page)]))
  return {
    title: { absolute: title },
    description: copy.lede,
    alternates: {
      canonical: path,
      languages: { ...languages, 'x-default': pagePath('es', page) },
    },
    openGraph: {
      type: 'website',
      siteName: 'M2 Optimizer',
      title,
      description: copy.lede,
      url: path,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((item) => item !== lang).map((item) => OG_LOCALE[item]),
      images: [{ url: '/logo.png', alt: 'M2 Optimizer' }],
    },
  }
}
