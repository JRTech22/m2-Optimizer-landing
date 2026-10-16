import type { Metadata } from 'next'
import { Article } from '@/components/article'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('es', 'help')

export default function HelpPage() {
  return <Article id="help" />
}
