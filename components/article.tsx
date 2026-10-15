'use client'

import { COPY, type Copy } from '@/lib/copy'
import { usePrefs } from '@/components/shell'

export function Article({ id }: { id: keyof Copy['pages'] }) {
  const { lang } = usePrefs()
  const page = COPY[lang].pages[id]
  const mail = id === 'contact'
  return (
    <article className="page">
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">M2 Optimizer</p>
          <h1>{page.title}</h1>
          <p className="lede">{page.lede}</p>
        </div>
      </header>
      <div className="wrap cards">
        {page.blocks.map((block, index) => (
          <section key={block.heading} className="card" style={{ animationDelay: `${index * 80}ms` }}>
            <span className="index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{block.heading}</h2>
            {mail ? (
              <p>
                <a href="mailto:contacto@m2dominicanrd.com">contacto@m2dominicanrd.com</a>
              </p>
            ) : (
              <p>{block.body}</p>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}
