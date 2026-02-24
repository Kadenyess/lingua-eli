import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { studentDictionaries } from './index'
import type { StudentDictionary, StudentLang } from './types'

interface StudentI18nContextValue {
  lang: StudentLang
  setLang: (lang: StudentLang) => void
  toggleLang: () => void
  dict: StudentDictionary
  ttsLocale: 'en-US' | 'es-ES'
}

const StudentI18nContext = createContext<StudentI18nContextValue | null>(null)
const STORAGE_KEY = 'studentUiLang'

export function StudentI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<StudentLang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'es' ? 'es' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value = useMemo<StudentI18nContextValue>(() => ({
    lang,
    setLang: (next) => setLangState(next),
    toggleLang: () => setLangState((prev) => (prev === 'en' ? 'es' : 'en')),
    dict: studentDictionaries[lang],
    ttsLocale: lang === 'es' ? 'es-ES' : 'en-US',
  }), [lang])

  return <StudentI18nContext.Provider value={value}>{children}</StudentI18nContext.Provider>
}

export function useStudentI18n() {
  const ctx = useContext(StudentI18nContext)
  if (!ctx) {
    throw new Error('useStudentI18n must be used within StudentI18nProvider')
  }
  return ctx
}
