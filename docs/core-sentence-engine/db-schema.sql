-- Phase 1 minimal tracking schema (Postgres)
CREATE TABLE students (
  id UUID PRIMARY KEY,
  external_auth_id TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE student_level_progress (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 5),
  status TEXT NOT NULL CHECK (status IN ('locked','in_progress','completed')),
  attempts_count INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP NULL,
  UNIQUE (student_id, level_number)
);

CREATE TABLE sentence_attempts (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  task_id TEXT NOT NULL,
  submitted_tokens JSONB NOT NULL,
  normalized_sentence TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  error_type TEXT NULL CHECK (error_type IN ('subject_verb_agreement','missing_component','word_order','logic_mismatch')),
  validation_result JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE vocabulary_mastery (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  correct_usage_count INTEGER NOT NULL DEFAULT 0,
  unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (student_id, word_id)
);
