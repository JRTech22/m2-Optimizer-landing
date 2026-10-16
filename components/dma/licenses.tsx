'use client'

import { useMemo, useState } from 'react'
import { daysLeft, shortId, tierLabel, useDma, when } from '@/components/dma/model'

export function DmaLicenses() {
  const { data, busy, run, copy } = useDma()
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const rows = useMemo(
    () => data.licenses.filter((item) => !needle || `${item.email} ${item.fingerprint} ${item.orderId}`.toLowerCase().includes(needle)),
    [data.licenses, needle],
  )

  async function act(action: 'extend' | 'revoke', fingerprint: string, email: string) {
    const question = action === 'revoke'
      ? `Revocar la licencia de ${email}? El equipo vuelve al plan gratis.`
      : `Extender un año la licencia de ${email}?`
    if (!window.confirm(question)) return
    await run(async () => {
      const response = await fetch('/api/dma/license', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, fingerprint }),
      })
      const body = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'No se actualizó la licencia')
      return action === 'revoke' ? 'Licencia revocada.' : 'Licencia extendida un año.'
    })
  }

  return (
    <div className="dma-stack">
      <section className="card dma-card">
        <div className="dma-toolbar">
          <h2>Licencias</h2>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar correo, pedido o huella" />
        </div>
        <div className="dma-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Correo</th>
                <th>Nivel</th>
                <th>Caduca</th>
                <th>Estado</th>
                <th>Equipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const left = daysLeft(item.expiresAt)
                const state = left < 0 ? 'Vencida' : left <= 30 ? 'Por vencer' : 'Vigente'
                const tone = left < 0 ? 'bad' : left <= 30 ? 'warn' : 'ok'
                return (
                  <tr key={item.fingerprint}>
                    <td><button className="linkish" type="button" onClick={() => void copy(item.email)}>{item.email}</button></td>
                    <td>{tierLabel(item.tier)}</td>
                    <td>{when(item.expiresAt)}</td>
                    <td><span className={`dma-badge ${tone}`}>{state}</span></td>
                    <td><button className="linkish" type="button" title={item.fingerprint} onClick={() => void copy(item.fingerprint)}>{shortId(item.fingerprint)}</button></td>
                    <td className="dma-row-actions">
                      <button className="btn btn-ghost dma-mini" type="button" disabled={busy} onClick={() => void act('extend', item.fingerprint, item.email)}>1 año</button>
                      <button className="btn btn-ghost dma-mini" type="button" disabled={busy} onClick={() => void act('revoke', item.fingerprint, item.email)}>Revocar</button>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6}>Sin licencias para esta búsqueda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
