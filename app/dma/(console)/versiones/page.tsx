import type { Metadata } from 'next'
import { DmaVersions } from '@/components/dma/versions'

export const metadata: Metadata = { title: 'DMA · Versiones', robots: { index: false, follow: false } }

export default function Page() {
  return <DmaVersions />
}
