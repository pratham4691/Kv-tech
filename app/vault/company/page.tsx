import type { Metadata } from "next"
import { ComingSoon } from "@/components/vault/coming-soon"
import { getVaultPath } from "@/lib/vault-paths"
import { isVaultPathEnabled } from "@/lib/feature-flags"

const path = getVaultPath("company")

export const metadata: Metadata = {
  title: "Kalki Vault Technologies",
  description: path.description,
  robots: { index: false, follow: true },
}

export default function CompanyVaultPage() {
  // When COMPANY_VAULT_ENABLED flips to true, the real platform renders here.
  if (isVaultPathEnabled("company")) {
    // Placeholder for the future Company platform.
  }
  return <ComingSoon path={path} />
}
