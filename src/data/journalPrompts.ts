/**
 * PVUSD ELD-aligned journal prompts for the Diario (SandboxJournal).
 * Each prompt targets one of 7 language functions and provides three
 * scaffolding tiers: Emerging, Expanding, and Bridging.
 */
import type { LanguageFunction } from '../types/teacher'

// ── Types ────────────────────────────────────────────────────────────────────

export type ELDTier = 'emerging' | 'expanding' | 'bridging'

export interface EmergingLevel {
  sentenceFrame: string
  wordBank: string[]
  exampleSentence: string
}

export interface ExpandingLevel {
  sentenceFrame: string
  guideQuestion: string
  guideQuestionEs: string
}

export interface BridgingLevel {
  prompt: string
  promptEs: string
  sentenceStarter?: string
}

export interface JournalPrompt {
  id: string
  languageFunction: LanguageFunction
  topic: string
  topicEs: string
  contentArea: string
  levels: {
    emerging: EmergingLevel
    expanding: ExpandingLevel
    bridging: BridgingLevel
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map numeric student level to an ELD tier across the full progression.
 *  We align broadly with CAASPP-style achievement bands:
 *  - Levels 1–20: students are mostly in "Standard Not Met / Nearly Met" → Emerging
 *  - Levels 21–30: moving toward "Standard Met" → Expanding
 *  - Levels 31–40: closer to "Standard Met / Exceeded" → Bridging
 */
export function getELDTier(numericLevel: number): ELDTier {
  if (numericLevel <= 20) return 'emerging'
  if (numericLevel <= 30) return 'expanding'
  return 'bridging'
}

/** Select a prompt for today using date-based rotation. */
export function getDailyPrompt(offset: number = 0): JournalPrompt {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  )
  const index = (dayOfYear + offset) % JOURNAL_PROMPTS.length
  return JOURNAL_PROMPTS[index]
}

/** Human-readable tier labels. */
export const ELD_TIER_LABELS: Record<ELDTier, { en: string; es: string }> = {
  emerging:  { en: 'Emerging',  es: 'Emergente' },
  expanding: { en: 'Expanding', es: 'En Expansión' },
  bridging:  { en: 'Bridging',  es: 'Avanzado' },
}

/** Language function labels in Spanish for the student UI. */
export const LF_LABELS_ES: Record<LanguageFunction, string> = {
  describe:    'Describir',
  retell:      'Recontar',
  compare:     'Comparar',
  explain:     'Explicar',
  opinion:     'Opinión',
  sequence:    'Secuencia',
  causeEffect: 'Causa y efecto',
}

// ── Prompt Data ──────────────────────────────────────────────────────────────

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  // ── DESCRIBE ───────────────────────────────────────────────────────────────
  {
    id: 'describe-family',
    languageFunction: 'describe',
    topic: 'My Family',
    topicEs: 'Mi Familia',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'My ___ is ___ and ___.',
        wordBank: ['mom', 'dad', 'brother', 'sister', 'tall', 'short', 'kind', 'funny', 'strong', 'nice'],
        exampleSentence: 'My mom is kind and funny.',
      },
      expanding: {
        sentenceFrame: 'My ___ is ___ and ___. I like when ___.',
        guideQuestion: 'What is your family member like? What do you like about them?',
        guideQuestionEs: '¿Cómo es tu familiar? ¿Qué te gusta de él/ella?',
      },
      bridging: {
        prompt: 'Describe someone in your family. What do they look like? What do they like to do?',
        promptEs: 'Describe a alguien de tu familia. ¿Cómo se ven? ¿Qué les gusta hacer?',
        sentenceStarter: 'In my family, ',
      },
    },
  },
  {
    id: 'describe-school',
    languageFunction: 'describe',
    topic: 'My School',
    topicEs: 'Mi Escuela',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'My school is ___ and ___.',
        wordBank: ['big', 'small', 'new', 'fun', 'clean', 'colorful', 'nice', 'quiet', 'busy', 'friendly'],
        exampleSentence: 'My school is big and friendly.',
      },
      expanding: {
        sentenceFrame: 'My school is ___. I like ___ because ___.',
        guideQuestion: 'What does your school look like? What is your favorite part?',
        guideQuestionEs: '¿Cómo es tu escuela? ¿Cuál es tu parte favorita?',
      },
      bridging: {
        prompt: 'Describe your school. What makes it special? What do you like most about it?',
        promptEs: 'Describe tu escuela. ¿Qué la hace especial? ¿Qué es lo que más te gusta?',
        sentenceStarter: 'My school is special because ',
      },
    },
  },

  // ── RETELL ─────────────────────────────────────────────────────────────────
  {
    id: 'retell-yesterday',
    languageFunction: 'retell',
    topic: 'My Day Yesterday',
    topicEs: 'Mi Día de Ayer',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'First, I ___. Then, I ___.',
        wordBank: ['went', 'ate', 'played', 'read', 'walked', 'talked', 'watched', 'helped', 'school', 'home'],
        exampleSentence: 'First, I went to school. Then, I played outside.',
      },
      expanding: {
        sentenceFrame: 'First, I ___. Then, I ___. Finally, I ___.',
        guideQuestion: 'What happened at the beginning, middle, and end of your day?',
        guideQuestionEs: '¿Qué pasó al principio, en el medio y al final de tu día?',
      },
      bridging: {
        prompt: 'Retell what happened yesterday from morning to night. Include details about how you felt.',
        promptEs: 'Cuenta lo que pasó ayer desde la mañana hasta la noche. Incluye detalles sobre cómo te sentiste.',
        sentenceStarter: 'Yesterday was ',
      },
    },
  },
  {
    id: 'retell-story',
    languageFunction: 'retell',
    topic: 'A Story I Know',
    topicEs: 'Un Cuento que Conozco',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'At the beginning, ___. At the end, ___.',
        wordBank: ['the character', 'went', 'found', 'happy', 'sad', 'helped', 'friend', 'home', 'lost', 'brave'],
        exampleSentence: 'At the beginning, the character was lost. At the end, he found his home.',
      },
      expanding: {
        sentenceFrame: 'At the beginning, ___. In the middle, ___. At the end, ___.',
        guideQuestion: 'What is the story about? What happened in the beginning, middle, and end?',
        guideQuestionEs: '¿De qué trata el cuento? ¿Qué pasó al principio, en el medio y al final?',
      },
      bridging: {
        prompt: 'Retell a story you know or read recently. Include the characters, problem, and solution.',
        promptEs: 'Vuelve a contar un cuento que conozcas o hayas leído. Incluye los personajes, el problema y la solución.',
        sentenceStarter: 'The story is about ',
      },
    },
  },

  // ── OPINION ────────────────────────────────────────────────────────────────
  {
    id: 'opinion-food',
    languageFunction: 'opinion',
    topic: 'My Favorite Food',
    topicEs: 'Mi Comida Favorita',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'I think ___ is the best because ___.',
        wordBank: ['pizza', 'tacos', 'chicken', 'rice', 'fruit', 'delicious', 'yummy', 'good', 'healthy', 'sweet'],
        exampleSentence: 'I think tacos are the best because they are delicious.',
      },
      expanding: {
        sentenceFrame: 'I think ___ is the best food because ___. Another reason is ___.',
        guideQuestion: 'What is your favorite food? Why do you like it? Give two reasons.',
        guideQuestionEs: '¿Cuál es tu comida favorita? ¿Por qué te gusta? Da dos razones.',
      },
      bridging: {
        prompt: 'What is your favorite food and why? Give your opinion with at least two reasons to support it.',
        promptEs: '¿Cuál es tu comida favorita y por qué? Da tu opinión con al menos dos razones.',
        sentenceStarter: 'In my opinion, ',
      },
    },
  },
  {
    id: 'opinion-subject',
    languageFunction: 'opinion',
    topic: 'My Favorite Subject',
    topicEs: 'Mi Materia Favorita',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'I like ___ because it is ___.',
        wordBank: ['math', 'reading', 'science', 'art', 'music', 'fun', 'interesting', 'easy', 'exciting', 'cool'],
        exampleSentence: 'I like art because it is fun.',
      },
      expanding: {
        sentenceFrame: 'I believe ___ is the best subject because ___.',
        guideQuestion: 'Which school subject do you enjoy most? What makes it your favorite?',
        guideQuestionEs: '¿Qué materia de la escuela disfrutas más? ¿Qué la hace tu favorita?',
      },
      bridging: {
        prompt: 'Which school subject is your favorite? Explain why you think it is the best and give examples.',
        promptEs: '¿Cuál materia es tu favorita? Explica por qué crees que es la mejor y da ejemplos.',
        sentenceStarter: 'I believe that ',
      },
    },
  },

  // ── EXPLAIN ────────────────────────────────────────────────────────────────
  {
    id: 'explain-weather',
    languageFunction: 'explain',
    topic: 'Why It Rains',
    topicEs: 'Por Qué Llueve',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: 'It rains because ___.',
        wordBank: ['clouds', 'water', 'sky', 'cold', 'drops', 'heavy', 'fall', 'wet', 'wind', 'gray'],
        exampleSentence: 'It rains because the clouds get heavy with water.',
      },
      expanding: {
        sentenceFrame: '___ happens because ___. This is important because ___.',
        guideQuestion: 'Why does it rain? What happens to the water in the clouds?',
        guideQuestionEs: '¿Por qué llueve? ¿Qué pasa con el agua en las nubes?',
      },
      bridging: {
        prompt: 'Explain why it rains. Use what you know about clouds and the water cycle.',
        promptEs: 'Explica por qué llueve. Usa lo que sabes sobre las nubes y el ciclo del agua.',
        sentenceStarter: 'Rain happens when ',
      },
    },
  },
  {
    id: 'explain-healthy',
    languageFunction: 'explain',
    topic: 'Why Exercise Is Important',
    topicEs: 'Por Qué Es Importante el Ejercicio',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: 'Exercise is important because ___.',
        wordBank: ['strong', 'healthy', 'happy', 'muscles', 'heart', 'energy', 'run', 'play', 'body', 'good'],
        exampleSentence: 'Exercise is important because it makes our body strong.',
      },
      expanding: {
        sentenceFrame: 'One reason exercise is important is because ___. It also helps ___.',
        guideQuestion: 'Why should we exercise? How does it help our body and mind?',
        guideQuestionEs: '¿Por qué debemos hacer ejercicio? ¿Cómo ayuda a nuestro cuerpo y mente?',
      },
      bridging: {
        prompt: 'Explain why exercise is important for kids. Give at least two reasons with details.',
        promptEs: 'Explica por qué el ejercicio es importante para los niños. Da al menos dos razones con detalles.',
        sentenceStarter: 'I know exercise is important because ',
      },
    },
  },

  // ── COMPARE ────────────────────────────────────────────────────────────────
  {
    id: 'compare-animals',
    languageFunction: 'compare',
    topic: 'Two Animals',
    topicEs: 'Dos Animales',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: 'A ___ is ___ but a ___ is ___.',
        wordBank: ['dog', 'cat', 'big', 'small', 'fast', 'slow', 'furry', 'loud', 'quiet', 'friendly'],
        exampleSentence: 'A dog is big but a cat is small.',
      },
      expanding: {
        sentenceFrame: '___ is similar to ___ because they both ___. But ___ is different because ___.',
        guideQuestion: 'Pick two animals. How are they the same? How are they different?',
        guideQuestionEs: 'Escoge dos animales. ¿En qué se parecen? ¿En qué son diferentes?',
      },
      bridging: {
        prompt: 'Compare two animals you know. Describe at least one similarity and one difference.',
        promptEs: 'Compara dos animales que conozcas. Describe al menos una semejanza y una diferencia.',
        sentenceStarter: 'Both ',
      },
    },
  },
  {
    id: 'compare-seasons',
    languageFunction: 'compare',
    topic: 'Two Seasons',
    topicEs: 'Dos Estaciones',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: '___ is ___ but ___ is ___.',
        wordBank: ['summer', 'winter', 'hot', 'cold', 'sunny', 'rainy', 'fun', 'long', 'short', 'windy'],
        exampleSentence: 'Summer is hot but winter is cold.',
      },
      expanding: {
        sentenceFrame: '___ is different from ___ because ___. They are similar because ___.',
        guideQuestion: 'Choose two seasons. What is different? What do they have in common?',
        guideQuestionEs: 'Escoge dos estaciones. ¿Qué es diferente? ¿Qué tienen en común?',
      },
      bridging: {
        prompt: 'Compare two seasons. Describe the weather, activities, and how each one makes you feel.',
        promptEs: 'Compara dos estaciones. Describe el clima, las actividades y cómo te hace sentir cada una.',
        sentenceStarter: 'When I compare ',
      },
    },
  },

  // ── SEQUENCE ───────────────────────────────────────────────────────────────
  {
    id: 'sequence-morning',
    languageFunction: 'sequence',
    topic: 'My Morning Routine',
    topicEs: 'Mi Rutina de la Mañana',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'First, I ___. Then, I ___.',
        wordBank: ['wake up', 'brush', 'eat', 'get dressed', 'walk', 'school', 'breakfast', 'teeth', 'backpack', 'ready'],
        exampleSentence: 'First, I wake up. Then, I eat breakfast.',
      },
      expanding: {
        sentenceFrame: 'First, I ___. Next, I ___. Then, I ___. Last, I ___.',
        guideQuestion: 'What do you do each morning from waking up to arriving at school?',
        guideQuestionEs: '¿Qué haces cada mañana desde que te levantas hasta llegar a la escuela?',
      },
      bridging: {
        prompt: 'Describe your morning routine step by step. Use sequence words like first, next, then, and finally.',
        promptEs: 'Describe tu rutina de la mañana paso a paso. Usa palabras de secuencia como primero, luego, después y finalmente.',
        sentenceStarter: 'Every morning, ',
      },
    },
  },
  {
    id: 'sequence-recipe',
    languageFunction: 'sequence',
    topic: 'How to Make a Sandwich',
    topicEs: 'Cómo Hacer un Sándwich',
    contentArea: 'ELA',
    levels: {
      emerging: {
        sentenceFrame: 'Step 1: ___. Step 2: ___.',
        wordBank: ['bread', 'cheese', 'meat', 'lettuce', 'put', 'add', 'cut', 'open', 'close', 'eat'],
        exampleSentence: 'Step 1: Get two pieces of bread. Step 2: Put cheese on the bread.',
      },
      expanding: {
        sentenceFrame: 'First, you ___. Next, you ___. Then, you ___. Finally, you ___.',
        guideQuestion: 'What are the steps to make a sandwich? Put them in order.',
        guideQuestionEs: '¿Cuáles son los pasos para hacer un sándwich? Ponlos en orden.',
      },
      bridging: {
        prompt: 'Write the steps to make your favorite sandwich or snack. Use clear sequence words so someone could follow your instructions.',
        promptEs: 'Escribe los pasos para hacer tu sándwich o snack favorito. Usa palabras de secuencia claras para que alguien pueda seguir tus instrucciones.',
        sentenceStarter: 'To make a sandwich, ',
      },
    },
  },

  // ── CAUSE & EFFECT ─────────────────────────────────────────────────────────
  {
    id: 'cause-rain',
    languageFunction: 'causeEffect',
    topic: 'When It Rains',
    topicEs: 'Cuando Llueve',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: 'Because it rains, ___.',
        wordBank: ['wet', 'puddles', 'umbrella', 'inside', 'cold', 'rainbow', 'plants', 'grow', 'happy', 'muddy'],
        exampleSentence: 'Because it rains, we see puddles on the ground.',
      },
      expanding: {
        sentenceFrame: 'When it rains, ___ happens. This is because ___.',
        guideQuestion: 'What happens when it rains? What are the causes and effects?',
        guideQuestionEs: '¿Qué pasa cuando llueve? ¿Cuáles son las causas y los efectos?',
      },
      bridging: {
        prompt: 'Describe what happens when it rains. Explain the cause and at least two effects you can observe.',
        promptEs: 'Describe lo que pasa cuando llueve. Explica la causa y al menos dos efectos que puedes observar.',
        sentenceStarter: 'When it rains, ',
      },
    },
  },
  {
    id: 'cause-sleep',
    languageFunction: 'causeEffect',
    topic: 'Not Getting Enough Sleep',
    topicEs: 'No Dormir lo Suficiente',
    contentArea: 'Science',
    levels: {
      emerging: {
        sentenceFrame: 'Because I did not sleep, I feel ___.',
        wordBank: ['tired', 'sleepy', 'grumpy', 'slow', 'hungry', 'weak', 'sad', 'yawn', 'rest', 'bed'],
        exampleSentence: 'Because I did not sleep, I feel tired and sleepy.',
      },
      expanding: {
        sentenceFrame: 'When I do not get enough sleep, ___. This causes ___.',
        guideQuestion: 'What happens to your body and mind when you do not sleep enough?',
        guideQuestionEs: '¿Qué le pasa a tu cuerpo y mente cuando no duermes lo suficiente?',
      },
      bridging: {
        prompt: 'Explain what happens when kids do not get enough sleep. What are the causes and effects on the body?',
        promptEs: 'Explica qué pasa cuando los niños no duermen lo suficiente. ¿Cuáles son las causas y efectos en el cuerpo?',
        sentenceStarter: 'Not getting enough sleep causes ',
      },
    },
  },
]
