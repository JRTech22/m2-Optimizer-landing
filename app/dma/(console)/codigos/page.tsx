import type { Metadata } from 'next'
import { DmaPromos } from '@/components/dma/promos'

export const metadata: Metadata = { title: 'DMA · Códigos', robots: { index: false, follow: false } }

export default function Page() {
  return <DmaPromos />
}
