-- ============================================
-- Performance Indexes
-- WorkerConnect - Supabase PostgreSQL
-- ============================================

-- ============================================
-- WORKER TABLE INDEXES
-- ============================================

-- Frequently queried fields
CREATE INDEX idx_worker_aadhaar ON worker(aadhaar_number);
CREATE INDEX idx_worker_mobile ON worker(mobile_number);
CREATE INDEX idx_worker_email ON worker(email_id);
CREATE INDEX idx_worker_status ON worker(status);
CREATE INDEX idx_worker_full_name ON worker(full_name);

-- Address lookups
CREATE INDEX idx_worker_per_district ON worker(per_district_id);
CREATE INDEX idx_worker_per_city ON worker(per_city_id);
CREATE INDEX idx_worker_pre_district ON worker(pre_district_id);
CREATE INDEX idx_worker_pre_city ON worker(pre_city_id);

-- ============================================
-- ESTABLISHMENT TABLE INDEXES
-- ============================================

-- Frequently queried fields
CREATE INDEX idx_establishment_mobile ON establishment(mobile_number);
CREATE INDEX idx_establishment_email ON establishment(email_id);
CREATE INDEX idx_establishment_status ON establishment(status);
CREATE INDEX idx_establishment_name ON establishment(establishment_name);

-- Category and work nature lookups
CREATE INDEX idx_establishment_category ON establishment(category_id);
CREATE INDEX idx_establishment_work_nature ON establishment(work_nature_id);

-- Location lookups
CREATE INDEX idx_establishment_district ON establishment(district_id);
CREATE INDEX idx_establishment_city ON establishment(city_id);

-- Date range queries
CREATE INDEX idx_establishment_commencement ON establishment(commencement_date);
CREATE INDEX idx_establishment_completion ON establishment(completion_date);
CREATE INDEX idx_establishment_registration ON establishment(registration_date);

-- ============================================
-- ESTABLISHMENT_WORKER TABLE INDEXES
-- ============================================

-- Junction table lookups
CREATE INDEX idx_estmt_worker_establishment ON establishment_worker(establishment_id);
CREATE INDEX idx_estmt_worker_worker ON establishment_worker(worker_id);
CREATE INDEX idx_estmt_worker_aadhaar ON establishment_worker(aadhaar_card_number);
CREATE INDEX idx_estmt_worker_status ON establishment_worker(status);

-- Date range queries for active workers
CREATE INDEX idx_estmt_worker_working_from ON establishment_worker(working_from_date);
CREATE INDEX idx_estmt_worker_working_to ON establishment_worker(working_to_date);

-- Composite index for finding active workers at establishment
CREATE INDEX idx_estmt_worker_active ON establishment_worker(establishment_id, status, working_from_date, working_to_date);

-- ============================================
-- ATTENDANCE TABLE INDEXES
-- ============================================

-- Foreign key lookups
CREATE INDEX idx_attendance_establishment ON attendance(establishment_id);
CREATE INDEX idx_attendance_worker ON attendance(worker_id);
CREATE INDEX idx_attendance_estmt_worker ON attendance(estmt_worker_id);

-- Status queries
CREATE INDEX idx_attendance_status ON attendance(status);

-- Date/time queries
CREATE INDEX idx_attendance_checkin ON attendance(check_in_date_time);
CREATE INDEX idx_attendance_checkout ON attendance(check_out_date_time);

-- Composite index for attendance reports
CREATE INDEX idx_attendance_report ON attendance(establishment_id, check_in_date_time DESC);

-- Composite index for worker attendance history
CREATE INDEX idx_attendance_worker_history ON attendance(worker_id, check_in_date_time DESC);

-- Index for finding currently checked-in workers
CREATE INDEX idx_attendance_current_checkin ON attendance(establishment_id, status) WHERE status = 'i' AND check_out_date_time IS NULL;

-- ============================================
-- DEPARTMENT_USER TABLE INDEXES
-- ============================================

CREATE INDEX idx_dept_user_email ON department_user(email_id);
CREATE INDEX idx_dept_user_role ON department_user(department_role_id);
CREATE INDEX idx_dept_user_status ON department_user(status);

-- ============================================
-- WORKER_DEPENDENTS TABLE INDEXES
-- ============================================

CREATE INDEX idx_dependents_worker ON worker_dependents(worker_id);
CREATE INDEX idx_dependents_nominee ON worker_dependents(is_nominee_selected) WHERE is_nominee_selected = true;

-- ============================================
-- MASTER DATA TABLE INDEXES
-- ============================================

-- State indexes
CREATE INDEX idx_state_code ON state(state_code);

-- District indexes
CREATE INDEX idx_district_state ON district(state_id);
CREATE INDEX idx_district_code ON district(district_code);
CREATE INDEX idx_district_name ON district(district_name);

-- City/Mandal indexes
CREATE INDEX idx_city_district ON city_mandal(district_id);
CREATE INDEX idx_city_code ON city_mandal(city_code);
CREATE INDEX idx_city_name ON city_mandal(city_name);

-- Village/Area indexes
CREATE INDEX idx_village_city ON village_area(city_id);
CREATE INDEX idx_village_code ON village_area(village_or_area_code);
CREATE INDEX idx_village_name ON village_area(village_or_area_name);

-- Establishment category indexes
CREATE INDEX idx_category_name ON establishment_category(category_name);

-- Work nature indexes
CREATE INDEX idx_work_nature_category ON establishment_work_nature(category_id);
CREATE INDEX idx_work_nature_name ON establishment_work_nature(work_nature_name);

-- ============================================
-- FULL TEXT SEARCH INDEXES (Optional - for advanced search)
-- ============================================

-- Enable trigram extension for full-text search
-- Uncomment the line below if you want full-text search capabilities
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- For searching workers by name (requires pg_trgm extension)
-- Uncomment the line below after enabling pg_trgm extension
-- CREATE INDEX idx_worker_name_trgm ON worker USING gin(full_name gin_trgm_ops);

-- For searching establishments by name (requires pg_trgm extension)
-- Uncomment the line below after enabling pg_trgm extension
-- CREATE INDEX idx_establishment_name_trgm ON establishment USING gin(establishment_name gin_trgm_ops);

-- Note: Full-text search indexes are optional and not required for basic functionality
-- To enable them:
-- 1. Run: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- 2. Uncomment the two CREATE INDEX lines above
-- 3. Run this script again

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON INDEX idx_worker_aadhaar IS 'Fast lookup of workers by Aadhaar number';
COMMENT ON INDEX idx_worker_mobile IS 'Fast lookup of workers by mobile number';
COMMENT ON INDEX idx_establishment_mobile IS 'Fast lookup of establishments by mobile number';
COMMENT ON INDEX idx_attendance_current_checkin IS 'Partial index for finding currently checked-in workers';
COMMENT ON INDEX idx_estmt_worker_active IS 'Composite index for finding active workers at an establishment';

