import type { Metadata } from 'next'
import { DmaHome } from '@/components/dma/home'

export const metadata: Metadata = { title: 'DMA · Inicio', robots: { index: false, follow: false } }

export default function Page() {
  return <DmaHome />
}
