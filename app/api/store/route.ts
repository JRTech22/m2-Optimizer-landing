import { json, options } from '@/server/http'
import { readCatalog, versionedUrl } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function GET() {
  try {
    const catalog = await readCatalog()
    if (!catalog.version) return json({ version: '', url: '' })
    return json({ version: catalog.version, url: versionedUrl(catalog.version) })
  } catch {
    return json({ version: '', url: '' })
  }
}
