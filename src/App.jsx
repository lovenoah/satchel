import { useCallback, useRef, useEffect } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import QRCodeStyling from 'qr-code-styling'
import { ParticlesProvider, useParticles } from './Particles'
import carrotSvg from './assets/carrot.svg?raw'
import glassSvg from './assets/glass.svg?raw'
import mapSvg from './assets/map.svg?raw'
import skullSvg from './assets/skull.svg?raw'
import miniStarSvg from './assets/mini-star.svg?raw'
import miniHeartSvg from './assets/mini-heart.svg?raw'
import miniCoinSvg from './assets/mini-coin.svg?raw'
import miniSkullSvg from './assets/mini-skull.svg?raw'
import './App.css'

const TOYS = [
  { id: 'glass', label: 'Potion', svg: glassSvg, particleSvg: miniStarSvg, haptic: 'error', anim: 'buzz' },
  { id: 'carrot', label: 'Carrot', svg: carrotSvg, particleSvg: miniHeartSvg, haptic: 'nudge', anim: 'wobble' },
  { id: 'map', label: 'Map', svg: mapSvg, particleSvg: miniCoinSvg, haptic: 'success', anim: 'pop' },
  { id: 'skull', label: 'Skull', svg: skullSvg, particleSvg: miniSkullSvg, haptic: 'buzz', anim: 'headshake' },
]

function ToyCard({ toy, trigger }) {
  const iconRef = useRef(null)
  const timeoutRef = useRef(null)
  const burst = useParticles()

  useEffect(() => {
    if (iconRef.current) iconRef.current.innerHTML = toy.svg
  }, [toy.svg])

  const handleTap = useCallback(() => {
    trigger(toy.haptic)
    const el = iconRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, toy.particleSvg)

    el.classList.remove(`toy__icon--${toy.anim}`)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    void el.offsetWidth
    el.classList.add(`toy__icon--${toy.anim}`)
    timeoutRef.current = setTimeout(() => {
      el.classList.remove(`toy__icon--${toy.anim}`)
    }, 650)
  }, [toy.haptic, toy.anim, toy.particleSvg, trigger, burst])

  return (
    <div className={`toy toy--${toy.id}`} onClick={handleTap}>
      <div className="toy__icon" ref={iconRef} />
      <span className="toy__label">{toy.label}</span>
    </div>
  )
}

const qrCode = new QRCodeStyling({
  width: 140,
  height: 140,
  data: 'https://satchel.noahfarrar.me',
  type: 'svg',
  dotsOptions: {
    type: 'dots',
    color: '#222',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#222',
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#222',
  },
  backgroundOptions: {
    color: 'transparent',
  },
  qrOptions: {
    errorCorrectionLevel: 'L',
  },
})

function StyledQR() {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      qrCode.append(ref.current)
    }
  }, [])
  return <div className="qr-card" ref={ref} />
}

function App() {
  const { trigger } = useWebHaptics({ debug: true })

  return (
    <ParticlesProvider>
      <div className="app">
        {TOYS.map(toy => (
          <ToyCard key={toy.id} toy={toy} trigger={trigger} />
        ))}
        <div className="qr-section">
          <StyledQR />
          <span className="qr-label">Scan to try haptics on mobile</span>
        </div>
        <footer className="credits">
          <span>Made with <a href="https://haptics.lochie.me/" target="_blank" rel="noopener noreferrer">web-haptics</a> by <a href="https://x.com/lochieaxon" target="_blank" rel="noopener noreferrer">@lochieaxon</a></span>
          <span><a href="https://noahfarrar.com" target="_blank" rel="noopener noreferrer">noahfarrar.com</a></span>
        </footer>
      </div>
    </ParticlesProvider>
  )
}

export default App
