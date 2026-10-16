import type { Lang } from '@/lib/copy'
import { LAUNCH_FREE_UNTIL } from '@/lib/campaign-logic'

export { isLaunchFreeActive, LAUNCH_FREE_UNTIL, LAUNCH_FREE_ORDER_ID, campaignPayload } from '@/lib/campaign-logic'

export function launchFreeUntilMs(): number {
  return Date.parse(LAUNCH_FREE_UNTIL)
}

export interface CampaignPayload {
  active: boolean
  until: string
  tier: 'complete'
}

export interface Countdown {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** Time left until the campaign ends, split into units. Never negative. */
export function countdownParts(now: number = Date.now(), until: string = LAUNCH_FREE_UNTIL): Countdown {
  const target = Date.parse(until)
  const total = Math.max(0, (Number.isFinite(target) ? target : 0) - now)
  const secs = Math.floor(total / 1000)
  return {
    total,
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    minutes: Math.floor((secs % 3600) / 60),
    seconds: secs % 60,
  }
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

const LOCALES: Record<Lang, string> = {
  es: 'es-DO',
  en: 'en-US',
  fr: 'fr-FR',
  pt: 'pt-BR',
}

/**
 * Human date of the cutoff, e.g. "1 de enero de 2027". Always formatted in UTC
 * so every visitor sees the same calendar day the server uses.
 */
export function formatLaunchFreeDate(lang: Lang, until: string = LAUNCH_FREE_UNTIL): string {
  try {
    return new Intl.DateTimeFormat(LOCALES[lang], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(until))
  } catch {
    return until.slice(0, 10)
  }
}
