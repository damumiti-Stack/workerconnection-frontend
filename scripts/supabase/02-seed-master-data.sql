-- ============================================
-- Seed Master Data
-- WorkerConnect - Supabase PostgreSQL
-- ============================================

-- ============================================
-- 1. STATE DATA (Andhra Pradesh)
-- ============================================

INSERT INTO state (state_name, state_code) VALUES
('Andhra Pradesh', 'AP');

-- Get the state_id for Andhra Pradesh
DO $$
DECLARE
    ap_state_id INTEGER;
BEGIN
    SELECT state_id INTO ap_state_id FROM state WHERE state_code = 'AP';

-- ============================================
-- 2. DISTRICT DATA (Andhra Pradesh Districts)
-- ============================================

INSERT INTO district (state_id, district_name, district_code) VALUES
(ap_state_id, 'Anantapur', 'ATP'),
(ap_state_id, 'Chittoor', 'CTR'),
(ap_state_id, 'East Godavari', 'EG'),
(ap_state_id, 'Guntur', 'GNT'),
(ap_state_id, 'Krishna', 'KRS'),
(ap_state_id, 'Kurnool', 'KNL'),
(ap_state_id, 'Prakasam', 'PKM'),
(ap_state_id, 'Nellore', 'NLR'),
(ap_state_id, 'Srikakulam', 'SKL'),
(ap_state_id, 'Visakhapatnam', 'VSP'),
(ap_state_id, 'Vizianagaram', 'VZM'),
(ap_state_id, 'West Godavari', 'WG'),
(ap_state_id, 'YSR Kadapa', 'YSR');

-- ============================================
-- 3. CITY/MANDAL DATA (Sample data for major cities)
-- ============================================

-- Visakhapatnam District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Visakhapatnam Urban', 'VSP-URB' FROM district WHERE district_code = 'VSP'
UNION ALL
SELECT district_id, 'Gajuwaka', 'VSP-GAJ' FROM district WHERE district_code = 'VSP'
UNION ALL
SELECT district_id, 'Anakapalli', 'VSP-ANK' FROM district WHERE district_code = 'VSP'
UNION ALL
SELECT district_id, 'Bheemunipatnam', 'VSP-BHP' FROM district WHERE district_code = 'VSP';

-- Guntur District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Guntur', 'GNT-GNT' FROM district WHERE district_code = 'GNT'
UNION ALL
SELECT district_id, 'Tenali', 'GNT-TNL' FROM district WHERE district_code = 'GNT'
UNION ALL
SELECT district_id, 'Mangalagiri', 'GNT-MGL' FROM district WHERE district_code = 'GNT'
UNION ALL
SELECT district_id, 'Narasaraopet', 'GNT-NSP' FROM district WHERE district_code = 'GNT';

-- Krishna District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Vijayawada', 'KRS-VJA' FROM district WHERE district_code = 'KRS'
UNION ALL
SELECT district_id, 'Machilipatnam', 'KRS-MCH' FROM district WHERE district_code = 'KRS'
UNION ALL
SELECT district_id, 'Gudivada', 'KRS-GDV' FROM district WHERE district_code = 'KRS';

-- East Godavari District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Kakinada', 'EG-KKD' FROM district WHERE district_code = 'EG'
UNION ALL
SELECT district_id, 'Rajahmundry', 'EG-RJY' FROM district WHERE district_code = 'EG'
UNION ALL
SELECT district_id, 'Amalapuram', 'EG-AMP' FROM district WHERE district_code = 'EG';

-- Chittoor District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Tirupati', 'CTR-TPT' FROM district WHERE district_code = 'CTR'
UNION ALL
SELECT district_id, 'Chittoor', 'CTR-CTR' FROM district WHERE district_code = 'CTR'
UNION ALL
SELECT district_id, 'Madanapalle', 'CTR-MDP' FROM district WHERE district_code = 'CTR';

-- Anantapur District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Anantapur', 'ATP-ATP' FROM district WHERE district_code = 'ATP'
UNION ALL
SELECT district_id, 'Hindupur', 'ATP-HDP' FROM district WHERE district_code = 'ATP';

-- Kurnool District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Kurnool', 'KNL-KNL' FROM district WHERE district_code = 'KNL'
UNION ALL
SELECT district_id, 'Nandyal', 'KNL-NDL' FROM district WHERE district_code = 'KNL';

-- Nellore District
INSERT INTO city_mandal (district_id, city_name, city_code)
SELECT district_id, 'Nellore', 'NLR-NLR' FROM district WHERE district_code = 'NLR'
UNION ALL
SELECT district_id, 'Gudur', 'NLR-GDR' FROM district WHERE district_code = 'NLR';

-- ============================================
-- 4. VILLAGE/AREA DATA (Sample data for major areas)
-- ============================================

-- Visakhapatnam Urban areas
INSERT INTO village_area (city_id, village_or_area_name, village_or_area_code)
SELECT city_id, 'MVP Colony', 'MVP' FROM city_mandal WHERE city_code = 'VSP-URB'
UNION ALL
SELECT city_id, 'Dwaraka Nagar', 'DWK' FROM city_mandal WHERE city_code = 'VSP-URB'
UNION ALL
SELECT city_id, 'Madhurawada', 'MDW' FROM city_mandal WHERE city_code = 'VSP-URB';

-- Gajuwaka areas
INSERT INTO village_area (city_id, village_or_area_name, village_or_area_code)
SELECT city_id, 'Kurmannapalem', 'KMP' FROM city_mandal WHERE city_code = 'VSP-GAJ'
UNION ALL
SELECT city_id, 'Gajuwaka Town', 'GJT' FROM city_mandal WHERE city_code = 'VSP-GAJ';

-- Vijayawada areas
INSERT INTO village_area (city_id, village_or_area_name, village_or_area_code)
SELECT city_id, 'Benz Circle', 'BNZ' FROM city_mandal WHERE city_code = 'KRS-VJA'
UNION ALL
SELECT city_id, 'Governorpet', 'GVP' FROM city_mandal WHERE city_code = 'KRS-VJA'
UNION ALL
SELECT city_id, 'Patamata', 'PTM' FROM city_mandal WHERE city_code = 'KRS-VJA';

-- Guntur areas
INSERT INTO village_area (city_id, village_or_area_name, village_or_area_code)
SELECT city_id, 'Guntur Urban', 'GU' FROM city_mandal WHERE city_code = 'GNT-GNT'
UNION ALL
SELECT city_id, 'Brodipet', 'BRD' FROM city_mandal WHERE city_code = 'GNT-GNT';

-- ============================================
-- 5. ESTABLISHMENT CATEGORY DATA
-- ============================================

INSERT INTO establishment_category (category_name, description) VALUES
('State Government', 'State government construction projects and departments'),
('Central Government', 'Central government construction projects and departments'),
('Private Residential', 'Private residential construction projects'),
('Private Commercial', 'Private commercial construction projects'),
('Public Sector Undertaking', 'PSU construction projects'),
('Autonomous Bodies', 'Autonomous body construction projects');

-- ============================================
-- 6. ESTABLISHMENT WORK NATURE DATA
-- ============================================

-- State Government work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Road Construction', 'Construction and maintenance of roads' FROM establishment_category WHERE category_name = 'State Government'
UNION ALL
SELECT category_id, 'Building Construction', 'Government building construction' FROM establishment_category WHERE category_name = 'State Government'
UNION ALL
SELECT category_id, 'Bridge Construction', 'Bridge and flyover construction' FROM establishment_category WHERE category_name = 'State Government'
UNION ALL
SELECT category_id, 'Infrastructure Development', 'General infrastructure development' FROM establishment_category WHERE category_name = 'State Government';

-- Central Government work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Railway Construction', 'Railway infrastructure construction' FROM establishment_category WHERE category_name = 'Central Government'
UNION ALL
SELECT category_id, 'Highway Construction', 'National highway construction' FROM establishment_category WHERE category_name = 'Central Government'
UNION ALL
SELECT category_id, 'Defense Construction', 'Defense infrastructure construction' FROM establishment_category WHERE category_name = 'Central Government'
UNION ALL
SELECT category_id, 'Port Development', 'Port and harbor development' FROM establishment_category WHERE category_name = 'Central Government';

-- Private Residential work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Residential Complex', 'Apartment and housing complex construction' FROM establishment_category WHERE category_name = 'Private Residential'
UNION ALL
SELECT category_id, 'Villa Construction', 'Individual villa and bungalow construction' FROM establishment_category WHERE category_name = 'Private Residential'
UNION ALL
SELECT category_id, 'Gated Community', 'Gated community development' FROM establishment_category WHERE category_name = 'Private Residential';

-- Private Commercial work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Commercial Complex', 'Shopping malls and commercial buildings' FROM establishment_category WHERE category_name = 'Private Commercial'
UNION ALL
SELECT category_id, 'Office Building', 'Corporate office building construction' FROM establishment_category WHERE category_name = 'Private Commercial'
UNION ALL
SELECT category_id, 'Industrial Construction', 'Factory and warehouse construction' FROM establishment_category WHERE category_name = 'Private Commercial'
UNION ALL
SELECT category_id, 'Hotel Construction', 'Hotel and hospitality construction' FROM establishment_category WHERE category_name = 'Private Commercial';

-- PSU work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Power Plant Construction', 'Power generation facility construction' FROM establishment_category WHERE category_name = 'Public Sector Undertaking'
UNION ALL
SELECT category_id, 'Industrial Complex', 'Industrial complex development' FROM establishment_category WHERE category_name = 'Public Sector Undertaking';

-- Autonomous Bodies work natures
INSERT INTO establishment_work_nature (category_id, work_nature_name, description)
SELECT category_id, 'Educational Institution', 'School and college construction' FROM establishment_category WHERE category_name = 'Autonomous Bodies'
UNION ALL
SELECT category_id, 'Hospital Construction', 'Healthcare facility construction' FROM establishment_category WHERE category_name = 'Autonomous Bodies';

-- ============================================
-- 7. DEPARTMENT ROLE DATA
-- ============================================

INSERT INTO department_role (role_name, role_description) VALUES
('Super Admin', 'Full system access with all permissions'),
('Admin', 'Administrative access to manage users and data'),
('Inspector', 'Field inspector for compliance and verification'),
('Data Entry Operator', 'Data entry and basic operations'),
('Viewer', 'Read-only access to view reports and data');

-- ============================================
-- 8. DEFAULT DEPARTMENT USER (Super Admin)
-- ============================================

-- Note: Default password is 'Admin@123' (hashed with bcrypt)
-- You should change this password after first login
INSERT INTO department_user (department_role_id, email_id, password, contact_number, first_name, last_name, status)
SELECT 
    department_role_id,
    'admin@workerconnect.gov.in',
    '$2b$10$rKZ9VB5Bx8Y9xZ9xZ9xZ9uO9xZ9xZ9xZ9xZ9xZ9xZ9xZ9xZ9xZ9x', -- Placeholder - will be properly hashed by backend
    9999999999,
    'System',
    'Administrator',
    'active'
FROM department_role 
WHERE role_name = 'Super Admin';

END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment these to verify the seeded data:

-- SELECT COUNT(*) as total_states FROM state;
-- SELECT COUNT(*) as total_districts FROM district;
-- SELECT COUNT(*) as total_cities FROM city_mandal;
-- SELECT COUNT(*) as total_villages FROM village_area;
-- SELECT COUNT(*) as total_categories FROM establishment_category;
-- SELECT COUNT(*) as total_work_natures FROM establishment_work_nature;
-- SELECT COUNT(*) as total_roles FROM department_role;
-- SELECT COUNT(*) as total_dept_users FROM department_user;

-- View all establishment categories with their work natures:
-- SELECT 
--     ec.category_name,
--     ew.work_nature_name,
--     ew.description
-- FROM establishment_category ec
-- LEFT JOIN establishment_work_nature ew ON ec.category_id = ew.category_id
-- ORDER BY ec.category_name, ew.work_nature_name;

-- View location hierarchy:
-- SELECT 
--     s.state_name,
--     d.district_name,
--     c.city_name,
--     v.village_or_area_name
-- FROM state s
-- JOIN district d ON s.state_id = d.state_id
-- JOIN city_mandal c ON d.district_id = c.district_id
-- LEFT JOIN village_area v ON c.city_id = v.city_id
-- ORDER BY s.state_name, d.district_name, c.city_name, v.village_or_area_name;

