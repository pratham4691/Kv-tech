'use client'

import { useEffect, useRef } from 'react'

export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      pulse: number
    }

    const NODE_COUNT = 36
    const nodes: Node[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.8,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        a.x += a.vx
        a.y += a.vy
        a.pulse += 0.02

        if (a.x < 0) a.x = width
        if (a.x > width) a.x = 0
        if (a.y < 0) a.y = height
        if (a.y > height) a.y = 0

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        const rad = a.size + Math.sin(a.pulse) * 0.4
        ctx.fillStyle = 'rgba(34, 211, 238, 0.45)'
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

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02040a]">
      {/* 1. Ambient Radial Deep Space Glows */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 60%), ' +
            'radial-gradient(circle at 15% 65%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), ' +
            'radial-gradient(circle at 85% 85%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)'
        }}
      />

      {/* 2. Cyber-Lattice Connecting Web */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-40 mix-blend-screen" />

      {/* 3. Subtle Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, #000 35%, transparent 85%)',
        }}
      />

      {/* 4. Film Grain Texture */}
      <div className="bg-noise absolute inset-0 opacity-15 mix-blend-overlay" />
    </div>
  )
}
