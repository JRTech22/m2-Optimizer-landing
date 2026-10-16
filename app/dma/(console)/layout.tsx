import type { Metadata } from 'next'
import { DmaConsole } from '@/components/dma/console'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DmaConsoleLayout({ children }: { children: React.ReactNode }) {
  return <DmaConsole>{children}</DmaConsole>
}
