'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Play, Pause, Layers, Radio, Shield, Terminal, Activity } from 'lucide-react'

export const VIDEO_FEEDS = [
  {
    id: 'codescan',
    name: 'CYBER MATRIX',
    tag: 'CODE DEEP SCAN',
    src: '/videos/codescan.mp4',
    accent: '#06b6d4',
    desc: 'Deep neural code scan & live vulnerability stream'
  },
  {
    id: 'neural',
    name: 'NEURAL MONITOR',
    tag: 'THREAT INTELLIGENCE',
    src: '/videos/neural-monitor.mp4',
    accent: '#a855f7',
    desc: 'Autonomous agentic telemetries & live perimeter security'
  },
  {
    id: 'cortex',
    name: 'QUANTUM CORTEX',
    tag: 'POST-QUANTUM CRYPTO',
    src: '/videos/cortex.mp4',
    accent: '#3b82f6',
    desc: 'Multi-layer cryptographic mesh & dynamic key entropy'
  },
  {
    id: 'gravity',
    name: 'GRAVITY SHIELD',
    tag: 'ZERO-TRUST DEFENSE',
    src: '/videos/gravity.mp4',
    accent: '#10b981',
    desc: 'High-density defensive kinetic lattice'
  },
  {
    id: 'negantropy',
    name: 'NEGENTROPY',
    tag: 'ENCLAVE SYNC',
    src: '/videos/negantropy.mp4',
    accent: '#f43f5e',
    desc: 'Deterministic cryptographically ordered enclave'
  }
]

export function CinematicBackground() {
  const [activeFeed, setActiveFeed] = useState(VIDEO_FEEDS[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 35
      const ny = (e.clientY / window.innerHeight - 0.5) * 35
      mouseX.set(nx)
      mouseY.set(ny)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Play video on mount & on activeFeed change
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.load()
      video.play().catch(() => {})
    }
  }, [activeFeed])

  // Dynamic particle layer overlay matching cybersecurity cyber-nodes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let time = 0

    const nodes: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      pulse: number
    }[] = []

    const count = width < 768 ? 20 : 50
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        pulse: Math.random() * Math.PI * 2
      })
    }

    const render = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Draw faint interconnecting neural web
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        a.x += a.speedX
        a.y += a.speedY
        a.pulse += 0.03

        if (a.x < 0) a.x = width
        if (a.x > width) a.x = 0
        if (a.y < 0) a.y = height
        if (a.y > height) a.y = 0

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 100) * 0.16})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        const rad = a.size + Math.sin(a.pulse) * 0.7
        ctx.fillStyle = 'rgba(34, 211, 238, 0.75)'
        ctx.beginPath()
        ctx.arc(a.x, a.y, Math.max(0.5, rad), 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02040a]">
      {/* 1. Full-Screen Cinematic Cybersecurity Video */}
      <motion.div
        style={{ x: springX, y: springY, scale: 1.05 }}
        className="absolute inset-0 h-full w-full"
      >
        <video
          ref={videoRef}
          key={activeFeed.src}
          src={activeFeed.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center filter saturate-[135%] contrast-[120%] brightness-[108%] transition-opacity duration-700"
        />

        {/* Dynamic Chromatic Gradient Vignette tailored to current feed accent */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-70 transition-all duration-700"
          style={{
            background: `
              radial-gradient(circle at 20% 25%, ${activeFeed.accent}55 0%, transparent 60%),
              radial-gradient(circle at 80% 40%, rgba(147, 51, 234, 0.35) 0%, transparent 60%),
              radial-gradient(circle at 50% 85%, rgba(6, 182, 212, 0.3) 0%, transparent 70%)
            `
          }}
        />

        {/* Ambient Darkened Edge Shroud for Maximum Content Contrast & Legibility */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 20%, rgba(2, 4, 10, 0.72) 80%, #02040a 100%)'
          }}
        />
      </motion.div>

      {/* 2. Cyber-Lattice Connecting Web */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen" />

      {/* 3. Subtle Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 35%, transparent 85%)',
        }}
      />

      {/* 4. Film Grain Texture */}
      <div className="bg-noise absolute inset-0 opacity-20 mix-blend-overlay" />

      {/* 5. Interactive Video Feed Controller (Bottom Right) */}
      <div className="pointer-events-auto absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-1 w-72 rounded-2xl border border-white/10 bg-[#040714]/92 p-3 shadow-2xl backdrop-blur-2xl font-mono"
            >
              <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2 text-[10px] tracking-wider text-white/50 uppercase">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  <span>SELECT VIDEO TELEMETRY</span>
                </span>
                <span className="text-[9px] text-cyan-400">LIVE FEED</span>
              </div>
              <div className="space-y-1">
                {VIDEO_FEEDS.map((feed) => {
                  const isCurrent = feed.id === activeFeed.id
                  return (
                    <button
                      key={feed.id}
                      type="button"
                      onClick={() => {
                        setActiveFeed(feed)
                        setMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: feed.accent }} 
                          />
                          <span className="font-medium text-[11px]">{feed.name}</span>
                        </div>
                        <span className="text-[9px] text-white/40 pl-4">{feed.tag}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] text-cyan-400 uppercase tracking-wider font-semibold">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#040612]/85 px-3.5 py-1.5 backdrop-blur-xl font-mono text-[10px] text-white/80 shadow-2xl">
          <span className="flex h-2 w-2 relative">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: activeFeed.accent }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2" 
              style={{ backgroundColor: activeFeed.accent }}
            />
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 tracking-wider hover:text-cyan-300 transition-colors uppercase font-medium"
            title="Click to switch background video telemetry"
          >
            <span className="text-white font-semibold">{activeFeed.name}</span>
            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{activeFeed.tag}</span>
            <span className="text-white/40 text-[9px]">▾</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            type="button"
            onClick={togglePlayback}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={isPlaying ? 'Pause Background Video' : 'Resume Background Video'}
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  )
}
