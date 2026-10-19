import { options } from '@/server/http'
import { directFileUrl, readCatalog } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function GET() {
  const catalog = await readCatalog().catch(() => null)
  if (!catalog?.url) return new Response('Not found', { status: 404 })
  return Response.redirect(directFileUrl(catalog.url), 302)
}
