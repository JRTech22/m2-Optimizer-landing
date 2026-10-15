import { json, options } from '@/server/http'
import { readRelease } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function GET() {
  try {
    return json(await readRelease())
  } catch {
    return json({ version: '', url: '', notes: '', publishedAt: '' })
  }
}
