import { Languages } from 'lucide-react'
import { ttsManager } from './ttsManager'
import '../student-ui.css'

interface Props {
  text: string
  id?: string
  label?: string
  compact?: boolean
}

export function SpanishAudioButton({
  text,
  id = 'es-audio',
  label = 'Play Spanish audio',
  compact = false,
}: Props) {
  return (
    <button
      type="button"
      className={`tts-es-btn ${compact ? 'compact' : ''}`.trim()}
      aria-label={label}
      onClick={() => ttsManager.speak(text, 'es-ES', id)}
    >
      <Languages size={compact ? 12 : 13} aria-hidden="true" />
      <span>ES Audio</span>
    </button>
  )
}

