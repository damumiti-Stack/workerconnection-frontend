# 🚀 Quick Start Guide - WorkerConnect with Supabase

## ✅ Your Configuration is Ready!

All your Supabase credentials have been configured. Follow these simple steps to get started.

---

## 📋 Step-by-Step Instructions

### **Step 1: Set Up Backend Configuration** (30 seconds)

```bash
cd backend

# Rename the configured file to .env
cp env-ready-to-use.txt .env
# OR on Windows: copy env-ready-to-use.txt .env
```

✅ **Done!** Your backend is now configured with:
- Supabase URL: https://jtseaglabuxnhowafnnm.supabase.co
- Anon Key: Configured ✅
- Service Role Key: Configured ✅

---

### **Step 2: Run Database Scripts** (5 minutes)

Go to your Supabase SQL Editor:
👉 **https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm/editor**

Click **"SQL Editor"** → **"New Query"** and run these scripts **in order**:

#### 2.1 Create Tables
1. Open file: `WorkerConnect-2/scripts/supabase/01-create-tables.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for "Success" message

#### 2.2 Seed Master Data
1. Open file: `WorkerConnect-2/scripts/supabase/02-seed-master-data.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click **"Run"**
5. Wait for "Success" message

#### 2.3 Create Indexes
1. Open file: `WorkerConnect-2/scripts/supabase/03-indexes.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click **"Run"**
5. Wait for "Success" message

#### 2.4 Set Up Security
1. Open file: `WorkerConnect-2/scripts/supabase/04-row-level-security.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click **"Run"**
5. Wait for "Success" message

#### ✅ Verify Tables Created
- Go to **Table Editor** in Supabase
- You should see **13 tables**: state, district, city_mandal, village_area, establishment_category, establishment_work_nature, department_role, worker, worker_dependents, establishment, establishment_worker, attendance, department_user

---

### **Step 3: Install Backend Dependencies** (1 minute)

```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
npm install
```

---

### **Step 4: Start Backend Server** (10 seconds)

```bash
npm run dev
```

**Expected Output:**
```
✅ Successfully connected to Supabase PostgreSQL
🚀 Server running on: http://localhost:3001
```

✅ **If you see this, backend is working!**

❌ **If you see errors:**
- Check that `.env` file exists in `backend/` folder
- Verify you ran all 4 SQL scripts in Supabase
- Check that Supabase project is not paused

---

### **Step 5: Test Backend** (30 seconds)

Open a **new terminal** (keep backend running) and test:

```bash
# Test health check
curl http://localhost:3001/health

# Test get states (should return Andhra Pradesh)
curl http://localhost:3001/api/location/states

# Test get categories
curl http://localhost:3001/api/establishmentcategory/details
```

All should return JSON data. ✅

---

### **Step 6: Start Frontend** (1 minute)

Open **another new terminal** and run:

```bash
# Go to project root
cd WorkerConnect-2

# Install dependencies (if not done already)
npm install

# Start frontend
npm run dev
```

Frontend will start on: **http://localhost:5173**

---

### **Step 7: Test the Application** 🎉

1. Open browser: **http://localhost:5173**
2. Click **"Worker Registration"** or **"Establishment Registration"**
3. Fill in the form with test data:

**Test Worker:**
- Aadhaar: `123456789012`
- First Name: `Test`
- Last Name: `Worker`
- Gender: Male
- Date of Birth: `1990-01-01`
- Mobile: `9876543210`
- Password: `Test@123`

4. Click **Submit**
5. Try logging in with the same credentials

**If registration and login work, you're all set! 🎉**

---

## 🧪 Quick API Tests

Test these endpoints to verify everything works:

### Test Worker Registration
```bash
curl -X POST http://localhost:3001/api/worker/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "987654321098",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "male",
    "dateOfBirth": "1985-05-15",
    "mobileNumber": "9999888877",
    "password": "Worker@123"
  }'
```

### Test Worker Login
```bash
curl -X POST http://localhost:3001/api/worker/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "9999888877",
    "password": "Worker@123"
  }'
```

---

## 📊 Database Verification

Check your data in Supabase:
👉 **https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm/editor**

Run this query to see registered workers:
```sql
SELECT worker_id, full_name, mobile_number, status, created_at 
FROM worker 
ORDER BY created_at DESC;
```

---

## ✅ Success Checklist

- [ ] Renamed `env-ready-to-use.txt` to `.env`
- [ ] Ran all 4 SQL scripts in Supabase
- [ ] Verified 13 tables exist in Table Editor
- [ ] Installed backend dependencies (`npm install`)
- [ ] Started backend (`npm run dev`)
- [ ] Saw "Successfully connected to Supabase" message
- [ ] Tested API endpoints with curl
- [ ] Installed frontend dependencies
- [ ] Started frontend (`npm run dev`)
- [ ] Tested worker/establishment registration in browser

---

## 🔧 Troubleshooting

### Backend won't start
- Verify `.env` file exists in `backend/` folder
- Check all environment variables are set
- Make sure port 3001 is not in use

### "Missing Supabase environment variables"
- Check that you renamed `env-ready-to-use.txt` to `.env`
- Open `.env` and verify all keys are present

### "Failed to connect to Supabase"
- Verify your Supabase project is active (not paused)
- Check internet connection
- Verify the service_role key is correct

### "relation does not exist" errors
- Make sure you ran all 4 SQL scripts
- Check Table Editor to confirm tables exist
- Re-run the scripts if needed

### Frontend can't connect to backend
- Verify backend is running on http://localhost:3001
- Check browser console for CORS errors
- Verify `src/api/api.ts` has correct BASE_URL

---

## 📚 Additional Documentation

- **Complete Migration Guide**: `MIGRATION_GUIDE.md`
- **Backend Documentation**: `backend/README.md`
- **API Testing Guide**: `backend/TESTING.md`
- **Database Schema**: `scripts/supabase/README.md`

---

## 🎯 What's Running

- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173
- **Database**: https://jtseaglabuxnhowafnnm.supabase.co
- **Supabase Dashboard**: https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm

---

## 🚀 Next Steps

Once everything works locally:
1. Deploy backend to Vercel/Railway/Heroku
2. Update frontend `BASE_URL` with deployed backend URL
3. Deploy frontend
4. Set up monitoring and backups

---

## 💡 Tips

- Keep backend terminal running while developing
- Check backend terminal for API request logs
- Use Supabase Table Editor to view database contents
- Use browser DevTools → Network tab to debug API calls

---

## 🎉 You're Ready!

Your WorkerConnect application is now running on Supabase PostgreSQL!

**Have fun building! 🚀**

