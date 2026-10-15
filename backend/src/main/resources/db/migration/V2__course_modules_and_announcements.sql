-- Child tables for course workspace. Only runs when "courses" already exists (legacy DB).
-- On fresh installs Hibernate creates these; IF NOT EXISTS avoids duplicate errors.

DO
$$
    BEGIN
        IF EXISTS (SELECT 1
                   FROM information_schema.tables
                   WHERE table_schema = 'public'
                     AND table_name = 'courses') THEN
            CREATE TABLE IF NOT EXISTS course_modules
            (
                id         BIGSERIAL PRIMARY KEY,
                course_id  BIGINT       NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
                title      VARCHAR(255) NOT NULL,
                content    TEXT,
                sort_order INTEGER      NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS course_announcements
            (
                id         BIGSERIAL PRIMARY KEY,
                course_id  BIGINT       NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
                title      VARCHAR(255) NOT NULL,
                message    TEXT         NOT NULL,
                created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
            );
        END IF;
    END;
$$;
