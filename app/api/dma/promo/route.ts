import { dmaOpen } from '@/server/dma'
import { isPaidTier } from '@/server/http'
import { createPromo } from '@/server/store'

export async function POST(request: Request) {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { tier?: unknown; maxUses?: unknown } | null
  const maxUses = Number(body?.maxUses)
  if (!body || !isPaidTier(body.tier) || !Number.isInteger(maxUses) || maxUses < 1 || maxUses > 500) {
    return Response.json({ error: 'Elige Básica o Completa y un número de usos entre 1 y 500.' }, { status: 400 })
  }
  try {
    const promo = await createPromo(body.tier, maxUses)
    return Response.json({ promo })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se creó el código' }, { status: 502 })
  }
}
