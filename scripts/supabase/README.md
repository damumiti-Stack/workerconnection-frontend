# Supabase PostgreSQL Migration Scripts

This directory contains SQL scripts to set up the WorkerConnect Labour Management System database in Supabase PostgreSQL.

## Files

1. **01-create-tables.sql** - Creates all 13 database tables with proper constraints and relationships
2. **02-seed-master-data.sql** - Seeds initial master data (states, districts, categories, etc.)
3. **03-indexes.sql** - Creates performance indexes on frequently queried columns
4. **04-row-level-security.sql** - Sets up Row Level Security policies for data protection

## Quick Start

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the scripts in order:
   - First: `01-create-tables.sql`
   - Second: `02-seed-master-data.sql`
   - Third: `03-indexes.sql`
   - Fourth: `04-row-level-security.sql`

### Option 2: Command Line (psql)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run scripts in order
\i 01-create-tables.sql
\i 02-seed-master-data.sql
\i 03-indexes.sql
\i 04-row-level-security.sql
```

### Option 3: Supabase CLI

```bash
# Initialize Supabase locally (optional)
supabase init

# Link to your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run migrations
supabase db push
```

## Database Schema Overview

### Master Data Tables
- **state** - Indian states (currently Andhra Pradesh)
- **district** - Districts within states (13 AP districts)
- **city_mandal** - Cities/Mandals within districts
- **village_area** - Villages/Areas within cities
- **establishment_category** - Establishment types (Govt, Private, etc.)
- **establishment_work_nature** - Nature of construction work
- **department_role** - Roles for department officials

### Core Entity Tables
- **worker** - Construction worker profiles and registration
- **worker_dependents** - Family dependents of workers
- **establishment** - Construction establishments/companies
- **establishment_worker** - Links workers to establishments
- **attendance** - Worker check-in/check-out records
- **department_user** - Department officials and administrators

## Database Features

### ✅ Implemented Features

- **Auto-incrementing IDs** using PostgreSQL SEQUENCES
- **Foreign Key Constraints** for referential integrity
- **Unique Constraints** on mobile numbers, emails, Aadhaar numbers
- **Check Constraints** for data validation
- **Generated Columns** (e.g., full_name from first_name + last_name)
- **Timestamps** - created_at and updated_at on all tables
- **Triggers** - Auto-update updated_at on record changes
- **Indexes** - Performance indexes on frequently queried columns
- **Row Level Security (RLS)** - Data-level security policies

## Master Data Seeded

### States
- Andhra Pradesh (AP)

### Districts (13)
Anantapur, Chittoor, East Godavari, Guntur, Krishna, Kurnool, Prakasam, Nellore, Srikakulam, Visakhapatnam, Vizianagaram, West Godavari, YSR Kadapa

### Cities/Mandals (Sample)
Major cities like Visakhapatnam, Vijayawada, Guntur, Tirupati, etc.

### Establishment Categories (6)
- State Government
- Central Government
- Private Residential
- Private Commercial
- Public Sector Undertaking
- Autonomous Bodies

### Work Natures (20+)
Categorized by establishment type (Road Construction, Building Construction, Residential Complex, etc.)

### Department Roles (5)
- Super Admin
- Admin
- Inspector
- Data Entry Operator
- Viewer

### Default Admin Account
- **Email**: admin@workerconnect.gov.in
- **Password**: Will be set by backend (currently placeholder)
- **Role**: Super Admin

⚠️ **Important**: Change the default admin password after first login!

## Verification Queries

After running the scripts, verify the data:

```sql
-- Check table counts
SELECT 
    'states' as table_name, COUNT(*) as count FROM state
UNION ALL
SELECT 'districts', COUNT(*) FROM district
UNION ALL
SELECT 'cities', COUNT(*) FROM city_mandal
UNION ALL
SELECT 'villages', COUNT(*) FROM village_area
UNION ALL
SELECT 'categories', COUNT(*) FROM establishment_category
UNION ALL
SELECT 'work_natures', COUNT(*) FROM establishment_work_nature
UNION ALL
SELECT 'roles', COUNT(*) FROM department_role;

-- View location hierarchy
SELECT 
    s.state_name,
    d.district_name,
    c.city_name,
    v.village_or_area_name
FROM state s
JOIN district d ON s.state_id = d.state_id
JOIN city_mandal c ON d.district_id = c.district_id
LEFT JOIN village_area v ON c.city_id = v.city_id
ORDER BY d.district_name, c.city_name, v.village_or_area_name
LIMIT 20;

-- View categories with work natures
SELECT 
    ec.category_name,
    COUNT(ew.work_nature_id) as work_nature_count
FROM establishment_category ec
LEFT JOIN establishment_work_nature ew ON ec.category_id = ew.category_id
GROUP BY ec.category_name;
```

## Row Level Security (RLS)

RLS is enabled on all tables with the following policies:

### Worker Policies
- Workers can view/update their own profile
- Workers can manage their own dependents
- Department users can view/update all workers

### Establishment Policies
- Establishments can view/update their own profile
- Establishments can manage their workers
- Department users can view/update all establishments

### Attendance Policies
- Workers can check-in/out and view their attendance
- Establishments can manage attendance of their workers
- Department users can view all attendance records

### Backend Bypass
- Backend service role can bypass all RLS policies using `enable_service_role_bypass()`

## Indexes Created

### High-Priority Indexes
- `idx_worker_aadhaar` - Worker Aadhaar lookups
- `idx_worker_mobile` - Worker mobile number lookups
- `idx_establishment_mobile` - Establishment mobile lookups
- `idx_attendance_current_checkin` - Currently checked-in workers
- `idx_estmt_worker_active` - Active workers at establishments

### Search Indexes
- Full-text search on worker names (requires pg_trgm extension)
- Full-text search on establishment names

## Adding More Master Data

To add more districts, cities, or other master data:

1. Open `02-seed-master-data.sql`
2. Add INSERT statements following the existing pattern
3. Re-run the script in Supabase SQL Editor

Example:
```sql
-- Add a new district
INSERT INTO district (state_id, district_name, district_code)
SELECT state_id, 'New District', 'ND' FROM state WHERE state_code = 'AP';
```

## Troubleshooting

### Error: relation already exists
The tables already exist. Either:
- Drop the tables first: `DROP TABLE IF EXISTS [table_name] CASCADE;`
- Or skip the create tables script

### Error: violates foreign key constraint
Ensure you run the scripts in order. Master data tables must be created before tables that reference them.

### Error: duplicate key value
Master data already exists. Either:
- Skip the seed data script
- Or modify the script to use `INSERT ... ON CONFLICT DO NOTHING`

## Next Steps

After running these scripts:

1. ✅ Database schema is ready
2. ✅ Master data is seeded
3. ✅ Indexes are created
4. ✅ Security policies are enabled

Now you can:
- Set up the backend API to connect to this database
- Configure environment variables with Supabase credentials
- Start building API endpoints
- Test with the frontend application

## Connection Details

Get your Supabase connection details from:
1. Go to Supabase Dashboard → Settings → API
2. Copy:
   - Project URL
   - Project API Keys (anon/public and service_role)
3. Add to your backend `.env` file

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the migration plan: `supabase-postgresql-migration.plan.md`
- Contact the development team

