'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Play, Pause, Radio } from 'lucide-react'

export function CinematicBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for cursor parallax
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

  // Ensure video auto-plays reliably
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Fallback if browser requires interaction
      })
    }
  }, [])

  // Floating bioluminescent light particles overlay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let time = 0

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      hue: number
      alpha: number
    }[] = []

    const count = width < 768 ? 30 : 65
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(Math.random() * 0.7 + 0.2),
        hue: Math.random() > 0.5 ? 180 + Math.random() * 30 : 270 + Math.random() * 40,
        alpha: Math.random() * 0.6 + 0.2,
      })
    }

    const render = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.3
        p.y += p.speedY

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.alpha * (0.6 + 0.4 * Math.sin(time * 2))})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02040b]">
      {/* 1. Seamless Full-Screen Animated Video Background */}
      <motion.div
        style={{ x: springX, y: springY, scale: 1.06 }}
        className="absolute inset-0 h-full w-full"
      >
        <video
          ref={videoRef}
          src="/videos/vesper-bg.mp4"
          poster="/videos/vesper-poster.webp"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center filter saturate-[140%] contrast-[115%] brightness-[105%]"
        />

        {/* Dynamic Chromatic Gradient Vignette to seamlessly blend with the UI */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-80"
          style={{
            background: `
              radial-gradient(circle at 20% 25%, rgba(6, 182, 212, 0.45) 0%, transparent 60%),
              radial-gradient(circle at 80% 40%, rgba(168, 85, 247, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 50% 80%, rgba(244, 63, 94, 0.35) 0%, transparent 70%)
            `
          }}
        />

        {/* Ambient Darkened Edge Shroud for Maximum Legibility */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 20%, rgba(2, 4, 11, 0.75) 85%, #02040b 100%)'
          }}
        />
      </motion.div>

      {/* 2. Floating Bioluminescent Particle Mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80 mix-blend-screen" />

      {/* 3. Subtle Animated Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 85%)',
        }}
      />

      {/* 4. Film Grain Overlay */}
      <div className="bg-noise absolute inset-0 opacity-25 mix-blend-overlay" />

      {/* 5. Minimal Interactive Video Feed Status Chip (Bottom Right) */}
      <div className="pointer-events-auto absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2.5 rounded-full border border-white/10 bg-[#040612]/75 px-3.5 py-1.5 backdrop-blur-xl font-mono text-[10px] text-white/70 shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="tracking-widest uppercase">CINEMATIC VIDEO FEED</span>
        <button
          type="button"
          onClick={togglePlayback}
          className="ml-1 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
      </div>
    </div>
  )
}