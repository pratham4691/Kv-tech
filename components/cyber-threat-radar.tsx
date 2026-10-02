'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, ShieldCheck, Flame, Radio, Search, Filter,
  ExternalLink, ChevronRight, Lock, Clock, AlertTriangle,
  GraduationCap, FlaskConical, Building2, ArrowRight, CheckCircle2,
  Terminal, Share2, Info
} from 'lucide-react'

interface ThreatArticle {
  id: string
  cveId: string
  title: string
  category: 'Zero-Day' | 'Ransomware' | 'Cloud & Infra' | 'Cryptography' | 'Supply Chain'
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED'
  cvss: number
  date: string
  source: string
  summary: string
  technicalDetails: string
  mitigation: string
  affectedSystems: string[]
}

const LIVE_THREAT_FEEDS: ThreatArticle[] = [
  {
    id: 'intel-01',
    cveId: 'CVE-2026-3190',
    title: 'Zero-Click Remote Kernel Execution via Distributed RPC Subsystems',
    category: 'Zero-Day',
    severity: 'CRITICAL',
    cvss: 9.8,
    date: 'Today • 04:15 UTC',
    source: 'Kalki Threat Research Group (KTRG)',
    summary: 'A critical memory safety defect in high-throughput RPC deserialization allows unauthenticated remote adversaries to execute arbitrary kernel-level code.',
    technicalDetails: 'The flaw stems from an out-of-bounds integer truncation during zero-copy buffer handoff in multi-threaded network daemons, allowing arbitrary memory overwrite.',
    mitigation: 'Deploy perimeter egress filtering on port 8443, apply kernel patch release v6.14.2-sec, or enforce strict memory bounds checking via eBPF probes.',
    affectedSystems: ['Enterprise Linux 8/9 Runtimes', 'Cloud Hypervisor Daemons', 'Kubernetes Ingress Controllers']
  },
  {
    id: 'intel-02',
    cveId: 'CVE-2026-2814',
    title: 'VoltShadow Ransomware Strain Exploits Identity Federation Protocols',
    category: 'Ransomware',
    severity: 'CRITICAL',
    cvss: 9.4,
    date: 'Today • 02:40 UTC',
    source: 'CISA / ENISA Joint Advisory',
    summary: 'Advanced threat syndicate VoltShadow is weaponizing SAML token forgery flaws to hijack hybrid Active Directory clusters and deploy dual-stage encryption payloads.',
    technicalDetails: 'Adversaries exploit timing side-channels in XML cryptographic verification to synthesize forged golden assertion tokens without triggering standard anomaly alarms.',
    mitigation: 'Enforce hardware-bound FIDO2 authentication, invalidate legacy SAML 1.1 bindings, and monitor for abnormal ticket-granting service requests.',
    affectedSystems: ['Hybrid Azure AD / Entra ID Connect', 'Okta SSO Federation Bridges', 'WS-Federation Endpoints']
  },
  {
    id: 'intel-03',
    cveId: 'CVE-2026-1940',
    title: 'Post-Quantum Lattice Decapsulation Fault in TLS Handshake Implementations',
    category: 'Cryptography',
    severity: 'HIGH',
    cvss: 8.6,
    date: 'Yesterday • 18:20 UTC',
    source: 'NIST Cryptographic Surveillance Team',
    summary: 'A side-channel vulnerability in early ML-KEM / Kyber implementations permits differential power analysis recovery of session secret keys.',
    technicalDetails: 'Leakage occurs during polynomial multiplication in non-constant-time NTT implementations on ARM64 and x86 architectures under heavy concurrent loads.',
    mitigation: 'Update cryptographic runtime to OpenSSL 3.5.1 with hardened constant-time assembly routines and enforce ephemeral ECDHE hybrid fallbacks.',
    affectedSystems: ['Experimental PQC Gateways', 'Encrypted DNS Resolvers', 'TLS 1.3 Pre-Standard Endpoints']
  },
  {
    id: 'intel-04',
    cveId: 'CVE-2026-1402',
    title: 'Automated CI/CD Runner Poisoning in Public Package Registries',
    category: 'Supply Chain',
    severity: 'HIGH',
    cvss: 8.2,
    date: 'Yesterday • 14:05 UTC',
    source: 'OpenSSF Incident Response',
    summary: 'Malicious actors coordinated a widespread credential harvesting campaign via 180+ compromised development dependencies across npm and PyPI ecosystems.',
    technicalDetails: 'Compromised packages executed obfuscated post-install scripts that exfiltrated GitHub Actions secrets and cloud deployment tokens to covert command-and-control proxies.',
    mitigation: 'Enforce artifact signing via Sigstore/Cosign, lock build dependencies to cryptographically pinned SHA-256 hashes, and mandate isolated ephemeral build runners.',
    affectedSystems: ['Node.js & Python Build Pipelines', 'GitHub Actions Self-Hosted Runners', 'Container Image Registries']
  },
  {
    id: 'intel-05',
    cveId: 'CVE-2026-0985',
    title: 'Multi-Tenant MicroVM Memory Escape in Containerized Cloud Stacks',
    category: 'Cloud & Infra',
    severity: 'CRITICAL',
    cvss: 9.6,
    date: 'Oct 01, 2026',
    source: 'Cloud Security Alliance (CSA)',
    summary: 'A hardware-assisted virtualization flaw allows malicious workloads inside a guest container to bypass hypervisor isolation and inspect adjacent tenant memory spaces.',
    technicalDetails: 'Race conditions during virtio-mem memory ballooning permit adjacent guest physical address mapping without proper host MMU page table unmapping.',
    mitigation: 'Disable dynamic memory overcommit on multi-tenant worker nodes and apply microcode firmware update rev 0x24a.',
    affectedSystems: ['KVM/QEMU Cloud Compute Instances', 'Firecracker MicroVM Clusters', 'Serverless Function Workers']
  },
  {
    id: 'intel-06',
    cveId: 'CVE-2026-0741',
    title: 'BGP Hijacking Campaign Target Financial Settlement Routing Gateways',
    category: 'Zero-Day',
    severity: 'HIGH',
    cvss: 8.5,
    date: 'Sep 30, 2026',
    source: 'Global Internet Telemetry Radar',
    summary: 'Coordinated rogue autonomous system (AS) path announcements temporarily intercepted traffic destined for major interbank payment verification endpoints.',
    technicalDetails: 'Attackers forged ROA prefixes through unverified Tier-2 transit providers lacking strict RPKI route origin validation filters.',
    mitigation: 'Enforce RPKI Route Origin Validation with Drop-Invalid policy at all border routing nodes and enable BGPsec path validation.',
    affectedSystems: ['Core Autonomous Systems (ASNs)', 'Financial Interconnect Gateways', 'Tier-1/2 Transit Routers']
  }
]

export function CyberThreatRadar() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeArticle, setActiveArticle] = useState<ThreatArticle | null>(null)

  const categories = ['All', 'Zero-Day', 'Ransomware', 'Cloud & Infra', 'Cryptography', 'Supply Chain']

  const filteredFeeds = useMemo(() => {
    return LIVE_THREAT_FEEDS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <section id="threat-news" className="relative w-full bg-[#030206] py-24 px-6 sm:px-12 text-white border-t border-white/10">
      
      {/* Background Subtle Accent Grids */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,102,0,0.06)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 1. SECTION HEADER: Enterprise Cyber Threat Radar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-amber-400 mb-4">
              <Radio className="h-3 w-3 animate-pulse text-amber-400" />
              <span>LIVE TELEMETRY STREAM // VERIFIED THREAT FEEDS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Global Cyber Threat Intelligence
            </h2>
            <p className="mt-3 text-base text-zinc-400 max-w-2xl font-light">
              Real-time surveillance of critical CVE advisories, zero-day exploit vectors, 
              and active adversarial campaigns. Updated continuously for security professionals.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>RADAR STATUS: SYNCHRONIZED</span>
            </div>
            <span className="text-zinc-500">NEXT SCHEDULED SWEEP: CONTINUOUS</span>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black font-semibold shadow-[0_0_20px_rgba(255,140,0,0.35)]'
                    : 'border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search CVE, vector, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 backdrop-blur-md outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>
        </div>

        {/* 3. THREAT CARDS GRID */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.map((feed) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_35px_rgba(255,102,0,0.12)] cursor-pointer"
              onClick={() => setActiveArticle(feed)}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-4 font-mono text-[11px]">
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-400 font-semibold tracking-wider">
                    {feed.cveId}
                  </span>

                  <span className={`rounded px-2 py-0.5 font-bold tracking-wider ${
                    feed.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {feed.severity} • CVSS {feed.cvss}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 mb-2">
                  <span>{feed.category}</span>
                  <span>•</span>
                  <span>{feed.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-3">
                  {feed.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3 mb-6">
                  {feed.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="text-zinc-500 truncate max-w-[180px]">{feed.source}</span>
                <span className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform font-semibold">
                  Inspect Advisory <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. DETAIL ADVISORY MODAL */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-[#0c0806] p-8 shadow-[0_0_80px_rgba(255,102,0,0.25)] max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs mb-2">
                      <span className="rounded bg-amber-500/20 text-amber-400 px-2 py-0.5 font-bold">
                        {activeArticle.cveId}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-red-400 font-bold">
                        {activeArticle.severity} (CVSS {activeArticle.cvss})
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {activeArticle.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-2">
                      Executive Threat Summary
                    </h4>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      {activeArticle.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-2">
                      Technical Anatomy & Exploit Path
                    </h4>
                    <div className="rounded-lg bg-black/50 border border-white/10 p-4 font-mono text-xs text-zinc-300 leading-relaxed">
                      {activeArticle.technicalDetails}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 mb-2">
                      Recommended Mitigations & Hotfixes
                    </h4>
                    <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-4 font-mono text-xs text-emerald-300">
                      {activeArticle.mitigation}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Targeted Infrastructure & Runtimes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.affectedSystems.map((sys, idx) => (
                        <span key={idx} className="rounded bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-zinc-300">
                          {sys}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500">Source: {activeArticle.source}</span>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors"
                  >
                    Close Advisory
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 5. SECURE ACCESS GATEWAYS (STUDENT, RESEARCHER, COMPANY) */}
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-3">
              <Lock className="h-3.5 w-3.5" />
              <span>AUTHENTICATED ACCESS ONLY</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              Institutional & Enterprise Vault Gateways
            </h3>
            <p className="mt-3 text-zinc-400 font-light text-sm sm:text-base leading-relaxed">
              All specialized curriculum, offensive security simulation sandboxes, and enterprise enclaves 
              are strictly segregated behind authenticated zero-exposure vaults. Select your portal to proceed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Student Portal */}
            <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-1">
                  Academic Training
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Student Portal</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Courseware video academy, guided vulnerability analysis, and ethical defense certifications.
                </p>
              </div>

              <Link
                href="/vault"
                className="inline-flex items-center justify-between w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition-all"
              >
                <span>Login as Student</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. Researcher Portal */}
            <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div className="font-mono text-[10px] text-orange-400 uppercase tracking-wider mb-1">
                  Security Research
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Researcher Portal</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Isolated attack reproduction sandboxes, post-quantum cryptographic fuzzers, and kernel probes.
                </p>
              </div>

              <Link
                href="/vault"
                className="inline-flex items-center justify-between w-full rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 font-mono text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-black transition-all"
              >
                <span>Login as Researcher</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3. Company Portal */}
            <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-400 mb-4">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-1">
                  Enterprise Defense
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Company Portal</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Zero-exposure enclave licenses, API key management, and continuous organizational telemetry.
                </p>
              </div>

              <Link
                href="/vault"
                className="inline-flex items-center justify-between w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition-all"
              >
                <span>Login as Company</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
