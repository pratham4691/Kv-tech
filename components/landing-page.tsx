'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPinned } from 'lucide-react'
import { useState } from 'react'

import type { HomepageData } from '@/lib/site-data'
import { threatLibrary } from '@/lib/threats'

const activeThreats = threatLibrary.slice(0, 8)

const labels = [
  { title: 'Threats', href: '/threat/phishing', tone: 'red' },
  { title: 'Defense', href: '/awareness', tone: 'blue' },
  { title: 'Intelligence', href: '/news', tone: 'amber' },
  { title: 'Web Exploits', href: '/threat/fake-login-page', tone: 'blue' },
  { title: 'Mobile Security', href: '/threat/public-wifi-abuse', tone: 'blue' },
  { title: 'Network Attacks', href: '/threat/session-hijacking', tone: 'blue' },
  { title: 'Cloud Security', href: '/threat/cloud-misconfiguration', tone: 'blue' },
  { title: 'Data Privacy', href: '/awareness', tone: 'blue' },
]

export function LandingPage({ data }: { data: HomepageData }) {
  const [selectedThreat] = useState(threatLibrary[0])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030914] text-white">
      <div className="neural-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.08),transparent_45%)]" />

      <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between px-4 pt-6 pb-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <BrandMark />
          <div>
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-slate-200">Kalki Vault</div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">Cybersecurity Awareness • Research • Innovation</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-[0.7rem] uppercase tracking-[0.25em] text-slate-300 md:flex">
          <Link href="/awareness">Awareness</Link>
          <Link href="/news">News</Link>
          <Link href="/vault">Enter the Vault</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-[1500px] px-4 pb-10 pt-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.5fr_1fr]">
          <div className="order-2 lg:order-1">
            <div className="text-[0.72rem] uppercase tracking-[0.38em] text-slate-300">Understand • Analyze • Defend</div>
            <div className="mt-8 text-[3rem] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white sm:text-[4.3rem]">
              Security<br />begins with<br />understanding.
            </div>
            <p className="mt-6 max-w-md text-base text-slate-300 sm:text-lg">
              Explore the threats shaping the digital world, understand how they happen, and learn what to do before they become incidents.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/threat/phishing" className="inline-flex items-center justify-center gap-3 rounded-full border border-red-500/50 bg-red-500/10 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-red-100 transition hover:bg-red-500/15">
                Explore the threat network <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/vault" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-cyan-400/40 hover:bg-white/10">
                Enter the Vault
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto flex h-[620px] w-full max-w-[850px] items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-[510px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15" />
              <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/10" />
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <BrainArtwork />
              </div>

              <div className="absolute inset-0">
                {labels.map((label, index) => {
                  const angle = (Math.PI * 2 * index) / labels.length
                  const radiusX = 320
                  const radiusY = 215
                  const x = Math.cos(angle) * radiusX
                  const y = Math.sin(angle) * radiusY
                  const toneClass =
                    label.tone === 'red'
                      ? 'border-red-500/40 bg-red-500/10 text-red-100'
                      : label.tone === 'amber'
                        ? 'border-yellow-400/40 bg-yellow-500/10 text-yellow-100'
                        : 'border-cyan-400/35 bg-cyan-500/10 text-cyan-100'

                  return (
                    <Link
                      key={label.title}
                      href={label.href}
                      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-[0.62rem] uppercase tracking-[0.25em] backdrop-blur-sm ${toneClass}`}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {label.title}
                    </Link>
                  )
                })}
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 text-[0.72rem] uppercase tracking-[0.28em] text-slate-200 backdrop-blur-sm">
                Scroll • Click • Explore
              </div>
            </div>
          </div>

          <div className="order-3 hidden lg:flex lg:flex-col lg:items-end">
            <div className="mb-12 text-right">
              <div className="text-[0.72rem] uppercase tracking-[0.38em] text-slate-300">"Security begins</div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[0.38em] text-slate-300">with understanding."</div>
            </div>

            <div className="space-y-4">
              {activeThreats.map((threat) => (
                <Link
                  key={threat.name}
                  href={`/threat/${threat.slug}`}
                  className="group flex w-[220px] items-center justify-between rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-slate-200 backdrop-blur-sm transition hover:border-red-500/40 hover:bg-red-500/10"
                >
                  <span>{threat.name}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200/80">Threat Network</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-white md:text-5xl">The world is connected. So are its threats.</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">Threat map</span>
              <span className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-red-100">{selectedThreat.severity}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {threatLibrary.map((threat) => (
                <Link
                  key={threat.name}
                  href={`/threat/${threat.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/3 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{threat.name}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{threat.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-red-500/20 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.32),transparent_35%),rgba(3,9,20,0.85)] p-5 backdrop-blur-sm">
            <div className="text-[0.68rem] uppercase tracking-[0.28em] text-red-200">Threat detected</div>
            <h3 className="mt-4 text-4xl font-black uppercase tracking-[-0.06em] text-white">{selectedThreat.name}</h3>
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-red-100">How it works</div>
              <p className="mt-3 text-slate-200">{selectedThreat.summary}</p>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              {selectedThreat.actions.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link href={`/threat/${selectedThreat.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white">
              View danger page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="mb-6 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200/80">Current Security Alerts</div>
        <div className="grid gap-6 md:grid-cols-3">
          {data.updates.map((alert) => (
            <article key={alert.title} className="rounded-[26px] border border-white/10 bg-slate-950/65 p-5 backdrop-blur-sm">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">{new Date(alert.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <h3 className="mt-4 text-2xl font-bold text-white">{alert.title}</h3>
              <p className="mt-3 text-slate-300">{alert.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-6 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200/80">Recent Activity</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.activities.map((activity) => (
            <article key={`${activity.title}-${activity.date}`} className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">{activity.title}</div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{activity.institution}</h3>
                </div>
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-cyan-100">
                  {new Date(activity.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year:'numeric' })}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <MapPinned className="h-4 w-4 text-cyan-200" />
                {activity.location}
              </div>
              <p className="mt-4 text-slate-300">{activity.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-8 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <BrandMark small />
            <div>
              <div className="text-lg font-bold text-white">Kalki Vault</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Cybersecurity awareness • research • innovation</div>
            </div>
          </div>
            <div className="flex items-center gap-6 uppercase tracking-[0.18em] text-[0.62rem] text-slate-300">
              <Link href="/awareness">Awareness</Link>
              <Link href="/news">News</Link>
              <Link href="/vault">Vault</Link>
              <Link href="/control/login">Admin</Link>
            </div>
        </div>
      </footer>
    </main>
  )
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950/80 shadow-[0_0_18px_rgba(34,211,238,0.15)] ${small ? 'h-8 w-8' : 'h-12 w-12'}`}>
      <svg viewBox="0 0 64 64" className={`${small ? 'h-4 w-4' : 'h-6 w-6'}`} fill="none" aria-label="Kalki Vault mark">
        <path d="M32 10C18 10 10 20 10 28C10 41 18 49 32 54C46 49 54 41 54 28C54 20 46 10 32 10Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5"/>
        <path d="M32 16L39 28H25L32 16Z" fill="rgba(34,211,238,0.7)"/>
        <path d="M23 29L32 20L41 29L35 38H29L23 29Z" fill="rgba(250,204,21,0.88)"/>
        <path d="M19 36L32 48L45 36" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function BrainArtwork() {
  return (
    <div className="relative h-[500px] w-[500px]">
      <svg viewBox="0 0 520 520" className="h-full w-full drop-shadow-[0_0_35px_rgba(34,211,238,0.16)]">
        <defs>
          <linearGradient id="brainLeft" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,92,92,0.82)" />
            <stop offset="50%" stopColor="rgba(255,86,86,0.5)" />
            <stop offset="100%" stopColor="rgba(12,18,28,0.18)" />
          </linearGradient>
          <linearGradient id="brainRight" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(88,175,255,0.8)" />
            <stop offset="48%" stopColor="rgba(142,215,255,0.52)" />
            <stop offset="100%" stopColor="rgba(12,18,28,0.22)" />
          </linearGradient>
          <linearGradient id="brainMid" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,200,70,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(83,211,255,0.9)" />
          </linearGradient>
        </defs>

        <g opacity="0.96">
          <path d="M178 131C128 143 94 178 92 234C90 294 122 341 110 384C97 431 143 456 194 456C236 456 271 435 306 415C345 394 383 382 402 341C424 294 420 236 393 190C370 151 331 122 287 114C249 107 210 111 178 131Z" fill="rgba(12,20,30,0.92)" stroke="rgba(161,176,201,0.4)" strokeWidth="1.5"/>
          <path d="M177 134C138 160 115 213 120 262C126 312 156 353 154 390C152 426 169 444 204 451C233 456 264 445 294 427C329 406 359 388 379 355C400 321 404 276 393 239C381 199 353 164 317 140C287 121 232 116 177 134Z" fill="rgba(10,14,20,0.5)" stroke="rgba(113,161,255,0.2)"/>
        </g>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M167 166C146 191 132 228 136 261C141 295 158 319 178 337C202 359 217 343 233 334C251 323 266 299 270 271C274 243 271 210 254 188C237 165 209 154 167 166Z" stroke="url(#brainLeft)" strokeWidth="2.8"/>
          <path d="M346 168C371 197 382 228 379 263C376 300 357 323 334 340C311 356 292 349 278 335C261 318 252 290 250 264C248 237 254 209 271 187C288 163 318 151 346 168Z" stroke="url(#brainRight)" strokeWidth="2.8"/>
          <path d="M170 256C196 247 216 250 230 266C245 284 246 314 232 334C215 356 196 370 171 376" stroke="url(#brainMid)" strokeWidth="2.2"/>
          <path d="M345 256C323 247 302 250 286 265C270 282 266 312 279 334C296 356 314 369 341 376" stroke="url(#brainMid)" strokeWidth="2.2"/>
          <path d="M204 166C190 196 191 222 210 240C228 257 246 265 271 262C296 258 319 245 335 219" stroke="url(#brainMid)" strokeWidth="2"/>
          <path d="M193 220C183 246 185 269 198 291C210 311 231 323 251 324C275 325 296 311 311 291C323 275 330 250 328 222" stroke="url(#brainMid)" strokeWidth="2"/>
          <path d="M178 321C200 316 222 322 241 337C259 351 263 379 252 398C238 420 210 429 184 423" stroke="url(#brainLeft)" strokeWidth="2"/>
          <path d="M343 322C321 318 298 324 280 339C262 355 258 381 268 400C283 421 310 431 336 425" stroke="url(#brainRight)" strokeWidth="2"/>
        </g>

        <g fill="rgba(255,255,255,0.9)">
          {[
            [148,176],[162,214],[150,254],[160,306],[177,350],[204,184],[228,153],[264,160],[290,174],[324,196],[347,232],[347,275],[330,324],[294,360],[257,380],[220,372],[186,334],[174,284],[191,244],[224,214],[247,227],[275,239],[299,270],[286,313],[261,330],[228,311],[201,287],[185,228],[202,181], [260,182], [233,277], [278,279]
          ].map(([x,y], index) => (
            <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r={index % 2 === 0 ? 3.5 : 2.6} fill={index % 3 === 0 ? 'rgba(250,204,21,0.9)' : index % 3 === 1 ? 'rgba(34,211,238,0.9)' : 'rgba(239,68,68,0.9)'} />
          ))}
        </g>

        <g fill="none" stroke="rgba(34,211,238,0.35)" strokeWidth="1.2" strokeDasharray="3 8">
          <path d="M90 178C58 156 52 118 94 103" />
          <path d="M432 178C464 157 470 119 427 104" />
        </g>
      </svg>
    </div>
  )
}
