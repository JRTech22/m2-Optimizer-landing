import { readCatalog } from '@/server/store'

function quad(version: string): string {
  const parts = version.split('.')
  while (parts.length < 4) parts.push('0')
  return parts.slice(0, 4).join('.')
}

function xmlEscape(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

export async function GET() {
  const catalog = await readCatalog().catch(() => null)
  if (!catalog?.version || !catalog.url) return new Response('Not found', { status: 404 })
  const version = quad(catalog.version)
  const page = 'https://optimizer.m2dominicanrd.com/M2Optimizer.appinstaller'
  const body = `<?xml version="1.0" encoding="utf-8"?>
<AppInstaller xmlns="http://schemas.microsoft.com/appx/appinstaller/2018" Uri="${page}" Version="${version}">
  <MainPackage Name="M2Optimizer" Publisher="CN=M2Dominican RD" Version="${version}" ProcessorArchitecture="x64" Uri="${xmlEscape(catalog.url)}" />
  <UpdateSettings>
    <OnLaunch HoursBetweenUpdateChecks="0" />
  </UpdateSettings>
</AppInstaller>
`
  return new Response(body, {
    headers: {
      'content-type': 'application/appinstaller',
      'cache-control': 'no-store',
    },
  })
}
