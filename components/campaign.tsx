'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { countdownParts, isLaunchFreeActive, LAUNCH_FREE_UNTIL, pad2, type CampaignPayload } from '@/lib/campaign'

interface CampaignState {
  active: boolean
  until: string
}

const CampaignContext = createContext<CampaignState>({ active: isLaunchFreeActive(), until: LAUNCH_FREE_UNTIL })

/** Fetches /api/campaign once and keeps `active` in sync with the clock. */
export function CampaignProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CampaignState>({ active: isLaunchFreeActive(), until: LAUNCH_FREE_UNTIL })

  useEffect(() => {
    let cancelled = false
    void fetch('/api/campaign', { cache: 'no-store' })
      .then((response) => (response.ok ? (response.json() as Promise<CampaignPayload>) : null))
      .then((body) => {
        if (cancelled || !body || typeof body.active !== 'boolean') return
        setState({ active: body.active, until: typeof body.until === 'string' ? body.until : LAUNCH_FREE_UNTIL })
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!state.active) return
    const id = window.setInterval(() => {
      if (Date.now() >= Date.parse(state.until)) setState((current) => ({ ...current, active: false }))
    }, 15000)
    return () => window.clearInterval(id)
  }, [state.active, state.until])

  return <CampaignContext.Provider value={state}>{children}</CampaignContext.Provider>
}

export function useCampaign(): CampaignState {
  return useContext(CampaignContext)
}

export interface CountdownLabels {
  days: string
  hours: string
  minutes: string
  seconds: string
}

export function Countdown({
  until,
  labels,
  tone = 'default',
}: {
  until: string
  labels: CountdownLabels
  tone?: 'default' | 'compact'
}) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const parts = now === null ? null : countdownParts(now, until)
  const cells: [string, string, string][] = [
    ['d', parts ? String(parts.days) : '--', labels.days],
    ['h', parts ? pad2(parts.hours) : '--', labels.hours],
    ['m', parts ? pad2(parts.minutes) : '--', labels.minutes],
    ['s', parts ? pad2(parts.seconds) : '--', labels.seconds],
  ]

  return (
    <div className={tone === 'compact' ? 'countdown countdown-compact' : 'countdown'} role="timer" aria-live="off">
      {cells.map(([id, value, label]) => (
        <div key={id} className="cd-cell">
          <span key={id === 's' ? value : id} className={id === 's' ? 'cd-value cd-tick' : 'cd-value'}>
            {value}
          </span>
          <span className="cd-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
