'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Countdown, CampaignProvider, useCampaign } from '@/components/campaign'
import { formatLaunchFreeDate } from '@/lib/campaign'
import { COPY, LANGS, type Lang } from '@/lib/copy'
import { barePath, langFromPath, localeHref } from '@/lib/locale'

interface Prefs {
  lang: Lang
  theme: 'light' | 'dark'
  downloadHref: string
  setLang: (lang: Lang) => void
  setTheme: (theme: 'light' | 'dark') => void
}

const PrefsContext = createContext<Prefs>({
  lang: 'es',
  theme: 'dark',
  downloadHref: 'https://optimizer.m2dominicanrd.com/M2Optimizer.appinstaller',
  setLang: () => undefined,
  setTheme: () => undefined,
})

export function usePrefs(): Prefs {
  return useContext(PrefsContext)
}

const LANG_NAMES: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  pt: 'Português',
}

function Flag({ id }: { id: Lang }) {
  if (id === 'es') {
    return (
      <svg className="flag" viewBox="0 0 18 12" aria-hidden>
        <rect width="18" height="12" fill="#AA151B" />
        <rect y="3" width="18" height="6" fill="#F1BF00" />
      </svg>
    )
  }
  if (id === 'en') {
    return (
      <svg className="flag" viewBox="0 0 18 12" aria-hidden>
        <rect width="18" height="12" fill="#B22234" />
        <rect y="1" width="18" height="1" fill="#fff" />
        <rect y="3" width="18" height="1" fill="#fff" />
        <rect y="5" width="18" height="1" fill="#fff" />
        <rect y="7" width="18" height="1" fill="#fff" />
        <rect y="9" width="18" height="1" fill="#fff" />
        <rect y="11" width="18" height="1" fill="#fff" />
        <rect width="8" height="6.5" fill="#3C3B6E" />
      </svg>
    )
  }
  if (id === 'fr') {
    return (
      <svg className="flag" viewBox="0 0 18 12" aria-hidden>
        <rect width="6" height="12" fill="#0055A4" />
        <rect x="6" width="6" height="12" fill="#fff" />
        <rect x="12" width="6" height="12" fill="#EF4135" />
      </svg>
    )
  }
  return (
    <svg className="flag" viewBox="0 0 18 12" aria-hidden>
      <rect width="18" height="12" fill="#009739" />
      <polygon points="9,1.2 16.2,6 9,10.8 1.8,6" fill="#FEDD00" />
      <circle cx="9" cy="6" r="2.2" fill="#012169" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2.2v2.4M12 19.4V22M2.2 12h2.4M19.4 12H22M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M19.2 4.8l-1.7 1.7M6.5 17.5 4.8 19.2" />
      </g>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M15.2 2.4A9 9 0 1 0 21.6 16 7.6 7.6 0 0 1 15.2 2.4z" />
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path fill="currentColor" d="M1 2.4 6.8 1.6v5.7H1V2.4zm6.5-.9L15 0v7.3H7.5V1.5zM1 8.7h5.8v5.7L1 13.6V8.7zm6.5 0H15V16l-7.5-1.5V8.7z" />
    </svg>
  )
}

export function Shell({ children, downloadHref }: { children: ReactNode; downloadHref: string }) {
  return (
    <CampaignProvider>
      <ShellFrame downloadHref={downloadHref}>{children}</ShellFrame>
    </CampaignProvider>
  )
}

function ShellFrame({ children, downloadHref }: { children: ReactNode; downloadHref: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const campaign = useCampaign()
  const lang = langFromPath(pathname)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const storedTheme = localStorage.getItem('m2.landing.theme')
    if (storedTheme === 'light' || storedTheme === 'dark') setTheme(storedTheme)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dataset.theme = theme
    localStorage.setItem('m2.landing.lang', lang)
    localStorage.setItem('m2.landing.theme', theme)
  }, [lang, theme])
  const chooseLang = (next: Lang) => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.push(`${localeHref(next, barePath(pathname))}${hash}`)
    setLangOpen(false)
  }
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLangOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
  const copy = COPY[lang]
  const bare = barePath(pathname)
  const links = [
    ['/', copy.nav.home],
    ['/#funciones', copy.nav.features],
    ['/#widgets', copy.nav.widgets],
    ['/pricing', copy.nav.pricing],
    ['/help', copy.nav.help],
  ] as const
  const foot = [
    ['/pricing', copy.nav.pricing],
    ['/help', copy.nav.help],
    ['/terms', copy.nav.terms],
    ['/privacy', copy.nav.privacy],
    ['/contact', copy.nav.contact],
  ] as const
  const dma = bare === '/dma' || bare.startsWith('/dma/')
  return (
    <PrefsContext.Provider value={{ lang, theme, downloadHref, setLang: chooseLang, setTheme }}>
      {!dma && <header className="bar">
        <div className="bar-inner">
          <Link href={localeHref(lang, '/')} className="brand" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="M2 Optimizer" width={40} height={40} />
            {copy.brand}
          </Link>
          <button type="button" className="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? '×' : '☰'}
          </button>
          <nav className={open ? 'open' : undefined}>
            {links.map(([href, label]) => {
              const current = !href.includes('#') && bare === href
              return (
                <Link key={href} href={localeHref(lang, href)} aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="prefs">
            <div className="lang" ref={langRef}>
              <button
                type="button"
                className="lang-btn"
                aria-label={copy.langLabel}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((value) => !value)}
              >
                <Flag id={lang} />
                <span>{LANG_NAMES[lang]}</span>
                <svg className={langOpen ? 'caret open' : 'caret'} width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              {langOpen && (
                <ul className="lang-menu" role="listbox" aria-label={copy.langLabel}>
                  {LANGS.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={item === lang}
                        onClick={() => chooseLang(item)}
                      >
                        <Flag id={item} />
                        <span>{LANG_NAMES[item]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="switch"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={theme === 'dark' ? copy.theme.toLight : copy.theme.toDark}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="switch-side sun" aria-hidden>
                <SunIcon />
              </span>
              <span className="switch-side moon" aria-hidden>
                <MoonIcon />
              </span>
              <span className="switch-knob" aria-hidden>
                <SunIcon />
                <MoonIcon />
              </span>
            </button>
            <a className="btn btn-primary win" href={downloadHref}>
              <WindowsIcon />
              {copy.nav.download}
            </a>
          </div>
        </div>
        {campaign.active && (
          <div className="ribbon">
            <div className="ribbon-inner">
              <span className="ribbon-dot" aria-hidden />
              <p>
                {copy.campaign.ribbon} <strong>{formatLaunchFreeDate(lang, campaign.until)}</strong>
              </p>
              <Countdown until={campaign.until} labels={copy.campaign} tone="compact" />
              <a className="ribbon-link" href={downloadHref}>
                {copy.campaign.ribbonCta}
                <span aria-hidden> →</span>
              </a>
            </div>
          </div>
        )}
      </header>}
      <main>{children}</main>
      {!dma && <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <p className="brand">
              <img src="/logo.png" alt="M2 Optimizer" width={32} height={32} />
              {copy.brand}
            </p>
            <p>© {new Date().getFullYear()} M2Dominican RD</p>
          </div>
          <div className="foot-links">
            {foot.map(([href, label]) => (
              <Link key={href} href={localeHref(lang, href)}>
                {label}
              </Link>
            ))}
            <a href="mailto:contacto@m2dominicanrd.com">contacto@m2dominicanrd.com</a>
          </div>
        </div>
      </footer>}
    </PrefsContext.Provider>
  )
}
