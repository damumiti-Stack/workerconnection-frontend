-- ============================================
-- Row Level Security (RLS) Policies
-- WorkerConnect - Supabase PostgreSQL
-- ============================================

-- Note: RLS provides data-level security in Supabase
-- These policies control who can access what data

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE state ENABLE ROW LEVEL SECURITY;
ALTER TABLE district ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_mandal ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_area ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_work_nature ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_worker ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_user ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MASTER DATA TABLES - READ-ONLY FOR ALL
-- ============================================

-- Anyone can read master data (states, districts, etc.)
CREATE POLICY "Master data readable by all" ON state FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON district FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON city_mandal FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON village_area FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON establishment_category FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON establishment_work_nature FOR SELECT USING (true);
CREATE POLICY "Master data readable by all" ON department_role FOR SELECT USING (true);

-- ============================================
-- WORKER TABLE POLICIES
-- ============================================

-- Workers can read their own data
CREATE POLICY "Workers can view own profile" 
    ON worker FOR SELECT 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Workers can update their own data
CREATE POLICY "Workers can update own profile" 
    ON worker FOR UPDATE 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Allow worker registration (anyone can insert)
CREATE POLICY "Allow worker registration" 
    ON worker FOR INSERT 
    WITH CHECK (true);

-- Department users can read all workers
CREATE POLICY "Department can view all workers" 
    ON worker FOR SELECT 
    USING (current_setting('app.user_role', true) = 'department');

-- Department users can update workers
CREATE POLICY "Department can update workers" 
    ON worker FOR UPDATE 
    USING (current_setting('app.user_role', true) = 'department');

-- ============================================
-- WORKER_DEPENDENTS TABLE POLICIES
-- ============================================

-- Workers can manage their own dependents
CREATE POLICY "Workers manage own dependents" 
    ON worker_dependents FOR ALL 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Department users can view all dependents
CREATE POLICY "Department can view dependents" 
    ON worker_dependents FOR SELECT 
    USING (current_setting('app.user_role', true) = 'department');

-- ============================================
-- ESTABLISHMENT TABLE POLICIES
-- ============================================

-- Establishments can view their own data
CREATE POLICY "Establishments view own profile" 
    ON establishment FOR SELECT 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Establishments can update their own data
CREATE POLICY "Establishments update own profile" 
    ON establishment FOR UPDATE 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Allow establishment registration
CREATE POLICY "Allow establishment registration" 
    ON establishment FOR INSERT 
    WITH CHECK (true);

-- Department users can read all establishments
CREATE POLICY "Department can view all establishments" 
    ON establishment FOR SELECT 
    USING (current_setting('app.user_role', true) = 'department');

-- Department users can update establishments
CREATE POLICY "Department can update establishments" 
    ON establishment FOR UPDATE 
    USING (current_setting('app.user_role', true) = 'department');

-- ============================================
-- ESTABLISHMENT_WORKER TABLE POLICIES
-- ============================================

-- Establishments can view their workers
CREATE POLICY "Establishments view own workers" 
    ON establishment_worker FOR SELECT 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Establishments can add workers
CREATE POLICY "Establishments add workers" 
    ON establishment_worker FOR INSERT 
    WITH CHECK (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Establishments can update their worker relationships
CREATE POLICY "Establishments update own workers" 
    ON establishment_worker FOR UPDATE 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Workers can view their establishment relationships
CREATE POLICY "Workers view own establishments" 
    ON establishment_worker FOR SELECT 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Department users can view all relationships
CREATE POLICY "Department view all worker-establishment links" 
    ON establishment_worker FOR SELECT 
    USING (current_setting('app.user_role', true) = 'department');

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

-- Establishments can view attendance of their workers
CREATE POLICY "Establishments view own attendance" 
    ON attendance FOR SELECT 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Workers can view their own attendance
CREATE POLICY "Workers view own attendance" 
    ON attendance FOR SELECT 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Workers can check-in/out (insert attendance)
CREATE POLICY "Workers can check-in" 
    ON attendance FOR INSERT 
    WITH CHECK (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Workers can update their own attendance (for checkout)
CREATE POLICY "Workers can check-out" 
    ON attendance FOR UPDATE 
    USING (worker_id = current_setting('app.current_worker_id', true)::INTEGER);

-- Establishments can manage attendance
CREATE POLICY "Establishments manage attendance" 
    ON attendance FOR ALL 
    USING (establishment_id = current_setting('app.current_establishment_id', true)::INTEGER);

-- Department users can view all attendance
CREATE POLICY "Department view all attendance" 
    ON attendance FOR SELECT 
    USING (current_setting('app.user_role', true) = 'department');

-- ============================================
-- DEPARTMENT_USER TABLE POLICIES
-- ============================================

-- Department users can view their own profile
CREATE POLICY "Department users view own profile" 
    ON department_user FOR SELECT 
    USING (department_user_id = current_setting('app.current_dept_user_id', true)::INTEGER);

-- Department users can update their own profile
CREATE POLICY "Department users update own profile" 
    ON department_user FOR UPDATE 
    USING (department_user_id = current_setting('app.current_dept_user_id', true)::INTEGER);

-- Only super admins can manage department users
CREATE POLICY "Super admins manage department users" 
    ON department_user FOR ALL 
    USING (current_setting('app.user_role', true) = 'super_admin');

-- ============================================
-- SERVICE ROLE BYPASS
-- ============================================

-- Create policies that allow service role (backend) to bypass RLS
-- This is for the backend API to have full access

CREATE POLICY "Service role has full access to workers" 
    ON worker FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

CREATE POLICY "Service role has full access to worker_dependents" 
    ON worker_dependents FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

CREATE POLICY "Service role has full access to establishments" 
    ON establishment FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

CREATE POLICY "Service role has full access to establishment_worker" 
    ON establishment_worker FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

CREATE POLICY "Service role has full access to attendance" 
    ON attendance FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

CREATE POLICY "Service role has full access to department_user" 
    ON department_user FOR ALL 
    USING (current_setting('app.bypass_rls', true) = 'true');

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

-- Function to set worker context
CREATE OR REPLACE FUNCTION set_worker_context(worker_id_val INTEGER)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_worker_id', worker_id_val::TEXT, false);
    PERFORM set_config('app.user_role', 'worker', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set establishment context
CREATE OR REPLACE FUNCTION set_establishment_context(establishment_id_val INTEGER)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_establishment_id', establishment_id_val::TEXT, false);
    PERFORM set_config('app.user_role', 'establishment', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set department context
CREATE OR REPLACE FUNCTION set_department_context(dept_user_id_val INTEGER, role_name_val TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_dept_user_id', dept_user_id_val::TEXT, false);
    PERFORM set_config('app.user_role', 
        CASE 
            WHEN role_name_val = 'Super Admin' THEN 'super_admin'
            ELSE 'department'
        END, 
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enable service role bypass
CREATE OR REPLACE FUNCTION enable_service_role_bypass()
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.bypass_rls', 'true', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON POLICY "Workers can view own profile" ON worker IS 
    'Workers can only view their own profile data';

COMMENT ON POLICY "Department can view all workers" ON worker IS 
    'Department users have read access to all worker records';

COMMENT ON POLICY "Service role has full access to workers" ON worker IS 
    'Backend service role can bypass RLS for API operations';

COMMENT ON FUNCTION set_worker_context IS 
    'Sets the current worker context for RLS policies';

COMMENT ON FUNCTION set_establishment_context IS 
    'Sets the current establishment context for RLS policies';

COMMENT ON FUNCTION set_department_context IS 
    'Sets the current department user context for RLS policies';

-- ============================================
-- NOTES FOR BACKEND IMPLEMENTATION
-- ============================================

/*
In your backend API, after successful authentication, call:
- For workers: SELECT set_worker_context(123);
- For establishments: SELECT set_establishment_context(456);
- For department: SELECT set_department_context(789, 'Admin');
- For service operations: SELECT enable_service_role_bypass();

Or use Supabase service role key which automatically bypasses RLS.
*/

