import { dmaOpen } from '@/server/dma'
import { publishRelease, versionedUrl } from '@/server/store'

const VERSION = /^\d+\.\d+\.\d+$/

export async function POST(request: Request) {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { version?: unknown; url?: unknown } | null
  if (!body || typeof body.version !== 'string' || !VERSION.test(body.version) || body.version.length > 32) {
    return Response.json({ error: 'La versión debe ser números separados por puntos, como 2.0.2.' }, { status: 400 })
  }
  if (typeof body.url !== 'string' || !body.url.startsWith('https://') || body.url.length > 4000) {
    return Response.json({ error: 'La URL del archivo tiene que empezar por https://' }, { status: 400 })
  }
  try {
    const catalog = await publishRelease(body.version, body.url)
    return Response.json({ catalog, storeUrl: versionedUrl(catalog.version) })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se publicó la versión' }, { status: 502 })
  }
}
