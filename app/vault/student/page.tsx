import type { Metadata } from "next"
import { ComingSoon } from "@/components/vault/coming-soon"
import { getVaultPath } from "@/lib/vault-paths"
import { isVaultPathEnabled } from "@/lib/feature-flags"

const path = getVaultPath("student")

export const metadata: Metadata = {
  title: "Student Vault",
  description: path.description,
  robots: { index: false, follow: true },
}

export default function StudentVaultPage() {
  // When STUDENT_VAULT_ENABLED flips to true, the real dashboard renders here.
  if (isVaultPathEnabled("student")) {
    // Placeholder for the future Student dashboard.
  }
  return <ComingSoon path={path} />
}
