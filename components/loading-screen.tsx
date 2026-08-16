'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const STORAGE_KEY = 'kv_booted'

export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    setMounted(true)
    const alreadyBooted =
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem(STORAGE_KEY) === '1'
    if (alreadyBooted) return

    setVisible(true)
    const duration = reduce ? 400 : 1600
    const t = setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
    }, duration)
    return () => clearTimeout(t)
  }, [reduce])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="grid-backdrop absolute inset-0 opacity-60" />
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-primary/40 animate-pulse-ring" />
              <span className="absolute inset-0 rounded-full border border-primary/20" />
              <motion.span
                className="h-3 w-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold tracking-[0.35em] text-foreground">
                KALKI VAULT
              </p>
              <motion.p
                className="mt-2 font-mono text-xs tracking-widest text-muted-foreground"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                Initializing secure environment...
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
