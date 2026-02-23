# LinguaELI

Version: 0.4.0-sandbox-redesign

LinguaELI is an English Language Development (ELD) learning application for elementary learners, aligned to Pajaro Valley Unified School District (PVUSD) ELD expectations and the California English Language Development Standards (CA ELD Standards).

This revision redesigns Sandbox Mode into a strict level-based progression with a hard split between building-block scaffolds (Levels 1–15) and free-response writing (Levels 16+).

## Sandbox Mode Redesign Overview

Sandbox Mode now uses a deterministic progression with two clearly separated instructional modes:

- Levels 1–15: Building-block mode only (scaffolded, constrained, no free typing)
- Levels 16+: Free-response mode only (student-generated writing, no scaffolds)

Design goals:

- prevent cognitive overload for 3rd-grade learners
- preserve grammatical progression across levels
- reduce nonsensical sentence combinations in scaffolded tasks
- remove mixed-mode confusion between scaffolded and free-response writing
- preserve CA ELD-aligned progression from supported output to independent output

## Updated Architecture Plan

### 1. Sandbox Mode Controller (Level-Gated)

Sandbox Mode determines instructional mode strictly from numeric level:

- `Levels 1–5` -> `FOUNDATIONAL_BUILD`
- `Levels 6–15` -> `EXPANDED_BUILD`
- `Levels 16+` -> `FREE_RESPONSE`

Rules enforced:

- no free typing in `FOUNDATIONAL_BUILD` or `EXPANDED_BUILD`
- no frames/word banks/build tools in `FREE_RESPONSE`
- no hybrid mode UI shown to students

### 2. Structured Prompt Pipeline

Sandbox prompts are split into two categories:

- Building-block prompts (Levels 1–15)
- Free-response prompts (Levels 16+)

Prompt phrasing is intentionally differentiated:

- Building-block prompts use language such as `Build a sentence`, `Put the words in order`, `Complete the frame`
- Free-response prompts use language such as `Write 3 sentences explaining...`, `Describe what happened when...`, `Explain why...`

### 3. Sentence Building Engine (Scaffolded)

For Levels 1–15, the sentence-building engine is responsible for:

- rendering a fixed sentence frame
- rendering constrained word banks
- collecting slot selections via tap-to-select (or drag-and-drop in future)
- validating syntax and logic before accepting an answer

### 4. Word Bank Logic Enforcement Layer

Word banks are generated per prompt (not random) and must be:

- prompt-specific
- grammatically compatible with the sentence frame
- semantically coherent
- age-appropriate and high-frequency
- limited in size and grouped by category

### 5. Validation Layer

The validation system runs in this order:

1. slot completeness validation
2. word-order / frame-position validation
3. grammar compatibility validation
4. semantic compatibility validation

### 6. UI Layer (3rd Grade Friendly)

Sandbox UI is optimized for a single task focus:

- large tap targets
- clear icons
- high contrast
- simple color coding
- progress visibility
- minimal text clutter
- separated action buttons (`Check Answer`, `Try Again`)

## Level Progression Table

| Levels | Mode | Student Input | Sentence Complexity | Scaffolds | Allowed Language Features |
|---|---|---|---|---|---|
| 1–5 | Foundational Building Block | Tap/select only | Single simple sentence patterns only | Required | Subject + Verb; Subject + Verb + Object; Subject + Linking Verb + Descriptor |
| 6–10 | Expanded Building Block | Tap/select only | Still scaffolded; short connected ideas | Required | `first`, `next`, `then`; simple SVO combinations |
| 11–15 | Expanded Building Block | Tap/select only | Structured expansion with controlled connectors | Required | `and`, `but`, `because`, `when`, `if` (only in controlled frames) |
| 16–20 | Free Response | Typing | Independent sentences | None | Short explanations, retell, describe |
| 21–30 | Free Response | Typing | Expanded multi-sentence responses | None | Cause/effect, sequencing, comparative language |
| 31–40 | Free Response | Typing | Advanced ELD response development | None | Academic explanation, justification, detail development |

## Levels 1–5 Foundational Structure (Required)

Levels 1–5 use non-complex sentence structures only.

Allowed sentence patterns:

- Subject + Verb
- Subject + Verb + Object
- Subject + Linking Verb + Descriptor

Disallowed in Levels 1–5:

- compound sentences
- multiple independent clauses
- stacked conjunctions
- abstract vocabulary
- multi-idea sentences

Student interaction in Levels 1–5:

- sentence frame only
- tap-to-select or drag-and-drop blocks only
- word bank only
- no free typing

## Levels 6–15 Expanded Building Block Structure

Levels 6–15 continue structured scaffolding and gradually introduce connectors within controlled frames.

Gradually introduced language:

- `and`, `but`, `because`
- `when`, `if`
- `first`, `next`, `then`

Constraints remain:

- scaffolded building-block interaction only
- no free typing
- word banks remain prompt-specific and logic-validated
- no sudden complexity jumps

## Levels 16+ Free-Response Mode

After Level 15, Sandbox Mode becomes fully independent writing.

Rules:

- no sentence frames
- no word banks
- no drag-and-drop/tap-to-build scaffolds
- no mixed mode UI

Free-response prompts must be distinct from scaffolded prompts to prevent confusion.

Examples of free-response prompt phrasing:

- `Write 3 sentences explaining...`
- `Describe what happened when...`
- `Explain why...`

## Strict Scaffold Limit Rule

**Building-block scaffolds exist only in Levels 1–15.**

This is a hard architectural rule for consistency and instructional clarity.

Why scaffolding ends at Level 15:

- prevents dependence on structured supports beyond the intended developmental band
- aligns with gradual release toward independent language production
- ensures students experience a clear transition into self-generated language
- supports CA ELD progression from supported production to increasingly independent output

## Word Bank Logic Enforcement (Detailed)

### Non-Negotiable Rule

For all building-block levels (1–15), word banks must be programmatically validated before presentation and before answer acceptance.

### Word Bank Requirements

Word banks must:

- correspond directly to the sentence prompt
- match the grammar of the sentence frame
- be logically compatible with one another
- contain only words that can form coherent sentences in the target frame
- avoid accidental nonsense combinations

Word banks must also be:

- categorized (e.g., Subjects, Verbs, Objects, Descriptors)
- limited in size (small, focused sets)
- age-appropriate and high-frequency

### Agreement and Compatibility Rules

Words must:

- agree in number (singular/plural)
- match the expected tense for the frame
- match semantic context

Examples:

- Allowed: `The dog can run.`
- Disallowed: `The rock can jump.` (unless prompt explicitly supports personification)

### Programmatic Enforcement Strategy

Each building-block prompt should define:

- a frame template
- slot types (subject / verb / object / descriptor / connector)
- allowed options per slot
- optional compatibility maps (e.g., `subject -> allowed verbs`)
- validation functions for grammar and logic

No random word generation is permitted for building-block prompts.

No prompt may reuse a word bank if the reused bank creates semantic mismatch in the new context.

## Grammatical Validation System

The grammatical validation system checks:

1. Frame completion
- all required slots are filled

2. Word order
- selected words appear in the exact English syntax required by the frame

3. Grammar compatibility
- slot choice matches expected part of speech and tense pattern

4. Logical coherence
- selected combinations pass semantic compatibility constraints for that prompt

5. Answer acceptance
- only grammatically correct and semantically logical outputs are marked correct in building-block mode

## Consistency Enforcement Rules

The Sandbox Mode redesign enforces the following consistency rules:

- no mixing scaffold and free typing in the same level
- no hidden scaffolds after Level 15
- no inconsistent grammar progression
- no vocabulary jumps without transition
- each level builds from the previous level
- complexity increases gradually and predictably

How prompt differentiation prevents confusion:

- building-block prompts use construction language (`build`, `put in order`, `complete frame`)
- free-response prompts use composition language (`write`, `describe`, `explain`)
- UI stage banner explicitly names the mode and level band

## UI Simplification Notes (3rd Grade Friendly)

Sandbox Mode UI requirements implemented and/or targeted:

- large buttons and tap targets
- clear icons and stage labels
- minimal text clutter
- one main task per screen
- high contrast and simple color coding
- explicit stage banner (building blocks vs free response)
- visible progress indicators
- audio read-aloud support (existing TTS buttons retained)
- separate answer actions in scaffolded tasks (target behavior)
- no developer terminology visible to students
- no dense menus

Navigation expectations:

- Home
- Sandbox Mode
- My Progress
- Settings (minimal)

## CA ELD Standards Alignment (Preserved)

This redesign preserves CA ELD alignment by:

- using structured supports during early production stages
- controlling grammar complexity in foundational levels
- gradually introducing connectors and sequencing language
- transitioning to independent writing after sufficient scaffolded practice
- maintaining clear instructional progression across levels

## Full List of Changes in This Revision

### Sandbox / UI code changes

- improved Sandbox sentence-builder interaction (slot-focused flow, clearer selection state, helper text, reset controls)
- modernized dropdown/select styling for level selection in vocabulary flow
- restored vocab image + typed-word verification flow in vocabulary module
- moved `Siguiente` action near the typing field in the vocabulary module for easier access
- added/retained visual supports for vocabulary and image-based assessment items
- added Sandbox stage banner in `SandboxJournal` to distinguish building-block vs free-response mode
- enforced level-based mode split in Sandbox UI:
  - Levels 1–15 -> build-only presentation
  - Levels 16+ -> free-response presentation

### Documentation changes

- added explicit Sandbox Mode redesign architecture
- documented Level 1–5 foundational structure
- documented Level 6–15 expanded building-block structure
- documented Level 16+ free-response mode
- added strict scaffold limit rule statement
- added detailed Word Bank Logic Enforcement section
- documented grammatical validation system expectations
- documented UI simplification requirements
- documented consistency enforcement rules
- added version update and revision summary

## Implementation Status Notes

This README defines the target enforcement model and instructional contract for Sandbox Mode.

Current codebase status in this revision:

- UI mode separation is enforced at the Sandbox screen level (build-only vs free-response presentation)
- sentence-builder UX has been significantly improved
- full prompt-by-prompt categorized word-bank validation with semantic compatibility maps is partially implemented and should be completed as the next engineering step for Levels 1–15

## Development

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## License

MIT
