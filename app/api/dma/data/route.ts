import { dmaOpen } from '@/server/dma'
import { listDevices, listLicenses, listPromos, readCatalog, versionedUrl } from '@/server/store'

export async function GET() {
  if (!(await dmaOpen())) return Response.json({ error: 'Sesión caducada' }, { status: 401 })
  try {
    const [catalog, licenses, devices, promos] = await Promise.all([readCatalog(), listLicenses(), listDevices(), listPromos()])
    return Response.json({
      catalog,
      storeUrl: catalog.version ? versionedUrl(catalog.version) : '',
      feedUrl: 'https://optimizer.m2dominicanrd.com/api/store',
      appInstallerUrl: 'https://optimizer.m2dominicanrd.com/M2Optimizer.appinstaller',
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
