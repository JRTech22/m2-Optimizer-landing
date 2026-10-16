'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Countdown, useCampaign } from '@/components/campaign'
import { PromoCelebrate } from '@/components/promo-celebrate'
import { usePrefs } from '@/components/shell'
import { formatLaunchFreeDate } from '@/lib/campaign'
import { COPY } from '@/lib/copy'
import { maskPromo, promoReady } from '@/lib/promo-code'
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
  const { lang, downloadHref } = usePrefs()
  const copy = COPY[lang].pricing
  const page = COPY[lang].pages.pricing
  const shared = COPY[lang].campaign
  const campaign = useCampaign()
  const [showPaid, setShowPaid] = useState(false)
  const paidVisible = !campaign.active || showPaid
  const initialTier = params.get('tier') === 'basic' ? 'basic' : 'complete'
  const fromApp = params.get('device') ?? ''
  const device = /^[a-f0-9]{64}$/.test(fromApp) ? fromApp : ''
  const [tier, setTier] = useState<'basic' | 'complete'>(initialTier)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [promoError, setPromoError] = useState('')
  const [covered, setCovered] = useState(false)
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(0)
  const [redeeming, setRedeeming] = useState(false)
  const [won, setWon] = useState<{ tier: 'basic' | 'complete'; expiresAt: string; code: string } | null>(null)
  const ready = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && device.length === 64
  const promoMessages = {
    missing: copy.promoMissing,
    used: copy.promoUsed,
    empty: copy.promoEmpty,
    invalid: copy.promoInvalid,
    covered: copy.promoCovered,
  }

  async function redeem(event: FormEvent) {
    event.preventDefault()
    if (!promoReady(code) || redeeming) return
    if (!ready) {
      setPromoError(copy.promoNeed)
      setShake((value) => value + 1)
      return
    }
    setRedeeming(true)
    setPromoError('')
    try {
      const response = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, fingerprint: device, email }),
      })
      const body = (await response.json()) as { error?: keyof typeof promoMessages; tier?: 'basic' | 'complete'; expiresAt?: string; code?: string }
      if (!response.ok || !body.tier || !body.expiresAt) {
        setPromoError(promoMessages[body.error ?? 'invalid'] ?? copy.promoInvalid)
        setShake((value) => value + 1)
        return
      }
      setCovered(true)
      setCode('')
      setWon({ tier: body.tier, expiresAt: body.expiresAt, code: body.code ?? code })
    } finally {
      setRedeeming(false)
    }
  }

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
    if (!ready || covered || !paidVisible) return
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
  }, [ready, covered, paidVisible, tier, device, email, copy.paid, copy.reused])

  const plans = [
    { id: 'basic' as const, name: copy.basic, price: '4,99', body: page.blocks[0]?.body ?? '' },
    { id: 'complete' as const, name: copy.complete, price: '19,99', body: page.blocks[1]?.body ?? '' },
  ]

  return (
    <>
      <section className="shop">
        <header className="shop-hero">
          <div className="wrap">
            <p className="eyebrow">M2 Optimizer</p>
            <h1>{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
        </header>
        {campaign.active && (
          <div className="wrap">
            <section className="launch-panel" aria-labelledby="launch-title">
              <div className="launch-copy">
                <span className="badge">
                  <span className="badge-dot" aria-hidden />
                  {copy.launch.badge}
                </span>
                <h2 id="launch-title">{copy.launch.title}</h2>
                <p className="launch-price">
                  <strong>{copy.launch.free}</strong>
                  <s>19,99 USD</s>
                </p>
                <p className="launch-lede">{copy.launch.lede}</p>
                <ul className="launch-list">
                  {copy.launch.includes.map((item) => (
                    <li key={item}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                        <path d="M3.5 8.4 6.6 11.5 12.5 4.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="cta-row">
                  <a className="btn btn-primary btn-lg" href={downloadHref}>
                    {copy.launch.cta}
                  </a>
                </div>
                <p className="launch-normal">{copy.launch.normal}</p>
              </div>
              <div className="launch-side">
                <p className="cd-lead">
                  <span className="pulse-dot" aria-hidden />
                  {copy.launch.expires} {formatLaunchFreeDate(lang, campaign.until)}
                </p>
                <Countdown until={campaign.until} labels={shared} />
                <p className="launch-paynote">{copy.launch.paypalNote}</p>
                <button type="button" className="linkish launch-toggle" aria-expanded={showPaid} onClick={() => setShowPaid((value) => !value)}>
                  {showPaid ? copy.launch.paypalHide : copy.launch.paypalToggle}
                </button>
              </div>
            </section>
          </div>
        )}
        {paidVisible && (
          <>
        <div className="wrap license-grid">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={tier === plan.id ? 'plan-card picked' : 'plan-card'}
              aria-pressed={tier === plan.id}
              onClick={() => setTier(plan.id)}
            >
              {plan.id === 'complete' && <span className="plan-flag">{copy.popular}</span>}
              <span className="plan-name">{plan.name}</span>
              <span className="plan-price">
                {plan.price} <small>USD</small>
              </span>
              <span className="plan-year">{copy.year}</span>
              <span className="plan-body">{plan.body}</span>
              <span className="plan-choose">{copy.choose}</span>
            </button>
          ))}
        </div>
        <form className="wrap shop-pay card" onSubmit={(event) => event.preventDefault()}>
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
          {!covered && <p className="pay-label">{copy.pay}</p>}
          {!covered && <div id="paypal-button" />}
          {message && <p className="pay-note">{message}</p>}
        </form>
          </>
        )}
        <form className={campaign.active ? 'wrap promo-card promo-quiet card' : 'wrap promo-card card'} onSubmit={(event) => void redeem(event)}>
          <div>
            <h2>{copy.promoTitle}</h2>
            <p>{copy.promoLead}</p>
          </div>
          {!paidVisible && (
            <label className="promo-email">
              {copy.email}
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </label>
          )}
          <div key={shake} className={shake > 0 ? 'promo-entry promo-temblor' : 'promo-entry'}>
            <input
              value={code}
              onChange={(event) => {
                setCode(maskPromo(event.target.value))
                setPromoError('')
              }}
              placeholder="XX-XXXX-XXXX"
              aria-label={copy.promoTitle}
              spellCheck={false}
              autoComplete="off"
              maxLength={12}
            />
            <button className="btn btn-primary" type="submit" disabled={!promoReady(code) || redeeming}>
              {redeeming ? copy.promoBusy : copy.promoAction}
            </button>
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}
        </form>
      </section>
      {won && (
        <PromoCelebrate
          tierName={won.tier === 'basic' ? copy.basic : copy.complete}
          expiresAt={won.expiresAt}
          code={won.code}
          title={copy.promoDone}
          lead={copy.promoCongrats}
          daysLabel={copy.promoDays}
          closeLabel={copy.promoClose}
          onClose={() => setWon(null)}
        />
      )}
    </>
  )
}
