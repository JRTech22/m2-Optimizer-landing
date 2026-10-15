import { isEmail, isFingerprint, json, options } from '@/server/http'
import { claimLicense } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; fingerprint?: unknown } | null
  if (!body || !isEmail(body.email) || !isFingerprint(body.fingerprint)) {
    return json({ reused: false }, 400)
  }
  try {
    const license = await claimLicense(body.email, body.fingerprint)
    if (!license) return json({ reused: false }, 404)
    return json({ reused: true, tier: license.tier, expiresAt: license.expiresAt })
  } catch {
    return json({ reused: false }, 502)
  }
}
