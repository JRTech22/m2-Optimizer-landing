import { captureOrder, signLicense, type PaidTier } from '@/server/paypal'
import { isEmail, isFingerprint, isPaidTier, json, options } from '@/server/http'
import { saveLicense } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    orderId?: unknown
    tier?: unknown
    fingerprint?: unknown
    email?: unknown
  } | null
  if (
    !body ||
    typeof body.orderId !== 'string' ||
    !isPaidTier(body.tier) ||
    !isFingerprint(body.fingerprint) ||
    !isEmail(body.email)
  ) {
    return json({ error: 'Datos de pago incompletos' }, 400)
  }
  try {
    await captureOrder(body.orderId, body.tier, body.fingerprint)
    const expires = new Date()
    expires.setUTCFullYear(expires.getUTCFullYear() + 1)
    const expiresAt = expires.toISOString()
    const tier: PaidTier = body.tier
    await saveLicense({
      email: body.email,
      tier,
      expiresAt,
      fingerprint: body.fingerprint,
      orderId: body.orderId,
      signature: signLicense(body.fingerprint, tier, expiresAt, body.orderId),
    })
    return json({ tier, expiresAt })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'No se guardó la licencia' }, 502)
  }
}
