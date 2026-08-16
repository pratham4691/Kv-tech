import Link from 'next/link'
import { ShieldHalf } from 'lucide-react'

const columns = [
  {
    heading: 'Platform',
    links: [
      { label: 'Awareness', href: '#awareness' },
      { label: 'Threats', href: '#threats' },
      { label: 'Students', href: '/student' },
      { label: 'Companies', href: '/company' },
    ],
  },
  {
    heading: 'Ecosystem',
    links: [
      { label: 'Research', href: '/research' },
      { label: 'Labs', href: '/labs' },
      { label: 'Learning', href: '/learning' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    heading: 'Organization',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Enter the Vault', href: '/vault' },
      { label: 'Products', href: '/products' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <ShieldHalf className="h-4 w-4" />
              </span>
              <span className="text-sm tracking-[0.2em]">KALKI VAULT</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Cybersecurity Awareness &bull; Research &bull; Innovation. Building
              the security ecosystem of the future.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Kalki Vault Technologies. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/responsible-disclosure" className="transition-colors hover:text-foreground">
              Responsible Disclosure
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
