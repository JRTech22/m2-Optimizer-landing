import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Article } from '@/components/article'
import { isPrefixedLang } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'pt' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isPrefixedLang(lang)) return {}
  return pageMetadata(lang, 'terms')
}

export default async function LocalizedTerms({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isPrefixedLang(lang)) notFound()
  return <Article id="terms" />
}
