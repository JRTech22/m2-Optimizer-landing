import type { Metadata } from 'next'
import { Article } from '@/components/article'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('es', 'privacy')

export default function PrivacyPage() {
  return <Article id="privacy" />
}
