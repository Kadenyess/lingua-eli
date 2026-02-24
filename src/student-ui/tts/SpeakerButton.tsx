import { Volume2 } from 'lucide-react'
import { ttsManager, type TtsLocale } from './ttsManager'
import { useTtsState } from './useTtsState'
import '../student-ui.css'

interface Props {
  text: string
  lang: TtsLocale
  label: string
  id?: string
  size?: 'sm' | 'md'
  className?: string
}

export function SpeakerButton({ text, lang, label, id = 'tts', size = 'sm', className = '' }: Props) {
  const { currentId } = useTtsState()
  const active = currentId === id
  return (
    <button
      type="button"
      className={`tts-icon-btn ${size} ${active ? 'is-speaking' : ''} ${className}`.trim()}
      aria-label={label}
      onClick={() => ttsManager.speak(text, lang, id)}
    >
      <Volume2 size={size === 'sm' ? 14 : 16} aria-hidden="true" />
    </button>
  )
}
