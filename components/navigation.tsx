'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ShieldHalf } from 'lucide-react'
import { MagneticButton } from './magnetic-button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Awareness', href: '#awareness' },
  { label: 'Threats', href: '#threats' },
  { label: 'Research', href: '#ecosystem', soon: true },
  { label: 'Students', href: '#audiences' },
  { label: 'Companies', href: '#ecosystem', soon: true },
  { label: 'About', href: '#about' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            'flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500',
            scrolled ? 'glass' : 'border border-transparent',
          )}
          aria-label="Primary"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-semibold tracking-wide"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <ShieldHalf className="h-4 w-4" />
            </span>
            <span className="text-sm tracking-[0.2em]">KALKI VAULT</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="group relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                  {l.soon && (
                    <span className="rounded-full bg-signal/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <MagneticButton href="/vault" className="px-5 py-2.5 text-sm">
                Enter the Vault
              </MagneticButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass mt-2 rounded-3xl p-4 lg:hidden">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                  >
                    {l.label}
                    {l.soon && (
                      <span className="rounded-full bg-signal/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/vault"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
                >
                  Enter the Vault
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
