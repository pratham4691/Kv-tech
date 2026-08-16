'use client'

import { Eye, GraduationCap, FlaskConical, Sparkles } from 'lucide-react'
import { Reveal, SectionKicker } from './reveal'

const pillars = [
  { icon: Eye, title: 'Awareness', text: 'Helping people see and understand the digital threats around them.' },
  { icon: GraduationCap, title: 'Education', text: 'Turning understanding into durable, practical security knowledge.' },
  { icon: FlaskConical, title: 'Research', text: 'Exploring what others overlook, responsibly and rigorously.' },
  { icon: Sparkles, title: 'Innovation', text: 'Building the defensive technology and ideas of the future.' },
]

export function About() {
  return (
    <section id="about" className="relative border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionKicker>About Kalki Vault</SectionKicker>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              A cybersecurity organization, built around understanding.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Kalki Vault exists to make cybersecurity comprehensible — to
              individuals, organizations and the researchers of tomorrow. We are
              building an ecosystem that connects awareness, learning and
              responsible research under one roof.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              We are early, and we are honest about that. What you see here is the
              foundation. As each part of the Vault is ready, it opens — no
              inflated claims, no fabricated numbers. Credibility, earned through
              clarity.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-border bg-surface/40 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
