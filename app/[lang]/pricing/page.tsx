import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Pricing } from '@/components/pricing'
import { isPrefixedLang } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'pt' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isPrefixedLang(lang)) return {}
  return pageMetadata(lang, 'pricing')
}

export default async function LocalizedPricing({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isPrefixedLang(lang)) notFound()
  return (
    <Suspense>
      <Pricing />
    </Suspense>
  )
}
