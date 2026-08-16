import type { Metadata } from "next"
import { ComingSoon } from "@/components/vault/coming-soon"
import { getVaultPath } from "@/lib/vault-paths"
import { isVaultPathEnabled } from "@/lib/feature-flags"

const path = getVaultPath("researcher")

export const metadata: Metadata = {
  title: "Researcher Vault",
  description: path.description,
  robots: { index: false, follow: true },
}

export default function ResearcherVaultPage() {
  // When RESEARCHER_VAULT_ENABLED flips to true, the real workspace renders here.
  if (isVaultPathEnabled("researcher")) {
    // Placeholder for the future Researcher workspace.
  }
  return <ComingSoon path={path} />
}
