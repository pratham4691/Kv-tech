'use client'

import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
}

/**
 * Lightweight, GPU-friendly network visualization on a 2D canvas.
 * - Reacts to the mouse (nodes drift toward the cursor, links brighten nearby)
 * - Reduces particle count on small screens
 * - Fully disabled for `prefers-reduced-motion`
 */
export function NetworkCanvas({
  className,
  density = 1,
  interactive = true,
}: {
  className?: string
  density?: number
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes: Node[] = []
    let raf = 0
    const mouse = { x: -9999, y: -9999, active: false }

    const primary = 'oklch(0.78 0.13 205'
    const signal = 'oklch(0.68 0.16 285'

    function count() {
      const base = width < 640 ? 26 : width < 1024 ? 44 : 66
      return Math.round(base * density)
    }

    function init() {
      const parent = canvas!.parentElement
      width = parent ? parent.clientWidth : window.innerWidth
      height = parent ? parent.clientHeight : window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = Array.from({ length: count() }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const linkDist = width < 640 ? 110 : 150

    function frame() {
      ctx!.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.02

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1

        if (interactive && mouse.active) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d = Math.hypot(dx, dy)
          if (d < 180 && d > 0.01) {
            n.x += (dx / d) * 0.4
            n.y += (dy / d) * 0.4
          }
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.28
            ctx!.strokeStyle = `${primary} / ${alpha * 100}%)`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const near =
          interactive && mouse.active
            ? Math.hypot(mouse.x - n.x, mouse.y - n.y) < 180
            : false
        const glow = 0.5 + Math.sin(n.pulse) * 0.25
        const color = near ? signal : primary
        ctx!.fillStyle = `${color} / ${(near ? 0.9 : glow) * 100}%)`
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r + (near ? 0.8 : 0), 0, Math.PI * 2)
        ctx!.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    function onLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    init()
    if (reduceMotion) {
      // draw a single static frame
      frame()
      cancelAnimationFrame(raf)
    } else {
      frame()
    }

    const onResize = () => {
      cancelAnimationFrame(raf)
      init()
      if (!reduceMotion) frame()
      else frame()
    }

    window.addEventListener('resize', onResize)
    if (interactive && !reduceMotion) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseleave', onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [density, interactive])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  )
}
