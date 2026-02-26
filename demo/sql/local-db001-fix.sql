-- Local-only schema fix for DB-001 (Hibernate update warnings)
-- Target DB: giga
-- Purpose:
-- 1) Align inquiry PK type with JPA (BIGINT signed)
-- 2) Recreate inquiry_memo_history with matching FK type
-- Note: Back up data first if needed.

USE giga;

-- Check current table DDL before running (optional)
-- SHOW CREATE TABLE inquiry;
-- SHOW CREATE TABLE inquiry_memo_history;

-- Recreate memo history table with FK type matching inquiry.inquiry_id (BIGINT signed)
DROP TABLE IF EXISTS inquiry_memo_history;

-- inquiry.inquiry_id is often created as BIGINT UNSIGNED from manual DDL.
-- JPA Long maps to BIGINT (signed), so align it to signed to avoid FK type mismatch.
ALTER TABLE inquiry
  MODIFY COLUMN inquiry_id BIGINT NOT NULL AUTO_INCREMENT;

CREATE TABLE inquiry_memo_history (
  memo_history_id BIGINT NOT NULL AUTO_INCREMENT,
  inquiry_id BIGINT NOT NULL,
  admin_name VARCHAR(100) NOT NULL,
  previous_memo TEXT NULL,
  next_memo TEXT NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  PRIMARY KEY (memo_history_id),
  KEY idx_inquiry_memo_history_inquiry (inquiry_id),
  CONSTRAINT fk_inquiry_memo_history_inquiry
    FOREIGN KEY (inquiry_id) REFERENCES inquiry(inquiry_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Applicant / Portfolio parent PKs may also be UNSIGNED from manual DDL.
-- JPA long -> BIGINT(signed), so align parent PKs to signed and recreate child tables if needed.
DROP TABLE IF EXISTS applicant_file;
DROP TABLE IF EXISTS portfolio_image;

ALTER TABLE applicant
  MODIFY COLUMN applicant_id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE portfolio
  MODIFY COLUMN portfolio_id BIGINT NOT NULL AUTO_INCREMENT;

-- After this, restart Spring Boot.
