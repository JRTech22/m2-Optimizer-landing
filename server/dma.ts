import 'server-only'

import { timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { signDma } from '@/server/paypal'

const COOKIE = 'm2_dma'
const SESSION_MS = 12 * 60 * 60 * 1000
const failures = new Map<string, { count: number; reset: number }>()

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'local'
  return 'local'
}

export function dmaLimited(ip: string): boolean {
  const row = failures.get(ip)
  if (!row || row.reset < Date.now()) return false
  return row.count >= 8
}

export function dmaFail(ip: string): void {
  const now = Date.now()
  const row = failures.get(ip)
  if (!row || row.reset < now) {
    failures.set(ip, { count: 1, reset: now + 15 * 60 * 1000 })
    return
  }
  row.count += 1
}

export function dmaClear(ip: string): void {
  failures.delete(ip)
}

export function pinMatches(stored: string, attempt: string): boolean {
  if (!/^\d{4}$/.test(stored) || !/^\d{4}$/.test(attempt)) return false
  const left = Buffer.from(stored)
  const right = Buffer.from(attempt)
  return left.length === right.length && timingSafeEqual(left, right)
}

export async function openDmaSession(): Promise<void> {
  const exp = Date.now() + SESSION_MS
  const token = `${exp}.${signDma(`dma|${exp}`)}`
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MS / 1000,
  })
}

export async function closeDmaSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function dmaOpen(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false
  const [exp, signature] = token.split('.')
  if (!exp || !signature || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  const expected = signDma(`dma|${exp}`)
  const left = Buffer.from(expected)
  const right = Buffer.from(signature)
  return left.length === right.length && timingSafeEqual(left, right)
}
