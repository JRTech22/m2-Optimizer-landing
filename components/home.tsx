'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { HOME } from '@/lib/home-copy'
import { usePrefs } from '@/components/shell'

const PLAN_TIER = ['free', 'basic', 'complete'] as const

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {children}
    </svg>
  )
}

const TILES = [
  <Icon key="read">
    <path d="M5 16.5 9 7l3.2 6.2L15 9.5 19 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
  <Icon key="plan">
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 12h8M8 8.5h5M8 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
  <Icon key="power">
    <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
  <Icon key="clock">
    <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8.5V12l2.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
]

const STRIP = [
  <Icon key="pc">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
  <Icon key="lock">
    <rect x="5" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.8" />
  </Icon>,
  <Icon key="widgets">
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
  </Icon>,
  <Icon key="year">
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3.5V7M16 3.5V7M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Icon>,
]

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path fill="currentColor" d="M1 2.4 6.8 1.6v5.7H1V2.4zm6.5-.9L15 0v7.3H7.5V1.5zM1 8.7h5.8v5.7L1 13.6V8.7zm6.5 0H15V16l-7.5-1.5V8.7z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#16a34a" />
      <path d="M4.6 8.2 7 10.5l4.5-5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LiveClock() {
  const [label, setLabel] = useState('--:--')
  useEffect(() => {
    const tick = () => setLabel(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return <strong className="face-time">{label}</strong>
}

export function Home() {
  const { lang } = usePrefs()
  const copy = HOME[lang]
  const pinRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const pin = pinRef.current
    const hero = heroRef.current
    if (!pin || !hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const total = pin.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-pin.getBoundingClientRect().top, 0), Math.max(total, 0))
      const progress = total > 0 ? scrolled / total : 0
      const scale = 1 - progress * 0.22
      hero.style.transform = `perspective(1400px) translateZ(${-340 * progress}px) scale(${scale})`
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('main .reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [lang])
  return (
    <>
      <div className="hero-pin" ref={pinRef}>
      <section className="hero" ref={heroRef}>
        <div className="hero-shade" aria-hidden />
        <div className="wrap hero-grid">
          <div className="hero-copy rise">
            <p className="kicker">
              <span className="badge">{copy.badge}</span>
              <span>{copy.badgeTrail}</span>
            </p>
            <h1>
              {copy.title}
              <span>{copy.accent}</span>
            </h1>
            <p className="lede">{copy.lede}</p>
            <ul className="tiles">
              {copy.tiles.map((tile, index) => (
                <li key={tile}>
                  <span className="tile-icon">{TILES[index]}</span>
                  {tile}
                </li>
              ))}
            </ul>
            <div className="cta-row">
              <a className="btn btn-primary" href="/download">
                <WindowsIcon />
                {copy.cta}
                <ArrowIcon />
              </a>
              <a className="btn btn-ghost" href="#como">
                {copy.ctaSecondary}
              </a>
            </div>
            <ul className="checks">
              {copy.checks.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hero-strip">
          <ul className="wrap strip-grid">
            {copy.strip.map((item, index) => (
              <li key={item.title}>
                <span className="strip-icon">{STRIP[index]}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>

      <section className="band-section reveal" id="funciones">
        <div className="wrap">
          <header className="section-head">
            <h2>{copy.featuresTitle}</h2>
            <p>{copy.featuresLede}</p>
          </header>
          <div className="feature-grid">
            {copy.features.map((feature, index) => (
              <article key={feature.title} className="card" style={{ animationDelay: `${index * 70}ms` }}>
                <span className="index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band-section reveal" id="widgets">
        <div className="wrap">
          <header className="section-head">
            <h2>{copy.widgetsTitle}</h2>
            <p>{copy.widgetsLede}</p>
          </header>
          <div className="widget-grid">
            {copy.widgetCards.map((card, index) => (
              <article key={card.kicker} className="widget-face">
                <span className="index">{card.kicker}</span>
                {index === 0 ? <LiveClock /> : <strong className="face-time">{index === 1 ? 'CPU' : 'RAM'}</strong>}
                <h3>{card.title}</h3>
                <p>{card.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band-section reveal" id="como">
        <div className="wrap">
          <header className="section-head">
            <h2>{copy.stepsTitle}</h2>
          </header>
          <ol className="steps">
            {copy.steps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band-section reveal">
        <div className="wrap">
          <header className="section-head">
            <h2>{copy.plansTitle}</h2>
            <p>{copy.plansLede}</p>
          </header>
          <div className="plan-grid">
            {copy.plans.map((plan, index) => (
              <article key={plan.name} className={index === 2 ? 'plan featured' : 'plan'}>
                <h3>{plan.name}</h3>
                <p className="price">{plan.price}</p>
                <p>{plan.body}</p>
                <Link className={index === 2 ? 'btn btn-primary' : 'btn btn-ghost'} href={index === 0 ? '#como' : `/pricing?tier=${PLAN_TIER[index]}`}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing reveal">
        <div className="wrap closing-inner">
          <div>
            <h2>{copy.bandTitle}</h2>
            <p>{copy.bandBody}</p>
          </div>
          <Link className="btn btn-primary" href="/pricing">
            {copy.bandCta}
          </Link>
        </div>
      </section>
    </>
  )
}
