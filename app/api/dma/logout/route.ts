import { closeDmaSession } from '@/server/dma'

export async function POST() {
  await closeDmaSession()
  return Response.json({ ok: true })
}
