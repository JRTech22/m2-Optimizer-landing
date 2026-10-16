import { dmaOpen } from '@/server/dma'
import { closePromo } from '@/server/store'

const CODE = /^[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

export async function POST(request: Request) {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { code?: unknown } | null
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (!CODE.test(code)) return Response.json({ error: 'Código no válido' }, { status: 400 })
  try {
    const result = await closePromo(code)
    return Response.json({ result })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se cerró el código' }, { status: 502 })
  }
}
