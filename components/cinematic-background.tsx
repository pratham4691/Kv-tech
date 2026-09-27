'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CinematicBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for cursor parallax
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 })

  const springXInverse = useSpring(mouseX, { stiffness: 30, damping: 30 })
  const springYInverse = useSpring(mouseY, { stiffness: 30, damping: 30 })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to range [-1, 1]
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(nx * 30) // subtle pixel travel
      mouseY.set(ny * 30)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Micro-dust particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: { x: number; y: number; size: number; alpha: number; speedY: number; speedX: number; pulse: number }[] = []
    const particleCount = width < 768 ? 24 : 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.4 + 0.1,
        speedY: -(Math.random() * 0.18 + 0.05),
        speedX: (Math.random() - 0.5) * 0.1,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.y += p.speedY
        p.x += p.speedX
        p.pulse += 0.015

        if (p.y < 0) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        const breathingAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))

        ctx.fillStyle = `rgba(220, 240, 255, ${breathingAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030508]">
      {/* 1. Subtle deep gradient layer */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 0%, rgba(12, 24, 42, 0.45) 0%, rgba(3, 5, 8, 0.95) 100%)'
        }}
      />

      {/* 2. Abstract drifting light fields (Parallax Layer A) */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0"
      >
        <div 
          className="ambient-blob-1 absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(6, 182, 212, 0.04) 65%, transparent 100%)' }}
        />
        <div 
          className="ambient-blob-2 absolute top-1/2 -right-20 h-[600px] w-[600px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.03) 65%, transparent 100%)' }}
        />
      </motion.div>

      {/* 3. Deep drifting secondary light (Parallax Layer B - Inverted movement) */}
      <motion.div
        style={{ x: springXInverse, y: springYInverse }}
        className="absolute inset-0"
      >
        <div 
          className="absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full blur-[150px] opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, transparent 70%)' }}
        />
      </motion.div>

      {/* 4. Micro-dust celestial points of light */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />

      {/* 5. Fine procedural film grain overlay */}
      <div className="bg-noise absolute inset-0 opacity-40 mix-blend-screen" />
    </div>
  )
}
