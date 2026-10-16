import { dmaOpen } from '@/server/dma'
import { APP_INSTALLER_URL, keepLatestVersions, listDevices, listLicenses, listPromos, readCatalog, trimCatalog, versionedUrl } from '@/server/store'

export async function GET() {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  try {
    const [read, licenses, devices, promos] = await Promise.all([readCatalog(), listLicenses(true), listDevices(), listPromos()])
    let catalog = read
    if (catalog.versions.length > 5) {
      try {
        catalog = await trimCatalog(catalog)
      } catch {
        catalog = { ...catalog, versions: keepLatestVersions(catalog.versions, catalog.version) }
      }
    }
    return Response.json({
      catalog,
      storeUrl: catalog.version ? versionedUrl(catalog.version) : '',
      feedUrl: 'https://optimizer.m2dominicanrd.com/api/store',
      appInstallerUrl: APP_INSTALLER_URL,
      licenses: licenses.map((item) => ({
        email: item.email,
        tier: item.tier,
        expiresAt: item.expiresAt,
        fingerprint: item.fingerprint,
        orderId: item.orderId,
      })),
      devices,
      promos,
    })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'No se leyeron los datos' }, { status: 502 })
  }
}
