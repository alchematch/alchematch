-- =============================================================================
-- V1: Clean bootstrap schema (PostgreSQL)
-- Migrated from MySQL. Ground truth: docs/schema-dump-local.sql (captured 2026-05-22)
--
-- Intentional differences from the live DB:
--   (1) VARCHAR used for all enum columns instead of a native enum type.
--       Reason: matches JPA @Enumerated(EnumType.STRING); avoids ALTER TYPE
--       on every new enum value; passes ddl-auto=validate cleanly.
--   (2) Three UNIQUE constraints added that were missing from the live DB:
--         uk_users_username   on users.username
--         uk_users_email      on users.email
--         uk_roles_role_name  on roles.role_name
--   (3) degree_fields.name has exactly ONE unique constraint (uk_degree_field_name).
--   (4) job_applications.document_public_id and document_url are intentionally
--       absent. These columns exist in the live DB but are not mapped by the
--       JobApplication entity (cloud upload was removed).
--   (5) Postgres does not auto-index foreign key columns the way MySQL does.
--       Explicit indexes were added on job_benefits.job_id,
--       job_minimum_requirements.job_id, and job_degree_fields.degree_field_id
--       to preserve equivalent query performance.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. roles
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
    role_id   BIGINT GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (role_id),
    CONSTRAINT uk_roles_role_name UNIQUE (role_name)
);

-- -----------------------------------------------------------------------------
-- 2. users
--    Depends on: roles
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    user_id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    username                VARCHAR(100) NOT NULL,
    email                   VARCHAR(50)  NOT NULL,
    password_hash           VARCHAR(120) DEFAULT NULL,
    role_id                 BIGINT       NOT NULL,
    account_non_locked      BOOLEAN      NOT NULL,
    account_non_expired     BOOLEAN      NOT NULL,
    credentials_non_expired BOOLEAN      NOT NULL,
    enabled                 BOOLEAN      NOT NULL,
    credentials_expiry_date DATE         DEFAULT NULL,
    account_expiry_date     DATE         DEFAULT NULL,
    two_factor_secret       VARCHAR(64)  DEFAULT NULL,
    two_factor_enabled      BOOLEAN      NOT NULL,
    sign_up_method          VARCHAR(20)  DEFAULT NULL,
    created_date            TIMESTAMP(6) DEFAULT NULL,
    updated_date            TIMESTAMP(6) DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email    UNIQUE (email),
    CONSTRAINT fk_users_role     FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

-- -----------------------------------------------------------------------------
-- 3. degree_fields
-- -----------------------------------------------------------------------------
CREATE TABLE degree_fields (
    id     BIGINT GENERATED ALWAYS AS IDENTITY,
    name   VARCHAR(120) NOT NULL,
    active BOOLEAN      NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_degree_field_name UNIQUE (name)
);

-- -----------------------------------------------------------------------------
-- 4. companies
--    Depends on: users
-- -----------------------------------------------------------------------------
CREATE TABLE companies (
    id             BIGINT GENERATED ALWAYS AS IDENTITY,
    name           VARCHAR(150) NOT NULL,
    owner_id       BIGINT       NOT NULL,
    logo_public_id VARCHAR(255) DEFAULT NULL,
    logo_url       VARCHAR(500) DEFAULT NULL,
    enabled        BOOLEAN      NOT NULL,
    created_at     TIMESTAMP(6) DEFAULT NULL,
    updated_at     TIMESTAMP(6) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_companies_owner_id UNIQUE (owner_id),
    CONSTRAINT fk_companies_owner    FOREIGN KEY (owner_id) REFERENCES users (user_id)
);

-- -----------------------------------------------------------------------------
-- 5. company_applications
--    Depends on: users
-- -----------------------------------------------------------------------------
CREATE TABLE company_applications (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id            BIGINT       NOT NULL,
    company_name       VARCHAR(150) NOT NULL,
    document_public_id VARCHAR(255) DEFAULT NULL,
    document_url       VARCHAR(500) DEFAULT NULL,
    status             VARCHAR(30)  NOT NULL,
    created_at         TIMESTAMP(6) NOT NULL,
    updated_at         TIMESTAMP(6) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_company_applications_user_id UNIQUE (user_id),
    CONSTRAINT fk_company_applications_user    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_status_created_at ON company_applications (status, created_at);

-- -----------------------------------------------------------------------------
-- 6. candidate_profiles
--    Depends on: users, degree_fields
--    Shared PK: user_id is both PK and FK to users.user_id (@MapsId).
-- -----------------------------------------------------------------------------
CREATE TABLE candidate_profiles (
    user_id          BIGINT       NOT NULL,
    education_level  VARCHAR(30)  DEFAULT NULL,
    location         VARCHAR(120) DEFAULT NULL,
    phone            VARCHAR(30)  DEFAULT NULL,
    resume_public_id VARCHAR(255) DEFAULT NULL,
    resume_url       VARCHAR(500) DEFAULT NULL,
    years_experience DECIMAL(4,1) DEFAULT NULL,
    degree_field_id  BIGINT       DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_candidate_profiles_user         FOREIGN KEY (user_id)        REFERENCES users (user_id),
    CONSTRAINT fk_candidate_profiles_degree_field FOREIGN KEY (degree_field_id) REFERENCES degree_fields (id)
);

-- -----------------------------------------------------------------------------
-- 7. candidate_certificates
--    Depends on: candidate_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE candidate_certificates (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    profile_user_id BIGINT       NOT NULL,
    name            VARCHAR(255) NOT NULL,
    issuer          VARCHAR(255) DEFAULT NULL,
    issue_date      DATE         DEFAULT NULL,
    expiry_date     DATE         DEFAULT NULL,
    credential_url  VARCHAR(500) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_candidate_certificates_profile
        FOREIGN KEY (profile_user_id) REFERENCES candidate_profiles (user_id)
);

-- -----------------------------------------------------------------------------
-- 8. candidate_experiences
--    Depends on: candidate_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE candidate_experiences (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    profile_user_id BIGINT       NOT NULL,
    type            VARCHAR(30)  NOT NULL,
    title           VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255) DEFAULT NULL,
    start_date      DATE         DEFAULT NULL,
    end_date        DATE         DEFAULT NULL,
    description     TEXT         DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_candidate_experiences_profile
        FOREIGN KEY (profile_user_id) REFERENCES candidate_profiles (user_id)
);

-- -----------------------------------------------------------------------------
-- 9. jobs
--    Depends on: companies
-- -----------------------------------------------------------------------------
CREATE TABLE jobs (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY,
    company_id           BIGINT        NOT NULL,
    title                VARCHAR(255)  NOT NULL,
    description          TEXT          NOT NULL,
    tagline              VARCHAR(255)  DEFAULT NULL,
    employment_type      VARCHAR(30)   NOT NULL,
    level                VARCHAR(255)  DEFAULT NULL,
    location             VARCHAR(255)  DEFAULT NULL,
    number_of_applicants INT           NOT NULL,
    pay_min              DECIMAL(12,2) DEFAULT NULL,
    pay_max              DECIMAL(12,2) DEFAULT NULL,
    pay_period           VARCHAR(10)   DEFAULT NULL,
    pay_type             VARCHAR(20)   DEFAULT NULL,
    status               VARCHAR(20)   NOT NULL,
    created_at           TIMESTAMP(6)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies (id)
);

CREATE INDEX idx_jobs_status_created_at         ON jobs (status, created_at);
CREATE INDEX idx_jobs_company_created_at        ON jobs (company_id, created_at);
CREATE INDEX idx_jobs_company_status_created_at ON jobs (company_id, status, created_at);

-- -----------------------------------------------------------------------------
-- 10. job_benefits (element collection)
--     Depends on: jobs
-- -----------------------------------------------------------------------------
CREATE TABLE job_benefits (
    job_id  BIGINT       NOT NULL,
    benefit VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_job_benefits_job
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
);

CREATE INDEX idx_job_benefits_job_id ON job_benefits (job_id);

-- -----------------------------------------------------------------------------
-- 11. job_minimum_requirements (element collection)
--     Depends on: jobs
-- -----------------------------------------------------------------------------
CREATE TABLE job_minimum_requirements (
    job_id      BIGINT       NOT NULL,
    requirement VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_job_minimum_requirements_job
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
);

CREATE INDEX idx_job_minimum_requirements_job_id ON job_minimum_requirements (job_id);

-- -----------------------------------------------------------------------------
-- 12. job_degree_fields (M:M join table)
--     Depends on: jobs, degree_fields
-- -----------------------------------------------------------------------------
CREATE TABLE job_degree_fields (
    job_id          BIGINT NOT NULL,
    degree_field_id BIGINT NOT NULL,
    PRIMARY KEY (job_id, degree_field_id),
    CONSTRAINT fk_job_degree_fields_job
        FOREIGN KEY (job_id)          REFERENCES jobs (id),
    CONSTRAINT fk_job_degree_fields_degree_field
        FOREIGN KEY (degree_field_id) REFERENCES degree_fields (id)
);

CREATE INDEX idx_job_degree_fields_degree_field_id ON job_degree_fields (degree_field_id);

-- -----------------------------------------------------------------------------
-- 13. job_applications
--     Depends on: users, jobs, companies
-- -----------------------------------------------------------------------------
CREATE TABLE job_applications (
    id         BIGINT       GENERATED ALWAYS AS IDENTITY,
    user_id    BIGINT       NOT NULL,
    job_id     BIGINT       NOT NULL,
    company_id BIGINT       NOT NULL,
    status     VARCHAR(20)  NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NULL,
    updated_at TIMESTAMP(6) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_job_application_job_user UNIQUE (job_id, user_id),
    CONSTRAINT fk_job_applications_user    FOREIGN KEY (user_id)    REFERENCES users (user_id),
    CONSTRAINT fk_job_applications_job     FOREIGN KEY (job_id)     REFERENCES jobs (id),
    CONSTRAINT fk_job_applications_company FOREIGN KEY (company_id) REFERENCES companies (id)
);

CREATE INDEX idx_job_app_company_created_at        ON job_applications (company_id, created_at);
CREATE INDEX idx_job_app_company_status_created_at ON job_applications (company_id, status, created_at);
CREATE INDEX idx_job_app_user_created_at           ON job_applications (user_id, created_at);

-- -----------------------------------------------------------------------------
-- 14. job_application_status_audits
--     Depends on: job_applications
-- -----------------------------------------------------------------------------
CREATE TABLE job_application_status_audits (
    id             BIGINT        GENERATED ALWAYS AS IDENTITY,
    application_id BIGINT        NOT NULL,
    company_id     BIGINT        NOT NULL,
    actor_user_id  BIGINT        NOT NULL,
    from_status    VARCHAR(50)   NOT NULL,
    to_status      VARCHAR(50)   NOT NULL,
    note           VARCHAR(1000) DEFAULT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_audit_application
        FOREIGN KEY (application_id) REFERENCES job_applications (id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_application_created_at ON job_application_status_audits (application_id, created_at);
CREATE INDEX idx_audit_company_created_at     ON job_application_status_audits (company_id, created_at);

-- -----------------------------------------------------------------------------
-- 15. saved_jobs
--     Depends on: users, jobs
-- -----------------------------------------------------------------------------
CREATE TABLE saved_jobs (
    id         BIGINT       GENERATED ALWAYS AS IDENTITY,
    user_id    BIGINT       NOT NULL,
    job_id     BIGINT       NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_saved_job_user_job UNIQUE (user_id, job_id),
    CONSTRAINT fk_saved_jobs_user   FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_saved_jobs_job    FOREIGN KEY (job_id)  REFERENCES jobs (id)
);

CREATE INDEX idx_saved_jobs_user_created_at ON saved_jobs (user_id, created_at);
CREATE INDEX idx_saved_jobs_job             ON saved_jobs (job_id);

-- -----------------------------------------------------------------------------
-- 16. password_reset_tokens
--     Depends on: users
-- -----------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    id         BIGINT       GENERATED ALWAYS AS IDENTITY,
    token_hash VARCHAR(64)  NOT NULL,
    user_id    BIGINT       NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    used_at    TIMESTAMP(6) DEFAULT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_prt_token_hash UNIQUE (token_hash),
    CONSTRAINT fk_prt_user       FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_prt_user_id    ON password_reset_tokens (user_id);
CREATE INDEX idx_prt_expires_at ON password_reset_tokens (expires_at);