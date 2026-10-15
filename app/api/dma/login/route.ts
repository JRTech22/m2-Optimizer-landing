import { clientIp, dmaClear, dmaFail, dmaLimited, openDmaSession, pinMatches } from '@/server/dma'
import { readDmaPin } from '@/server/store'

export async function POST(request: Request) {
  const ip = clientIp(request)
  if (dmaLimited(ip)) return Response.json({ error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 })
  const body = (await request.json().catch(() => null)) as { pin?: unknown } | null
  const attempt = typeof body?.pin === 'string' ? body.pin : ''
  try {
    const stored = await readDmaPin()
    if (!stored || !pinMatches(stored, attempt)) {
      dmaFail(ip)
      await new Promise((resolve) => setTimeout(resolve, 400))
      return Response.json({ error: 'PIN incorrecto' }, { status: 401 })
    }
  } catch {
    return Response.json({ error: 'No se pudo leer el PIN en Firestore.' }, { status: 503 })
  }
  dmaClear(ip)
  await openDmaSession()
  return Response.json({ ok: true })
}
