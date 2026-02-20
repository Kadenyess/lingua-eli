// Student progress tracking utility for PVUSD curriculum alignment

export interface StudentProgress {
  id: string
  name: string
  currentLevel: number
  vocabularyLevel: number
  readingLevel: number
  totalPoints: number
  streakDays: number
  lastActivity: Date
}

export interface PVUSDCurriculum {
  level: number
  vocabularyWords: string[]
  readingPassages: string[]
  grammarConcepts: string[]
  mathConcepts: string[]
}

// PVUSD curriculum mapping (simplified for demo)
export const pvusdCurriculum: PVUSDCurriculum[] = [
  {
    level: 1,
    vocabularyWords: ['hello', 'goodbye', 'thank you', 'please', 'yes', 'no', 'help', 'school', 'friend', 'family'],
    readingPassages: ['I see a cat.', 'The sun is yellow.', 'My name is Tom.', 'I like apples.'],
    grammarConcepts: ['present tense', 'articles', 'prepositions'],
    mathConcepts: []
  },
  {
    level: 2,
    vocabularyWords: ['big', 'small', 'happy', 'sad', 'run', 'walk', 'eat', 'drink', 'sleep'],
    readingPassages: ['Today is Monday.', 'I have two brothers.', 'We go to school.', 'The dog is playing.'],
    grammarConcepts: ['past tense', 'adjectives', 'questions'],
    mathConcepts: ['counting 1-10', 'addition']
  },
  {
    level: 3,
    vocabularyWords: ['beautiful', 'ugly', 'fast', 'slow', 'jump', 'swim', 'read', 'write'],
    readingPassages: ['Yesterday I went to the park.', 'She is reading a book.', 'They are playing soccer.', 'The weather is nice.'],
    grammarConcepts: ['future tense', 'comparatives', 'conjunctions'],
    mathConcepts: ['subtraction', 'shapes']
  },
  {
    level: 4,
    vocabularyWords: ['delicious', 'terrible', 'important', 'different', 'same', 'change', 'learn', 'teach'],
    readingPassages: ['Tomorrow is Friday.', 'I will visit my grandmother.', 'The cat is sleeping.', 'We are learning English.'],
    grammarConcepts: ['perfect tense', 'passive voice', 'reported speech'],
    mathConcepts: ['multiplication', 'time']
  },
  {
    level: 5,
    vocabularyWords: ['exciting', 'boring', 'difficult', 'easy', 'practice', 'study', 'test', 'grade'],
    readingPassages: ['In the summer we swim.', 'My birthday is in June.', 'The birds are singing.', 'I love learning.'],
    grammarConcepts: ['conditionals', 'phrasal verbs', 'idioms'],
    mathConcepts: ['division', 'measurement']
  }
]

// Get student's appropriate level based on their progress
export function getStudentLevel(progress: StudentProgress): number {
  // Calculate overall mastery percentage
  const vocabularyMastery = progress.vocabularyLevel / 5 * 100 // 5 levels max
  const readingMastery = progress.readingLevel / 5 * 100
  const overallMastery = (vocabularyMastery + readingMastery) / 2
  
  // Determine appropriate level
  if (overallMastery >= 90) return 5
  if (overallMastery >= 70) return 4
  if (overallMastery >= 50) return 3
  if (overallMastery >= 30) return 2
  if (overallMastery >= 10) return 1
  
  return 1 // Default to level 1
}

// Check if student has mastered specific content
export function hasMasteredContent(progress: StudentProgress, content: string): boolean {
  const level = pvusdCurriculum.find(l => l.level === progress.currentLevel)
  if (!level) return false
  
  return [
    ...level.vocabularyWords,
    ...level.readingPassages,
    ...level.grammarConcepts,
    ...level.mathConcepts
  ].includes(content.toLowerCase())
}

// Get recommended content for student's current level
export function getRecommendedContent(progress: StudentProgress): {
  vocabularyWords: string[]
  readingPassages: string[]
  grammarConcepts: string[]
} {
  const level = pvusdCurriculum.find(l => l.level === progress.currentLevel)
  if (!level) {
    return {
      vocabularyWords: ['hello', 'goodbye'],
      readingPassages: ['I see a cat.'],
      grammarConcepts: ['present tense']
    }
  }
  
  return {
    vocabularyWords: level.vocabularyWords.slice(0, 5), // Show 5 words at a time
    readingPassages: level.readingPassages.slice(0, 2), // Show 2 passages at a time
    grammarConcepts: level.grammarConcepts.slice(0, 3) // Show 3 concepts at a time
  }
}

// Save student progress to localStorage
export function saveStudentProgress(progress: StudentProgress): void {
  localStorage.setItem('studentProgress', JSON.stringify(progress))
}

// Load student progress from localStorage
export function loadStudentProgress(): StudentProgress | null {
  const saved = localStorage.getItem('studentProgress')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      localStorage.removeItem('studentProgress')
      return null
    }
  }
  return null
}

// Initialize or update student progress
export function initializeOrUpdateStudentProgress(studentId: string, studentName: string): StudentProgress {
  const existing = loadStudentProgress()
  
  if (existing && existing.id === studentId) {
    // Update existing student
    return existing
  } else {
    // Create new student record
    const newProgress: StudentProgress = {
      id: studentId,
      name: studentName,
      currentLevel: getStudentLevel(existing || { id: 'default', name: 'Student', currentLevel: 1, vocabularyLevel: 1, readingLevel: 1, totalPoints: 0, streakDays: 1, lastActivity: new Date() }),
      vocabularyLevel: 1,
      readingLevel: 1,
      totalPoints: 0,
      streakDays: 1,
      lastActivity: new Date()
    }
    
    saveStudentProgress(newProgress)
    return newProgress
  }
}
