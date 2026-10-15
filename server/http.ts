import 'server-only'

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors })
}

export function options(): Response {
  return new Response(null, { status: 204, headers: cors })
}

const FINGERPRINT = /^[a-f0-9]{64}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isFingerprint(value: unknown): value is string {
  return typeof value === 'string' && FINGERPRINT.test(value)
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 200 && EMAIL.test(value)
}

export function isPaidTier(value: unknown): value is 'basic' | 'complete' {
  return value === 'basic' || value === 'complete'
}
