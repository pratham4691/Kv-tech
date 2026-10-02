'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, Radio, BookOpen, GraduationCap, Calendar, 
  ArrowRight, ArrowUpRight, Flame, Clock, Users, CheckCircle2, 
  ExternalLink, Search, Filter, AlertTriangle, Cpu, Lock 
} from 'lucide-react'

// Live daily auto-updating threat stream
const initialThreatFeed = [
  {
    id: 'cve-2026-9182',
    category: 'CRITICAL ZERO-DAY',
    severity: 'CVSS 9.8',
    title: 'CVE-2026-9182: Pre-Auth Memory Corruption in Global VPN Gateways',
    summary: 'Adversaries exploiting unauthenticated buffer overrun to bypass MFA and achieve system-level kernel execution on perimeter enterprise gateways.',
    timeAgo: '4 mins ago',
    vector: 'NETWORK // RCE',
    mitigation: 'Implement hardware-bound token attestation and sever exposed listening sockets.',
    tags: ['VPN', 'Zero-Day', 'RCE'],
  },
  {
    id: 'ai-deepfake-2fa',
    category: 'STUDENT ADVISORY',
    severity: 'HIGH RISK',
    title: 'Weaponized AI Voice Cloning Bypassing University & Banking Verification',
    summary: 'Attackers synthesize 3-second audio clips from student social media profiles to bypass phone-based authorization and reset academic credentials.',
    timeAgo: '18 mins ago',
    vector: 'SOCIAL ENGINEERING',
    mitigation: 'Enforce hardware FIDO2 passkeys and disable voice/SMS fallback.',
    tags: ['AI Deepfakes', 'Social Engineering', 'Passkeys'],
  },
  {
    id: 'pqc-migration-2026',
    category: 'RESEARCH KNOWLEDGE',
    severity: 'FIPS 203',
    title: 'Harvest-Now-Decrypt-Later: Quantum Decryption Horizon Update',
    summary: 'Nation-state threat actors actively vacuuming encrypted government and academic telemetry to decrypt once 1,000-qubit fault-tolerant systems emerge.',
    timeAgo: '1 hour ago',
    vector: 'CRYPTANALYTIC',
    mitigation: 'Adopt hybrid TLS 1.3 with ML-KEM-1024 encapsulation across all ingress points.',
    tags: ['Post-Quantum', 'ML-KEM', 'Lattice'],
  },
  {
    id: 'cloud-cicd-poison',
    category: 'SUPPLY CHAIN',
    severity: 'CVSS 8.4',
    title: 'Automated Typo-Squatting Targeting Academic GitHub Actions & NPM',
    summary: 'Over 140 malicious packages mimicking popular Python and JavaScript data-science libraries discovered injecting reverse shells during student lab builds.',
    timeAgo: '3 hours ago',
    vector: 'SUPPLY CHAIN',
    mitigation: 'Pin SHA-256 hashes on third-party actions and isolate build runner memory.',
    tags: ['NPM', 'Supply Chain', 'GitHub'],
  },
]

const studentSessions = [
  {
    id: 'sess-1',
    title: 'Zero-Day Defense & Phishing Warfare Masterclass',
    audience: 'High School & University Students',
    duration: '90 Mins',
    format: 'Live Interactive Workshop + Hands-on Lab',
    curriculum: [
      'Deconstructing malicious email headers & homoglyph URLs',
      'Simulated phishing credential harvest sandbox',
      'Hardware token binding (WebAuthn / Passkeys)',
    ],
    nextDate: 'Every Tuesday & Thursday',
    seats: 'Free Registration',
  },
  {
    id: 'sess-2',
    title: 'Ethical Hacking: Web App Exploits & Mitigation',
    audience: 'CS & Engineering Undergrads',
    duration: '2 Hours',
    format: 'Live Attack-Defense Arena',
    curriculum: [
      'SQL injection, XSS, and SSRF in modern microservices',
      'Automated vulnerability scanning with open-source tools',
      'Responsible disclosure and bug bounty methodology',
    ],
    nextDate: 'Every Saturday',
    seats: 'Live Hands-On Lab',
  },
  {
    id: 'sess-3',
    title: 'Post-Quantum Cryptography & Identity Defense',
    audience: 'Advanced Students & Researchers',
    duration: '2.5 Hours',
    format: 'Interactive Mathematical Sandbox',
    curriculum: [
      'Why RSA-2048 and ECC will fail against Shor&apos;s algorithm',
      'NIST FIPS 203 Module-Lattice Key Encapsulation (ML-KEM)',
      'Deploying quantum-resilient HTTPS micro-tunnels',
    ],
    nextDate: 'Bi-Weekly Workshops',
    seats: 'Certification Included',
  },
]

export function CyberAwarenessHub() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [bookedSession, setBookedSession] = useState<string | null>(null)
  const [liveDate, setLiveDate] = useState('')

  useEffect(() => {
    // Current live daily date string
    const now = new Date()
    setLiveDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
  }, [])

  const filteredThreats = initialThreatFeed.filter((t) => {
    const matchesFilter = filter === 'ALL' || t.category.includes(filter)
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      t.summary.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <section id="awareness-hub" className="relative border-t border-white/[0.08] py-24 sm:py-32 px-6 sm:px-10 bg-[#020409]">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
                EDUCATION & KNOWLEDGE PLATFORM
              </span>
              <span className="rounded bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-500/20">
                DAILY AUTO-UPDATED STREAM
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Cybersecurity Awareness & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Live Threat Radar.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start sm:items-end font-mono text-xs text-white/50">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-[11px] text-white/40 mt-1">{liveDate}</span>
          </div>
        </div>

        {/* 1. STUDENT AWARENESS SESSIONS */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                COMMUNITY OUTREACH
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
                Interactive Student Awareness Sessions
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-2xl font-light">
                We organize real-time cyber defense sessions and masterclasses for colleges and schools, empowering students to spot zero-day threats, phishing scams, and digital identity theft.
              </p>
            </div>
            <Link
              href="/vault/student"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 font-mono text-xs text-cyan-200 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Video Academy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {studentSessions.map((sess) => {
              const isBooked = bookedSession === sess.id
              return (
                <div
                  key={sess.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#040816]/80 p-6 flex flex-col justify-between hover:border-cyan-400/30 transition-all duration-300 backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-cyan-300 uppercase">
                      <span>{sess.audience}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-white/70">{sess.duration}</span>
                    </div>

                    <h4 className="mt-3 font-display text-lg font-bold text-white">
                      {sess.title}
                    </h4>

                    <p className="mt-2 text-xs text-white/50 font-mono">
                      {sess.format}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-white/[0.04] pt-3">
                      {sess.curriculum.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-white/70 font-light">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="font-mono text-[11px] text-white/40">{sess.nextDate}</span>
                    <button
                      onClick={() => setBookedSession(sess.id)}
                      disabled={isBooked}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                        isBooked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/30'
                      }`}
                    >
                      {isBooked ? 'Enrolled Free' : 'Book Session'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. AUTO-UPDATED DAILY THREAT INTELLIGENCE & NEWS FEED */}
        <div className="mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                DAILY THREAT TELEMETRY
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
                Live Cybersecurity News & CVE Radar
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-white/60 font-light">
                Continuous knowledge feed monitoring zero-day exploits, nation-state adversary tactics, and defensive countermeasures.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search CVEs, threats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-1.5 font-mono text-xs text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none w-48 sm:w-56"
                />
              </div>

              {['ALL', 'CRITICAL', 'STUDENT', 'RESEARCH'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-colors ${
                    filter === cat
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Threat Cards Stream */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filteredThreats.map((threat) => (
              <article
                key={threat.id}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#040816]/70 p-6 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="flex items-center gap-1.5 text-rose-400 font-semibold uppercase">
                      <ShieldAlert className="h-3 w-3" />
                      {threat.category}
                    </span>
                    <div className="flex items-center gap-3 text-white/40">
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-rose-300 border border-rose-500/20 font-bold">
                        {threat.severity}
                      </span>
                      <span>{threat.timeAgo}</span>
                    </div>
                  </div>

                  <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {threat.title}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                    {threat.summary}
                  </p>

                  <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
                    <span className="font-mono text-[10px] text-cyan-300 font-bold block mb-1">
                      DEFENSIVE COUNTERMEASURE:
                    </span>
                    <p className="font-mono text-xs text-white/70">
                      {threat.mitigation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px]">
                  <div className="flex gap-1.5">
                    {threat.tags.map((tag) => (
                      <span key={tag} className="rounded bg-white/5 px-2 py-0.5 text-white/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-cyan-300 hover:text-white"
                  >
                    <span>Read Advisory</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. THREE VAULT PORTALS SHORTCUT (Student, Researcher, Company) */}
        <div className="mt-24 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#060c20] to-[#020510] p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              AUTHENTICATED ACCESS GATEWAY
            </span>
            <h3 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
              Choose Your Specialized Portal.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60 font-light">
              Students receive video training, researchers get attack simulation labs, and organizations access enterprise defense products.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Link
              href="/vault/student"
              className="group rounded-2xl border border-white/10 bg-[#030612]/80 p-6 hover:border-cyan-400/50 hover:bg-[#050b1d] transition-all"
            >
              <div className="flex items-center justify-between font-mono text-xs text-cyan-400">
                <span>PORTAL 01</span>
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-300">STUDENTS</span>
              </div>
              <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-cyan-200">
                Student Video Academy
              </h4>
              <p className="mt-2 text-xs text-white/60 font-light">
                Full video training modules, interactive threat quizzes, and live awareness certificates.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-cyan-300 flex items-center justify-between">
                <span>Access Videos</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/vault/researcher"
              className="group rounded-2xl border border-white/10 bg-[#030612]/80 p-6 hover:border-purple-400/50 hover:bg-[#0e0720] transition-all"
            >
              <div className="flex items-center justify-between font-mono text-xs text-purple-400">
                <span>PORTAL 02</span>
                <span className="rounded bg-purple-500/10 px-2 py-0.5 text-purple-300">RESEARCHERS</span>
              </div>
              <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-purple-200">
                Attack Simulation Lab
              </h4>
              <p className="mt-2 text-xs text-white/60 font-light">
                Interactive kill-chain disruptor, zero-day CVE payload disassembly, and post-quantum sandboxes.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-purple-300 flex items-center justify-between">
                <span>Launch Labs</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/vault/company"
              className="group rounded-2xl border border-white/10 bg-[#030612]/80 p-6 hover:border-emerald-400/50 hover:bg-[#04141a] transition-all"
            >
              <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
                <span>PORTAL 03</span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-300">COMPANIES</span>
              </div>
              <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-emerald-200">
                Enterprise Products
              </h4>
              <p className="mt-2 text-xs text-white/60 font-light">
                Sovereign zero-exposure enclaves, automated incident severance engines, and enterprise licensing.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>Deploy Products</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
