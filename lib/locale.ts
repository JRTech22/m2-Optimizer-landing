import { LANGS, type Lang } from '@/lib/copy'

const PREFIXED = ['en', 'fr', 'pt'] as const
export type PrefixedLang = (typeof PREFIXED)[number]

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value)
}

export function isPrefixedLang(value: string): value is PrefixedLang {
  return (PREFIXED as readonly string[]).includes(value)
}

/** Idioma de la URL. La raíz es español; /en /fr /pt usan prefijo. */
export function langFromPath(pathname: string): Lang {
  const segment = pathname.split('/').filter(Boolean)[0]
  return segment && isPrefixedLang(segment) ? segment : 'es'
}

/** Ruta sin el prefijo de idioma. */
export function barePath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isPrefixedLang(parts[0])) {
    const rest = parts.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

/** Conserva el ancla, por ejemplo `/#funciones`. */
export function localeHref(lang: Lang, href: string): string {
  const hashAt = href.indexOf('#')
  const hash = hashAt >= 0 ? href.slice(hashAt) : ''
  const path = hashAt >= 0 ? href.slice(0, hashAt) || '/' : href
  if (lang === 'es') return `${path || '/'}${hash}`
  if (path === '/' || path === '') return `/${lang}${hash}`
  return `/${lang}${path}${hash}`
}
