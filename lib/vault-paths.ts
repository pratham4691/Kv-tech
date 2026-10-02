import type { VaultPathId } from './feature-flags'

export type VaultPath = {
  id: VaultPathId
  label: string
  tagline: string
  headline: string
  description: string
  planned: string[]
  lockedTitle: string
  lockedMessage: string
  accent: 'primary' | 'signal' | 'warn'
}

export const vaultPaths: VaultPath[] = [
  {
    id: 'student',
    label: 'Student',
    tagline: 'Awareness Training & Video Modules',
    headline: 'For students stepping into cybersecurity.',
    description:
      'Students receive curated defensive training videos, hands-on phishing dissections, interactive quizzes, and live awareness masterclasses.',
    planned: [
      'Interactive Training Video Modules',
      'Live Masterclass Sessions Schedule',
      'Certification & Quiz Challenges',
      'Downloadable Security Cheat-sheets',
    ],
    lockedTitle: 'Student Vault Access Granted',
    lockedMessage: 'Proceeding to your Student Training Dashboard...',
    accent: 'primary',
  },
  {
    id: 'researcher',
    label: 'Researcher',
    tagline: 'Vulnerability Research & Attack Labs',
    headline: 'For security analysts and forensic researchers.',
    description:
      'Researchers receive access to live attack simulation labs, MITRE ATT&CK kill-chain disruption tools, and post-quantum cryptographic sandboxes.',
    planned: [
      'Interactive Attack Simulation Lab',
      'Live CVE Telemetry Radar',
      'Post-Quantum Cryptographic Sandbox',
      'Kernel Intercept Telemetry',
    ],
    lockedTitle: 'Researcher Vault Access Granted',
    lockedMessage: 'Initializing your Research Laboratory...',
    accent: 'signal',
  },
  {
    id: 'company',
    label: 'Company',
    tagline: 'Enterprise Products & Enclave Licensing',
    headline: 'For organizations defending at scale.',
    description:
      'Enterprises receive autonomous defense products, zero-exposure micro-enclaves, automated PQC compliance validators, and deployment SDKs.',
    planned: [
      'Kalki Sentinel Core Enclaves',
      'Phoenicx Autonomous Incident Severance',
      'Organization API Key & Token Generator',
      'SOC 2 & FIPS 203 Compliance Tooling',
    ],
    lockedTitle: 'Enterprise Vault Access Granted',
    lockedMessage: 'Accessing your Organization Deployment Portal...',
    accent: 'warn',
  },
]

export function getVaultPath(id: VaultPathId): VaultPath {
  const path = vaultPaths.find((p) => p.id === id)
  if (!path) throw new Error(`Unknown vault path: ${id}`)
  return path
}
