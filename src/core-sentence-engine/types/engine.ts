export type PosCategory = 'noun' | 'verb' | 'adjective' | 'article'
export type SlotType = 'article' | 'subject' | 'verb' | 'object' | 'descriptor' | 'linkingVerb'
export type ErrorTag = 'subject_verb_agreement' | 'missing_component' | 'word_order' | 'logic_mismatch'

export interface WordEntry {
  id: string
  text: string
  category: PosCategory
  role?: SlotType
  number?: 'singular' | 'plural'
  agreement?: 'singular' | 'plural'
  semanticTags?: string[]
}

export interface LevelTask {
  id: string
  prompt: string
  targetGrammarSkill: string
  displayFrame: string
  slots: SlotType[]
  wordBanks: Record<PosCategory, WordEntry[]>
  slotOptions: Partial<Record<SlotType, string[]>>
  logic: {
    subjectToVerb?: Record<string, string[]>
    subjectToDescriptor?: Record<string, string[]>
    verbToObject?: Record<string, string[]>
  }
  correctExamples: string[]
}

export interface LevelDefinition {
  level: 1 | 2 | 3 | 4 | 5
  title: string
  vocabularyFocus: string[]
  targetGrammarSkill: string
  tasks: LevelTask[]
}

export interface ValidationResult {
  isCorrect: boolean
  errorType: ErrorTag | null
  normalizedSentence: string
  feedback: {
    title: string
    message: string
    hint: string
  }
}

export interface AttemptRecord {
  studentId: string
  level: number
  taskId: string
  selectedWordIds: string[]
  normalizedSentence: string
  isCorrect: boolean
  errorType: ErrorTag | null
  createdAt: string
}
