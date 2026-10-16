'use client'

import Link from 'next/link'
import { daysLeft, useDma } from '@/components/dma/model'

export function DmaHome() {
  const { data, copy } = useDma()
  const now = Date.now()
  const active = data.licenses.filter((item) => Date.parse(item.expiresAt) > now)
  const expiring = active.filter((item) => daysLeft(item.expiresAt) <= 30)
  const complete = active.filter((item) => item.tier === 'complete').length
  const basic = active.filter((item) => item.tier === 'basic').length
  const currentDevices = data.devices.filter((item) => item.version === data.catalog.version).length
  const behind = data.devices.length - currentDevices
  const openPromos = data.promos.filter((item) => item.used < item.maxUses)
  const usesLeft = openPromos.reduce((sum, item) => sum + (item.maxUses - item.used), 0)

  return (
    <div className="dma-stack">
      <div className="dma-stats">
        <Link className="dma-stat" href="/dma/versiones">
          <span>Versión</span>
          <strong>{data.catalog.version || '—'}</strong>
          <small>{data.catalog.versions.length} guardadas</small>
        </Link>
        <Link className="dma-stat" href="/dma/licencias">
          <span>Licencias</span>
          <strong>{active.length}</strong>
          <small>{complete} completas · {basic} básicas</small>
        </Link>
        <Link className="dma-stat" href="/dma/equipos">
          <span>Equipos</span>
          <strong>{data.devices.length}</strong>
          <small>{currentDevices} en esta versión</small>
        </Link>
        <Link className="dma-stat" href="/dma/codigos">
          <span>Códigos</span>
          <strong>{openPromos.length}</strong>
          <small>{usesLeft} usos libres</small>
        </Link>
      </div>

      <section className="dma-panel dma-release">
        <div>
          <p className="dma-kicker">Descarga pública</p>
          <h2>App Installer</h2>
          <button className="dma-url" type="button" onClick={() => void copy(data.appInstallerUrl)}>{data.appInstallerUrl}</button>
        </div>
        <div className="dma-actions">
          <Link className="btn btn-primary" href="/dma/versiones">Publicar</Link>
          <Link className="btn btn-ghost" href="/dma/codigos">Nuevo código</Link>
        </div>
      </section>

      <div className="dma-split">
        <Link className="dma-panel dma-insight" href="/dma/licencias">
          <p className="dma-kicker">Próximos 30 días</p>
          <strong>{expiring.length}</strong>
          <span>{expiring.length === 0 ? 'Ninguna licencia por vencer' : 'Licencias por vencer'}</span>
        </Link>
        <Link className="dma-panel dma-insight" href="/dma/equipos">
          <p className="dma-kicker">Otra versión</p>
          <strong>{behind}</strong>
          <span>{behind === 0 ? `Todos en ${data.catalog.version || 'la versión publicada'}` : 'Equipos pendientes de actualizar'}</span>
        </Link>
        <section className="dma-panel dma-insight dma-insight-wide">
          <p className="dma-kicker">URL versionada</p>
          <button className="dma-url" type="button" onClick={() => void copy(data.storeUrl)}>{data.storeUrl || 'Sin versión publicada'}</button>
          <span>La usa Microsoft Store. El archivo sigue en Drive.</span>
        </section>
      </div>
    </div>
  )
}
