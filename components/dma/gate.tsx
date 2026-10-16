'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

export function DmaGate() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void fetch('/api/dma/data')
      .then((response) => {
        if (response.ok) router.replace('/dma/inicio')
        else setReady(true)
      })
      .catch(() => setReady(true))
  }, [router])

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
        setShake((value) => value + 1)
        setPin('')
        return
      }
      router.replace('/dma/inicio')
    } finally {
      setBusy(false)
    }
  }

  if (!ready) {
    return (
      <section className="dma dma-gate">
        <p className="dma-loading">Cargando…</p>
      </section>
    )
  }

  return (
    <section className="dma dma-gate">
      <form className="dma-login" onSubmit={(event) => void enter(event)}>
        <img className="dma-mark" src="/logo.png" alt="" width={64} height={64} />
        <p className="eyebrow">M2 Optimizer</p>
        <h1>Acceso DMA</h1>
        <p className="dma-lead">Área privada. Introduce el PIN de cuatro dígitos.</p>
        <label className="dma-pin">
          <span className="dma-pin-label">PIN</span>
          <input
            className="dma-pin-input"
            value={pin}
            onChange={(event) => {
              setError('')
              setPin(event.target.value.replace(/\D/g, '').slice(0, 4))
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={4}
            pattern="\d{4}"
            aria-invalid={error ? true : undefined}
            required
          />
          <span className={`dma-slots${error ? ' dma-shake' : ''}`} key={shake} aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className={pin.length === index ? 'caret' : pin[index] ? 'filled' : undefined}>
                {pin[index] ? '•' : ''}
              </span>
            ))}
          </span>
        </label>
        {error && <p className="dma-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy || pin.length !== 4}>
          {busy ? 'Comprobando…' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
