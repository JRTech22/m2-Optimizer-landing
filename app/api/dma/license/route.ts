import { dmaOpen } from '@/server/dma'
import { isFingerprint } from '@/server/http'
import { extendLicense, revokeLicense } from '@/server/store'

export async function POST(request: Request) {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { action?: unknown; fingerprint?: unknown } | null
  if (!body || !isFingerprint(body.fingerprint) || (body.action !== 'extend' && body.action !== 'revoke')) {
    return Response.json({ error: 'Acción no válida' }, { status: 400 })
  }
  try {
    if (body.action === 'extend') {
      const license = await extendLicense(body.fingerprint)
      return Response.json({ license: { fingerprint: license.fingerprint, expiresAt: license.expiresAt, tier: license.tier } })
    }
    await revokeLicense(body.fingerprint)
    return Response.json({ revoked: true })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se actualizó la licencia' }, { status: 502 })
  }
}
