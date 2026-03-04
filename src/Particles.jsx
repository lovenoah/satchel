import { createContext, useContext, useRef, useCallback, useEffect, useState } from 'react'

const ParticlesContext = createContext(null)

const MAX_PARTICLES = 120
const PARTICLE_LIFE = 90

const isDesktop = () => window.innerWidth >= 600

function createParticle(x, y, svgSrc) {
  const desktop = isDesktop()
  const angle = Math.random() * Math.PI * 2
  const speed = desktop ? 3.5 + Math.random() * 5.5 : 2.5 + Math.random() * 4.5
  const size = 25
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (desktop ? 3 : 2.5),
    size,
    rotation: (Math.random() - 0.5) * 0.4,
    rotationSpeed: (Math.random() - 0.5) * 0.15,
    opacity: 1,
    life: PARTICLE_LIFE,
    svgSrc,
    scale: 0.3,
    desktop,
  }
}

export function ParticlesProvider({ children }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animatingRef = useRef(false)
  const imgCacheRef = useRef({})
  const dprRef = useRef(Math.min(window.devicePixelRatio || 1, 2))

  // Resize canvas to fill viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Load SVG as high-res Image
  const getImage = useCallback((svgSrc) => {
    if (imgCacheRef.current[svgSrc]) return imgCacheRef.current[svgSrc]
    const img = new Image()
    // Strip width/height and force large render size so canvas draws crisp
    const hiRes = svgSrc
      .replace(/\s*width="[^"]*"/, '')
      .replace(/\s*height="[^"]*"/, '')
      .replace('<svg', '<svg width="256" height="256"')
    const blob = new Blob([hiRes], { type: 'image/svg+xml' })
    img.src = URL.createObjectURL(blob)
    imgCacheRef.current[svgSrc] = img
    return img
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = dprRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const particles = particlesRef.current
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      // Physics
      const drag = p.desktop ? 0.98 : 0.97
      p.vx *= drag
      p.vy *= drag
      p.vy += p.desktop ? 0.07 : 0.12 // gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed
      p.rotationSpeed *= 0.98
      p.life--

      // Scale spring-in then hold
      if (p.life > PARTICLE_LIFE - 8) {
        p.scale += (1 - p.scale) * 0.35
      }

      // Fade out in last 30 frames
      if (p.life < 30) {
        p.opacity = p.life / 30
        p.scale *= 0.98
      }

      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      // Draw
      const img = getImage(p.svgSrc)
      if (!img.complete) continue

      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x * dpr, p.y * dpr)
      ctx.rotate(p.rotation)
      ctx.scale(p.scale, p.scale)
      const s = p.size * dpr
      ctx.drawImage(img, -s / 2, -s / 2, s, s)
      ctx.restore()
    }

    if (particles.length > 0) {
      animatingRef.current = true
      requestAnimationFrame(animate)
    } else {
      animatingRef.current = false
    }
  }, [getImage])

  // Spawn burst of particles
  const burst = useCallback((x, y, svgSrc, count = 6) => {
    const particles = particlesRef.current

    // Cap total particles
    while (particles.length + count > MAX_PARTICLES) {
      particles.shift()
    }

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(x, y, svgSrc))
    }

    if (!animatingRef.current) {
      animatingRef.current = true
      requestAnimationFrame(animate)
    }
  }, [animate])

  return (
    <ParticlesContext.Provider value={burst}>
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 9999,
        }}
      />
    </ParticlesContext.Provider>
  )
}

export function useParticles() {
  return useContext(ParticlesContext)
}
