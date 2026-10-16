import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Pricing } from '@/components/pricing'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('es', 'pricing')

export default function PricingPage() {
  return (
    <Suspense>
      <Pricing />
    </Suspense>
  )
}
