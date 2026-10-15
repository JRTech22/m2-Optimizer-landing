import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

const PAYPAL_CLIENT_ID =
  'AUtSJunWSbG7ATBnzirQqEuD5N86OPVCJJWVfkqWgmjsyzXeQif07TLoaYndhaky66lhszphmkTvceJn'
const PAYPAL_SECRET = 'EGKFRNJNZXteIIfZMq2ZARLykXlL_oeE7a9BHW0ScyJf5cuUqD2j6sZhNlErfOLIOBA9A762GN5VkhGd'
const API = 'https://api-m.paypal.com'

export const PRICES = { basic: '4.99', complete: '19.99' } as const
export type PaidTier = keyof typeof PRICES

export function signLicense(fingerprint: string, tier: string, expiresAt: string, orderId: string): string {
  return createHmac('sha256', PAYPAL_SECRET).update(`${fingerprint}|${tier}|${expiresAt}|${orderId}`).digest('hex')
}

export function signPromo(code: string, tier: string, maxUses: number, used: number, createdAt: string): string {
  return createHmac('sha256', PAYPAL_SECRET).update(`promo|${code}|${tier}|${maxUses}|${used}|${createdAt}`).digest('hex')
}

export function signDma(payload: string): string {
  return createHmac('sha256', PAYPAL_SECRET).update(payload).digest('hex')
}

export function verifyLicense(fingerprint: string, tier: string, expiresAt: string, orderId: string, signature: string): boolean {
  const expected = signLicense(fingerprint, tier, expiresAt, orderId)
  const left = Buffer.from(expected)
  const right = Buffer.from(signature)
  return left.length === right.length && timingSafeEqual(left, right)
}

async function token(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
  const response = await fetch(`${API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!response.ok) throw new Error('PayPal rechazó la autenticación')
  const body = (await response.json()) as { access_token?: string }
  if (!body.access_token) throw new Error('PayPal no entregó un token')
  return body.access_token
}

export async function createOrder(tier: PaidTier, fingerprint: string): Promise<string> {
  const access = await token()
  const response = await fetch(`${API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: PRICES[tier] },
          custom_id: `${fingerprint}:${tier}`.slice(0, 127),
          description: `M2 Optimizer ${tier} annual`,
        },
      ],
    }),
  })
  if (!response.ok) throw new Error('PayPal no creó la orden')
  const body = (await response.json()) as { id?: string }
  if (!body.id) throw new Error('PayPal no devolvió la orden')
  return body.id
}

interface CaptureBody {
  status?: string
  purchase_units?: {
    custom_id?: string
    payments?: { captures?: { status?: string; amount?: { value?: string; currency_code?: string } }[] }
  }[]
}

export async function captureOrder(orderId: string, tier: PaidTier, fingerprint: string): Promise<void> {
  const access = await token()
  const response = await fetch(`${API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error('PayPal no capturó el pago')
  const body = (await response.json()) as CaptureBody
  const unit = body.purchase_units?.[0]
  const capture = unit?.payments?.captures?.[0]
  const paid = capture?.status === 'COMPLETED' || body.status === 'COMPLETED'
  const amount = capture?.amount?.value
  const currency = capture?.amount?.currency_code
  if (!paid || amount !== PRICES[tier] || currency !== 'USD') throw new Error('El pago no coincide con la licencia')
  if (unit?.custom_id && unit.custom_id !== `${fingerprint}:${tier}`.slice(0, 127)) {
    throw new Error('La orden no corresponde a este equipo')
  }
}
