const CODE = /^[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

/** Lo escrito pasa a XX-XXXX-XXXX, solo letras y números. */
export function maskPromo(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  return [clean.slice(0, 2), clean.slice(2, 6), clean.slice(6)].filter(Boolean).join('-')
}

export function promoReady(value: string): boolean {
  return CODE.test(value)
}
