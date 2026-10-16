'use client'

import { useState, type FormEvent } from 'react'
import { tierLabel, useDma, when } from '@/components/dma/model'

export function DmaPromos() {
  const { data, busy, run, copy } = useDma()
  const [tier, setTier] = useState<'basic' | 'complete'>('complete')
  const [uses, setUses] = useState('10')

  async function create(event: FormEvent) {
    event.preventDefault()
    await run(async () => {
      const response = await fetch('/api/dma/promo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tier, maxUses: Number(uses) }),
      })
      const body = (await response.json()) as { error?: string; promo?: { code: string } }
      if (!response.ok || !body.promo) throw new Error(body.error ?? 'No se creó el código')
      return `Código ${body.promo.code} listo. Cada PC puede usarlo una sola vez.`
    })
  }

  async function close(code: string) {
    if (!window.confirm(`Cerrar el código ${code}? Los usos que queden dejan de estar disponibles.`)) return
    await run(async () => {
      const response = await fetch('/api/dma/promo/close', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const body = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'No se cerró el código')
      return `Código ${code} cerrado.`
    })
  }

  return (
    <div className="dma-stack">
      <form className="card dma-card" onSubmit={(event) => void create(event)}>
        <h2>Nuevo código</h2>
        <div className="dma-fields">
          <label>
            Licencia
            <select value={tier} onChange={(event) => setTier(event.target.value === 'basic' ? 'basic' : 'complete')}>
              <option value="complete">Completa · 1 año</option>
              <option value="basic">Básica · 1 año</option>
            </select>
          </label>
          <label>
            Usos totales
            <input value={uses} onChange={(event) => setUses(event.target.value.replace(/\D/g, '').slice(0, 3))} inputMode="numeric" required />
          </label>
        </div>
        <p>El código se genera solo, con forma XX-XXXX-XXXX. Cada equipo lo canjea una única vez.</p>
        <button className="btn btn-primary" type="submit" disabled={busy}>Generar código</button>
      </form>
      <section className="card dma-card">
        <h2>Códigos</h2>
        <div className="dma-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Licencia</th>
                <th>Usos</th>
                <th>Creado</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.promos.map((item) => {
                const open = item.used < item.maxUses
                return (
                  <tr key={item.code}>
                    <td><button className="linkish" type="button" onClick={() => void copy(item.code)}>{item.code}</button></td>
                    <td>{tierLabel(item.tier)}</td>
                    <td>{item.used}/{item.maxUses}</td>
                    <td>{when(item.createdAt)}</td>
                    <td><span className={`dma-badge ${open ? 'ok' : 'bad'}`}>{open ? 'Abierto' : 'Agotado'}</span></td>
                    <td>{open && <button className="btn btn-ghost dma-mini" type="button" disabled={busy} onClick={() => void close(item.code)}>Cerrar</button>}</td>
                  </tr>
                )
              })}
              {data.promos.length === 0 && (
                <tr>
                  <td colSpan={6}>Todavía no hay códigos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
