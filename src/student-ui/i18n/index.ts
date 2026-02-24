import { en } from './en'
import { es } from './es'
import type { StudentDictionary, StudentLang } from './types'

export const studentDictionaries: Record<StudentLang, StudentDictionary> = { en, es }

export * from './types'
