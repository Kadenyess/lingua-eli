import { useState } from 'react'
import { Gauge, Zap } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'
import './TTSSpeedSlider.css'

export function TTSSpeedSlider() {
  const [rate, setRate] = useState(soundEffects.getRate())
  const [isVisible, setIsVisible] = useState(false)

  const handleRateChange = (newRate: number) => {
    setRate(newRate)
    soundEffects.setRate(newRate)
  }

  const getSpeedLabel = (r: number) => {
    if (r <= 0.6) return 'Muy lento'
    if (r <= 0.8) return 'Lento'
    if (r <= 1.0) return 'Normal'
    if (r <= 1.3) return 'Rápido'
    return 'Muy rápido'
  }

  return (
    <div className="tts-speed-control">
      <button 
        className="speed-toggle-btn"
        onClick={() => setIsVisible(!isVisible)}
        title="Velocidad de voz"
      >
        <Gauge size={20} />
        <span>{rate.toFixed(1)}x</span>
      </button>
      
      {isVisible && (
        <div className="speed-slider-popup">
          <div className="speed-slider-header">
            <div className="header-with-icon">
              <Gauge size={18} />
              <span>Velocidad de voz</span>
            </div>
            <span className="speed-label">{getSpeedLabel(rate)}</span>
          </div>
          <div className="slider-container">
            <span className="slider-label">Lento</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="speed-slider"
            />
            <span className="slider-label">Rápido</span>
          </div>
          <div className="speed-value">{rate.toFixed(1)}x</div>
        </div>
      )}
    </div>
  )
}
