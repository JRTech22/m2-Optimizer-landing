'use client'

import { useState, type FormEvent } from 'react'
import { storeUrlFor, useDma, when } from '@/components/dma/model'

export function DmaVersions() {
  const { data, busy, run, copy } = useDma()
  const [version, setVersion] = useState(data.catalog.version)
  const [url, setUrl] = useState(data.catalog.url)
  const rows = [...data.catalog.versions].sort((left, right) => (right.publishedAt || '').localeCompare(left.publishedAt || ''))

  async function publish(event: FormEvent) {
    event.preventDefault()
    await run(async () => {
      const response = await fetch('/api/dma/release', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ version, url }),
      })
      const body = (await response.json()) as { error?: string; storeUrl?: string }
      if (!response.ok) throw new Error(body.error ?? 'No se publicó')
      return body.storeUrl ? `Publicada. ${body.storeUrl}` : 'Publicada.'
    })
  }

  return (
    <div className="dma-stack">
      <form className="card dma-card" onSubmit={(event) => void publish(event)}>
        <h2>Publicar instalador</h2>
        <label>
          Versión
          <input value={version} onChange={(event) => setVersion(event.target.value.trim())} pattern="\d+\.\d+\.\d+" required />
        </label>
        <label>
          URL del archivo
          <input value={url} onChange={(event) => setUrl(event.target.value.trim())} required />
        </label>
        <p>La URL de Drive puede quedarse igual. El archivo se llama M2 Optimizer Installer.exe. Se guardan las últimas 5 versiones.</p>
        <button className="btn btn-primary" type="submit" disabled={busy}>Publicar</button>
      </form>
      <section className="card dma-card">
        <h2>Enlaces fijos</h2>
        <p>Feed: <button className="linkish" type="button" onClick={() => void copy(data.feedUrl)}>{data.feedUrl}</button></p>
        <p>Descarga: <button className="linkish" type="button" onClick={() => void copy(data.downloadUrl)}>{data.downloadUrl}</button></p>
      </section>
      <section className="card dma-card">
        <h2>Últimas 5 versiones</h2>
        <div className="dma-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Versión</th>
                <th>Publicada</th>
                <th>URL de la tienda</th>
                <th>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const store = storeUrlFor(item.version)
                const live = item.version === data.catalog.version
                return (
                  <tr key={item.version}>
                    <td>{item.version}{live && <span className="dma-badge ok">Vigente</span>}</td>
                    <td>{when(item.publishedAt)}</td>
                    <td><button className="linkish" type="button" onClick={() => void copy(store)}>{store}</button></td>
                    <td className="clip" title={item.url}>{item.url}</td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4}>Todavía no hay versiones.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
