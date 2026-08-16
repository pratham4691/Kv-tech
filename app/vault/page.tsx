import type { Metadata } from 'next'
import { VaultGateway } from '@/components/vault/vault-gateway'

export const metadata: Metadata = {
  title: 'Enter the Vault',
  description:
    'Enter Kalki Vault — choose your path as a student, researcher or organization.',
  robots: { index: false, follow: true },
}

export default function VaultPage() {
  return <VaultGateway />
}
