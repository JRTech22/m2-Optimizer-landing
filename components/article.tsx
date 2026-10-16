'use client'

import { COPY, type Copy } from '@/lib/copy'
import { usePrefs } from '@/components/shell'

const MAIL = 'contacto@m2dominicanrd.com'

export function Article({ id }: { id: keyof Copy['pages'] }) {
  const { lang } = usePrefs()
  const page = COPY[lang].pages[id]
  const mail = id === 'contact'
  return (
    <article className="page">
      <header className="page-hero">
        <div className="page-glow" aria-hidden />
        <div className="wrap page-hero-inner">
          <p className="eyebrow">M2 Optimizer</p>
          <h1>{page.title}</h1>
          <p className="lede">{page.lede}</p>
        </div>
      </header>
      <div className="wrap prose">
        {mail ? (
          <section className="prose-block prose-mail">
            <span className="index">01</span>
            <div>
              <h2>{page.blocks[0]?.heading}</h2>
              <a className="btn btn-primary btn-lg" href={`mailto:${MAIL}`}>
                {MAIL}
              </a>
            </div>
          </section>
        ) : (
          page.blocks.map((block, index) => (
            <section key={block.heading} className="prose-block" style={{ animationDelay: `${index * 80}ms` }}>
              <span className="index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{block.heading}</h2>
                <p>{block.body}</p>
              </div>
            </section>
          ))
        )}
      </div>
    </article>
  )
}
