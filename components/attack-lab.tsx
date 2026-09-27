'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, ShieldCheck, ShieldAlert, Play, RotateCcw, 
  CheckCircle2, AlertOctagon, ArrowRight, Lock, Server, Cpu
} from 'lucide-react'
import { Reveal, SectionKicker } from './reveal'

type AttackScenario = {
  id: string
  name: string
  target: string
  cve: string
  stages: {
    name: string
    desc: string
    technique: string
    defendedAt: boolean
  }[]
  defenseAction: string
}

const scenarios: AttackScenario[] = [
  {
    id: 'ransomware',
    name: 'Ransomware Lateral Movement',
    target: 'Enterprise Domain Controller',
    cve: 'CVE-2024-41107',
    stages: [
      { name: '1. Ingress', desc: 'Phishing attachment drops loader into user temp directory.', technique: 'T1566.001', defendedAt: false },
      { name: '2. Execution', desc: 'Obfuscated PowerShell spawns background thread.', technique: 'T1059.001', defendedAt: false },
      { name: '3. Privilege Escalation', desc: 'Exploitation of token impersonation vulnerability.', technique: 'T1134.001', defendedAt: true },
      { name: '4. Lateral Propagation', desc: 'SMB scanning and shadow copy deletion.', technique: 'T1021.002', defendedAt: false },
      { name: '5. Encrypted Lockdown', desc: 'Bulk file locking with AES-256 and key exfiltration.', technique: 'T1486', defendedAt: false },
    ],
    defenseAction: 'Kalki Host Isolation Engine drops unauthorized SMB sockets and revokes forged Kerberos tickets instantly.',
  },
  {
    id: 'session',
    name: 'Session Token Theft & Hijack',
    target: 'Cloud Management Portal',
    cve: 'CWE-287 / OWASP A07',
    stages: [
      { name: '1. Adversary-in-the-Middle', desc: 'Reverse proxy captures session cookie during MFA challenge.', technique: 'T1557.001', defendedAt: false },
      { name: '2. Cookie Extraction', desc: 'Stolen authorization cookie transferred to foreign IP address.', technique: 'T1539', defendedAt: true },
      { name: '3. API Session Replay', desc: 'Attacker queries internal administrative endpoints.', technique: 'T1078.004', defendedAt: false },
      { name: '4. Data Extraction', desc: 'Bulk query on customer data buckets.', technique: 'T1530', defendedAt: false },
    ],
    defenseAction: 'Kalki Device Bound Session Credentials (DBSC) bind the session to hardware TPM keys, invalidating cookies replayed from remote machines.',
  },
  {
    id: 'cloud',
    name: 'Cloud IAM Policy Poisoning',
    target: 'AWS / Multi-Cloud Production Role',
    cve: 'MITRE ATT&CK Cloud Matrix',
    stages: [
      { name: '1. Exposed Secret', desc: 'Hardcoded temporary AWS secret discovered in public repository.', technique: 'T1552.001', defendedAt: false },
      { name: '2. Role Enumeration', desc: 'Automated scan reveals unrestricted AssumeRole permissions.', technique: 'T1069.003', defendedAt: false },
      { name: '3. Privilege Escalation', desc: 'Attacker attaches AdministratorAccess policy to rogue role.', technique: 'T1098.001', defendedAt: true },
      { name: '4. Resource Hijack', desc: 'Crypto miners deployed across 8 unmonitored regions.', technique: 'T1496', defendedAt: false },
    ],
    defenseAction: 'Kalki Cloud Posture Sentinel intercepts policy modification via real-time IAM drift anomaly detection and rolls back attached policies within 400ms.',
  },
]

export function AttackLab() {
  const [activeScenario, setActiveScenario] = useState<AttackScenario>(scenarios[0])
  const [simStep, setSimStep] = useState<number>(-1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [defenseActive, setDefenseActive] = useState(true)
  const [logStream, setLogStream] = useState<string[]>([
    'System ready. Select a scenario and initiate kill-chain simulation.',
  ])

  const runSimulation = () => {
    setIsSimulating(true)
    setSimStep(0)
    setLogStream([`[${new Date().toLocaleTimeString()}] INITIATING SIMULATION: ${activeScenario.name}`])

    let step = 0
    const interval = setInterval(() => {
      step++
      if (defenseActive && activeScenario.stages[step - 1]?.defendedAt) {
        clearInterval(interval)
        setIsSimulating(false)
        setLogStream(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ALERT: Anomaly identified at Stage ${step} (${activeScenario.stages[step - 1].technique})`,
          `[${new Date().toLocaleTimeString()}] SUCCESS: Kalki Defensive Interceptor triggered! Attack severed.`,
          `[${new Date().toLocaleTimeString()}] RESOLUTION: ${activeScenario.defenseAction}`,
        ])
        return
      }

      if (step >= activeScenario.stages.length) {
        clearInterval(interval)
        setIsSimulating(false)
        setLogStream(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] WARNING: Full kill-chain completed without defensive intervention.`,
        ])
        return
      }

      setSimStep(step)
      setLogStream(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executing Stage ${step + 1}: ${activeScenario.stages[step].name} [${activeScenario.stages[step].technique}]`,
      ])
    }, 900)
  }

  const resetSim = () => {
    setSimStep(-1)
    setIsSimulating(false)
    setLogStream(['System reset. Ready for next diagnostic test run.'])
  }

  return (
    <section id="attack-lab" className="relative border-t border-border/60 py-24 sm:py-32 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionKicker>Interactive Cyber Range</SectionKicker>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl text-white">
            Live Kill-Chain Simulator.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Experience how real attacks progress through each phase of the MITRE ATT&CK framework,
            and see how Kalki Zero-Trust rules dissect and sever the chain before data exfiltration.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          {/* Left: Scenario Selector & Control Panel */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-300">
              Select Attack Vector
            </h3>
            <div className="space-y-3">
              {scenarios.map((sc) => {
                const isSelected = sc.id === activeScenario.id
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveScenario(sc)
                      resetSim()
                    }}
                    className={`w-full text-left rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40'
                        : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{sc.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 rounded px-1.5 py-0.5">
                        {sc.cve}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: {sc.target}</p>
                  </button>
                )
              })}
            </div>

            {/* Controls */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Kalki Defensive Shield:
                </span>
                <button
                  type="button"
                  onClick={() => setDefenseActive(!defenseActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    defenseActive ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      defenseActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>
                <button
                  type="button"
                  onClick={resetSim}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Visual Stage Progression & Live Logs */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    Kill-Chain Vector Visualizer
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {simStep >= 0 ? `Stage ${simStep + 1} of ${activeScenario.stages.length}` : 'Idle'}
                </span>
              </div>

              {/* Stages List */}
              <div className="space-y-3 relative">
                {activeScenario.stages.map((stage, idx) => {
                  const isCurrent = simStep === idx
                  const isPassed = simStep > idx
                  const isDefendedHere = defenseActive && stage.defendedAt && (simStep >= idx || (!isSimulating && simStep !== -1))

                  return (
                    <motion.div
                      key={stage.name}
                      animate={{ scale: isCurrent ? 1.02 : 1 }}
                      className={`relative flex items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                        isCurrent
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : isPassed
                          ? 'border-white/10 bg-slate-900/30 opacity-70'
                          : 'border-white/5 bg-slate-900/20 opacity-40'
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-slate-800 font-mono text-xs text-white shrink-0 mt-0.5">
                        {isDefendedHere ? (
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        ) : isPassed ? (
                          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{stage.name}</span>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                            {stage.technique}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{stage.desc}</p>

                        {isDefendedHere && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            KALKI DEFENSE INTERCEPT: Kill-chain severed here.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Terminal Live Log Stream */}
            <div className="rounded-2xl border border-white/10 bg-black/80 p-4 font-mono text-[11px] space-y-1.5 max-h-[160px] overflow-y-auto">
              <div className="text-slate-500 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-cyan-400" />
                Live Diagnostic Telemetry Stream
              </div>
              {logStream.map((log, i) => (
                <div key={i} className="text-slate-300">
                  {log.includes('SUCCESS') ? (
                    <span className="text-emerald-400">{log}</span>
                  ) : log.includes('ALERT') ? (
                    <span className="text-yellow-400">{log}</span>
                  ) : log.includes('WARNING') ? (
                    <span className="text-red-400">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
