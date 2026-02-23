import { useState } from 'react'
import { ArrowRight, CheckCircle, XCircle, Sparkles, Target } from 'lucide-react'
import { assessmentQuestions, calculateStartingLevel } from '../data/assessment'
import { soundEffects } from '../utils/soundEffects'
import './InitialAssessment.css'

interface InitialAssessmentProps {
  onComplete: (startingLevel: number, score: number, total: number) => void
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
