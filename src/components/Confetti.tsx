import { useEffect, useState } from 'react'
import './Confetti.css'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    if (active) {
      const colors = ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899']
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2
      }))
      setParticles(newParticles)
      
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active || particles.length === 0) return null

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            backgroundColor: particle.color,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  )
}
