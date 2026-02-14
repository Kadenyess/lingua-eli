import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, CheckCircle, AlertCircle, BookOpen, PenLine } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'
import './SandboxJournal.css'

interface SandboxJournalProps {
  onBack: () => void
  onAddPoints: (points: number, message: string) => void
}

interface AIFeedback {
  corrected: string
  suggestions: string[]
  encouragement: string
  score: number
  grammarExplanations: {
    english: string
    spanish: string
  }
}

export function SandboxJournal({ onBack, onAddPoints }: SandboxJournalProps) {
  const [sentence1, setSentence1] = useState('')
  const [sentence2, setSentence2] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!sentence1.trim() || !sentence2.trim()) {
      setError('Escribe 2 oraciones para continuar')
      return
    }

    soundEffects.playClick()
    setIsLoading(true)
    setError('')
    setFeedback(null)

    // Get API key from environment or use demo mode
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || ''

    try {
      if (!apiKey) {
        // Demo mode - simulate AI feedback without API
        setTimeout(() => {
          const demoFeedback: AIFeedback = generateDemoFeedback(sentence1, sentence2)
          setFeedback(demoFeedback)
          onAddPoints(15, '¡Diario completado!')
          soundEffects.playSuccess()
          setIsLoading(false)
        }, 1500)
        return
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a friendly English teacher for Spanish-speaking children. Review their 2-sentence journal entry and provide gentle, encouraging feedback.
              
              IMPORTANT: Rewrite their sentences to be grammatically correct AND natural-sounding English. Don't just fix punctuation - improve word choice, verb tenses, and expressions.
              
              Examples of improvements:
              - "I eated a sandwhich at morning time" → "I ate a sandwich for breakfast"
              - "I have 10 years old" → "I am 10 years old"
              - "I go to the house" → "I went home" or "I am going home"
              - "I like play soccer" → "I like playing soccer" or "I like to play soccer"
              
              Respond in this JSON format:
              {
                "corrected": "The improved, natural-sounding version of their 2 sentences",
                "suggestions": ["1-2 specific tips to improve, phrased positively"],
                "encouragement": "A warm, encouraging message in Spanish",
                "score": number from 1-100 based on effort and correctness,
                "grammarExplanations": {
                  "english": "Clear explanation in English about what makes the corrected sentences grammatically correct and why the changes were needed. Explain specific grammar rules like verb tenses, prepositions, word choice, etc.",
                  "spanish": "Clear explanation in Spanish about what makes the corrected sentences grammatically correct and why the changes were needed. Explain specific grammar rules like verb tenses, prepositions, word choice, etc."
                }
              }
              
              Keep suggestions simple and age-appropriate. Be encouraging! Provide clear grammar explanations that help the child understand the rules. Focus on making the sentences sound natural to native English speakers.`
            },
            {
              role: 'user',
              content: `Here are my 2 sentences:\n1. ${sentence1}\n2. ${sentence2}`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      
      // Parse JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedFeedback: AIFeedback = JSON.parse(jsonMatch[0])
        setFeedback(parsedFeedback)
        onAddPoints(Math.floor(parsedFeedback.score / 10), '¡Diario completado!')
        soundEffects.playSuccess()
      }
    } catch (err) {
      // Fallback to demo feedback
      const demoFeedback: AIFeedback = generateDemoFeedback(sentence1, sentence2)
      setFeedback(demoFeedback)
      onAddPoints(10, '¡Intentaste escribir en inglés!')
      soundEffects.playSuccess()
    } finally {
      setIsLoading(false)
    }
  }

  // Demo feedback generator when API is not available
  const generateDemoFeedback = (s1: string, s2: string): AIFeedback => {
    let score = 70
    const suggestions: string[] = []
    let grammarExplanationEnglish = ''
    let grammarExplanationSpanish = ''
    
    // Common error patterns and corrections
    const commonErrors = [
      { pattern: /\beated\b/g, correction: 'ate', explanation: { english: '"Eat" is an irregular verb. The past tense is "ate", not "eated".', spanish: '"Eat" es un verbo irregular. El pasado es "ate", no "eated".' } },
      { pattern: /\bgo(ed)?\b/g, correction: 'went', explanation: { english: '"Go" is an irregular verb. The past tense is "went", not "goed".', spanish: '"Go" es un verbo irregular. El pasado es "went", no "goed".' } },
      { pattern: /\bat morning time\b/gi, correction: 'in the morning', explanation: { english: 'We say "in the morning" or "for breakfast" instead of "at morning time".', spanish: 'Decimos "in the morning" o "for breakfast" en lugar de "at morning time".' } },
      { pattern: /\bat night time\b/gi, correction: 'at night', explanation: { english: 'We say "at night" instead of "at night time".', spanish: 'Decimos "at night" en lugar de "at night time".' } },
      { pattern: /\bsandwhich\b/gi, correction: 'sandwich', explanation: { english: 'The correct spelling is "sandwich".', spanish: 'La ortografía correcta es "sandwich".' } },
      { pattern: /\bI have (\d+) years old\b/gi, correction: 'I am $1 years old', explanation: { english: 'In English, we say "I am [age] years old" not "I have [age] years old".', spanish: 'En inglés, decimos "I am [edad] years old" no "I have [edad] years old".' } },
      { pattern: /\blike play\b/gi, correction: 'like playing', explanation: { english: 'After "like", we use the gerund form (-ing) or "to + verb". "Like playing" or "like to play".', spanish: 'Después de "like", usamos la forma gerundio (-ing) o "to + verbo". "Like playing" o "like to play".' } },
      { pattern: /\bgo to the house\b/gi, correction: 'go home', explanation: { english: 'We say "go home" not "go to the house" when referring to our own home.', spanish: 'Decimos "go home" no "go to the house" cuando nos referimos a nuestra propia casa.' } },
      { pattern: /\bvery happy\b/gi, correction: 'very happy', explanation: { english: '"Very happy" is correct, but you could also say "really happy" or "excited".', spanish: '"Very happy" es correcto, pero también puedes decir "really happy" o "excited".' } },
      { pattern: /\bplay the (soccer|basketball|tennis|football|baseball)\b/gi, correction: 'play $1', explanation: { english: 'For most sports, we say "play soccer" not "play the soccer". Exception: "play the piano/guitar".', spanish: 'Para la mayoría de deportes, decimos "play soccer" no "play the soccer". Excepción: "play the piano/guitar".' } }
    ]
    
    // Function to correct a single sentence
    const correctSentence = (sentence: string) => {
      let corrected = sentence.trim()
      let hasCapitalStart = /^[A-Z]/.test(corrected)
      let hasPeriodEnd = /[.!?]$/.test(corrected)
      let sentenceCorrections = 0
      
      // Apply common error corrections
      commonErrors.forEach(error => {
        if (error.pattern.test(corrected)) {
          corrected = corrected.replace(error.pattern, error.correction)
          sentenceCorrections++
        }
      })
      
      // Fix capitalization
      if (!hasCapitalStart && corrected.length > 0) {
        corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1)
        sentenceCorrections++
      }
      
      // Fix punctuation
      if (!hasPeriodEnd && corrected.length > 0) {
        corrected = corrected + '.'
        sentenceCorrections++
      }
      
      return { corrected, corrections: sentenceCorrections }
    }
    
    // Process both sentences individually
    const sentence1Result = correctSentence(s1)
    const sentence2Result = correctSentence(s2)
    
    const totalCorrections = sentence1Result.corrections + sentence2Result.corrections
    
    // Build explanations based on corrections made
    if (totalCorrections > 0) {
      // Check for specific errors in original sentences to provide targeted explanations
      const originalText = `${s1} ${s2}`
      
      if (/\beated\b/gi.test(originalText)) {
        grammarExplanationEnglish = '"Eat" is an irregular verb. The past tense is "ate", not "eated".'
        grammarExplanationSpanish = '"Eat" es un verbo irregular. El pasado es "ate", no "eated".'
        suggestions.push('¡Buena intento! Recuerda que "eat" en pasado es "ate".')
      } else if (/\bat morning time\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'We say "in the morning" or "for breakfast" instead of "at morning time".'
        grammarExplanationSpanish = 'Decimos "in the morning" o "for breakfast" en lugar de "at morning time".'
        suggestions.push('¡Buena intento! En inglés decimos "in the morning".')
      } else if (/\bI have (\d+) years old\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'In English, we say "I am [age] years old" not "I have [age] years old".'
        grammarExplanationSpanish = 'En inglés, decimos "I am [edad] years old" no "I have [edad] years old".'
        suggestions.push('¡Buena intento! Para decir la edad usamos "I am" no "I have".')
      } else if (/\blike play\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'After "like", we use the gerund form (-ing) or "to + verb". "Like playing" or "like to play".'
        grammarExplanationSpanish = 'Después de "like", usamos la forma gerundio (-ing) o "to + verbo". "Like playing" o "like to play".'
        suggestions.push('¡Buena intento! Después de "like" usa "playing" o "to play".')
      } else {
        grammarExplanationEnglish = 'Great job on trying to express yourself! I\'ve helped make your sentences more natural-sounding by fixing common grammar patterns.'
        grammarExplanationSpanish = '¡Buen trabajo al intentar expresarte! He ayudado a hacer tus oraciones más naturales corrigiendo patrones gramaticales comunes.'
        suggestions.push('¡Sigue así! Cada vez te irá mejor.')
      }
      
      score = Math.max(60, 85 - (totalCorrections * 5))
    } else {
      // No corrections needed
      suggestions.push('¡Excelente trabajo! Tus oraciones son claras y correctas.')
      score = 95
      grammarExplanationEnglish = 'Perfect! Your sentences follow the basic rules of capitalization, punctuation, and grammar. Keep up the great work!'
      grammarExplanationSpanish = '¡Perfecto! Tus oraciones siguen las reglas básicas de mayúsculas, puntuación y gramática. ¡Sigue así!'
    }
    
    suggestions.push('Sigue practicando todos los días.')
    
    // Combine corrected sentences properly
    const correctedText = sentence1Result.corrected && sentence2Result.corrected 
      ? `${sentence1Result.corrected} ${sentence2Result.corrected}`
      : sentence1Result.corrected || sentence2Result.corrected || ''
    
    return {
      corrected: correctedText,
      suggestions,
      encouragement: score >= 80 
        ? '¡Increíble trabajo! Tu inglés está mejorando mucho. 🌟'
        : '¡Muy bien! Cada práctica te hace mejor. 💪',
      score,
      grammarExplanations: {
        english: grammarExplanationEnglish,
        spanish: grammarExplanationSpanish
      }
    }
  }

  const handleReset = () => {
    soundEffects.playClick()
    setSentence1('')
    setSentence2('')
    setFeedback(null)
    setError('')
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟'
    if (score >= 75) return '⭐'
    if (score >= 60) return '👍'
    return '💪'
  }

  return (
    <div className="sandbox-journal">
      <div className="journal-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
          <span>Volver</span>
        </button>
        <div className="journal-title">
          <BookOpen size={28} />
          <h2>Mi Diario de Inglés</h2>
        </div>
      </div>

      <div className="journal-instructions">
        <PenLine size={20} />
        <p>Escribe 2 oraciones sobre tu día. ¡La IA te ayudará a mejorar!</p>
      </div>

      <div className="journal-inputs">
        <div className="input-group">
          <label>Oración 1:</label>
          <textarea
            value={sentence1}
            onChange={(e) => setSentence1(e.target.value)}
            placeholder="Escribe tu primera oración en inglés..."
            rows={2}
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label>Oración 2:</label>
          <textarea
            value={sentence2}
            onChange={(e) => setSentence2(e.target.value)}
            placeholder="Escribe tu segunda oración en inglés..."
            rows={2}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="journal-actions">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Sparkles size={20} className="spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Enviar a la IA</span>
            </>
          )}
        </button>

        <button 
          className="reset-btn"
          onClick={handleReset}
          disabled={isLoading}
        >
          Escribir otra vez
        </button>
      </div>

      {feedback && (
        <div className="feedback-card">
          <div className="feedback-header">
            <CheckCircle size={24} className="feedback-icon" />
            <h3>¡Retroalimentación de la IA! {getScoreEmoji(feedback.score)}</h3>
          </div>

          <div className="corrected-text">
            <label>Versión mejorada:</label>
            <p>{feedback.corrected}</p>
          </div>

          <div className="suggestions">
            <label>Consejos para mejorar:</label>
            <ul>
              {feedback.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="grammar-explanations">
            <div className="explanation-section">
              <label>🇬🇧 English Explanation:</label>
              <p>{feedback.grammarExplanations.english}</p>
            </div>
            
            <div className="explanation-section">
              <label>🇪🇸 Explicación en Español:</label>
              <p>{feedback.grammarExplanations.spanish}</p>
            </div>
          </div>

          <div className="encouragement">
            <Sparkles size={18} />
            <p>{feedback.encouragement}</p>
          </div>

          <div className="score-badge">
            Puntuación: {feedback.score}/100
          </div>
        </div>
      )}
    </div>
  )
}
