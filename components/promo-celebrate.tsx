'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'

const COLORS = ['#2b78ff', '#22d3ee', '#7ff0ff', '#3dc9ff', '#4a8dff', '#9fd0ff', '#ffffff']

function Confetti({ count }: { count: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        left: Math.random() * 100,
        delay: -Math.random() * 3.5,
        duration: 2.6 + Math.random() * 2.2,
        color: COLORS[index % COLORS.length],
        drift: (Math.random() - 0.5) * 160,
        spin: 360 + Math.random() * 720,
        scale: 0.6 + Math.random() * 0.7,
      })),
    [count],
  )
  return (
    <div className="promo-confetti" aria-hidden>
      {pieces.map((piece, index) => (
        <span
          key={index}
          style={
            {
              left: `${piece.left}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              scale: piece.scale,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function useCount(target: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / 1400)
      setValue(Math.round(target * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

function chime() {
  try {
    const ctx = new AudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = freq
      osc.type = 'triangle'
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + index * 0.12 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + index * 0.12)
      osc.stop(ctx.currentTime + index * 0.12 + 0.4)
    })
  } catch {
    /* Sin audio el festejo sigue en pantalla. */
  }
}

export function PromoCelebrate({
  tierName,
  expiresAt,
  code,
  title,
  lead,
  daysLabel,
  closeLabel,
  onClose,
}: {
  tierName: string
  expiresAt: string
  code: string
  title: string
  lead: string
  daysLabel: string
  closeLabel: string
  onClose: () => void
}) {
  const days = useCount(365)
  const until = new Date(expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    chime()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="promo-layer" role="dialog" aria-modal="true">
      <Confetti count={80} />
      <section className="promo-pop">
        <Confetti count={36} />
        <p className="promo-kicker">{title}</p>
        <h2>{tierName}</h2>
        <p className="promo-count">
          <strong>{days}</strong> <span>{daysLabel}</span>
        </p>
        <p>{lead}</p>
        <p className="promo-until">{until}</p>
        <p className="promo-code">{code}</p>
        <button className="btn btn-primary" type="button" onClick={onClose} autoFocus>
          {closeLabel}
        </button>
      </section>
    </div>
  )
}
