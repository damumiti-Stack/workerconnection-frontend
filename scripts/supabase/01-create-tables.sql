-- ============================================
-- WorkerConnect - Supabase PostgreSQL Schema
-- Labour Management System Database Tables
-- ============================================

-- Enable UUID extension for generating correlation IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MASTER DATA TABLES
-- ============================================

-- 1. STATE Table
CREATE TABLE state (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DISTRICT Table
CREATE TABLE district (
    district_id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL REFERENCES state(state_id) ON DELETE CASCADE,
    district_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, district_code)
);

-- 3. CITY/MANDAL Table
CREATE TABLE city_mandal (
    city_id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES district(district_id) ON DELETE CASCADE,
    city_name VARCHAR(100) NOT NULL,
    city_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(district_id, city_code)
);

-- 4. VILLAGE/AREA Table
CREATE TABLE village_area (
    village_or_area_id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES city_mandal(city_id) ON DELETE CASCADE,
    village_or_area_name VARCHAR(100) NOT NULL,
    village_or_area_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id, village_or_area_code)
);

-- 5. ESTABLISHMENT_CATEGORY Table
CREATE TABLE establishment_category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ESTABLISHMENT_WORK_NATURE Table
CREATE TABLE establishment_work_nature (
    work_nature_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES establishment_category(category_id) ON DELETE CASCADE,
    work_nature_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, work_nature_name)
);

-- 7. DEPARTMENT_ROLE Table
CREATE TABLE department_role (
    department_role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CORE ENTITY TABLES
-- ============================================

-- 8. WORKER Table
CREATE TABLE worker (
    worker_id SERIAL PRIMARY KEY,
    
    -- Identity Information
    aadhaar_number VARCHAR(12) NOT NULL UNIQUE,
    e_card_id VARCHAR(50),
    e_sharm_id VARCHAR(50),
    bo_cw_id VARCHAR(50),
    access_card_id VARCHAR(50),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(300) GENERATED ALWAYS AS (
        CASE 
            WHEN middle_name IS NOT NULL THEN first_name || ' ' || middle_name || ' ' || last_name
            ELSE first_name || ' ' || last_name
        END
    ) STORED,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'transgender')),
    marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    date_of_birth DATE NOT NULL,
    age INTEGER,
    relative_name VARCHAR(100), -- Father/Husband name
    caste VARCHAR(50),
    sub_caste VARCHAR(50),
    
    -- Contact Information
    mobile_number BIGINT NOT NULL UNIQUE,
    email_id VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    -- Permanent Address
    per_door_number VARCHAR(20),
    per_street VARCHAR(100),
    per_state_id INTEGER REFERENCES state(state_id),
    per_state_code VARCHAR(10),
    per_district_id INTEGER REFERENCES district(district_id),
    per_district_code VARCHAR(10),
    per_city_id INTEGER REFERENCES city_mandal(city_id),
    per_city_code VARCHAR(10),
    per_village_or_area_id INTEGER REFERENCES village_area(village_or_area_id),
    per_pincode INTEGER,
    
    -- Present Address
    is_same_as_per_addr BOOLEAN DEFAULT false,
    pre_door_number VARCHAR(20),
    pre_street VARCHAR(100),
    pre_state_id INTEGER REFERENCES state(state_id),
    pre_state_code VARCHAR(10),
    pre_district_id INTEGER REFERENCES district(district_id),
    pre_district_code VARCHAR(10),
    pre_city_id INTEGER REFERENCES city_mandal(city_id),
    pre_city_code VARCHAR(10),
    pre_village_or_area_id INTEGER REFERENCES village_area(village_or_area_id),
    pre_pincode INTEGER,
    
    -- Membership Information
    is_nres_member CHAR(1) DEFAULT 'N' CHECK (is_nres_member IN ('Y', 'N')),
    is_trade_union CHAR(1) DEFAULT 'N' CHECK (is_trade_union IN ('Y', 'N')),
    trade_union_number INTEGER,
    
    -- System Fields
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_logged_in TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. WORKER_DEPENDENTS Table
CREATE TABLE worker_dependents (
    dependent_id SERIAL PRIMARY KEY,
    worker_id INTEGER NOT NULL REFERENCES worker(worker_id) ON DELETE CASCADE,
    dependent_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_nominee_selected BOOLEAN DEFAULT false,
    percentage_of_benefits DECIMAL(5,2) DEFAULT 0.00 CHECK (percentage_of_benefits >= 0 AND percentage_of_benefits <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. ESTABLISHMENT Table
CREATE TABLE establishment (
    establishment_id SERIAL PRIMARY KEY,
    
    -- Basic Information
    establishment_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    mobile_number BIGINT NOT NULL UNIQUE,
    email_id VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    -- Address Information
    door_number VARCHAR(20),
    street VARCHAR(100),
    state_id INTEGER NOT NULL REFERENCES state(state_id),
    state_code VARCHAR(10) NOT NULL,
    district_id INTEGER NOT NULL REFERENCES district(district_id),
    district_code VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    city_id INTEGER NOT NULL REFERENCES city_mandal(city_id),
    city_code VARCHAR(10) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    village_or_area_id INTEGER REFERENCES village_area(village_or_area_id),
    village_or_area_code VARCHAR(10),
    village_or_area_name VARCHAR(100),
    pincode INTEGER NOT NULL,
    
    -- Business Details
    is_plan_approval_id CHAR(1) DEFAULT 'N' CHECK (is_plan_approval_id IN ('Y', 'N')),
    plan_approval_id VARCHAR(50),
    category_id INTEGER NOT NULL REFERENCES establishment_category(category_id),
    work_nature_id INTEGER NOT NULL REFERENCES establishment_work_nature(work_nature_id),
    
    -- Project Details
    commencement_date DATE NOT NULL,
    completion_date DATE,
    construction_estimated_cost DECIMAL(15,2),
    construction_area DECIMAL(10,2),
    built_up_area DECIMAL(10,2),
    basic_estimated_cost DECIMAL(15,2),
    no_of_male_workers INTEGER DEFAULT 0,
    no_of_female_workers INTEGER DEFAULT 0,
    
    -- Terms and Conditions
    is_accepted_terms_and_conditions CHAR(1) DEFAULT 'N' CHECK (is_accepted_terms_and_conditions IN ('Y', 'N')),
    
    -- System Fields
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_logged_in TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. ESTABLISHMENT_WORKER Junction Table
CREATE TABLE establishment_worker (
    estmt_worker_id SERIAL PRIMARY KEY,
    establishment_id INTEGER NOT NULL REFERENCES establishment(establishment_id) ON DELETE CASCADE,
    worker_id INTEGER NOT NULL REFERENCES worker(worker_id) ON DELETE CASCADE,
    aadhaar_card_number VARCHAR(12) NOT NULL,
    working_from_date DATE NOT NULL,
    working_to_date DATE,
    work_location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(establishment_id, worker_id)
);

-- 12. ATTENDANCE Table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    establishment_id INTEGER NOT NULL REFERENCES establishment(establishment_id) ON DELETE CASCADE,
    worker_id INTEGER NOT NULL REFERENCES worker(worker_id) ON DELETE CASCADE,
    estmt_worker_id INTEGER NOT NULL REFERENCES establishment_worker(estmt_worker_id) ON DELETE CASCADE,
    work_location VARCHAR(200),
    check_in_date_time TIMESTAMP,
    check_out_date_time TIMESTAMP,
    status CHAR(1) NOT NULL CHECK (status IN ('i', 'o')), -- 'i' for check-in, 'o' for check-out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. DEPARTMENT_USER Table
CREATE TABLE department_user (
    department_user_id SERIAL PRIMARY KEY,
    department_role_id INTEGER NOT NULL REFERENCES department_role(department_role_id),
    email_id VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_number BIGINT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_logged_in TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_state_updated_at BEFORE UPDATE ON state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_district_updated_at BEFORE UPDATE ON district FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_mandal_updated_at BEFORE UPDATE ON city_mandal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_village_area_updated_at BEFORE UPDATE ON village_area FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_establishment_category_updated_at BEFORE UPDATE ON establishment_category FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_establishment_work_nature_updated_at BEFORE UPDATE ON establishment_work_nature FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_role_updated_at BEFORE UPDATE ON department_role FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_worker_updated_at BEFORE UPDATE ON worker FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_worker_dependents_updated_at BEFORE UPDATE ON worker_dependents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_establishment_updated_at BEFORE UPDATE ON establishment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_establishment_worker_updated_at BEFORE UPDATE ON establishment_worker FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_user_updated_at BEFORE UPDATE ON department_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE state IS 'Master table for Indian states';
COMMENT ON TABLE district IS 'Master table for districts within states';
COMMENT ON TABLE city_mandal IS 'Master table for cities/mandals within districts';
COMMENT ON TABLE village_area IS 'Master table for villages/areas within cities';
COMMENT ON TABLE establishment_category IS 'Categories of establishments (Government, Private, etc.)';
COMMENT ON TABLE establishment_work_nature IS 'Nature of work for establishments';
COMMENT ON TABLE department_role IS 'Roles for department users';
COMMENT ON TABLE worker IS 'Construction workers registration and profile data';
COMMENT ON TABLE worker_dependents IS 'Family dependents of workers';
COMMENT ON TABLE establishment IS 'Construction establishments/companies';
COMMENT ON TABLE establishment_worker IS 'Junction table linking workers to establishments';
COMMENT ON TABLE attendance IS 'Worker attendance check-in/check-out records';
COMMENT ON TABLE department_user IS 'Department officials and administrators';

