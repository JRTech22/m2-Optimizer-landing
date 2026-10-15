'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Article } from '@/components/article'
import { usePrefs } from '@/components/shell'
import { COPY } from '@/lib/copy'
import { PAYPAL_CLIENT_ID } from '@/lib/paypal-public'

interface PayPalButtons {
  Buttons: (options: {
    createOrder: () => Promise<string>
    onApprove: (data: { orderID: string }) => Promise<void>
  }) => { render: (selector: string) => Promise<void> }
}

declare global {
  interface Window {
    paypal?: PayPalButtons
  }
}

export function Pricing() {
  const params = useSearchParams()
  const { lang } = usePrefs()
  const copy = COPY[lang].pricing
  const initialTier = params.get('tier') === 'basic' ? 'basic' : 'complete'
  const fromApp = params.get('device') ?? ''
  const device = /^[a-f0-9]{64}$/.test(fromApp) ? fromApp : ''
  const [tier, setTier] = useState<'basic' | 'complete'>(initialTier)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [covered, setCovered] = useState(false)
  const ready = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && device.length === 64

  useEffect(() => {
    if (!ready) {
      setCovered(false)
      return
    }
    let cancelled = false
    const timer = window.setTimeout(() => {
      void fetch('/api/license/restore', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, fingerprint: device }),
      })
        .then(async (response) => ({ ok: response.ok, body: (await response.json()) as { reused?: boolean; tier?: string } }))
        .then((result) => {
          if (cancelled || !result.ok || !result.body.reused) {
            if (!cancelled) {
              setCovered(false)
              setMessage((current) => (current === copy.reused || current === copy.partial ? '' : current))
            }
            return
          }
          const fits = result.body.tier === 'complete' || result.body.tier === tier
          setCovered(fits)
          setMessage(fits ? copy.reused : copy.partial)
        })
        .catch(() => {
          if (!cancelled) setCovered(false)
        })
    }, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [ready, email, device, tier, copy.reused, copy.partial])

  useEffect(() => {
    if (!ready || covered) return
    const holder = document.querySelector('#paypal-button')
    if (!holder) return
    holder.innerHTML = ''
    let cancelled = false
    const render = () => {
      if (cancelled || !window.paypal) return
      void window.paypal
        .Buttons({
          createOrder: async () => {
            const response = await fetch('/api/paypal/order', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ tier, fingerprint: device, email }),
            })
            const body = (await response.json()) as { id?: string; reused?: boolean; error?: string }
            if (body.reused) {
              setCovered(true)
              setMessage(copy.reused)
              throw new Error('reused')
            }
            if (!response.ok || !body.id) throw new Error(body.error ?? 'PayPal')
            return body.id
          },
          onApprove: async (data) => {
            const response = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, tier, fingerprint: device, email }),
            })
            const body = (await response.json()) as { error?: string }
            setMessage(response.ok ? copy.paid : (body.error ?? 'PayPal'))
          },
        })
        .render('#paypal-button')
    }
    if (window.paypal) render()
    else {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
      script.onload = render
      document.body.appendChild(script)
    }
    return () => {
      cancelled = true
      if (holder) holder.innerHTML = ''
    }
  }, [ready, covered, tier, device, email, copy.paid, copy.reused])

  return (
    <>
      <Article id="pricing" />
      <form className="pay card" onSubmit={(event) => event.preventDefault()}>
        <label>
          {copy.email}
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          {copy.device}
          <input
            className="device-lock"
            value={device}
            readOnly
            tabIndex={-1}
            spellCheck={false}
            autoComplete="off"
            aria-readonly="true"
            onChange={() => undefined}
            onCopy={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            onPaste={(event) => event.preventDefault()}
            onDrop={(event) => event.preventDefault()}
            onKeyDown={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
          />
        </label>
        {device.length === 0 && <p>{copy.missingDevice}</p>}
        <div className="tiers">
          <button type="button" aria-pressed={tier === 'basic'} onClick={() => setTier('basic')}>
            {copy.basic} · 4,99 USD
          </button>
          <button type="button" aria-pressed={tier === 'complete'} onClick={() => setTier('complete')}>
            {copy.complete} · 19,99 USD
          </button>
        </div>
        {!covered && <p>{copy.pay}</p>}
        {!covered && <div id="paypal-button" />}
        {message && <p>{message}</p>}
      </form>
    </>
  )
}
