export interface StudentModeDefinition {
  id: string
  path: string
  title: string
  titleEs: string
  icon: string
  description: string
  descriptionEs: string
  explanation: string
  explanationEs: string
}

export const STUDENT_MODES: StudentModeDefinition[] = [
  {
    id: 'sentence-builder',
    path: '/modes/sentence-builder',
    title: 'Sentence Builder',
    titleEs: 'Constructor de Oraciones',
    icon: '🧩',
    description: 'Build one sentence with word blocks.',
    descriptionEs: 'Construye una oración con bloques de palabras.',
    explanation: 'Put words in order to make one complete sentence.',
    explanationEs: 'Pon las palabras en orden para hacer una oración completa.',
  },
  {
    id: 'grammar-detective',
    path: '/modes/grammar-detective',
    title: 'Grammar Detective',
    titleEs: 'Detective de Gramática',
    icon: '🕵️',
    description: 'Find the grammar clue in one sentence.',
    descriptionEs: 'Encuentra la pista gramatical en una oración.',
    explanation: 'Look carefully and choose the grammar clue.',
    explanationEs: 'Mira con cuidado y elige la pista gramatical.',
  },
  {
    id: 'logic-check',
    path: '/modes/logic-check',
    title: 'Logic Check',
    titleEs: 'Revisión de Lógica',
    icon: '✅',
    description: 'Pick the sentence that makes sense.',
    descriptionEs: 'Elige la oración que tiene sentido.',
    explanation: 'Choose the sentence that matches the picture or idea.',
    explanationEs: 'Elige la oración que coincide con la imagen o la idea.',
  },
  {
    id: 'sentence-expansion',
    path: '/modes/sentence-expansion',
    title: 'Sentence Expansion',
    titleEs: 'Expansión de Oraciones',
    icon: '➕',
    description: 'Add one detail to make a stronger sentence.',
    descriptionEs: 'Agrega un detalle para hacer una oración más fuerte.',
    explanation: 'Add one word or phrase to improve the sentence.',
    explanationEs: 'Agrega una palabra o frase para mejorar la oración.',
  },
  {
    id: 'story-builder',
    path: '/modes/story-builder',
    title: 'Interactive Story Builder',
    titleEs: 'Constructor Interactivo de Historias',
    icon: '📖',
    description: 'Build one part of a story at a time.',
    descriptionEs: 'Construye una parte de la historia a la vez.',
    explanation: 'Choose story parts to build one step of the story.',
    explanationEs: 'Elige partes de la historia para construir un paso.',
  },
  {
    id: 'peer-review',
    path: '/modes/peer-review',
    title: 'Peer Review',
    titleEs: 'Revisión entre Compañeros',
    icon: '🤝',
    description: 'Practice giving one kind fix.',
    descriptionEs: 'Practica dar una corrección amable.',
    explanation: 'Read one sentence and choose a kind helpful response.',
    explanationEs: 'Lee una oración y elige una respuesta amable y útil.',
  },
  {
    id: 'vocabulary-unlock',
    path: '/modes/vocabulary-unlock',
    title: 'Vocabulary Unlock',
    titleEs: 'Desbloqueo de Vocabulario',
    icon: '🔓',
    description: 'Practice words to unlock new blocks.',
    descriptionEs: 'Practica palabras para desbloquear nuevos bloques.',
    explanation: 'Use words correctly to unlock more practice words.',
    explanationEs: 'Usa palabras correctamente para desbloquear más práctica.',
  },
  {
    id: 'timed-practice',
    path: '/modes/timed-practice',
    title: 'Timed Practice',
    titleEs: 'Práctica con Tiempo',
    icon: '⏱️',
    description: 'Solve one task before time runs out.',
    descriptionEs: 'Resuelve una tarea antes de que se acabe el tiempo.',
    explanation: 'Work quickly and carefully on one short task.',
    explanationEs: 'Trabaja rápido y con cuidado en una tarea corta.',
  },
]
