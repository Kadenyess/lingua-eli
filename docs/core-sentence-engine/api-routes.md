# API Route Examples (Phase 1 Target Architecture)

- `GET /api/health`
- `POST /api/auth/session` (placeholder)
- `GET /api/levels/:levelNumber`
- `POST /api/validate`
- `GET /api/progress/:studentId`
- `POST /api/progress/attempt`
- `GET /api/vocabulary/mastery/:studentId`

Example `POST /api/validate` payload:

```json
{
  "studentId": "student-123",
  "levelNumber": 1,
  "taskId": "l1-t1",
  "selectedBlocks": {
    "subject": "dog",
    "verb": "runs"
  }
}
```
