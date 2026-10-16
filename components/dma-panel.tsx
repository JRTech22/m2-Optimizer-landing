'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

interface VersionEntry {
  version: string
  url: string
  publishedAt: string
}

interface Catalog {
  version: string
  url: string
  versions: VersionEntry[]
}

interface LicenseRow {
  email: string
  tier: string
  expiresAt: string
  fingerprint: string
  orderId: string
}

interface DeviceRow {
  fingerprint: string
  firstSeen: string
  lastSeen: string
  version: string
}

interface PromoRow {
  code: string
  tier: string
  maxUses: number
  used: number
  createdAt: string
}

interface AdminData {
  catalog: Catalog
  storeUrl: string
  feedUrl: string
  appInstallerUrl: string
  licenses: LicenseRow[]
  devices: DeviceRow[]
  promos: PromoRow[]
}

function shortId(value: string): string {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value
}

export function DmaPanel() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [version, setVersion] = useState('')
  const [url, setUrl] = useState('')
  const [promoTier, setPromoTier] = useState<'basic' | 'complete'>('complete')
  const [promoUses, setPromoUses] = useState('10')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const response = await fetch('/api/dma/data')
    if (!response.ok) {
      setAuthed(false)
      setData(null)
      return
    }
    const body = (await response.json()) as AdminData
    setData(body)
    setVersion(body.catalog.version)
    setUrl(body.catalog.url)
    setAuthed(true)
  }, [])

  useEffect(() => {
    void load().finally(() => setReady(true))
  }, [load])

  async function enter(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/dma/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const body = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(body.error ?? 'PIN incorrecto')
        return
      }
      setPin('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function publish(event: FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const response = await fetch('/api/dma/release', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ version, url }),
      })
      const body = (await response.json()) as { error?: string; storeUrl?: string }
      if (!response.ok) {
        setError(body.error ?? 'No se publicó')
        return
      }
      setNotice(body.storeUrl ? `Publicada. Microsoft Store: ${body.storeUrl}` : 'Publicada.')
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function createPromo(event: FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const response = await fetch('/api/dma/promo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tier: promoTier, maxUses: Number(promoUses) }),
      })
      const body = (await response.json()) as { error?: string; promo?: { code: string } }
      if (!response.ok || !body.promo) {
        setError(body.error ?? 'No se creó el código')
        return
      }
      setNotice(`Código ${body.promo.code} listo. Cada PC puede usarlo una sola vez.`)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value)
    setNotice('URL copiada.')
  }

  async function leave() {
    await fetch('/api/dma/logout', { method: 'POST' })
    setAuthed(false)
    setData(null)
    setNotice('')
  }

  if (!ready) return <section className="dma"><p className="dma-loading">Cargando…</p></section>

  if (!authed || !data) {
    return (
      <section className="dma">
        <form className="card dma-card" onSubmit={(event) => void enter(event)}>
          <p className="eyebrow">M2 Optimizer</p>
          <h1>DMA</h1>
          <label>
            PIN
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              pattern="\d{4}"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy || pin.length !== 4}>
            Entrar
          </button>
          {error && <p className="dma-error" role="alert">{error}</p>}
        </form>
      </section>
    )
  }

  return (
    <section className="dma">
      <div className="dma-head">
        <div>
          <p className="eyebrow">M2 Optimizer</p>
          <h1>DMA</h1>
        </div>
        <button className="btn btn-ghost" type="button" onClick={() => void leave()}>
          Salir
        </button>
      </div>
      <form className="card dma-card" onSubmit={(event) => void publish(event)}>
        <h2>Versión del instalador</h2>
        <label>
          Versión
          <input value={version} onChange={(event) => setVersion(event.target.value.trim())} required />
        </label>
        <label>
          URL del archivo
          <input value={url} onChange={(event) => setUrl(event.target.value.trim())} required />
        </label>
        <p>La URL de Drive puede quedarse igual. Cambia solo la versión: el archivo siempre se llama M2 Optimizer Installer.exe.</p>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Publicar
        </button>
        {data.storeUrl && (
          <p>
            Microsoft Store: <button type="button" className="linkish" onClick={() => void copy(data.storeUrl)}>{data.storeUrl}</button>
          </p>
        )}
        <p>
          Feed: <button type="button" className="linkish" onClick={() => void copy(data.feedUrl)}>{data.feedUrl}</button>
        </p>
        <p>
          App Installer: <button type="button" className="linkish" onClick={() => void copy(data.appInstallerUrl)}>{data.appInstallerUrl}</button>
        </p>
        {error && <p>{error}</p>}
        {notice && <p>{notice}</p>}
      </form>
      <div className="card dma-card">
        <h2>URLs versionadas</h2>
        <table>
          <thead>
            <tr>
              <th>Versión</th>
              <th>URL de la tienda</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {data.catalog.versions.length === 0 && data.catalog.version && (
              <tr>
                <td>{data.catalog.version}</td>
                <td>
                  <button type="button" className="linkish" onClick={() => void copy(data.storeUrl)}>{data.storeUrl}</button>
                </td>
                <td className="clip">{data.catalog.url}</td>
              </tr>
            )}
            {data.catalog.versions.map((item) => {
              const store = `https://optimizer.m2dominicanrd.com/v/${item.version}`
              return (
                <tr key={item.version}>
                  <td>{item.version}</td>
                  <td>
                    <button type="button" className="linkish" onClick={() => void copy(store)}>{store}</button>
                  </td>
                  <td className="clip">{item.url}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <form className="card dma-card" onSubmit={(event) => void createPromo(event)}>
        <h2>Códigos promocionales</h2>
        <label>
          Licencia
          <select value={promoTier} onChange={(event) => setPromoTier(event.target.value === 'basic' ? 'basic' : 'complete')}>
            <option value="complete">Completa · 1 año</option>
            <option value="basic">Básica · 1 año</option>
          </select>
        </label>
        <label>
          Usos totales
          <input
            value={promoUses}
            onChange={(event) => setPromoUses(event.target.value.replace(/\D/g, '').slice(0, 3))}
            inputMode="numeric"
            required
          />
        </label>
        <p>El código se genera solo. Cada equipo puede canjearlo una única vez, aunque queden usos.</p>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Generar código
        </button>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Licencia</th>
              <th>Usos</th>
            </tr>
          </thead>
          <tbody>
            {data.promos.map((item) => (
              <tr key={item.code}>
                <td>
                  <button type="button" className="linkish" onClick={() => void copy(item.code)}>{item.code}</button>
                </td>
                <td>{item.tier === 'complete' ? 'Completa' : 'Básica'}</td>
                <td>{item.used}/{item.maxUses}</td>
              </tr>
            ))}
            {data.promos.length === 0 && (
              <tr>
                <td colSpan={3}>Todavía no hay códigos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
      <div className="card dma-card">
        <h2>Licencias</h2>
        <table>
          <thead>
            <tr>
              <th>Correo</th>
              <th>Nivel</th>
              <th>Caduca</th>
              <th>Equipo</th>
            </tr>
          </thead>
          <tbody>
            {data.licenses.map((item) => (
              <tr key={item.fingerprint}>
                <td>{item.email}</td>
                <td>{item.tier}</td>
                <td>{item.expiresAt.slice(0, 10)}</td>
                <td title={item.fingerprint}>{shortId(item.fingerprint)}</td>
              </tr>
            ))}
            {data.licenses.length === 0 && (
              <tr>
                <td colSpan={4}>Sin licencias firmadas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card dma-card">
        <h2>Equipos</h2>
        <table>
          <thead>
            <tr>
              <th>Huella</th>
              <th>App</th>
              <th>Última vez</th>
            </tr>
          </thead>
          <tbody>
            {data.devices.map((item) => (
              <tr key={item.fingerprint}>
                <td title={item.fingerprint}>{shortId(item.fingerprint)}</td>
                <td>{item.version}</td>
                <td>{item.lastSeen ? item.lastSeen.slice(0, 16).replace('T', ' ') : ''}</td>
              </tr>
            ))}
            {data.devices.length === 0 && (
              <tr>
                <td colSpan={3}>Sin equipos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
