export const featureFlags = {
  STUDENT_VAULT_ENABLED: true,
  RESEARCHER_VAULT_ENABLED: true,
  COMPANY_VAULT_ENABLED: true,
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
