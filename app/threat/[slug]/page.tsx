import Link from 'next/link'
import { notFound } from 'next/navigation'

import { threatLookup } from '@/lib/threats'

export function generateStaticParams() {
  return Object.keys(threatLookup).map((slug) => ({ slug }))
}

export default async function ThreatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const threat = threatLookup[slug]

  if (!threat) {
    notFound()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030914] text-white">
      <div className="neural-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/65 px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-slate-200">
            ← Back to home
          </Link>
          <div className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Threat network</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-red-500/25 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.38),transparent_35%),rgba(9,14,20,0.92)] p-6 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
            <div className="text-[0.7rem] uppercase tracking-[0.32em] text-red-200">Threat detected</div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.08em] text-white md:text-6xl">{threat.name}</h1>
            <div className="mt-4 inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-red-100">Severity: {threat.severity}</div>
            <p className="mt-6 max-w-2xl text-lg text-slate-200">{threat.summary}</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">What is happening?</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {threat.whatHappens.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">What should you do now?</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {threat.actions.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="rounded-[32px] border border-red-500/30 bg-slate-950/80 p-6">
            <div className="text-[0.7rem] uppercase tracking-[0.26em] text-slate-400">Immediate action required</div>
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
              <div className="text-[0.68rem] uppercase tracking-[0.24em]">Danger</div>
              <div className="mt-2 text-2xl font-black uppercase tracking-[-0.05em]">Your credentials may be at risk.</div>
            </div>

            <div className="mt-6">
              <div className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">How to prevent it</div>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {threat.prevention.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <div className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">Related threats</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {threat.related.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-cyan-100">{item}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
