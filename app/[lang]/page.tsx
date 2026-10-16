import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Home } from '@/components/home'
import { isPrefixedLang } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'pt' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isPrefixedLang(lang)) return {}
  return pageMetadata(lang, 'home')
}

export default async function LocalizedHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isPrefixedLang(lang)) notFound()
  return <Home />
}
