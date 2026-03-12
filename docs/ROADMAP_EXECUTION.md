# Lingua ELI Execution Roadmap (PVUSD First Tenant)

## Current State (as of 2026-03-11)
- Legacy student app path removed from active routing and build.
- Student mode architecture is active (`/modes/*`) with bilingual UI + TTS controls.
- Curriculum engine has standardized 50-level framework with:
  - 10 questions per level
  - pass thresholds and retry logic
  - post-level gap-check definitions
  - module parity across 8 modules
- Question progression now works inside each simple mode (question-to-question and level-to-level), not only in Sentence Builder.

## Delivery Principles
- Protect core student flow first.
- Keep teacher/admin routes stable while adding capability.
- Ship in thin vertical slices (data model -> API -> UI -> QA).
- Every milestone must be demoable to district stakeholders.

## Milestone 1: Curriculum Runtime Hardening (Now)
Status: `In Progress`

### 1.1 Level + Question Runtime Consistency
- Enforce persisted current level for all 8 modules.
- Enforce 10-question sessions with deterministic pass/fail loop.
- Track retries and level outcomes in local/session store.

### 1.2 Sentence Builder Content Depth
- Expand sentence-builder word banks to support at least 10 logical sentence outcomes per level session.
- Prevent semantically invalid combinations in building-block stages.
- Keep English text immutable for students; Spanish available via audio assist only.

### 1.3 Gap Diagnostics Surface
- Add post-level gap-check completion flow in student mode.
- Persist dimension scores (`literal`, `inference`, `vocab-in-context`, `syntax`, `cohesion`, `knowledge`).
- Expose results to teacher intervention inputs.

Acceptance criteria:
- Every module can be progressed from Level 1 upward with no route jump until level completion.
- Every level session is 10 questions, scored, and either advances or retries.
- Teacher view can consume level performance + gap signals from completed sessions.

## Milestone 2: Superintendent-Ready Intervention Intelligence
Status: `Next`

### 2.1 Intensive Filter Layer
- Priority queue ranking by:
  - risk score trend
  - gap severity trend
  - inactivity recency
  - domain-level weakness concentration
- Add “students needing immediate intervention” saved view presets.

### 2.2 Precision Grouping
- Auto-cluster students by:
  - literacy stage band
  - dominant error type
  - dominant comprehension dimension gap
- Produce recommended intervention groups (small-group planning output).

### 2.3 Actionability
- Add “next best action” cards with:
  - module
  - level band
  - target domain
  - estimated minutes
- Export intervention list (CSV) for leadership and PLC use.

Acceptance criteria:
- Teacher/admin can isolate top-risk students in <10 seconds.
- Dashboard produces intervention-ready groups without manual sorting.
- Export output is readable for district leadership meetings.

## Milestone 3: District Integration Track (Parallel)
Status: `Planned`

### 3.1 Auth + Launch
- Clever SSO + role routing (student/teacher/admin).
- Google Classroom Option A deep-link launch continuity.

### 3.2 Rostering
- Clever roster sync pipeline (schools, sections, users, memberships).
- Idempotent sync runs with audit events.

### 3.3 Compliance Baseline
- FERPA/COPPA/SOPIPA guardrails:
  - minimal PII
  - retention policy controls
  - export/delete workflows
  - audit logging

Acceptance criteria:
- User lands in correct section after login.
- Roster sync can run repeatedly without duplication/corruption.
- Data retention policy can be configured per district.

## Milestone 4: Lesson-System Layer (Beyond Practice)
Status: `Planned`

### 4.1 Lesson Plan Engine
- Convert practice pathways into lesson sequences:
  - objective
  - mini-task sequence
  - checks for understanding
  - closure
- Tie each lesson to CA ELD + ELPAC domain metadata.

### 4.2 Gamified Response Loop
- Replace passive flow with response-driven loops:
  - mission goals
  - immediate feedback
  - unlock states
  - adaptive branching

### 4.3 Teacher Assignment Controls
- Assign by class, subgroup, or student.
- Set required completion and due windows.

Acceptance criteria:
- Teacher can assign a standards-mapped lesson path in <2 minutes.
- Student experiences interactive, response-based progression (not passive content).

## 30-60-90 Execution Plan

### Next 30 Days
- Finish Milestone 1 runtime hardening.
- Ship intervention filter upgrades (Milestone 2.1).
- Add telemetry for pass rates, retries, and gap clears.

### Days 31-60
- Ship precision grouping + recommended action cards (Milestone 2.2/2.3).
- Implement Clever auth scaffolding and token validation path.
- Start roster sync schema + first sync job.

### Days 61-90
- Complete Clever roster sync and section landing flow.
- Add district admin retention controls + exports.
- Begin lesson-system layer pilot in 1-2 modules.

## Risk Register
- Content scale risk: 8 modules x 50 levels requires strong tooling for authoring and QA.
- Data trust risk: intervention dashboard quality depends on clean, complete event capture.
- Integration risk: district rollout speed depends on Clever credential/setup timing.
- Compliance risk: retention/export/delete must be fully testable before district pilot.

## Offload Candidates (Safe to Delegate)
- Graphic asset production and icon packs.
- Translation QA pass for EN/ES UI strings.
- Content entry tooling for question bank authoring.
- Manual regression test scripts and browser matrix runs.
- Documentation formatting and district-facing one-pagers.

## Core Engineering Items to Keep In-House
- Curriculum logic, validation, and progression rules.
- Risk model and intervention ranking algorithm.
- Auth, rostering, deep-link launch, and security controls.
- Data model, migrations, and compliance-sensitive workflows.
