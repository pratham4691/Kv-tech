/**
 * Future-ready feature flags.
 *
 * Every Vault path is a FUTURE platform category. Flipping any of these to
 * `true` activates the corresponding dashboard/route without redesigning the
 * site. Nothing in the UI should claim these services exist while a flag is
 * false — the "locked" states are driven entirely by these values.
 *
 * These can later be sourced from an env var, edge config, or a flags provider
 * without changing consumers, e.g.
 *   STUDENT_VAULT_ENABLED: process.env.NEXT_PUBLIC_STUDENT_VAULT_ENABLED === 'true'
 */
export const featureFlags = {
  STUDENT_VAULT_ENABLED: false,
  RESEARCHER_VAULT_ENABLED: false,
  COMPANY_VAULT_ENABLED: false,
} as const

export type VaultPathId = 'student' | 'researcher' | 'company'

export const vaultFlagByPath: Record<VaultPathId, keyof typeof featureFlags> = {
  student: 'STUDENT_VAULT_ENABLED',
  researcher: 'RESEARCHER_VAULT_ENABLED',
  company: 'COMPANY_VAULT_ENABLED',
}

export function isVaultPathEnabled(path: VaultPathId): boolean {
  return featureFlags[vaultFlagByPath[path]]
}
