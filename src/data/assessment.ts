/**
 * Initial Assessment Questions for Student Placement
 * Maps to levels 1-40 based on CAASPP-style achievement bands
 */

export interface AssessmentQuestion {
  id: string
  type: 'vocabulary' | 'sentence' | 'picture'
  question: string
  questionEs: string
  options: string[]
  correctAnswer: number
  levelRange: { min: number; max: number } // What level range this question targets
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Level 1-5: Pre-literacy / No literacy (CAASPP Level 1)
  {
    id: 'q1',
    type: 'picture',
    question: 'What is this?',
    questionEs: '¿Qué es esto?',
    options: ['cat', 'dog', 'house', 'book'],
    correctAnswer: 0,
    levelRange: { min: 1, max: 5 }
  },
  {
    id: 'q2',
    type: 'vocabulary',
    question: 'Which word means "hola" in English?',
    questionEs: '¿Qué palabra significa "hola" en inglés?',
    options: ['hello', 'goodbye', 'please', 'thank you'],
    correctAnswer: 0,
    levelRange: { min: 1, max: 5 }
  },
  {
    id: 'q3',
    type: 'vocabulary',
    question: 'What color is the sun?',
    questionEs: '¿De qué color es el sol?',
    options: ['blue', 'red', 'yellow', 'green'],
    correctAnswer: 2,
    levelRange: { min: 1, max: 5 }
  },
  
  // Level 6-10: Basic literacy (CAASPP Level 1-2)
  {
    id: 'q4',
    type: 'vocabulary',
    question: 'Which word means "feliz"?',
    questionEs: '¿Qué palabra significa "feliz"?',
    options: ['sad', 'happy', 'angry', 'tired'],
    correctAnswer: 1,
    levelRange: { min: 6, max: 10 }
  },
  {
    id: 'q5',
    type: 'sentence',
    question: 'Complete: "I ___ to school."',
    questionEs: 'Completa: "I ___ to school."',
    options: ['go', 'went', 'going', 'goes'],
    correctAnswer: 0,
    levelRange: { min: 6, max: 10 }
  },
  {
    id: 'q6',
    type: 'vocabulary',
    question: 'What do you use to write?',
    questionEs: '¿Qué usas para escribir?',
    options: ['book', 'pencil', 'table', 'chair'],
    correctAnswer: 1,
    levelRange: { min: 6, max: 10 }
  },
  
  // Level 11-15: Grade 3 early (CAASPP Level 2)
  {
    id: 'q7',
    type: 'sentence',
    question: 'Complete: "My ___ is kind and funny."',
    questionEs: 'Completa: "My ___ is kind and funny."',
    options: ['mom', 'house', 'book', 'school'],
    correctAnswer: 0,
    levelRange: { min: 11, max: 15 }
  },
  {
    id: 'q8',
    type: 'vocabulary',
    question: 'Which word means "maestro"?',
    questionEs: '¿Qué palabra significa "maestro"?',
    options: ['student', 'teacher', 'friend', 'family'],
    correctAnswer: 1,
    levelRange: { min: 11, max: 15 }
  },
  {
    id: 'q9',
    type: 'sentence',
    question: 'Complete: "First, I ___. Then, I ___."',
    questionEs: 'Completa: "First, I ___. Then, I ___."',
    options: ['wake up / eat breakfast', 'happy / sad', 'big / small', 'red / blue'],
    correctAnswer: 0,
    levelRange: { min: 11, max: 15 }
  },
  
  // Level 16-20: Grade 3 mid (CAASPP Level 2-3)
  {
    id: 'q10',
    type: 'sentence',
    question: 'Complete: "I think ___ is the best because ___."',
    questionEs: 'Completa: "I think ___ is the best because ___."',
    options: ['pizza / it is delicious', 'cat / dog', 'red / blue', 'big / small'],
    correctAnswer: 0,
    levelRange: { min: 16, max: 20 }
  },
  {
    id: 'q11',
    type: 'vocabulary',
    question: 'Which word means "describir"?',
    questionEs: '¿Qué palabra significa "describir"?',
    options: ['describe', 'compare', 'explain', 'retell'],
    correctAnswer: 0,
    levelRange: { min: 16, max: 20 }
  },
  {
    id: 'q12',
    type: 'sentence',
    question: 'Complete: "A dog is big but a cat is ___."',
    questionEs: 'Completa: "A dog is big but a cat is ___."',
    options: ['small', 'big', 'fast', 'slow'],
    correctAnswer: 0,
    levelRange: { min: 16, max: 20 }
  },
  
  // Level 21-25: Grade 4 early (CAASPP Level 3)
  {
    id: 'q13',
    type: 'vocabulary',
    question: 'Which word means "resumir"?',
    questionEs: '¿Qué palabra significa "resumir"?',
    options: ['summarize', 'describe', 'compare', 'explain'],
    correctAnswer: 0,
    levelRange: { min: 21, max: 25 }
  },
  {
    id: 'q14',
    type: 'sentence',
    question: 'Complete: "When it rains, ___ happens. This is because ___."',
    questionEs: 'Completa: "When it rains, ___ happens. This is because ___."',
    options: ['puddles / clouds get heavy', 'happy / sad', 'big / small', 'red / blue'],
    correctAnswer: 0,
    levelRange: { min: 21, max: 25 }
  },
  {
    id: 'q15',
    type: 'vocabulary',
    question: 'What does "evidence" mean?',
    questionEs: '¿Qué significa "evidence"?',
    options: ['proof', 'story', 'question', 'answer'],
    correctAnswer: 0,
    levelRange: { min: 21, max: 25 }
  },
  
  // Level 26-30: Grade 4 mid (CAASPP Level 3)
  {
    id: 'q16',
    type: 'sentence',
    question: 'Complete: "I believe ___ is the best subject because ___. Another reason is ___."',
    questionEs: 'Completa: "I believe ___ is the best subject because ___. Another reason is ___."',
    options: ['math / it is fun / I like numbers', 'cat / dog / bird', 'red / blue / green', 'big / small / medium'],
    correctAnswer: 0,
    levelRange: { min: 26, max: 30 }
  },
  {
    id: 'q17',
    type: 'vocabulary',
    question: 'What does "infer" mean?',
    questionEs: '¿Qué significa "infer"?',
    options: ['guess from clues', 'read', 'write', 'speak'],
    correctAnswer: 0,
    levelRange: { min: 26, max: 30 }
  },
  
  // Level 31-35: Grade 5 early (CAASPP Level 3-4)
  {
    id: 'q18',
    type: 'vocabulary',
    question: 'What does "analyze" mean?',
    questionEs: '¿Qué significa "analyze"?',
    options: ['study carefully', 'read', 'write', 'speak'],
    correctAnswer: 0,
    levelRange: { min: 31, max: 35 }
  },
  {
    id: 'q19',
    type: 'sentence',
    question: 'Complete: "When I compare two seasons, they are similar because ___. But they are different because ___."',
    questionEs: 'Completa: "When I compare two seasons, they are similar because ___. But they are different because ___."',
    options: ['both have weather / one is hot and one is cold', 'cat / dog', 'red / blue', 'big / small'],
    correctAnswer: 0,
    levelRange: { min: 31, max: 35 }
  },
  
  // Level 36-40: Grade 5 advanced (CAASPP Level 4)
  {
    id: 'q20',
    type: 'vocabulary',
    question: 'What does "justify" mean?',
    questionEs: '¿Qué significa "justify"?',
    options: ['give reasons for', 'read', 'write', 'speak'],
    correctAnswer: 0,
    levelRange: { min: 36, max: 40 }
  },
  {
    id: 'q21',
    type: 'sentence',
    question: 'Complete: "I know exercise is important because ___. It also helps ___."',
    questionEs: 'Completa: "I know exercise is important because ___. It also helps ___."',
    options: ['it makes us strong / our heart', 'cat / dog', 'red / blue', 'big / small'],
    correctAnswer: 0,
    levelRange: { min: 36, max: 40 }
  },
]

/**
 * Calculate starting level based on assessment score
 * Maps to CAASPP-style bands:
 * - 0-30% correct: Levels 1-10 (Pre-literacy / CAASPP Level 1)
 * - 31-50% correct: Levels 11-20 (Grade 3 early / CAASPP Level 2)
 * - 51-70% correct: Levels 21-30 (Grade 4 / CAASPP Level 3)
 * - 71-85% correct: Levels 31-35 (Grade 5 early / CAASPP Level 3-4)
 * - 86-100% correct: Levels 36-40 (Grade 5 advanced / CAASPP Level 4)
 */
export function calculateStartingLevel(score: number, totalQuestions: number): number {
  const percentage = (score / totalQuestions) * 100
  
  if (percentage <= 30) {
    // Pre-literacy: Levels 1-10
    // Map score to specific level within range
    const levelInRange = Math.max(1, Math.floor((score / totalQuestions) * 10) + 1)
    return Math.min(10, levelInRange)
  } else if (percentage <= 50) {
    // Grade 3 early: Levels 11-20
    const levelInRange = 11 + Math.floor(((score - (totalQuestions * 0.3)) / (totalQuestions * 0.2)) * 10)
    return Math.min(20, Math.max(11, levelInRange))
  } else if (percentage <= 70) {
    // Grade 4: Levels 21-30
    const levelInRange = 21 + Math.floor(((score - (totalQuestions * 0.5)) / (totalQuestions * 0.2)) * 10)
    return Math.min(30, Math.max(21, levelInRange))
  } else if (percentage <= 85) {
    // Grade 5 early: Levels 31-35
    const levelInRange = 31 + Math.floor(((score - (totalQuestions * 0.7)) / (totalQuestions * 0.15)) * 5)
    return Math.min(35, Math.max(31, levelInRange))
  } else {
    // Grade 5 advanced: Levels 36-40
    const levelInRange = 36 + Math.floor(((score - (totalQuestions * 0.85)) / (totalQuestions * 0.15)) * 5)
    return Math.min(40, Math.max(36, levelInRange))
  }
}
