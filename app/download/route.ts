import { options } from '@/server/http'
import { APP_INSTALLER_URL } from '@/server/store'

export function OPTIONS() {
  return options()
}

export function GET() {
  return Response.redirect(APP_INSTALLER_URL, 302)
}
