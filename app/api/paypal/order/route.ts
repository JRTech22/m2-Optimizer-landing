import { createOrder } from '@/server/paypal'
import { isEmail, isFingerprint, isPaidTier, json, options } from '@/server/http'
import { claimLicense } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { tier?: unknown; fingerprint?: unknown; email?: unknown } | null
  if (!body || !isPaidTier(body.tier) || !isFingerprint(body.fingerprint) || !isEmail(body.email)) {
    return json({ error: 'Datos de pago incompletos' }, 400)
  }
  try {
    const existing = await claimLicense(body.email, body.fingerprint, body.tier)
    if (existing) return json({ reused: true, tier: existing.tier, expiresAt: existing.expiresAt })
    const id = await createOrder(body.tier, body.fingerprint)
    return json({ id })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'PayPal no disponible' }, 502)
  }
}
