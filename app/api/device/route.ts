import { isFingerprint, json, options } from '@/server/http'
import { ensureLaunchFreeLicense, touchDevice } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { fingerprint?: unknown; version?: unknown } | null
  if (!body || !isFingerprint(body.fingerprint) || typeof body.version !== 'string' || body.version.length > 32) {
    return json({ error: 'Equipo no válido' }, 400)
  }
  try {
    await touchDevice(body.fingerprint, body.version)
    const license = await ensureLaunchFreeLicense(body.fingerprint)
    return json({ ok: true, ...license })
  } catch {
    return json({ error: 'No se guardó el equipo' }, 503)
  }
}
