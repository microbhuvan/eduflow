-- Align existing "courses" table with JPA Course entity (fixes: column credits does not exist).
-- Skips cleanly when "courses" does not exist yet (Hibernate will create it on first run).

DO
$$
    BEGIN
        IF EXISTS (SELECT 1
                   FROM information_schema.tables
                   WHERE table_schema = 'public'
                     AND table_name = 'courses') THEN
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_code VARCHAR(32);

            ALTER TABLE courses ADD COLUMN IF NOT EXISTS credits INTEGER;
            UPDATE courses SET credits = 3 WHERE credits IS NULL;
            ALTER TABLE courses ALTER COLUMN credits SET DEFAULT 3;
            ALTER TABLE courses ALTER COLUMN credits SET NOT NULL;

            ALTER TABLE courses ADD COLUMN IF NOT EXISTS syllabus TEXT;
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes TEXT;
        END IF;
    END;
$$;
