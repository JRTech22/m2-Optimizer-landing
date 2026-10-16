import type { Metadata } from 'next'
import { DmaGate } from '@/components/dma/gate'

export const metadata: Metadata = {
  title: 'DMA',
  robots: { index: false, follow: false },
}

export default function DmaPage() {
  return <DmaGate />
}
