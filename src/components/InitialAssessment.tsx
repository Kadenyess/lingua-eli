import { useState } from 'react'
import { ArrowRight, CheckCircle, XCircle, Sparkles, Target } from 'lucide-react'
import { assessmentQuestions, calculateStartingLevel } from '../data/assessment'
import { soundEffects } from '../utils/soundEffects'
import './InitialAssessment.css'

interface InitialAssessmentProps {
  onComplete: (startingLevel: number, score: number, total: number) => void
}

function makeAssessmentImage(label: string, emoji: string, hue = 40) {
  const safe = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue} 88% 95%)" />
          <stop offset="100%" stop-color="hsl(${(hue + 36) % 360} 78% 88%)" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" rx="16" fill="url(#g)" />
      <rect x="8" y="8" width="144" height="104" rx="12" fill="rgba(255,255,255,0.55)" />
      <text x="80" y="58" text-anchor="middle" dominant-baseline="central" font-size="38">${emoji}</text>
      <text x="80" y="99" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#1f2937">${safe.slice(0, 14)}</text>
    </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function emojiForAssessmentOption(option: string) {
  const key = option.toLowerCase()
  const map: Record<string, string> = {
    cat: '🐱',
    dog: '🐶',
    house: '🏠',
    book: '📘',
    pencil: '✏️',
    table: '🪑',
    chair: '🪑',
    hello: '👋',
    happy: '😊',
    teacher: '👩‍🏫',
    proof: '🧾',
  }
  return map[key] || '🖼️'
}

function getPicturePromptVisual(currentQuestion: { imagePrompt?: { title: string; emoji: string; hue?: number }; options: string[]; correctAnswer: number }) {
  if (currentQuestion.imagePrompt) {
    return currentQuestion.imagePrompt
  }

  const fallbackLabel = currentQuestion.options[currentQuestion.correctAnswer] || 'picture'
  return {
    title: fallbackLabel,
    emoji: emojiForAssessmentOption(fallbackLabel),
    hue: 40,
  }
}

export function InitialAssessment({ onComplete }: InitialAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    
    soundEffects.playClickSafe()
    setSelectedAnswer(index)
    const correct = index === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setScore(prev => prev + 1)
      soundEffects.playSuccess()
    } else {
      soundEffects.playTryAgain()
    }
  }

  const handleNext = () => {
    soundEffects.playClickSafe()
    
    if (isLastQuestion) {
      // Assessment complete - calculate starting level
      const startingLevel = calculateStartingLevel(score, assessmentQuestions.length)
      onComplete(startingLevel, score, assessmentQuestions.length)
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  return (
    <div className="initial-assessment">
      <div className="assessment-header">
        <div className="assessment-title">
          <Target size={32} />
          <h1>Evaluación Inicial</h1>
          <p className="subtitle">Initial Assessment</p>
        </div>
        <div className="assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            Pregunta {currentQuestionIndex + 1} de {assessmentQuestions.length}
          </span>
        </div>
      </div>

      <div className="assessment-instructions">
        <Sparkles size={20} />
        <p>
          Responde estas preguntas para que podamos encontrar el mejor nivel para ti.
          <br />
          <em>Answer these questions so we can find the best level for you.</em>
        </p>
      </div>

      <div className="question-card">
        <div className="question-header">
          <span className="question-type-badge">
            {currentQuestion.type === 'vocabulary' && '📚 Vocabulario'}
            {currentQuestion.type === 'sentence' && '✏️ Oración'}
            {currentQuestion.type === 'picture' && '🖼️ Imagen'}
          </span>
        </div>

        <div className="question-content">
          <h3 className="question-text">{currentQuestion.question}</h3>
          <p className="question-translation">{currentQuestion.questionEs}</p>
        </div>

        {currentQuestion.type === 'picture' && (
          <div className="assessment-picture-prompt">
            {(() => {
              const promptVisual = getPicturePromptVisual(currentQuestion)
              return (
                <>
                  <img
                    src={makeAssessmentImage(
                      promptVisual.title,
                      promptVisual.emoji,
                      promptVisual.hue ?? 40,
                    )}
                    alt={`Picture prompt: ${promptVisual.title}`}
                  />
                  <div className="picture-prompt-caption">
                    <strong>Look at the picture</strong>
                    <span>Mira la imagen antes de escoger la respuesta.</span>
                  </div>
                </>
              )
            })()}
          </div>
        )}

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
              {currentQuestion.type === 'picture' && (
                <img
                  className="option-image"
                  src={makeAssessmentImage(option, emojiForAssessmentOption(option), 200 + idx * 24)}
                  alt=""
                  aria-hidden="true"
                />
              )}
              <span className="option-text">{option}</span>
              {showResult && idx === currentQuestion.correctAnswer && (
                <CheckCircle size={20} className="correct-icon" />
              )}
              {showResult && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && (
                <XCircle size={20} className="incorrect-icon" />
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <>
                <CheckCircle size={24} />
                <span>¡Correcto! / Correct!</span>
              </>
            ) : (
              <>
                <XCircle size={24} />
                <span>
                  La respuesta correcta es: {currentQuestion.options[currentQuestion.correctAnswer]}
                  <br />
                  <em>The correct answer is: {currentQuestion.options[currentQuestion.correctAnswer]}</em>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="assessment-navigation">
        {showResult && (
          <button className="next-btn" onClick={handleNext}>
            <span>{isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}</span>
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
