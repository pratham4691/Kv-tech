'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, Lock, AlertCircle, ArrowLeft, 
  Terminal, ShieldCheck, Key, Bell, Server
} from 'lucide-react'

const enterpriseProducts = [
  {
    id: 'prod-enclave-01',
    name: 'Kalki Sovereign Enclave Engine',
    tier: 'ENTERPRISE PRODUCTION',
    spec: 'Hardware-Isolated Memory Boundary',
    description: 'Autonomous zero-exposure runtime isolation protecting API keys, cryptographic tokens, and customer secrets from hypervisor inspection.',
  },
  {
    id: 'prod-telemetry-02',
    name: 'Real-Time Perimeter eBPF Threat Loom',
    tier: 'SOC TIER-1',
    spec: 'Sub-Millisecond Kernel Probes',
    description: 'Continuous kernel-level anomaly detection blocking zero-day deserialization exploits and credential harvesting in distributed clusters.',
  },
  {
    id: 'prod-pqc-03',
    name: 'Post-Quantum TLS Intercept Gateway',
    tier: 'STRATEGIC CRITICAL',
    spec: 'FIPS 140-3 Cryptographic Core',
    description: 'Next-generation quantum-resistant ingress proxy establishing ML-KEM/Kyber forward secrecy tunnels across legacy enterprise endpoints.',
  }
]

export default function CompanyVaultPage() {
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const handleProductClick = (name: string) => {
    setSelectedProduct(name)
    setShowBlockModal(true)
  }

  return (
    <div className="min-h-screen bg-[#030206] text-[#f4f6fa] pt-24 pb-20 px-6 sm:px-12 selection:bg-amber-500/25 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Radar</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>ENTERPRISE ACCREDITATION VERIFIED</span>
          </div>
        </div>

        {/* PROMINENT BLOCK / HOLD NOTICE BANNER */}
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-black p-6 sm:p-8 backdrop-blur-xl mb-12 shadow-[0_0_50px_rgba(255,120,0,0.15)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>ENTERPRISE PROVISIONING ON HOLD // TEMPORARILY UNAVAILABLE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  SOC2 Compliance Recertification & License Allocation Audit
                </h2>
                <p className="text-sm text-zinc-300 font-light max-w-3xl leading-relaxed">
                  Commercial production enclave deployments and automated API key generation are temporarily held 
                  during our scheduled annual zero-exposure infrastructure compliance audit. 
                  Product activation is temporarily unavailable. Your dedicated enterprise account executive will notify your organization upon clearance.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubscribed(true)}
              disabled={subscribed}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-amber-400 transition-colors shrink-0 disabled:opacity-50"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>{subscribed ? 'Account Flagged' : 'Request Account Sync'}</span>
            </button>
          </div>
        </div>

        {/* Enterprise Products Catalog (Locked) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Enterprise Security Product Suites</h3>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Zero-exposure enclave runtimes & defense architectures (Held pending compliance audit)
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
              STATE: AUDIT // TEMPORARILY LOCKED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enterpriseProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleProductClick(prod.name)}
                className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-white/[0.04] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      {prod.tier}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500 truncate max-w-[150px]">{prod.spec}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Deploy <Lock className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BLOCK MODAL DIALOG */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#0d0907] p-8 shadow-[0_0_80px_rgba(255,120,0,0.3)] text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Lock className="h-7 w-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">
                <span>DEPLOYMENT TEMPORARILY UNAVAILABLE</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedProduct || 'Enterprise Product'}
              </h3>

              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                Commercial license activation and enclave provisioning are temporarily on hold during infrastructure compliance audit. 
                Please stand by for enterprise account dispatch.
              </p>

              <div className="rounded-lg bg-black/50 border border-white/10 p-3 font-mono text-xs text-zinc-400 mb-6">
                PROVISIONING STATE: HOLD-COMPLIANCE-AUDIT
              </div>

              <button
                onClick={() => setShowBlockModal(false)}
                className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 font-mono text-xs font-semibold text-black hover:brightness-110 transition-all uppercase tracking-wider"
              >
                Acknowledge & Stand By
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
