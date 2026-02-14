import { Sparkles, Rocket, BookOpen, Brain, Heart, Star } from 'lucide-react'
import { Mascot } from './Mascot'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="mascot-welcome">
          <Mascot message="¡Hola amigo! ¿Listo para aprender inglés? 🎉" emotion="excited" />
        </div>

        <div className="welcome-header">
          <div className="sparkle-icon">
            <Sparkles size={48} />
          </div>
          <h1>LinguaELi</h1>
          <p className="subtitle">Lingua English Learning Institution</p>
          <div className="welcome-badges">
            <span className="badge"><Heart size={14} /> Para niños</span>
            <span className="badge"><Star size={14} /> Gratis</span>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Brain className="feature-icon brain" />
            <h3>Vocabulario</h3>
            <p>Aprende palabras nuevas en inglés con traducción al español</p>
          </div>
          <div className="feature-card">
            <BookOpen className="feature-icon book" />
            <h3>Lectura</h3>
            <p>Lee historias divertidas desde nivel básico hasta 5to grado</p>
          </div>
          <div className="feature-card">
            <Rocket className="feature-icon rocket" />
            <h3>Progreso</h3>
            <p>Gana puntos y sube de nivel mientras aprendes</p>
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          <Rocket size={24} />
          <span>¡Comenzar Aventura!</span>
        </button>
      </div>
    </div>
  )
}
