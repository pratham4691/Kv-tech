'use client'

import { User, Building2, Compass } from 'lucide-react'
import { Reveal, SectionKicker } from './reveal'

const audiences = [
  {
    icon: User,
    title: 'Individuals',
    intro: 'Everyday security that protects your accounts, devices and privacy.',
    topics: [
      'Passwords & MFA',
      'Phishing & scams',
      'Privacy',
      'Device security',
      'Social engineering',
      'Safe browsing',
    ],
  },
  {
    icon: Building2,
    title: 'Organizations',
    intro: 'Building a resilient security culture across people and systems.',
    topics: [
      'Employee security',
      'Identity & endpoints',
      'Cloud risks',
      'Data protection',
      'Incident response',
      'Security culture',
    ],
  },
  {
    icon: Compass,
    title: 'Future Professionals',
    intro: 'An introduction to the disciplines that define a security career.',
    topics: [
      'SOC & DFIR',
      'Threat intelligence',
      'Cloud & app security',
      'Malware analysis',
      'Security research',
      'Reverse engineering',
    ],
  },
]

export function Audiences() {
  return (
    <section
      id="audiences"
      className="relative border-t border-border/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionKicker>Awareness For Everyone</SectionKicker>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Security knowledge, wherever you stand.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Awareness-level introductions today — designed to grow into deeper
            paths as the Vault expands.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface/40 p-7 transition-all duration-300 hover:border-primary/40 hover:bg-surface">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, oklch(0.78 0.13 205 / 60%), transparent)',
                  }}
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.intro}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {a.topics.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
