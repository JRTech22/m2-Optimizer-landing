'use client'

import Link from 'next/link'
import { usePrefs } from '@/components/shell'
import { COPY } from '@/lib/copy'
import { localeHref } from '@/lib/locale'

export default function NotFound() {
  const { lang } = usePrefs()
  const copy = COPY[lang]
  const page = copy.pages.missing
  const block = page.blocks[0]
  return (
    <section className="lost">
      <div className="page-glow" aria-hidden />
      <div className="wrap lost-inner">
        <p className="lost-code" aria-hidden>
          404
        </p>
        <p className="eyebrow">M2 Optimizer</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.lede}</p>
        {block && <p className="lost-next">{block.body}</p>}
        <div className="cta-row">
          <Link className="btn btn-primary btn-lg" href={localeHref(lang, '/')}>
            {copy.nav.home}
          </Link>
          <Link className="btn btn-ghost btn-lg" href={localeHref(lang, '/pricing')}>
            {copy.nav.pricing}
          </Link>
        </div>
      </div>
    </section>
  )
}
