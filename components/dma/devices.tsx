'use client'

import { useMemo, useState } from 'react'
import { shortId, useDma, when } from '@/components/dma/model'

export function DmaDevices() {
  const { data, copy } = useDma()
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const rows = useMemo(
    () => data.devices.filter((item) => !needle || `${item.fingerprint} ${item.version}`.toLowerCase().includes(needle)),
    [data.devices, needle],
  )

  return (
    <div className="dma-stack">
      <section className="card dma-card">
        <div className="dma-toolbar">
          <h2>Equipos vistos</h2>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar huella o versión" />
        </div>
        <p>La versión publicada es {data.catalog.version || 'ninguna'}.</p>
        <div className="dma-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Huella</th>
                <th>App</th>
                <th>Estado</th>
                <th>Primera vez</th>
                <th>Última vez</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const current = Boolean(data.catalog.version) && item.version === data.catalog.version
                return (
                  <tr key={item.fingerprint}>
                    <td><button className="linkish" type="button" title={item.fingerprint} onClick={() => void copy(item.fingerprint)}>{shortId(item.fingerprint)}</button></td>
                    <td>{item.version || '—'}</td>
                    <td><span className={`dma-badge ${current ? 'ok' : 'warn'}`}>{current ? 'Al día' : 'Otra versión'}</span></td>
                    <td>{when(item.firstSeen)}</td>
                    <td>{when(item.lastSeen)}</td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5}>Sin equipos para esta búsqueda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
