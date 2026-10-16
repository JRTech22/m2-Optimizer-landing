import 'server-only'

import {
  campaignPayload,
  isLaunchFreeActive,
  LAUNCH_FREE_ORDER_ID,
  LAUNCH_FREE_UNTIL,
} from '@/lib/campaign-logic'

export const LAUNCH_FREE_EMAIL = 'launch-free@m2dominicanrd.com'

export { LAUNCH_FREE_UNTIL, LAUNCH_FREE_ORDER_ID, isLaunchFreeActive, campaignPayload }
