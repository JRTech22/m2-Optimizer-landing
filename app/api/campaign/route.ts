import { json, options } from '@/server/http'
import { campaignPayload } from '@/server/campaign'

export function OPTIONS() {
  return options()
}

export async function GET() {
  return json(campaignPayload())
}
