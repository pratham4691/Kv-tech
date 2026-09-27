'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for cursor responsiveness
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 40
      const ny = (e.clientY / window.innerHeight - 0.5) * 40
      mouseX.set(nx)
      mouseY.set(ny)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // GPU-accelerated Colorful Motion Waves & Fluid Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let time = 0

    // Particle streams
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      hue: number
      alpha: number
      pulseSpeed: number
    }[] = []

    const count = width < 768 ? 45 : 85
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: -(Math.random() * 0.8 + 0.3),
        hue: Math.random() > 0.5 ? Math.random() * 40 + 175 : Math.random() * 60 + 260, // Cyan or Magenta/Violet
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      })
    }

    const render = () => {
      time += 0.012
      ctx.clearRect(0, 0, width, height)

      // Draw multi-layered animated colorful fluid wave ribbons
      // Wave 1: Electric Cyan / Turquoise
      drawFluidWave(
        ctx,
        width,
        height,
        time * 1.2,
        height * 0.45,
        70,
        0.0022,
        'rgba(6, 182, 212, 0.45)',
        'rgba(14, 165, 233, 0.05)'
      )

      // Wave 2: Neon Purple / Ultraviolet
      drawFluidWave(
        ctx,
        width,
        height,
        time * 0.9 + 2,
        height * 0.55,
        90,
        0.0018,
        'rgba(168, 85, 247, 0.4)',
        'rgba(217, 70, 239, 0.04)'
      )

      // Wave 3: Deep Sunset Magenta & Coral
      drawFluidWave(
        ctx,
        width,
        height,
        time * 1.4 + 4,
        height * 0.65,
        80,
        0.0028,
        'rgba(244, 63, 94, 0.35)',
        'rgba(249, 115, 22, 0.03)'
      )

      // Wave 4: Cosmic Azure Blue
      drawFluidWave(
        ctx,
        width,
        height,
        time * 0.7 + 1,
        height * 0.35,
        110,
        0.0015,
        'rgba(59, 130, 246, 0.35)',
        'rgba(99, 102, 241, 0.02)'
      )

      // Render glowing floating particles
      for (const p of particles) {
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.4
        p.y += p.speedY
        p.hue += 0.2

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const pulse = 0.5 + 0.5 * Math.sin(time * 3 + p.pulseSpeed * 100)
        const currentAlpha = p.alpha * pulse

        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${currentAlpha})`
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.8)`
        ctx.shadowBlur = 12

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0 // reset shadow for performance
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

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030612]">
      {/* 1. Base Multi-Color Radiant Aurora Gradients */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 90% 80% at 20% 10%, rgba(6, 182, 212, 0.35) 0%, transparent 65%),
            radial-gradient(ellipse 80% 70% at 85% 25%, rgba(168, 85, 247, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 95% 85% at 50% 90%, rgba(244, 63, 94, 0.28) 0%, transparent 70%),
            radial-gradient(ellipse 70% 60% at 10% 85%, rgba(59, 130, 246, 0.3) 0%, transparent 60%),
            linear-gradient(180deg, #02040a 0%, #060a1c 45%, #050414 100%)
          `,
        }}
      />

      {/* 2. Large Animated Vivid Light Orbs Moving on Organic Lissajous Curves */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0"
      >
        {/* Orb 1: Electric Cyan / Sky Blue */}
        <div 
          className="absolute -top-32 -left-20 h-[650px] w-[650px] rounded-full blur-[110px] opacity-75 animate-[pulse_8s_ease-in-out_infinite]"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(14, 165, 233, 0.3) 50%, transparent 80%)',
            animation: 'floatOrb1 18s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 2: Deep Neon Violet / Fuchsia */}
        <div 
          className="absolute top-1/4 -right-28 h-[750px] w-[750px] rounded-full blur-[130px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.55) 0%, rgba(139, 92, 246, 0.35) 55%, transparent 80%)',
            animation: 'floatOrb2 22s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 3: Radiant Amber / Coral Flare */}
        <div 
          className="absolute bottom-10 left-1/4 h-[600px] w-[600px] rounded-full blur-[120px] opacity-65"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, rgba(244, 63, 94, 0.3) 55%, transparent 75%)',
            animation: 'floatOrb3 20s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 4: Electric Indigo Oceanic Surge */}
        <div 
          className="absolute top-1/2 left-1/3 h-[500px] w-[500px] rounded-full blur-[100px] opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.55) 0%, rgba(59, 130, 246, 0.25) 60%, transparent 80%)',
            animation: 'floatOrb4 16s ease-in-out infinite alternate',
          }}
        />
      </motion.div>

      {/* 3. Fluid Animated Wave Canvas (Produces the live animated video look) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90 mix-blend-screen" />

      {/* 4. Fine Digital Grid Backdrop to give structure to the light */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 40%, transparent 90%)',
        }}
      />

      {/* 5. Fine Film Grain Texture */}
      <div className="bg-noise absolute inset-0 opacity-30 mix-blend-overlay" />
    </div>
  )
}

/**
 * Helper to render organic waving fluid ribbons on canvas
 */
function drawFluidWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  baseY: number,
  amplitude: number,
  frequency: number,
  colorTop: string,
  colorBottom: string
) {
  const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, height)
  gradient.addColorStop(0, colorTop)
  gradient.addColorStop(1, colorBottom)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(0, height)
  ctx.lineTo(0, baseY)

  const step = 20
  for (let x = 0; x <= width + step; x += step) {
    const y =
      baseY +
      Math.sin(x * frequency + time) * amplitude * 0.6 +
      Math.cos(x * (frequency * 0.6) - time * 0.8) * (amplitude * 0.4)
    ctx.lineTo(x, y)
  }

  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fill()
}