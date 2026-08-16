import type { ReactNode } from 'react'

export default function ControlLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#09111a] text-slate-100">{children}</div>
}
