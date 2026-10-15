import { isFingerprint, json, options } from '@/server/http'
import { readLicense } from '@/server/store'

export function OPTIONS() {
  return options()
}

export async function GET(request: Request) {
  const fingerprint = new URL(request.url).searchParams.get('fingerprint')
  if (!isFingerprint(fingerprint)) return json({ tier: 'free', expiresAt: null })
  try {
    return json(await readLicense(fingerprint))
  } catch {
    return json({ error: 'No se pudo leer la licencia' }, 503)
  }
}
