import type { Metadata } from 'next'
import { Article } from '@/components/article'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('es', 'contact')

export default function ContactPage() {
  return <Article id="contact" />
}
