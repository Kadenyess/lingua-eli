import type { ErrorTag, LevelTask, ValidationResult, WordEntry, SlotType } from '../types/engine'

function titleCase(text: string) {
  if (!text) return text
  return text[0].toUpperCase() + text.slice(1)
}

function buildFeedback(errorType: ErrorTag | null): ValidationResult['feedback'] {
  if (!errorType) {
    return {
      title: 'Nice job!',
      message: 'You built a complete sentence.',
      hint: 'Try another one to practice.',
    }
  }

  const map: Record<ErrorTag, ValidationResult['feedback']> = {
    missing_component: {
      title: 'Nice try!',
      message: 'One part is missing.',
      hint: 'Fill every blank in the sentence frame.',
    },
    word_order: {
      title: 'Nice try!',
      message: 'The words are not in order yet.',
      hint: 'Put the words in the same order as the frame.',
    },
    subject_verb_agreement: {
      title: 'Nice try!',
      message: 'The subject and verb do not match yet.',
      hint: 'Pick a verb form that matches one subject.',
    },
    logic_mismatch: {
      title: 'Nice try!',
      message: 'These words do not match this idea yet.',
      hint: 'Choose words that make a real sentence together.',
    },
  }
  return map[errorType]
}

function tagMatch(entry: WordEntry | undefined, allowedTags: string[] | undefined) {
  if (!entry || !allowedTags || allowedTags.length === 0) return true
  const tags = entry.semanticTags || []
  return tags.some((t) => allowedTags.includes(t))
}

export function validateSentenceSelection(task: LevelTask, selectedBySlot: Partial<Record<SlotType, WordEntry>>): ValidationResult {
  const requiredSlots = task.slots

  for (const slot of requiredSlots) {
    if (!selectedBySlot[slot]) {
      return {
        isCorrect: false,
        errorType: 'missing_component',
        normalizedSentence: '',
        feedback: buildFeedback('missing_component'),
      }
    }
  }

  const wordsInOrder = requiredSlots.map((slot) => selectedBySlot[slot]!.text)
  const subject = selectedBySlot.subject
  const verb = selectedBySlot.verb || selectedBySlot.linkingVerb
  const object = selectedBySlot.object
  const descriptor = selectedBySlot.descriptor

  if (subject && verb && subject.number && verb.agreement && subject.number !== verb.agreement) {
    return {
      isCorrect: false,
      errorType: 'subject_verb_agreement',
      normalizedSentence: wordsInOrder.join(' ') + '.',
      feedback: buildFeedback('subject_verb_agreement'),
    }
  }

  if (subject && verb && task.logic.subjectToVerb) {
    const subjectTag = (subject.semanticTags || [])[0]
    const allowedVerbTags = task.logic.subjectToVerb[subjectTag]
    if (!tagMatch(verb, allowedVerbTags)) {
      return {
        isCorrect: false,
        errorType: 'logic_mismatch',
        normalizedSentence: wordsInOrder.join(' ') + '.',
        feedback: buildFeedback('logic_mismatch'),
      }
    }
  }

  if (subject && descriptor && task.logic.subjectToDescriptor) {
    const subjectTag = (subject.semanticTags || [])[0]
    const allowedDescriptorTags = task.logic.subjectToDescriptor[subjectTag]
    if (!tagMatch(descriptor, allowedDescriptorTags)) {
      return {
        isCorrect: false,
        errorType: 'logic_mismatch',
        normalizedSentence: wordsInOrder.join(' ') + '.',
        feedback: buildFeedback('logic_mismatch'),
      }
    }
  }

  if (verb && object && task.logic.verbToObject) {
    const verbTag = (verb.semanticTags || [])[0]
    const allowedObjectTags = task.logic.verbToObject[verbTag]
    if (!tagMatch(object, allowedObjectTags)) {
      return {
        isCorrect: false,
        errorType: 'logic_mismatch',
        normalizedSentence: wordsInOrder.join(' ') + '.',
        feedback: buildFeedback('logic_mismatch'),
      }
    }
  }

  // Level 5 article check (simple a/an rule)
  const article = selectedBySlot.article
  if (article && subject && ['A', 'An', 'a', 'an'].includes(article.text)) {
    const startsWithVowel = /^[aeiou]/i.test(subject.text)
    if (/^an$/i.test(article.text) && !startsWithVowel) {
      return { isCorrect: false, errorType: 'logic_mismatch', normalizedSentence: wordsInOrder.join(' ') + '.', feedback: buildFeedback('logic_mismatch') }
    }
    if (/^a$/i.test(article.text) && startsWithVowel) {
      return { isCorrect: false, errorType: 'logic_mismatch', normalizedSentence: wordsInOrder.join(' ') + '.', feedback: buildFeedback('logic_mismatch') }
    }
  }

  const normalizedSentence = titleCase(wordsInOrder.join(' ').replace(/\s+/g, ' ').trim()) + '.'
  return {
    isCorrect: true,
    errorType: null,
    normalizedSentence,
    feedback: buildFeedback(null),
  }
}
