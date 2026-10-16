import type { Metadata } from 'next'
import { Article } from '@/components/article'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('es', 'terms')

export default function TermsPage() {
  return <Article id="terms" />
}
