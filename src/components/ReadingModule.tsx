import { useState } from 'react'
import { ArrowLeft, Volume2, CheckCircle, BookOpen, ChevronRight, RotateCcw, VolumeX } from 'lucide-react'
import { readingPassages } from '../data/reading'
import { soundEffects } from '../utils/soundEffects'
import './ReadingModule.css'

interface ReadingModuleProps {
  level: number
  onAddPoints: (points: number, reason?: string) => void
  onComplete: () => void
  onBack: () => void
  onCelebration?: (message: string) => void
}

export function ReadingModule({ onAddPoints, onComplete, onBack, onCelebration }: ReadingModuleProps) {
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showSpanish, setShowSpanish] = useState(false)
  const [completedPassages, setCompletedPassages] = useState<string[]>([])

  const currentPassage = readingPassages[selectedPassageIndex]
  const currentQuestion = currentPassage.questions[currentQuestionIndex]

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeakingSpanish, setIsSpeakingSpanish] = useState(false)

  const speakText = async (text: string) => {
    soundEffects.playClick()
    
    // If already speaking, stop it
    if (isSpeaking) {
      soundEffects.stopSpeaking()
      setIsSpeaking(false)
      return
    }
    
    setIsSpeaking(true)
    soundEffects.speakEnglish(text)
    // Reset after a short delay (browser TTS doesn't give us exact end time)
    setTimeout(() => setIsSpeaking(false), 2000)
  }

  const speakSpanish = async (text: string) => {
    soundEffects.playClick()
    
    // If already speaking Spanish, stop it
    if (isSpeakingSpanish) {
      soundEffects.stopSpeaking()
      setIsSpeakingSpanish(false)
      return
    }
    
    setIsSpeakingSpanish(true)
    soundEffects.speakSpanish(text)
    // Reset after a short delay
    setTimeout(() => setIsSpeakingSpanish(false), 2000)
  }

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    soundEffects.playClick()
    setSelectedAnswer(index)
    const correct = index === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setScore((prev: number) => prev + 1)
      onAddPoints(20, '¡Respuesta correcta!')
      soundEffects.playSuccess()
      soundEffects.speakEncouragement('correct')
    } else {
      soundEffects.playTryAgain()
      soundEffects.speakEncouragement('tryAgain')
    }
  }

  const handleNext = () => {
    soundEffects.playClick()
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      const finalScore = score + (isCorrect ? 1 : 0)
      if (finalScore === currentPassage.questions.length) {
        if (!completedPassages.includes(currentPassage.id)) {
          setCompletedPassages((prev: string[]) => [...prev, currentPassage.id])
          onAddPoints(100, '¡Lectura completada perfectamente!')
          onComplete()
          onCelebration?.(`¡Completaste "${currentPassage.title}"! 📚`)
          soundEffects.playLevelComplete()
        }
      }
      
      if (selectedPassageIndex < readingPassages.length - 1) {
        setSelectedPassageIndex((prev: number) => prev + 1)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
      }
    }
  }

  const restartPassage = () => {
    soundEffects.playClick()
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
  }

  const handlePassageSelect = (idx: number) => {
    soundEffects.playClick()
    setSelectedPassageIndex(idx)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
  }

  const isLastQuestion = currentQuestionIndex === currentPassage.questions.length - 1
  const isLastPassage = selectedPassageIndex === readingPassages.length - 1

  return (
    <div className="reading-module">
      <div className="reading-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
          <span>Volver</span>
        </button>
        <h2>Lectura</h2>
      </div>

      <div className="passage-selector">
        {readingPassages.map((passage, idx) => (
          <button
            key={passage.id}
            className={`passage-btn ${selectedPassageIndex === idx ? 'active' : ''} ${completedPassages.includes(passage.id) ? 'completed' : ''}`}
            onClick={() => handlePassageSelect(idx)}
          >
            <BookOpen size={16} />
            <span>{idx + 1}</span>
            {completedPassages.includes(passage.id) && <CheckCircle size={12} className="completed-icon" />}
          </button>
        ))}
      </div>

      <div className="reading-card">
        <div className="reading-title">
          <h3>{currentPassage.title}</h3>
          <button className={`speak-btn ${isSpeaking ? 'speaking' : ''}`} onClick={() => speakText(currentPassage.content)}>
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <span>{isSpeaking ? 'Detener' : 'Leer en voz alta'}</span>
          </button>
        </div>

        <div className="reading-content">
          <p className="english-text">{currentPassage.content}</p>
          
          <button 
            className="translate-toggle"
            onClick={() => {
              soundEffects.playClick()
              setShowSpanish(!showSpanish)
            }}
          >
            {showSpanish ? 'Ocultar español' : 'Ver en español'}
          </button>
          
          {showSpanish && (
            <div className="spanish-section">
              <p className="spanish-text">{currentPassage.contentEs}</p>
              <button 
                className={`speak-btn spanish ${isSpeakingSpanish ? 'speaking' : ''}`} 
                onClick={() => speakSpanish(currentPassage.contentEs)}
                title="Escuchar en español"
              >
                {isSpeakingSpanish ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>Escuchar español</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Pregunta {currentQuestionIndex + 1} de {currentPassage.questions.length}</span>
        </div>

        <div className="question-content">
          <p className="question-text">{currentQuestion.question}</p>
          <p className="question-translation">{currentQuestion.questionEs}</p>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                selectedAnswer === idx 
                  ? showResult 
                    ? idx === currentQuestion.correctAnswer 
                      ? 'correct' 
                      : 'incorrect'
                    : 'selected'
                  : showResult && idx === currentQuestion.correctAnswer 
                    ? 'correct'
                    : ''
              }`}
              onClick={() => handleAnswerSelect(idx)}
              disabled={showResult}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <>
                <CheckCircle size={24} />
                <span>¡Correcto! +20 puntos</span>
              </>
            ) : (
              <>
                <span>La respuesta correcta es: {currentQuestion.options[currentQuestion.correctAnswer]}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="reading-navigation">
        <button className="nav-btn" onClick={restartPassage}>
          <RotateCcw size={16} />
          <span>Repetir</span>
        </button>
        
        {showResult && (
          <button className="nav-btn next" onClick={handleNext}>
            <span>{isLastQuestion && isLastPassage ? 'Terminar' : 'Siguiente'}</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
