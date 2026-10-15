import type { Metadata } from 'next'
import { DmaPanel } from '@/components/dma-panel'

export const metadata: Metadata = {
  title: 'DMA',
  robots: { index: false, follow: false },
}

export default function DmaPage() {
  return <DmaPanel />
}
