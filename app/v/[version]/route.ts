import { directFileUrl, fileUrlFor } from '@/server/store'

const VERSION = /^\d+\.\d+\.\d+$/

export async function GET(_request: Request, context: { params: Promise<{ version: string }> }) {
  const { version } = await context.params
  if (!VERSION.test(version)) return new Response('Not found', { status: 404 })
  const url = await fileUrlFor(decodeURIComponent(version))
  if (!url) return new Response('Not found', { status: 404 })
  return Response.redirect(directFileUrl(url), 302)
}
