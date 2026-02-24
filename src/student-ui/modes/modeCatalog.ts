export interface StudentModeDefinition {
  id: string
  path: string
  title: string
  icon: string
  description: string
  explanation: string
}

export const STUDENT_MODES: StudentModeDefinition[] = [
  {
    id: 'sentence-builder',
    path: '/modes/sentence-builder',
    title: 'Sentence Builder',
    icon: '🧩',
    description: 'Build one sentence with word blocks.',
    explanation: 'Put words in order to make one complete sentence.',
  },
  {
    id: 'grammar-detective',
    path: '/modes/grammar-detective',
    title: 'Grammar Detective',
    icon: '🕵️',
    description: 'Find the grammar clue in one sentence.',
    explanation: 'Look carefully and choose the grammar clue.',
  },
  {
    id: 'logic-check',
    path: '/modes/logic-check',
    title: 'Logic Check',
    icon: '✅',
    description: 'Pick the sentence that makes sense.',
    explanation: 'Choose the sentence that matches the picture or idea.',
  },
  {
    id: 'sentence-expansion',
    path: '/modes/sentence-expansion',
    title: 'Sentence Expansion',
    icon: '➕',
    description: 'Add one detail to make a stronger sentence.',
    explanation: 'Add one word or phrase to improve the sentence.',
  },
  {
    id: 'story-builder',
    path: '/modes/story-builder',
    title: 'Interactive Story Builder',
    icon: '📖',
    description: 'Build one part of a story at a time.',
    explanation: 'Choose story parts to build one step of the story.',
  },
  {
    id: 'peer-review',
    path: '/modes/peer-review',
    title: 'Peer Review',
    icon: '🤝',
    description: 'Practice giving one kind fix.',
    explanation: 'Read one sentence and choose a kind helpful response.',
  },
  {
    id: 'vocabulary-unlock',
    path: '/modes/vocabulary-unlock',
    title: 'Vocabulary Unlock',
    icon: '🔓',
    description: 'Practice words to unlock new blocks.',
    explanation: 'Use words correctly to unlock more practice words.',
  },
  {
    id: 'timed-practice',
    path: '/modes/timed-practice',
    title: 'Timed Practice',
    icon: '⏱️',
    description: 'Solve one task before time runs out.',
    explanation: 'Work quickly and carefully on one short task.',
  },
]
