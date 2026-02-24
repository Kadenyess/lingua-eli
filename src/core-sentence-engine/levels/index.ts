import level1 from './level-1.json'
import level2 from './level-2.json'
import level3 from './level-3.json'
import level4 from './level-4.json'
import level5 from './level-5.json'
import type { LevelDefinition } from '../types/engine'

export const coreSentenceLevels = [level1, level2, level3, level4, level5] as LevelDefinition[]

export function getCoreSentenceLevel(level: number): LevelDefinition {
  const idx = Math.min(5, Math.max(1, level)) - 1
  return coreSentenceLevels[idx]
}
