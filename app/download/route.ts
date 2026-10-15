import { json, options } from '@/server/http'
import { readCatalog } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function GET() {
  try {
    const catalog = await readCatalog()
    if (!catalog.url) return json({ error: 'No hay instalador publicado' }, 404)
    return Response.redirect(catalog.url, 302)
  } catch {
    return json({ error: 'No hay instalador publicado' }, 404)
  }
}
