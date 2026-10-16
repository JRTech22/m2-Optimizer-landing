import type { Metadata } from 'next'
import { DmaLicenses } from '@/components/dma/licenses'

export const metadata: Metadata = { title: 'DMA · Licencias', robots: { index: false, follow: false } }

export default function Page() {
  return <DmaLicenses />
}
