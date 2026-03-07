import type {
  CurriculumErrorType,
  CurriculumLevelQuestion,
  CurriculumModuleId,
  CurriculumQuestionRole,
  LiteracyStageId,
} from './types'

interface LocalizedText {
  en: string
  es: string
}

interface Lexeme {
  en: string
  es: string
}

interface SentenceLexeme extends Lexeme {
  singular: boolean
  semantic: 'animal' | 'person' | 'school_object' | 'food' | 'place' | 'activity'
}

interface VerbLexeme extends Lexeme {
  present3s: string
  presentPlural: string
  past: string
  semantic: 'movement' | 'school' | 'play' | 'carry' | 'consume' | 'state'
}

interface BuiltQuestionContent {
  domain: CurriculumLevelQuestion['domain']
  prompt: LocalizedText
  choices: CurriculumLevelQuestion['choices']
  rationale: LocalizedText
}

const subjects: SentenceLexeme[] = [
  { en: 'dog', es: 'perro', singular: true, semantic: 'animal' },
  { en: 'cat', es: 'gato', singular: true, semantic: 'animal' },
  { en: 'bird', es: 'pájaro', singular: true, semantic: 'animal' },
  { en: 'girl', es: 'niña', singular: true, semantic: 'person' },
  { en: 'boy', es: 'niño', singular: true, semantic: 'person' },
  { en: 'teacher', es: 'maestra', singular: true, semantic: 'person' },
  { en: 'students', es: 'estudiantes', singular: false, semantic: 'person' },
]

const objects: SentenceLexeme[] = [
  { en: 'book', es: 'libro', singular: true, semantic: 'school_object' },
  { en: 'pencil', es: 'lápiz', singular: true, semantic: 'school_object' },
  { en: 'backpack', es: 'mochila', singular: true, semantic: 'school_object' },
  { en: 'ball', es: 'pelota', singular: true, semantic: 'activity' },
  { en: 'apple', es: 'manzana', singular: true, semantic: 'food' },
  { en: 'park', es: 'parque', singular: true, semantic: 'place' },
]

const verbs: VerbLexeme[] = [
  { en: 'run', es: 'correr', present3s: 'runs', presentPlural: 'run', past: 'ran', semantic: 'movement' },
  { en: 'jump', es: 'saltar', present3s: 'jumps', presentPlural: 'jump', past: 'jumped', semantic: 'movement' },
  { en: 'read', es: 'leer', present3s: 'reads', presentPlural: 'read', past: 'read', semantic: 'school' },
  { en: 'write', es: 'escribir', present3s: 'writes', presentPlural: 'write', past: 'wrote', semantic: 'school' },
  { en: 'play', es: 'jugar', present3s: 'plays', presentPlural: 'play', past: 'played', semantic: 'play' },
  { en: 'carry', es: 'llevar', present3s: 'carries', presentPlural: 'carry', past: 'carried', semantic: 'carry' },
  { en: 'eat', es: 'comer', present3s: 'eats', presentPlural: 'eat', past: 'ate', semantic: 'consume' },
]

const adjectives: Lexeme[] = [
  { en: 'happy', es: 'feliz' },
  { en: 'small', es: 'pequeño' },
  { en: 'fast', es: 'rápido' },
  { en: 'red', es: 'rojo' },
  { en: 'kind', es: 'amable' },
]

const sequenceWords: Lexeme[] = [
  { en: 'First', es: 'Primero' },
  { en: 'Next', es: 'Luego' },
  { en: 'Then', es: 'Después' },
  { en: 'Finally', es: 'Finalmente' },
]

const roleFriendly: Record<CurriculumQuestionRole, LocalizedText> = {
  core_skill: { en: 'core skill', es: 'habilidad clave' },
  reinforcement: { en: 'practice', es: 'práctica' },
  application: { en: 'apply', es: 'aplicar' },
  challenge: { en: 'challenge', es: 'reto' },
}

function isMasteryOrAbove(stage: LiteracyStageId): boolean {
  return (
    stage === 'third_grade_mastery' ||
    stage === 'advanced_comprehension_bridge' ||
    stage === 'accelerated_mastery_extension'
  )
}

function isAdvancedStage(stage: LiteracyStageId): boolean {
  return stage === 'advanced_comprehension_bridge' || stage === 'accelerated_mastery_extension'
}

function seeded(moduleId: CurriculumModuleId, level: number, question: number) {
  let value = 0
  for (const ch of moduleId) value += ch.charCodeAt(0)
  let state = Math.max(1, ((value + 97) * (level + 13) * (question + 19)) % 2147483647)
  return () => {
    state = (state * 48271) % 2147483647
    return state / 2147483647
  }
}

function pick<T>(items: readonly T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)]
}

function maybeArticle(word: SentenceLexeme): LocalizedText {
  const vowel = /^[aeiou]/i.test(word.en)
  return {
    en: `${vowel ? 'an' : 'a'} ${word.en}`,
    es: `${word.es}`,
  }
}

function sentenceSV(subject: SentenceLexeme, verb: VerbLexeme): LocalizedText {
  const verbForm = subject.singular ? verb.present3s : verb.presentPlural
  return {
    en: `The ${subject.en} ${verbForm}.`,
    es: `El/La ${subject.es} ${verb.es}.`,
  }
}

function sentenceSVO(subject: SentenceLexeme, verb: VerbLexeme, object: SentenceLexeme): LocalizedText {
  const verbForm = subject.singular ? verb.present3s : verb.presentPlural
  return {
    en: `The ${subject.en} ${verbForm} the ${object.en}.`,
    es: `El/La ${subject.es} ${verb.es} el/la ${object.es}.`,
  }
}

function simpleDistractorSentence(subject: SentenceLexeme, verb: VerbLexeme, object: SentenceLexeme): LocalizedText {
  return {
    en: `The ${object.en} ${verb.present3s} the ${subject.en}.`,
    es: `El/La ${object.es} ${verb.es} el/la ${subject.es}.`,
  }
}

function buildChoices(
  choices: Array<{ text: LocalizedText; isCorrect: boolean; errorType?: CurriculumErrorType }>,
): CurriculumLevelQuestion['choices'] {
  return choices.map((choice, index) => ({
    choice_id: `c${index + 1}`,
    text: choice.text,
    is_correct: choice.isCorrect,
    error_type: choice.errorType ?? null,
  }))
}

function buildGrammarDetectiveQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber, questionNumber)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)

  if (stage === 'pre_literacy_early_exposure') {
    const sentence = sentenceSV(subject, verb)
    const nounChoice = { en: subject.en, es: subject.es }
    const verbChoice = { en: subject.singular ? verb.present3s : verb.presentPlural, es: verb.es }
    return {
      domain: 'reading',
      prompt: {
        en: `Find the action word in: ${sentence.en}`,
        es: `Encuentra la palabra de acción en: ${sentence.es}`,
      },
      choices: buildChoices([
        { text: verbChoice, isCorrect: true },
        { text: nounChoice, isCorrect: false, errorType: 'verb_identification' },
        { text: { en: 'the', es: 'el/la' }, isCorrect: false, errorType: 'verb_identification' },
      ]),
      rationale: {
        en: `${verbChoice.en} is the action word.`,
        es: `${verbChoice.es} es la palabra de acción.`,
      },
    }
  }

  if (stage === 'early_sentence_awareness') {
    const sentence = sentenceSV(subject, verb)
    return {
      domain: 'reading',
      prompt: {
        en: `Which word is the noun in: ${sentence.en}`,
        es: `¿Qué palabra es el sustantivo en: ${sentence.es}?`,
      },
      choices: buildChoices([
        { text: { en: subject.en, es: subject.es }, isCorrect: true },
        {
          text: { en: subject.singular ? verb.present3s : verb.presentPlural, es: verb.es },
          isCorrect: false,
          errorType: 'noun_identification',
        },
        { text: { en: 'the', es: 'el/la' }, isCorrect: false, errorType: 'noun_identification' },
      ]),
      rationale: {
        en: `${subject.en} names who or what.`,
        es: `${subject.es} nombra quién o qué.`,
      },
    }
  }

  if (stage === 'emerging_reader') {
    const wrongSentence = {
      en: `The ${subject.en} ${verb.presentPlural}.`,
      es: `El/La ${subject.es} ${verb.es}.`,
    }
    const fix = {
      en: `The ${subject.en} ${verb.present3s}.`,
      es: `El/La ${subject.es} ${verb.es}.`,
    }
    return {
      domain: 'reading',
      prompt: {
        en: `Find the best fix: ${wrongSentence.en}`,
        es: `Encuentra la mejor corrección: ${wrongSentence.es}`,
      },
      choices: buildChoices([
        { text: fix, isCorrect: true },
        { text: wrongSentence, isCorrect: false, errorType: 'subject_verb_agreement' },
        { text: { en: `The ${verb.present3s} ${subject.en}.`, es: `El/La ${verb.es} ${subject.es}.` }, isCorrect: false, errorType: 'word_order' },
      ]),
      rationale: {
        en: 'The subject and verb must match.',
        es: 'El sujeto y el verbo deben coincidir.',
      },
    }
  }

  if (stage === 'developing_fluency') {
    const pronoun = subject.semantic === 'person' ? 'she' : 'it'
    return {
      domain: 'reading',
      prompt: {
        en: `Choose the best edit: "${subject.en} read a book and ${pronoun} smile."`,
        es: `Elige la mejor edición: "${subject.es} lee un libro y ${pronoun} sonríe."`,
      },
      choices: buildChoices([
        { text: { en: `${subject.en} read a book and ${pronoun} smiled.`, es: `${subject.es} leyó un libro y luego sonrió.` }, isCorrect: true },
        { text: { en: `${subject.en} read a book and ${pronoun} smile.`, es: `${subject.es} lee un libro y sonríe.` }, isCorrect: false, errorType: 'tense_consistency' },
        { text: { en: `${subject.en} and smile read a book.`, es: `${subject.es} y sonríe lee un libro.` }, isCorrect: false, errorType: 'word_order' },
      ]),
      rationale: {
        en: 'Past tense should stay consistent in both parts.',
        es: 'El tiempo pasado debe mantenerse en ambas partes.',
      },
    }
  }

  const first = pick(sequenceWords, rand)
  return {
    domain: 'reading',
    prompt: {
      en: `Find the sentence with the clearest sequence.`,
      es: `Encuentra la oración con la secuencia más clara.`,
    },
    choices: buildChoices([
      {
        text: { en: `${first.en}, the students read, then they write.`, es: `${first.es}, los estudiantes leen y luego escriben.` },
        isCorrect: true,
      },
      {
        text: { en: `Students read then because and write.`, es: `Los estudiantes leen luego porque y escriben.` },
        isCorrect: false,
        errorType: 'paragraph_sequence',
      },
      {
        text: { en: `Write read students then.`, es: `Escriben leen estudiantes después.` },
        isCorrect: false,
        errorType: 'word_order',
      },
    ]),
    rationale: {
      en: 'The best sentence has clear order and grammar.',
      es: 'La mejor oración tiene orden y gramática claros.',
    },
  }
}

function buildLogicCheckQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 11, questionNumber + 7)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const object = pick(objects, rand)
  const correct = stage === 'pre_literacy_early_exposure' ? sentenceSV(subject, verb) : sentenceSVO(subject, verb, object)

  return {
    domain: 'reading',
    prompt: {
      en: isMasteryOrAbove(stage) ? 'Choose the strongest logical sentence.' : 'Which sentence makes sense?',
      es: isMasteryOrAbove(stage) ? 'Elige la oración más lógica y fuerte.' : '¿Qué oración tiene sentido?',
    },
    choices: buildChoices([
      { text: correct, isCorrect: true },
      { text: simpleDistractorSentence(subject, verb, object), isCorrect: false, errorType: 'logic_mismatch' },
      {
        text: { en: `The ${subject.en} ${object.en} ${subject.singular ? verb.present3s : verb.presentPlural}.`, es: `El/La ${subject.es} ${object.es} ${verb.es}.` },
        isCorrect: false,
        errorType: 'word_order',
      },
    ]),
    rationale: {
      en: 'A logical sentence has clear order and meaning.',
      es: 'Una oración lógica tiene orden y significado claros.',
    },
  }
}

function buildSentenceExpansionQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 23, questionNumber + 29)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const object = pick(objects, rand)
  const adjective = pick(adjectives, rand)
  const base = sentenceSV(subject, verb)
  const expanded = {
    en: `The ${adjective.en} ${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural} with the ${object.en}.`,
    es: `El/La ${subject.es} ${verb.es} con el/la ${object.es}.`,
  }

  if (stage === 'pre_literacy_early_exposure') {
    const paired = {
      en: `${subject.en} ${adjective.en}`,
      es: `${subject.es} ${adjective.es}`,
    }
    return {
      domain: 'writing',
      prompt: { en: 'Pick the best expanded phrase.', es: 'Elige la mejor frase ampliada.' },
      choices: buildChoices([
        { text: paired, isCorrect: true },
        { text: { en: `${adjective.en} ${verb.present3s}`, es: `${adjective.es} ${verb.es}` }, isCorrect: false, errorType: 'logic_mismatch' },
        { text: { en: `${verb.present3s} ${subject.en}`, es: `${verb.es} ${subject.es}` }, isCorrect: false, errorType: 'word_order' },
      ]),
      rationale: { en: 'Add one detail that matches the noun.', es: 'Agrega un detalle que combine con el sustantivo.' },
    }
  }

  return {
    domain: 'writing',
    prompt: { en: `Expand this sentence: ${base.en}`, es: `Amplía esta oración: ${base.es}` },
    choices: buildChoices([
      { text: expanded, isCorrect: true },
      { text: base, isCorrect: false, errorType: 'missing_component' },
      { text: { en: `The ${subject.en} and but ${subject.singular ? verb.present3s : verb.presentPlural}.`, es: `El/La ${subject.es} y pero ${verb.es}.` }, isCorrect: false, errorType: 'conjunction_usage' },
    ]),
    rationale: { en: 'A strong expansion adds detail and stays clear.', es: 'Una buena ampliación agrega detalle y sigue clara.' },
  }
}

function buildStoryBuilderQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 37, questionNumber + 41)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const place = pick(objects.filter((obj) => obj.semantic === 'place' || obj.semantic === 'school_object'), rand)
  const first = pick(sequenceWords, rand)
  const next = pick(sequenceWords.filter((word) => word.en !== first.en), rand)

  if (stage === 'pre_literacy_early_exposure') {
    return {
      domain: 'writing',
      prompt: { en: 'Choose the best story start.', es: 'Elige el mejor inicio de historia.' },
      choices: buildChoices([
        { text: { en: `The ${subject.en}.`, es: `El/La ${subject.es}.` }, isCorrect: true },
        { text: { en: `${verb.present3s}.`, es: `${verb.es}.` }, isCorrect: false, errorType: 'missing_component' },
        { text: { en: `${place.en}.`, es: `${place.es}.` }, isCorrect: false, errorType: 'logic_mismatch' },
      ]),
      rationale: { en: 'A story start needs a clear character.', es: 'El inicio de una historia necesita un personaje claro.' },
    }
  }

  const story = {
    en: `${first.en}, the ${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural} to the ${place.en}. ${next.en}, the ${subject.en} smiles.`,
    es: `${first.es}, el/la ${subject.es} ${verb.es} al/a la ${place.es}. ${next.es}, el/la ${subject.es} sonríe.`,
  }
  return {
    domain: 'writing',
    prompt: { en: 'Choose the best next story step.', es: 'Elige el mejor siguiente paso de la historia.' },
    choices: buildChoices([
      { text: story, isCorrect: true },
      {
        text: { en: `The ${subject.en} because and ${subject.singular ? verb.present3s : verb.presentPlural}.`, es: `El/La ${subject.es} porque y ${verb.es}.` },
        isCorrect: false,
        errorType: 'conjunction_usage',
      },
      {
        text: { en: `${subject.singular ? verb.present3s : verb.presentPlural} the ${subject.en} to ${place.en}.`, es: `${verb.es} el/la ${subject.es} a ${place.es}.` },
        isCorrect: false,
        errorType: 'word_order',
      },
    ]),
    rationale: { en: 'Good stories keep events in clear order.', es: 'Las buenas historias mantienen eventos en orden claro.' },
  }
}

function buildVocabularyQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 53, questionNumber + 59)
  const targetNoun = pick(objects, rand)
  const targetVerb = pick(verbs, rand)
  const wrongNoun = pick(objects.filter((word) => word.en !== targetNoun.en), rand)
  const wrongVerb = pick(verbs.filter((word) => word.en !== targetVerb.en), rand)
  const nounQuestion = questionNumber % 2 === 1

  if (nounQuestion) {
    return {
      domain: 'reading',
      prompt: {
        en: stage === 'pre_literacy_early_exposure' ? `Pick the school object word.` : `Which word means this object: ${targetNoun.en}?`,
        es: stage === 'pre_literacy_early_exposure' ? `Elige la palabra del objeto escolar.` : `¿Qué palabra nombra este objeto: ${targetNoun.es}?`,
      },
      choices: buildChoices([
        { text: { en: targetNoun.en, es: targetNoun.es }, isCorrect: true },
        { text: { en: wrongNoun.en, es: wrongNoun.es }, isCorrect: false, errorType: 'noun_identification' },
        { text: { en: targetVerb.present3s, es: targetVerb.es }, isCorrect: false, errorType: 'noun_identification' },
      ]),
      rationale: { en: 'This word names a thing.', es: 'Esta palabra nombra una cosa.' },
    }
  }

  return {
    domain: 'reading',
    prompt: {
      en: `Which word is an action word?`,
      es: `¿Qué palabra es una palabra de acción?`,
    },
    choices: buildChoices([
      { text: { en: targetVerb.present3s, es: targetVerb.es }, isCorrect: true },
      { text: { en: targetNoun.en, es: targetNoun.es }, isCorrect: false, errorType: 'verb_identification' },
      { text: { en: wrongVerb.en, es: wrongVerb.es }, isCorrect: false, errorType: 'verb_identification' },
    ]),
    rationale: { en: 'Action words tell what someone does.', es: 'Las palabras de acción dicen qué hace alguien.' },
  }
}

function buildFluencyQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
  role: CurriculumQuestionRole,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 67, questionNumber + 71)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const object = pick(objects, rand)
  const fastPrompt = isMasteryOrAbove(stage) ? 'Timed check: choose the strongest response.' : 'Quick pick: choose the best sentence.'

  if (role === 'challenge' && levelNumber >= 13) {
    const seq = pick(sequenceWords, rand)
    return {
      domain: 'reading',
      prompt: {
        en: `${fastPrompt} ${seq.en} sentence.`,
        es: `${fastPrompt} ${seq.es} oración.`,
      },
      choices: buildChoices([
        {
          text: {
            en: `${seq.en}, the ${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural} the ${object.en}, then writes.`,
            es: `${seq.es}, el/la ${subject.es} ${verb.es} el/la ${object.es} y luego escribe.`,
          },
          isCorrect: true,
        },
        {
          text: { en: `${seq.en} the ${subject.en} and but ${verb.present3s}.`, es: `${seq.es} el/la ${subject.es} y pero ${verb.es}.` },
          isCorrect: false,
          errorType: 'conjunction_usage',
        },
        {
          text: { en: `${verb.present3s} ${subject.en} then ${object.en}.`, es: `${verb.es} ${subject.es} luego ${object.es}.` },
          isCorrect: false,
          errorType: 'word_order',
        },
      ]),
      rationale: { en: 'Fast and accurate still needs clear grammar.', es: 'Rápido y correcto todavía necesita gramática clara.' },
    }
  }

  const sentence = stage === 'pre_literacy_early_exposure' ? sentenceSV(subject, verb) : sentenceSVO(subject, verb, object)
  return {
    domain: 'reading',
    prompt: { en: fastPrompt, es: 'Selección rápida: elige la mejor oración.' },
    choices: buildChoices([
      { text: sentence, isCorrect: true },
      { text: simpleDistractorSentence(subject, verb, object), isCorrect: false, errorType: 'logic_mismatch' },
      { text: { en: `The ${subject.en} ${object.en} ${subject.singular ? verb.present3s : verb.presentPlural}.`, es: `El/La ${subject.es} ${object.es} ${verb.es}.` }, isCorrect: false, errorType: 'word_order' },
    ]),
    rationale: { en: 'Keep speed and accuracy together.', es: 'Mantén velocidad y precisión juntas.' },
  }
}

function buildPeerReviewQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 83, questionNumber + 89)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const object = pick(objects, rand)
  const wrong = {
    en: `The ${subject.en} ${verb.presentPlural} the ${object.en}.`,
    es: `El/La ${subject.es} ${verb.es} el/la ${object.es}.`,
  }
  const fix = {
    en: `Nice work. Try: The ${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural} the ${object.en}.`,
    es: `Buen trabajo. Prueba: El/La ${subject.es} ${verb.es} el/la ${object.es}.`,
  }

  if (stage === 'pre_literacy_early_exposure') {
    return {
      domain: 'speaking',
      prompt: { en: 'Pick the kind feedback.', es: 'Elige la retroalimentación amable.' },
      choices: buildChoices([
        { text: { en: 'Nice job. Try this word.', es: 'Buen trabajo. Prueba esta palabra.' }, isCorrect: true },
        { text: { en: 'This is bad.', es: 'Esto está mal.' }, isCorrect: false, errorType: 'logic_mismatch' },
        { text: { en: 'No idea.', es: 'No sé.' }, isCorrect: false, errorType: 'missing_component' },
      ]),
      rationale: { en: 'Peer feedback should be kind and helpful.', es: 'La retroalimentación debe ser amable y útil.' },
    }
  }

  return {
    domain: 'writing',
    prompt: { en: `A classmate wrote: "${wrong.en}" Choose the best feedback.`, es: `Un compañero escribió: "${wrong.es}" Elige la mejor retroalimentación.` },
    choices: buildChoices([
      { text: fix, isCorrect: true },
      { text: { en: 'Wrong. Start over.', es: 'Incorrecto. Empieza de nuevo.' }, isCorrect: false, errorType: 'logic_mismatch' },
      { text: { en: 'Looks fine to me.', es: 'Se ve bien para mí.' }, isCorrect: false, errorType: 'subject_verb_agreement' },
    ]),
    rationale: { en: 'Best feedback is kind and gives one clear fix.', es: 'La mejor retroalimentación es amable y da una corrección clara.' },
  }
}

function buildSentenceBuilderQuestion(
  stage: LiteracyStageId,
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
): BuiltQuestionContent {
  const rand = seeded(moduleId, levelNumber + 101, questionNumber + 103)
  const subject = pick(subjects, rand)
  const verb = pick(verbs, rand)
  const object = pick(objects, rand)
  const adjective = pick(adjectives, rand)
  const baseSentence =
    stage === 'pre_literacy_early_exposure'
      ? { en: `${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural}`, es: `${subject.es} ${verb.es}` }
      : isAdvancedStage(stage)
        ? {
            en: `${sequenceWords[0].en}, the ${subject.en} ${verb.past} the ${object.en}. Then the class explained why it mattered.`,
            es: `${sequenceWords[0].es}, el/la ${subject.es} ${verb.es} ${object.es}. Luego la clase explicó por qué importaba.`,
          }
        : isMasteryOrAbove(stage)
          ? { en: `${sequenceWords[0].en}, the ${subject.en} ${verb.past} the ${object.en} and wrote about it.`, es: `${sequenceWords[0].es}, el/la ${subject.es} ${verb.es} ${object.es} y escribió sobre eso.` }
          : { en: `The ${adjective.en} ${subject.en} ${subject.singular ? verb.present3s : verb.presentPlural} the ${object.en}.`, es: `El/La ${subject.es} ${verb.es} el/la ${object.es}.` }

  const articleForm = maybeArticle(object)

  return {
    domain: 'writing',
    prompt: {
      en: `Build this sentence with blocks: ${baseSentence.en}`,
      es: `Construye esta oración con bloques: ${baseSentence.es}`,
    },
    choices: buildChoices([
      { text: baseSentence, isCorrect: true },
      {
        text: { en: `${subject.singular ? verb.present3s : verb.presentPlural} the ${subject.en} ${object.en}.`, es: `${verb.es} el/la ${subject.es} ${object.es}.` },
        isCorrect: false,
        errorType: 'word_order',
      },
      {
        text: { en: `The ${subject.en} ${articleForm.en} ${verb.present3s}.`, es: `El/La ${subject.es} ${articleForm.es} ${verb.es}.` },
        isCorrect: false,
        errorType: 'missing_component',
      },
    ]),
    rationale: {
      en: 'Use sentence blocks in the correct order.',
      es: 'Usa los bloques de oración en el orden correcto.',
    },
  }
}

export function buildQuestionContent(
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionNumber: number,
  stage: LiteracyStageId,
  role: CurriculumQuestionRole,
): BuiltQuestionContent {
  switch (moduleId) {
    case 'grammar_detective':
      return buildGrammarDetectiveQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'logic_check':
      return buildLogicCheckQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'sentence_expansion':
      return buildSentenceExpansionQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'story_builder':
      return buildStoryBuilderQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'vocabulary':
      return buildVocabularyQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'fluency_challenge':
      return buildFluencyQuestion(stage, moduleId, levelNumber, questionNumber, role)
    case 'peer_review':
      return buildPeerReviewQuestion(stage, moduleId, levelNumber, questionNumber)
    case 'sentence_builder':
      return buildSentenceBuilderQuestion(stage, moduleId, levelNumber, questionNumber)
    default:
      return {
        domain: 'reading',
        prompt: {
          en: `Question ${questionNumber}`,
          es: `Pregunta ${questionNumber}`,
        },
        choices: buildChoices([{ text: { en: 'Option A', es: 'Opción A' }, isCorrect: true }]),
        rationale: {
          en: roleFriendly[role].en,
          es: roleFriendly[role].es,
        },
      }
  }
}
