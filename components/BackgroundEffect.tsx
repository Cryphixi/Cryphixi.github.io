'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const starsRef = useRef<Array<{ x: number; y: number; radius: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create stars
    const numStars = 50
    starsRef.current = []
    for (let i = 0; i < numStars; i++) {
      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background that follows mouse
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        Math.max(canvas.width, canvas.height) * 0.8
      )
      
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      
      gradient.addColorStop(0, `${accentColor}15`)
      gradient.addColorStop(0.5, `${accentColor}08`)
      gradient.addColorStop(1, `${bgColor}00`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and animate stars
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      starsRef.current.forEach(star => {
        star.x += star.vx
        star.y += star.vy

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        const glowGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius * 3
        )
        glowGradient.addColorStop(0, `${accentColor}40`)
        glowGradient.addColorStop(1, `${accentColor}00`)
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = accentColor
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

