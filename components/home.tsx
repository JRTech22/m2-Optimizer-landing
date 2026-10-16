'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { Countdown, useCampaign } from '@/components/campaign'
import { usePrefs } from '@/components/shell'
import { formatLaunchFreeDate } from '@/lib/campaign'
import { COPY } from '@/lib/copy'
import { HOME } from '@/lib/home-copy'
import { localeHref } from '@/lib/locale'

const PLAN_TIER = ['free', 'basic', 'complete'] as const

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {children}
    </svg>
  )
}

const STRIP = [
  <Icon key="pc">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </Icon>,
  <Icon key="lock">
    <rect x="5" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
  </Icon>,
  <Icon key="widgets">
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
  </Icon>,
  <Icon key="year">
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 3.5V7M16 3.5V7M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
  const campaign = useCampaign()
  const copy = HOME[lang]
  const shared = COPY[lang].campaign
  const hero = campaign.active ? copy.launch : copy.regular
  const untilLabel = formatLaunchFreeDate(lang, campaign.until)

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
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [lang, campaign.active])

  return (
    <>
      <section className="hero">
        <div className="hero-media" role="img" aria-label={copy.imageAlt} />
        <div className="hero-veil" aria-hidden />
        <div className="hero-glow" aria-hidden />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="kicker hero-in" style={{ animationDelay: '0ms' }}>
              <span className="badge">
                <span className="badge-dot" aria-hidden />
                {hero.badge}
              </span>
            </p>
            <h1 className="hero-in" style={{ animationDelay: '90ms' }}>
              {hero.title}
              <span>{hero.accent}</span>
            </h1>
            <p className="lede hero-in" style={{ animationDelay: '180ms' }}>
              {hero.lede}
            </p>
            <div className="cta-row hero-in" style={{ animationDelay: '270ms' }}>
              <a className="btn btn-primary btn-lg" href="/download">
                <WindowsIcon />
                {copy.cta}
                <ArrowIcon />
              </a>
              <a className="btn btn-ghost btn-lg" href="#como">
                {copy.ctaSecondary}
              </a>
            </div>
            {campaign.active && (
              <div className="hero-count hero-in" style={{ animationDelay: '360ms' }}>
                <span className="cd-lead">
                  <span className="pulse-dot" aria-hidden />
                  {shared.endsIn} · {untilLabel}
                </span>
                <Countdown until={campaign.until} labels={shared} />
              </div>
            )}
            <p className="hero-note hero-in" style={{ animationDelay: '440ms' }}>
              {hero.note}
            </p>
          </div>
        </div>
      </section>

      <section className="proof reveal" aria-label="M2 Optimizer">
        <ul className="wrap proof-grid">
          {copy.strip.map((item, index) => (
            <li key={item.title}>
              <span className="proof-icon">{STRIP[index]}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="band-section reveal" id="funciones">
        <div className="wrap">
          <header className="section-head">
            <p className="eyebrow">M2 Optimizer</p>
            <h2>{copy.featuresTitle}</h2>
            <p>{copy.featuresLede}</p>
          </header>
          <div className="feature-grid">
            {copy.features.map((feature, index) => (
              <article key={feature.title} className="feature">
                <span className="index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band-section band-tint reveal" id="widgets">
        <div className="wrap">
          <header className="section-head">
            <p className="eyebrow">Widgets</p>
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
            {copy.steps.map((step, index) => {
              const shown = index === 2 && campaign.active ? copy.launchStep3 : step
              return (
                <li key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{shown.title}</h3>
                    <p>{shown.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="band-section band-tint reveal" id="planes">
        <div className="wrap">
          <header className="section-head">
            <p className="eyebrow">{campaign.active ? shared.ribbonCta : 'M2 Optimizer'}</p>
            <h2>{campaign.active ? copy.launchPlansTitle : copy.plansTitle}</h2>
            <p>{campaign.active ? copy.launchPlansLede : copy.plansLede}</p>
          </header>
          <div className="plan-grid">
            {copy.plans.map((plan, index) => {
              const launchComplete = campaign.active && index === 2
              if (launchComplete) {
                const free = copy.launchComplete
                return (
                  <article key={plan.name} className="plan featured launch-plan">
                    <span className="plan-flag">{free.flag}</span>
                    <h3>{free.name}</h3>
                    <p className="price">
                      {free.price} <s>{free.was}</s>
                    </p>
                    <p className="plan-until">
                      {free.until} {untilLabel}
                    </p>
                    <p>{free.body}</p>
                    <p className="plan-after">{free.after}</p>
                    <a className="btn btn-primary" href="/download">
                      <WindowsIcon />
                      {free.cta}
                    </a>
                  </article>
                )
              }
              return (
                <article key={plan.name} className={index === 2 ? 'plan featured' : 'plan'}>
                  <h3>{plan.name}</h3>
                  <p className="price">{plan.price}</p>
                  <p>{plan.body}</p>
                  <Link className={index === 2 ? 'btn btn-primary' : 'btn btn-ghost'} href={index === 0 ? '#como' : `/pricing?tier=${PLAN_TIER[index]}`}>
                    {plan.cta}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="closing reveal">
        <div className="wrap closing-inner">
          <div>
            <h2>{campaign.active ? copy.launchBandTitle : copy.bandTitle}</h2>
            <p>{campaign.active ? copy.launchBandBody : copy.bandBody}</p>
          </div>
          {campaign.active ? (
            <a className="btn btn-primary btn-lg" href="/download">
              <WindowsIcon />
              {copy.launchBandCta}
            </a>
          ) : (
            <Link className="btn btn-primary btn-lg" href={localeHref(lang, '/pricing')}>
              {copy.bandCta}
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
