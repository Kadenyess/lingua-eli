import { Pause, Play, Square, Volume2 } from 'lucide-react'
import { useStudentI18n } from '../i18n/useI18n'
import { ttsManager } from './ttsManager'
import { useTtsState } from './useTtsState'
import '../student-ui.css'

interface Props {
  items: string[]
  pageId: string
}

export function ReadPageControls({ items, pageId }: Props) {
  const { dict, ttsLocale } = useStudentI18n()
  const { speaking, paused } = useTtsState()

  const readPage = () => {
    ttsManager.stop()
    ttsManager.enqueueMany(items.filter(Boolean).map((text, idx) => ({
      id: `${pageId}-${idx}`,
      text,
      lang: ttsLocale,
    })))
  }

  return (
    <div className="tts-read-page-controls" role="group" aria-label={dict.tts.readPageAria}>
      <button type="button" className="student-btn secondary compact" onClick={readPage}>
        <Volume2 size={16} aria-hidden="true" />
        <span>{dict.common.readPage}</span>
      </button>
      <button type="button" className="tts-icon-btn md" aria-label={dict.tts.stopAria} onClick={() => ttsManager.stop()}>
        <Square size={14} aria-hidden="true" />
      </button>
      {paused ? (
        <button type="button" className="tts-icon-btn md" aria-label={dict.tts.resumeAria} onClick={() => ttsManager.resume()}>
          <Play size={14} aria-hidden="true" />
        </button>
      ) : (
        <button type="button" className="tts-icon-btn md" aria-label={dict.tts.pauseAria} onClick={() => ttsManager.pause()} disabled={!speaking}>
          <Pause size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
