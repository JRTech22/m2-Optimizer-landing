import type { Metadata } from 'next'
import { DmaDevices } from '@/components/dma/devices'

export const metadata: Metadata = { title: 'DMA · Equipos', robots: { index: false, follow: false } }

export default function Page() {
  return <DmaDevices />
}
