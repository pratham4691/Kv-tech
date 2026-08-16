import type { VaultPathId } from './feature-flags'

export type VaultPath = {
  id: VaultPathId
  label: string
  tagline: string
  headline: string
  description: string
  /** Future capabilities — presented as planned, never as available today. */
  planned: string[]
  /** Status shown on the locked screen after a login attempt. */
  lockedTitle: string
  lockedMessage: string
  accent: 'primary' | 'signal' | 'warn'
}

export const vaultPaths: VaultPath[] = [
  {
    id: 'student',
    label: 'Student',
    tagline: 'Learn. Build. Enter cybersecurity.',
    headline: 'For those beginning the journey.',
    description:
      'A guided environment to build real security knowledge — from fundamentals to hands-on practice — and step into the field with confidence.',
    planned: [
      'Structured learning paths',
      'Hands-on labs',
      'Guided projects',
      'Community & mentorship',
      'Opportunities board',
    ],
    lockedTitle: 'Student Vault is currently unavailable.',
    lockedMessage:
      'Student services are being prepared for the next phase of Kalki Vault.',
    accent: 'primary',
  },
  {
    id: 'researcher',
    label: 'Researcher',
    tagline: 'Discover. Experiment. Advance.',
    headline: 'For those who look deeper.',
    description:
      'A future home for security research — resources, environments and datasets to explore what others overlook and advance the field responsibly.',
    planned: [
      'Research resources & publications',
      'Isolated research environments',
      'Security datasets',
      'Research challenges',
      'Responsible disclosure resources',
    ],
    lockedTitle: 'Researcher Vault is currently unavailable.',
    lockedMessage:
      'Research infrastructure and research services are currently under development.',
    accent: 'signal',
  },
  {
    id: 'company',
    label: 'Company',
    tagline: 'Secure. Build. Defend.',
    headline: 'For organizations that defend at scale.',
    description:
      'Kalki Vault Technologies will connect organizations with defensive technology, assessments and enterprise security solutions — entering the Vault in a future release.',
    planned: [
      'Enterprise security solutions',
      'Security assessments',
      'Defensive technology',
      'Security platforms & services',
    ],
    lockedTitle: 'Kalki Vault Technologies is preparing its enterprise platform.',
    lockedMessage:
      'Company services and products will become available in a future release.',
    accent: 'warn',
  },
]

export function getVaultPath(id: VaultPathId): VaultPath {
  const path = vaultPaths.find((p) => p.id === id)
  if (!path) throw new Error(`Unknown vault path: ${id}`)
  return path
}
