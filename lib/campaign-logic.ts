/** Client/server-safe campaign constants (no server-only imports). */
export const LAUNCH_FREE_UNTIL = '2027-01-01T00:00:00.000Z'
export const LAUNCH_FREE_ORDER_ID = 'launch-free-2027'

export function isLaunchFreeActive(now = Date.now()): boolean {
  return now < Date.parse(LAUNCH_FREE_UNTIL)
}

export function campaignPayload(now = Date.now()) {
  return {
    active: isLaunchFreeActive(now),
    until: LAUNCH_FREE_UNTIL,
    tier: 'complete' as const,
    orderId: LAUNCH_FREE_ORDER_ID,
  }
}
