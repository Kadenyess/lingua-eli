/**
 * Seed activities for Lingua ELI – 3rd grade ELD-aligned.
 * Each activity tags a languageFunction, sentenceFrame, and contentArea
 * so teachers can see alignment with their PVUSD core curriculum units.
 *
 * To seed these into Firestore, call seedActivitiesToFirestore() from the
 * browser console (one-time setup).
 */
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import type { Activity } from '../types/teacher'

export const SEED_ACTIVITIES: Omit<Activity, 'id'>[] = [
  // ── DESCRIBE ─────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'vocabulary',
    languageFunction: 'describe',
    sentenceFrame: 'The ___ is ___ and ___.',
    contentArea: 'ELA',
    prompt: 'Choose a character from our story. Describe them using at least two adjectives.',
    difficulty: 1,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'describe',
    sentenceFrame: 'I notice ___ because ___.',
    contentArea: 'Science',
    prompt: 'Look at the plant diagram. Write two sentences describing what you observe.',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'describe',
    sentenceFrame: 'This ___ has ___. It also has ___.',
    contentArea: 'Math',
    prompt: 'Describe the shape in front of you. Name its sides and angles.',
    difficulty: 1,
  },

  // ── RETELL ───────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'reading',
    languageFunction: 'retell',
    sentenceFrame: 'First, ___. Then, ___. Finally, ___.',
    contentArea: 'ELA',
    prompt: 'Retell the story beginning, middle, and end using the sentence frame.',
    difficulty: 1,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'retell',
    sentenceFrame: 'At the beginning, ___. In the middle, ___. At the end, ___.',
    contentArea: 'ELA',
    prompt: 'Write a short retell of the story we read today.',
    difficulty: 2,
  },

  // ── SEQUENCE ─────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'sequence',
    sentenceFrame: 'First, ___. Next, ___. Then, ___. Last, ___.',
    contentArea: 'Science',
    prompt: 'Explain the steps of the water cycle in order using the sequence words.',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'sequence',
    sentenceFrame: 'Step 1: ___. Step 2: ___. Step 3: ___.',
    contentArea: 'Math',
    prompt: 'Write the steps you used to solve the word problem.',
    difficulty: 2,
  },

  // ── OPINION ──────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'opinion',
    sentenceFrame: 'I think ___ because ___.',
    contentArea: 'ELA',
    prompt: 'What was the most important event in the story? Give your opinion and one reason.',
    difficulty: 1,
  },
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'opinion',
    sentenceFrame: 'In my opinion, ___ because ___ and ___.',
    contentArea: 'Social Studies',
    prompt: 'Which community helper is most important? Share your opinion with two reasons.',
    difficulty: 3,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'opinion',
    sentenceFrame: 'I believe ___ is the best ___ because ___.',
    contentArea: 'ELA',
    prompt: 'Which book from our reading unit is your favorite? Write your opinion.',
    difficulty: 2,
  },

  // ── EXPLAIN ──────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'reading',
    languageFunction: 'explain',
    sentenceFrame: '___ happens because ___.',
    contentArea: 'Science',
    prompt: 'Why do leaves change color in autumn? Explain using evidence from the text.',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'explain',
    sentenceFrame: 'One reason ___ is because ___.',
    contentArea: 'Math',
    prompt: 'Explain how you solved the word problem step by step. Use a number sentence.',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'explain',
    sentenceFrame: 'I know ___ because ___.',
    contentArea: 'Science',
    prompt: 'Explain why animals need food, water, and shelter. Give one example.',
    difficulty: 1,
  },

  // ── COMPARE ──────────────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'reading',
    languageFunction: 'compare',
    sentenceFrame: '___ is similar to ___ because they both ___.',
    contentArea: 'ELA',
    prompt: 'Compare the two main characters. How are they alike? How are they different?',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'compare',
    sentenceFrame: '___ is different from ___ because ___.',
    contentArea: 'Social Studies',
    prompt: 'Compare life in a city and life in the country. Give one similarity and one difference.',
    difficulty: 3,
  },
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'compare',
    sentenceFrame: 'Both ___ and ___ ___. However, ___ while ___.',
    contentArea: 'Science',
    prompt: 'Compare two animals we studied. What do they have in common? What is different?',
    difficulty: 3,
  },

  // ── CAUSE & EFFECT ───────────────────────────────────────────────────────
  {
    grade: 3,
    skill: 'reading',
    languageFunction: 'causeEffect',
    sentenceFrame: 'Because ___, ___.',
    contentArea: 'ELA',
    prompt: 'What happened because of the character\'s choice? Explain the cause and effect.',
    difficulty: 2,
  },
  {
    grade: 3,
    skill: 'speaking',
    languageFunction: 'causeEffect',
    sentenceFrame: '___ caused ___ to happen.',
    contentArea: 'Social Studies',
    prompt: 'What are two effects of not recycling in our community?',
    difficulty: 3,
  },
  {
    grade: 3,
    skill: 'writing',
    languageFunction: 'causeEffect',
    sentenceFrame: 'When ___, ___ happens.',
    contentArea: 'Science',
    prompt: 'Write about one cause and one effect from the weather unit.',
    difficulty: 2,
  },
]

/** One-time utility: seeds SEED_ACTIVITIES to Firestore. Run from console. */
export async function seedActivitiesToFirestore(): Promise<void> {
  console.log(`Seeding ${SEED_ACTIVITIES.length} activities…`)
  for (const activity of SEED_ACTIVITIES) {
    await addDoc(collection(db, 'activities'), activity)
  }
  console.log('Done seeding activities.')
}
