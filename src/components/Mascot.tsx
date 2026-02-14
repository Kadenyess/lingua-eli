import { useState, useEffect } from 'react'
import { Sparkles, Lightbulb, Heart, Star } from 'lucide-react'
import './Mascot.css'

interface MascotProps {
  message?: string
  emotion?: 'happy' | 'excited' | 'thinking' | 'celebrating'
  showTip?: boolean
}

const messages = {
  welcome: [
    "¡Hola! Soy tu amigo de aprendizaje. ¡Vamos a aprender inglés juntos! 🎉",
    "¡Bienvenido! Estoy aquí para ayudarte. ¡Tú puedes hacerlo! 💪",
    "¡Hola amigo! ¿Listo para una aventura de inglés? 🌟"
  ],
  encouragement: [
    "¡Excelente trabajo! ¡Sigue así! ⭐",
    "¡Lo estás haciendo muy bien! ¡Estoy orgulloso de ti! 🌈",
    "¡Increíble! ¡Eres muy inteligente! 💡",
    "¡Vas muy bien! ¡No pares ahora! 🚀"
  ],
  correct: [
    "¡Correcto! ¡Eres un genio! 🎉",
    "¡Muy bien! ¡Lo lograste! ⭐",
    "¡Perfecto! ¡Eres super listo! 🌟"
  ],
  keepTrying: [
    "¡Casi lo tienes! ¡Inténtalo de nuevo! 💪",
    "¡No te rindas! ¡Tú puedes! 🌈",
    "¡Sigue practicando! ¡Cada intento te hace mejor! ⭐"
  ],
  tip: [
    "💡 Consejo: Haz clic en el botón de audio para escuchar la pronunciación",
    "💡 Consejo: Lee el español primero si necesitas ayuda",
    "💡 Consejo: Practica todos los días para mejorar",
    "💡 Consejo: No te preocupes por los errores, ¡es así como aprendemos!"
  ]
}

export function Mascot({ message, emotion = 'happy', showTip = false }: MascotProps) {
  const [currentMessage, setCurrentMessage] = useState(message || messages.welcome[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (message) {
      setCurrentMessage(message)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [message])

  useEffect(() => {
    if (showTip) {
      const randomTip = messages.tip[Math.floor(Math.random() * messages.tip.length)]
      setCurrentMessage(randomTip)
      setShowTooltip(true)
      const timer = setTimeout(() => setShowTooltip(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showTip])

  const getRandomMessage = (category: keyof typeof messages) => {
    const categoryMessages = messages[category]
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
  }

  const handleClick = () => {
    setIsAnimating(true)
    setCurrentMessage(getRandomMessage('encouragement'))
    setTimeout(() => setIsAnimating(false), 1000)
  }

  const getEmotionIcon = () => {
    switch (emotion) {
      case 'excited':
        return <Sparkles size={24} className="emotion-icon" />
      case 'thinking':
        return <Lightbulb size={24} className="emotion-icon" />
      case 'celebrating':
        return <Star size={24} className="emotion-icon" />
      default:
        return <Heart size={24} className="emotion-icon" />
    }
  }

  return (
    <div className="mascot-container" onClick={handleClick}>
      <div className={`mascot ${isAnimating ? 'bounce' : ''} ${emotion}`}>
        <div className="mascot-face">
          <div className="mascot-eyes">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          <div className="mascot-beak"></div>
          <div className="mascot-blush"></div>
        </div>
        <div className="mascot-wings">
          <div className="wing left"></div>
          <div className="wing right"></div>
        </div>
        {getEmotionIcon()}
      </div>
      
      {(showTooltip || message) && (
        <div className="mascot-speech-bubble">
          <p>{currentMessage}</p>
          <div className="speech-bubble-tail"></div>
        </div>
      )}
    </div>
  )
}
