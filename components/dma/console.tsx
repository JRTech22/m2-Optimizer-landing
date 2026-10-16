'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { DmaContext, type AdminData } from '@/components/dma/model'

const NAV = [
  { href: '/dma/inicio', label: 'Inicio', icon: 'grid' },
  { href: '/dma/versiones', label: 'Versiones', icon: 'box' },
  { href: '/dma/codigos', label: 'Códigos', icon: 'tag' },
  { href: '/dma/licencias', label: 'Licencias', icon: 'key' },
  { href: '/dma/equipos', label: 'Equipos', icon: 'pc' },
] as const

function Icon({ name }: { name: (typeof NAV)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      {name === 'grid' && (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" {...common} />
          <rect x="13" y="4" width="7" height="7" rx="1.5" {...common} />
          <rect x="4" y="13" width="7" height="7" rx="1.5" {...common} />
          <rect x="13" y="13" width="7" height="7" rx="1.5" {...common} />
        </>
      )}
      {name === 'box' && (
        <>
          <path d="M4 8l8-4 8 4-8 4-8-4z" {...common} />
          <path d="M4 8v8l8 4 8-4V8" {...common} />
          <path d="M12 12v8" {...common} />
        </>
      )}
      {name === 'tag' && <path d="M4 12V5h7l9 9-7 7-9-9zM8 8h.01" {...common} />}
      {name === 'key' && <path d="M15 8a4 4 0 1 0-3.5 6H10v2H8v2H5v-3.2L8.2 12A4 4 0 0 0 15 8z" {...common} />}
      {name === 'pc' && (
        <>
          <rect x="3" y="5" width="18" height="12" rx="2" {...common} />
          <path d="M8 21h8M12 17v4" {...common} />
        </>
      )}
    </svg>
  )
}

export function DmaConsole({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)

  const reload = useCallback(async () => {
    const response = await fetch('/api/dma/data')
    if (!response.ok) {
      setData(null)
      router.replace('/dma')
      return
    }
    setData((await response.json()) as AdminData)
  }, [router])

  useEffect(() => {
    const stored = window.localStorage.getItem('dma-nav')
    if (stored === 'closed') setCollapsed(true)
    void reload().finally(() => setReady(true))
  }, [reload])

  useEffect(() => {
    setNotice('')
    setError('')
    setDrawer(false)
  }, [pathname])

  async function run(work: () => Promise<string | void>) {
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const message = await work()
      if (message) setNotice(message)
      await reload()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se completó')
    } finally {
      setBusy(false)
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value)
    setNotice('Copiado.')
  }

  async function leave() {
    await fetch('/api/dma/logout', { method: 'POST' })
    router.replace('/dma')
  }

  function toggleNav() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setDrawer((value) => !value)
      return
    }
    setCollapsed((value) => {
      const next = !value
      window.localStorage.setItem('dma-nav', next ? 'closed' : 'open')
      return next
    })
  }

  if (!ready) {
    return (
      <section className="dma dma-gate">
        <p className="dma-loading">Cargando…</p>
      </section>
    )
  }

  if (!data) return null

  const current = NAV.find((item) => pathname === item.href)?.label ?? 'DMA'

  return (
    <DmaContext.Provider value={{ data, notice, error, busy, reload, run, copy }}>
      <div className={`dma-app${collapsed ? ' is-collapsed' : ''}${drawer ? ' is-open' : ''}`}>
        <aside className="dma-side">
          <div className="dma-brand">
            <Link href="/dma/inicio">
              <img src="/logo.png" alt="" width={36} height={36} />
              <span className="dma-label">
                <strong>DMA</strong>
                <small>M2 Optimizer</small>
              </span>
            </Link>
            <button className="dma-collapse" type="button" onClick={toggleNav} aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d={collapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="dma-nav-label">Panel</p>
          <nav className="dma-nav" aria-label="Administración">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} title={item.label}>
                <Icon name={item.icon} />
                <span className="dma-label">{item.label}</span>
              </Link>
            ))}
          </nav>
          <button className="dma-leave" type="button" onClick={() => void leave()}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M10 7V5H5v14h5v-2M10 12h9M16 9l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="dma-label">Cerrar sesión</span>
          </button>
        </aside>
        {drawer && <button className="dma-backdrop" type="button" aria-label="Cerrar menú" onClick={() => setDrawer(false)} />}
        <div className="dma-main">
          <header className="dma-top">
            <div className="dma-title">
              <button className="dma-menu" type="button" onClick={toggleNav} aria-label="Menú">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <div>
                <p>Consola</p>
                <h1>{current}</h1>
              </div>
            </div>
            {data.catalog.version && <span className="dma-live">v{data.catalog.version}</span>}
          </header>
          {error && <p className="dma-banner bad" role="alert">{error}</p>}
          {notice && <p className="dma-banner ok">{notice}</p>}
          <div className="dma-stage">{children}</div>
        </div>
      </div>
    </DmaContext.Provider>
  )
}
