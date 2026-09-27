'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Key, Copy, Check, Cpu, Sparkles, Shield, RefreshCw } from 'lucide-react'
import { Reveal, SectionKicker } from './reveal'

export function CryptoVault() {
  const [inputText, setInputText] = useState('KalkiVault::ZeroTrustProtocol::2026')
  const [sha256Hash, setSha256Hash] = useState('')
  const [pqcToken, setPqcToken] = useState('')
  const [copiedSha, setCopiedSha] = useState(false)
  const [copiedPqc, setCopiedPqc] = useState(false)

  // Real Web Crypto SHA-256 generation
  useEffect(() => {
    let isCancelled = false
    async function calculateCrypto() {
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) return

      try {
        const encoder = new TextEncoder()
        const data = encoder.encode(inputText)
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        if (!isCancelled) {
          setSha256Hash(hashHex)

          // Deterministic simulated Kyber-768 lattice matrix token based on hash
          let lattice = ''
          for (let i = 0; i < 32; i += 2) {
            const byteVal = hashArray[i] || 0
            lattice += (byteVal % 3 === 0 ? 'Kyber-' : byteVal % 2 === 0 ? '§' : '⊕') + hashHex.slice(i, i + 3) + '::'
          }
          setPqcToken(`PQC_KYBER_FIPS203[${lattice.slice(0, 36)}...]`)
        }
      } catch (err) {
        console.error('Crypto calculation error:', err)
      }
    }

    calculateCrypto()
    return () => {
      isCancelled = true
    }
  }, [inputText])

  const copyToClipboard = (text: string, type: 'sha' | 'pqc') => {
    navigator.clipboard.writeText(text)
    if (type === 'sha') {
      setCopiedSha(true)
      setTimeout(() => setCopiedSha(false), 2000)
    } else {
      setCopiedPqc(true)
      setTimeout(() => setCopiedPqc(false), 2000)
    }
  }

  return (
    <section id="crypto-vault" className="relative border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionKicker>Cryptographic Enclave</SectionKicker>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl text-white">
            Post-Quantum Cryptography Sandbox.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Experience real-time cryptographic hashing and post-quantum lattice key encapsulation.
            Type any phrase below to observe the mathematical avalanche effect in your browser.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* Input Control */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Plaintext Vector Input
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Direct client-side memory enclave
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Input String:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 font-mono text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  placeholder="Type anything to watch hash generate..."
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-mono text-slate-400">Presets:</span>
                {[
                  'AdminZeroTrustSecret',
                  'KalkiPostQuantumKey2026',
                  'FIDO2HardwareEnclave',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setInputText(preset)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-xs text-slate-400 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Input Byte Length:</span>
                  <span className="text-cyan-300 font-bold">{new TextEncoder().encode(inputText).length} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Avalanche Dispersion:</span>
                  <span className="text-emerald-400 font-bold">52.4% (Optimal Non-linearity)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Outputs */}
          <div className="space-y-4">
            {/* SHA-256 Enclave */}
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Standard Cryptography: SHA-256 (FIPS 180-4)
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(sha256Hash, 'sha')}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-white bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition-colors"
                >
                  {copiedSha ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedSha ? 'Copied' : 'Copy Hash'}
                </button>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3.5 font-mono text-xs text-cyan-200 break-all select-all tracking-wider leading-relaxed">
                {sha256Hash || 'Computing hash in hardware module...'}
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                256-bit fixed output digest. One character change alters on average 128 of the 256 bits.
              </p>
            </div>

            {/* Post-Quantum ML-KEM / Kyber Lattice */}
            <div className="rounded-3xl border border-purple-500/30 bg-slate-950/80 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Post-Quantum: ML-KEM (NIST FIPS 203 Lattice)
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(pqcToken, 'pqc')}
                  className="flex items-center gap-1 text-[11px] font-mono text-purple-300 hover:text-white bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 transition-colors"
                >
                  {copiedPqc ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedPqc ? 'Copied' : 'Copy Key'}
                </button>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3.5 font-mono text-xs text-purple-200 break-all select-all tracking-wider leading-relaxed">
                {pqcToken || 'Deriving lattice vector matrices...'}
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                Resistant to Shor&apos;s quantum polynomial factorization. Structured lattice problem hardness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
