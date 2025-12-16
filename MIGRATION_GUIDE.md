# Supabase PostgreSQL Migration Guide

## ✅ Migration Complete!

Your WorkerConnect application has been successfully set up to use Supabase PostgreSQL as the new database backend.

## 📋 What Was Done

### 1. Database Scripts Created ✅
All SQL scripts are in `scripts/supabase/`:
- ✅ **01-create-tables.sql** - All 13 database tables with constraints
- ✅ **02-seed-master-data.sql** - Master data for states, districts, categories, etc.
- ✅ **03-indexes.sql** - Performance indexes
- ✅ **04-row-level-security.sql** - Security policies

### 2. Backend API Created ✅
Complete Node.js + Express backend in `backend/`:
- ✅ Supabase configuration and connection
- ✅ JWT authentication and password hashing
- ✅ Worker registration and login endpoints
- ✅ Establishment registration and login endpoints
- ✅ Department login and dashboard endpoints
- ✅ Attendance check-in/check-out system
- ✅ Location and master data endpoints
- ✅ Error handling and validation

### 3. Frontend Updated ✅
- ✅ Updated `src/api/api.ts` to point to new backend

---

## 🚀 Setup Instructions

### Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project (free tier works fine)
   - Wait for database setup to complete (~2 minutes)

2. **Run SQL Scripts**
   - Go to your Supabase dashboard → **SQL Editor**
   - Click "New Query"
   - Copy and paste the contents of each SQL file in order:
     1. `scripts/supabase/01-create-tables.sql`
     2. `scripts/supabase/02-seed-master-data.sql`
     3. `scripts/supabase/03-indexes.sql`
     4. `scripts/supabase/04-row-level-security.sql`
   - Click "Run" for each script
   - Verify: Check the "Table Editor" to see all tables

3. **Get Supabase Credentials**
   - Go to Settings → API
   - Copy these values:
     - Project URL
     - anon/public key
     - service_role key (keep this secret!)

### Step 2: Set Up Backend

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   - Copy `env.example.txt` to `.env`:
     ```bash
     cp env.example.txt .env
     ```
   - Edit `.env` and fill in your Supabase credentials:
     ```env
     PORT=3001
     NODE_ENV=development
     
     SUPABASE_URL=https://your-project-ref.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_KEY=your-service-role-key
     
     JWT_SECRET=your-random-secret-key-here
     JWT_EXPIRES_IN=7d
     
     FRONTEND_URL=http://localhost:5173
     ```

3. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ Successfully connected to Supabase PostgreSQL
   🚀 Server running on: http://localhost:3001
   ```

### Step 3: Run Frontend

1. **Navigate to Frontend**
   ```bash
   cd WorkerConnect-2
   ```

2. **Install Dependencies** (if not done already)
   ```bash
   npm install
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Test the Application**
   - Open browser: http://localhost:5173
   - Try registering a new worker or establishment
   - Try logging in
   - Check attendance features

---

## 🧪 Testing the Migration

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```
Expected: `{"status":"healthy","database":"connected"}`

### Test 2: Get States
```bash
curl http://localhost:3001/api/location/states
```
Expected: List of states (should include Andhra Pradesh)

### Test 3: Get Establishment Categories
```bash
curl http://localhost:3001/api/establishmentcategory/details
```
Expected: List of 6 categories (State Government, Private, etc.)

### Test 4: Worker Registration
```bash
curl -X POST http://localhost:3001/api/worker/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "123456789012",
    "firstName": "Test",
    "lastName": "Worker",
    "gender": "male",
    "dateOfBirth": "1990-01-01",
    "mobileNumber": "9876543210",
    "password": "Test@123"
  }'
```
Expected: Success response with worker details

### Test 5: Worker Login
```bash
curl -X POST http://localhost:3001/api/worker/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "9876543210",
    "password": "Test@123"
  }'
```
Expected: Success response with JWT token

---

## 📊 Verify Database

### Check Table Counts
Run this in Supabase SQL Editor:

```sql
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
```

Expected results:
- states: 1 (Andhra Pradesh)
- districts: 13
- cities: 20+
- villages: 10+
- categories: 6
- work_natures: 20+
- roles: 5

---

## 🔧 Troubleshooting

### Backend Won't Start

**Problem**: "Missing Supabase environment variables"
- **Solution**: Check your `.env` file has all required variables filled in

**Problem**: "Failed to connect to Supabase"
- **Solution**: Verify your Supabase URL and keys are correct
- **Solution**: Check that your Supabase project is not paused

### Frontend Can't Connect

**Problem**: CORS errors in browser console
- **Solution**: Make sure backend is running on port 3001
- **Solution**: Check `FRONTEND_URL` in backend `.env` matches your frontend URL

**Problem**: "API request failed"
- **Solution**: Verify backend is running: http://localhost:3001/health
- **Solution**: Check browser console for specific error messages

### Database Errors

**Problem**: "relation does not exist"
- **Solution**: Re-run the SQL scripts in Supabase SQL Editor

**Problem**: "duplicate key value"
- **Solution**: Data already exists. Either skip seed data or clear tables first

---

## 🚀 Deployment

### Deploy Backend (Vercel - Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd backend
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY
   - JWT_SECRET
   - FRONTEND_URL

4. Update frontend `src/api/api.ts` with deployed URL

### Deploy Frontend

Your existing deployment process remains the same. Just ensure the frontend points to your deployed backend URL.

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/worker/register` - Register worker
- `POST /api/worker/login` - Worker login
- `POST /api/establishment/register` - Register establishment
- `POST /api/establishment/login` - Establishment login
- `POST /api/department/login` - Department login

### Worker Management
- `GET /api/establishment/workerdetails?establishmentId={id}`
- `POST /api/establishment/persistworkerdetailsbyestablishment`
- `GET /api/establishment/availableaadhaarcarddetails`

### Attendance
- `POST /api/attendance/checkinorout`
- `GET /api/attendance/worker/:workerId`
- `GET /api/attendance/establishment/:establishmentId`

### Dashboard
- `GET /api/establishment/dashboard/carddetails?establishmentId={id}`
- `GET /api/department/dashboard/carddetails`

### Master Data
- `GET /api/location/states`
- `GET /api/location/districts?stateId={id}`
- `GET /api/location/cities?districtId={id}`
- `GET /api/location/villages?cityId={id}`
- `GET /api/establishmentcategory/details`
- `GET /api/establishmentworknature/details?categoryId={id}`

---

## 🔄 Rolling Back

If you need to switch back to the old backend temporarily:

1. Edit `src/api/api.ts`
2. Uncomment the rollback line:
   ```typescript
   const BASE_URL = process.env.NODE_ENV === "development" 
     ? "http://108.181.164.242:8085/labourms/v1/services/adapter" 
     : "https://108.181.164.242:5001/labourms/v1/services/adapter";
   ```
3. Restart the frontend

---

## ✨ Benefits of Supabase Migration

✅ **PostgreSQL Reliability** - Industry-standard relational database
✅ **Built-in Security** - Row Level Security policies
✅ **Real-time Capabilities** - Can add real-time subscriptions later
✅ **Automatic Backups** - Daily backups included
✅ **Better Performance** - Optimized indexes and queries
✅ **Modern Stack** - Node.js + Express + PostgreSQL
✅ **Free Tier** - 500MB database, 2GB bandwidth/month
✅ **Easy Scaling** - Upgrade as your app grows

---

## 📞 Support

For issues or questions:
- Backend logs: Check terminal where `npm run dev` is running
- Database logs: Supabase Dashboard → Logs
- API documentation: See `backend/README.md`
- SQL scripts: See `scripts/supabase/README.md`

---

## 🎉 Next Steps

Now that migration is complete, you can:
1. ✅ Test all application features thoroughly
2. ✅ Deploy backend to Vercel/Railway/Heroku
3. ✅ Update frontend deployment with new backend URL
4. ✅ Set up monitoring and logging
5. ✅ Configure backups in Supabase
6. ✅ Train users on the new system

**Congratulations! Your WorkerConnect app is now powered by Supabase PostgreSQL! 🚀**

