import { useState, useEffect } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { isFirebaseConfigured } from '../utils/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isDemo: boolean
}

const DEMO_UID = 'demo-teacher'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isDemo: false,
  })

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // No Firebase – auto-enter demo mode
      setState({ user: null, loading: false, error: null, isDemo: true })
      return
    }

    const auth = getAuth()
    const unsub = onAuthStateChanged(
      auth,
      user => setState({ user, loading: false, error: null, isDemo: false }),
      err => setState({ user: null, loading: false, error: err.message, isDemo: false }),
    )
    return unsub
  }, [])

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) return
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    try {
      setState(s => ({ ...s, error: null }))
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setState(s => ({ ...s, error: err.message }))
    }
  }

  const enterDemoMode = () => {
    setState({ user: null, loading: false, error: null, isDemo: true })
  }

  const signOutUser = async () => {
    if (state.isDemo) {
      setState(s => ({ ...s, isDemo: false }))
      return
    }
    const auth = getAuth()
    await signOut(auth)
  }

  const teacherUid = state.isDemo ? DEMO_UID : state.user?.uid ?? null

  return { ...state, teacherUid, signInWithGoogle, enterDemoMode, signOutUser }
}
