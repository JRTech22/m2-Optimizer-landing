import { isEmail, isFingerprint, json, options } from '@/server/http'
import { PromoError, redeemPromo } from '@/server/store'

const CODE = /^[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

export function OPTIONS() {
  return options()
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown; fingerprint?: unknown; email?: unknown } | null
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (!body || !CODE.test(code) || !isFingerprint(body.fingerprint) || !isEmail(body.email)) {
    return json({ error: 'invalid' }, 400)
  }
  try {
    const license = await redeemPromo(code, body.fingerprint, body.email.trim())
    return json({ ...license, code })
  } catch (error) {
    if (error instanceof PromoError) return json({ error: error.reason }, error.reason === 'missing' ? 404 : 409)
    return json({ error: 'invalid' }, 502)
  }
}
