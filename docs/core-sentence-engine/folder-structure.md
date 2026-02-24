# Phase 1 Folder Structure (Core Sentence Engine)

```txt
src/core-sentence-engine/
  components/
    CoreSentenceEngine.tsx
    CoreSentenceEngine.css
  levels/
    level-1.json ... level-5.json
    index.ts
  validation/
    validator.ts
  storage/
    localTracking.ts
  types/
    engine.ts
```

Planned backend expansion (Phase 1 architecture target):
- `apps/api` (Node.js REST)
- `db/schema.sql` (Postgres) or Firebase collections
- modular validation routes/services
