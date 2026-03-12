import { validateSentenceSelection } from '../validation/validator'
import type { LevelDefinition, LevelTask, SlotType, WordEntry } from '../types/engine'

function basePoolForSlot(task: LevelTask, slot: SlotType): WordEntry[] {
  if (slot === 'article') return task.wordBanks.article || []
  if (slot === 'descriptor') return task.wordBanks.adjective || []
  if (slot === 'subject' || slot === 'object') return task.wordBanks.noun || []
  return task.wordBanks.verb || []
}

function slotCompatible(slot: SlotType, word: WordEntry): boolean {
  if (slot === 'subject') return !word.role || word.role === 'subject'
  if (slot === 'object') return !word.role || word.role === 'object'
  if (slot === 'verb') return word.role === 'verb'
  if (slot === 'linkingVerb') return word.role === 'linkingVerb'
  if (slot === 'descriptor') return word.category === 'adjective'
  if (slot === 'article') return word.category === 'article'
  return false
}

function slotWords(task: LevelTask, slot: SlotType): WordEntry[] {
  const base = basePoolForSlot(task, slot).filter((word) => slotCompatible(slot, word))
  const allowed = task.slotOptions[slot]
  if (!allowed || allowed.length === 0) return base
  const allowedSet = new Set(allowed)
  return base.filter((word) => allowedSet.has(word.id))
}

function countLogicalSentences(task: LevelTask, minimumToFind: number): number {
  const slots = task.slots
  const pools = slots.map((slot) => slotWords(task, slot))
  if (pools.some((pool) => pool.length === 0)) return 0

  const selected: Partial<Record<SlotType, WordEntry>> = {}
  let validCount = 0

  const walk = (index: number) => {
    if (validCount >= minimumToFind) return
    const slot = slots[index]
    const words = pools[index]
    for (const word of words) {
      selected[slot] = word
      if (index === slots.length - 1) {
        const result = validateSentenceSelection(task, selected)
        if (result.isCorrect) validCount += 1
      } else {
        walk(index + 1)
      }
      if (validCount >= minimumToFind) break
    }
    delete selected[slot]
  }

  walk(0)
  return validCount
}

export function assertMinimumLogicalSentencesPerTask(
  levels: LevelDefinition[],
  minimumValidSentences = 10,
) {
  for (const level of levels) {
    for (const task of level.tasks) {
      const validCount = countLogicalSentences(task, minimumValidSentences)
      if (validCount < minimumValidSentences) {
        throw new Error(
          `Sentence Builder quality gate failed for level ${level.level}, task ${task.id}: found ${validCount} valid logical sentences; required ${minimumValidSentences}.`,
        )
      }
    }
  }
}
