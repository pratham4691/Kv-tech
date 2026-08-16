'use client'

import Link from 'next/link'
import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary',
  ghost:
    'border border-border bg-surface/40 text-foreground hover:bg-surface hover:border-primary/50',
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  type = 'button',
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * 0.3)
    y.set(relY * 0.3)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  const inner = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        <Link href={href} className={cn(base, variants[variant], className)}>
          {inner}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={cn(base, variants[variant], className)}
        >
          {inner}
        </button>
      )}
    </motion.div>
  )
}
