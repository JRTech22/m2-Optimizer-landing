import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Shell } from '@/components/shell'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'M2 Optimizer',
  description: 'Licencia anual de M2 Optimizer. El análisis se queda en el PC.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body className={outfit.className}>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
