import { useEffect, useState } from 'react'
import { ttsManager } from './ttsManager'

export function useTtsState() {
  const [state, setState] = useState({ speaking: false, paused: false, currentId: null as string | null })
  useEffect(() => {
    const unsubscribe = ttsManager.subscribe(setState)
    return () => {
      unsubscribe()
    }
  }, [])
  return state
}
