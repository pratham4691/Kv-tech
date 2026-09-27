'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, ShieldAlert, Crosshair, ArrowRight, Activity, Terminal } from 'lucide-react'

type VectorItem = {
  id: string
  name: string
  classification: string
  mitre: string
  severity: 'Critical' | 'Elevated' | 'Advisory'
  lead: string
  anatomy: string
  defensiveInterruption: string
}

const threatVectors: VectorItem[] = [
  {
    id: 'phish',
    name: 'Homoglyph & Deceptive Ingress',
    classification: 'Social Engineering & Identity',
    mitre: 'T1566.002',
    severity: 'Critical',
    lead: 'Adversary leverages punycode or typo-squatted domains to harvest active MFA tokens.',
    anatomy: 'Victim is lured via urgent SMS/email to a zero-entropy mirrored domain that intercepts WebAuthn or push notifications in transit.',
    defensiveInterruption: 'Hardware-enforced Origin-Bound DBSC binding automatically revokes tokens transmitted outside verified TLS hardware enclaves.',
  },
  {
    id: 'session',
    name: 'Session Token Exfiltration',
    classification: 'Web Infrastructure',
    mitre: 'T1539',
    severity: 'Critical',
    lead: 'Infostealer malware dumps stored browser cookies to bypass multi-factor authentication.',
    anatomy: 'Endpoint malware extracts decrypted SQLite session databases from disk and transmits serialized JSON cookies to foreign C2 drops.',
    defensiveInterruption: 'Process memory micro-segmentation blocks unauthorized read operations against browser credential keystores.',
  },
  {
    id: 'cloud',
    name: 'Cloud IAM Role Assumption Drift',
    classification: 'Multi-Cloud Fabric',
    mitre: 'T1098.001',
    severity: 'Elevated',
    lead: 'Latent service role permissions are elevated via automated credential rotation flaws.',
    anatomy: 'Attacker leverages over-privileged CI/CD service principals to attach administrative policy layers across orphan accounts.',
    defensiveInterruption: 'Ephemeral zero-trust IAM policies auto-expire in 300 seconds and enforce immutable continuous posture auditing.',
  },
  {
    id: 'supply',
    name: 'Supply-Chain Registry Poisoning',
    classification: 'Ecosystem Dependency',
    mitre: 'T1195.002',
    severity: 'Elevated',
    lead: 'Upstream open-source build scripts are modified to execute post-install reverse shells.',
    anatomy: 'Typo-squatted package names deploy obfuscated node modules that parse environment variables for production API secrets.',
    defensiveInterruption: 'Kalki Hermetic Build Sandbox executes package installations in strict write-locked ephemeral containers.',
  },
  {
    id: 'ai-prompt',
    name: 'Adversarial Prompt & Model Jailbreak',
    classification: 'Generative AI & LLM Systems',
    mitre: 'OWASP LLM01',
    severity: 'Advisory',
    lead: 'Multi-turn recursive payload instructions force models to disclose backend system prompts.',
    anatomy: 'Adversary crafts semantic evasion strings that bypass safety alignment filters and induce unauthorized tool executions.',
    defensiveInterruption: 'Deterministic AST semantic barrier parses prompt tokens prior to LLM ingestion, neutralizing latent instruction overrides.',
  },
  {
    id: 'ransom',
    name: 'Asymmetric Cryptographic Lockout',
    classification: 'System Endpoint',
    mitre: 'T1486',
    severity: 'Critical',
    lead: 'Fast multi-threaded file encryption using public keys to hold organizational data hostage.',
    anatomy: 'Adversary terminates volume shadow copies, enumerates network shares, and executes high-throughput in-place encryption.',
    defensiveInterruption: 'Kernel-level I/O rate anomaly tripwires freeze suspicious write loops within 12 milliseconds of mass encryption.',
  },
]

export function ThreatLoom() {
  const [selectedId, setSelectedId] = useState<string>(threatVectors[0].id)
  const active = threatVectors.find(v => v.id === selectedId) || threatVectors[0]

  return (
    <section id="threat-loom" className="relative border-t border-white/[0.06] py-28 sm:py-36 px-6 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-16 border-b border-white/[0.06]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
              Vector Dissection
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              The Threat <span className="font-serif italic font-normal text-cyan-200">Loom.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-white/50 leading-relaxed font-light">
            Every attack vector exhibits distinct mathematical entropy and telemetry signatures. 
            Inspect how the Kalki mesh recognizes and severs the chain.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1.1fr]">
          {/* Vector Selector Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {threatVectors.map((v) => {
              const isSelected = v.id === selectedId
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={`text-left rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400/50 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                      : 'border-white/[0.05] bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                      <span className="text-white/40">{v.mitre}</span>
                      <span
                        className={
                          v.severity === 'Critical'
                            ? 'text-red-400'
                            : v.severity === 'Elevated'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }
                      >
                        {v.severity}
                      </span>
                    </div>

                    <h4 className="mt-3 font-display text-lg font-bold text-white">
                      {v.name}
                    </h4>

                    <p className="mt-1.5 text-xs text-white/50 line-clamp-2">
                      {v.lead}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
                    <span>INSPECT ANATOMY</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Forensic Inspection HUD */}
          <div className="relative rounded-3xl border border-white/[0.08] bg-[#050811]/80 p-8 sm:p-10 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                <Crosshair className="h-4 w-4" />
                <span>FORENSIC TELEMETRY // {active.mitre}</span>
              </div>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                {active.classification}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {active.name}
            </h3>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-white/[0.05] bg-slate-900/40 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-300 flex items-center gap-1.5 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                  Adversarial Kill-Chain Execution
                </span>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                  {active.anatomy}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 flex items-center gap-1.5 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Kalki Defensive Interruption Protocol
                </span>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                  {active.defensiveInterruption}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/40 uppercase tracking-widest">
              <span>AUTOMATED INTERRUPT TIME: &lt; 14MS</span>
              <span className="text-emerald-400 font-semibold">CONTAINED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
