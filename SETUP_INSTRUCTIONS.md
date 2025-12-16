# ⚡ Quick Setup Instructions for Your Supabase Database

## ✅ Step 1: Get Your Service Role Key (IMPORTANT!)

Your `.env` file has been created with your Supabase URL and anon key, but you need to add the **service_role key**.

### How to get the service_role key:
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm
2. Click **Settings** (gear icon in left sidebar)
3. Click **API** in the settings menu
4. Scroll down to **Project API keys**
5. Copy the **`service_role`** key (it says "secret" - keep it safe!)
6. Open `backend/.env` file
7. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with the actual service_role key

⚠️ **Important**: The service_role key is different from the anon key. The backend needs the service_role key to have full database access.

---

## ✅ Step 2: Run Database Scripts

Run these SQL scripts in your Supabase SQL Editor:

### 2.1 Open SQL Editor
1. Go to: https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm/editor
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### 2.2 Run Script 1: Create Tables
1. Open `scripts/supabase/01-create-tables.sql`
2. Copy entire contents
3. Paste into Supabase SQL Editor
4. Click **"Run"** button
5. Wait for success message

### 2.3 Run Script 2: Seed Master Data
1. Open `scripts/supabase/02-seed-master-data.sql`
2. Copy entire contents
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Wait for success message

### 2.4 Run Script 3: Create Indexes
1. Open `scripts/supabase/03-indexes.sql`
2. Copy entire contents
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Wait for success message

### 2.5 Run Script 4: Row Level Security
1. Open `scripts/supabase/04-row-level-security.sql`
2. Copy entire contents
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Wait for success message

### 2.6 Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see 13 tables:
   - state
   - district
   - city_mandal
   - village_area
   - establishment_category
   - establishment_work_nature
   - department_role
   - worker
   - worker_dependents
   - establishment
   - establishment_worker
   - attendance
   - department_user

---

## ✅ Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- @supabase/supabase-js (Supabase client)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- cors (CORS handling)
- dotenv (environment variables)
- uuid (correlation IDs)

---

## ✅ Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Successfully connected to Supabase PostgreSQL
🚀 Server running on: http://localhost:3001
```

If you see connection errors, verify your service_role key is correct in `.env`.

---

## ✅ Step 5: Test Backend API

Open a new terminal and test:

```bash
# Test health check
curl http://localhost:3001/health

# Test get states
curl http://localhost:3001/api/location/states

# Test get categories
curl http://localhost:3001/api/establishmentcategory/details
```

All should return JSON responses with data.

---

## ✅ Step 6: Start Frontend

In a new terminal:

```bash
cd WorkerConnect-2
npm run dev
```

Frontend will start on http://localhost:5173

---

## ✅ Step 7: Test Full Application

1. Open browser: http://localhost:5173
2. Click **"Worker Registration"**
3. Fill in the form with test data:
   - Aadhaar: 123456789012
   - Name: Test Worker
   - Mobile: 9876543210
   - Password: Test@123
4. Submit registration
5. Try logging in with the same credentials

---

## 🧪 Quick Test Commands

### Test Worker Registration
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

### Test Worker Login
```bash
curl -X POST http://localhost:3001/api/worker/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "9876543210",
    "password": "Test@123"
  }'
```

---

## 🔧 Troubleshooting

### Backend won't connect to Supabase
✅ **Solution**: Make sure you added the service_role key (not anon key) to `.env`

### "relation does not exist" error
✅ **Solution**: Run the SQL scripts again in order (01, 02, 03, 04)

### CORS errors in browser
✅ **Solution**: Make sure backend is running on port 3001

### Frontend can't connect
✅ **Solution**: Verify `src/api/api.ts` has `BASE_URL = "http://localhost:3001/api"`

---

## 📋 Checklist

- [ ] Get service_role key from Supabase dashboard
- [ ] Update `backend/.env` with service_role key
- [ ] Run all 4 SQL scripts in Supabase SQL Editor
- [ ] Verify 13 tables exist in Table Editor
- [ ] Install backend dependencies (`npm install`)
- [ ] Start backend (`npm run dev`)
- [ ] Verify backend connects to Supabase
- [ ] Start frontend (`npm run dev`)
- [ ] Test worker registration in browser
- [ ] Test worker login
- [ ] Test establishment registration

---

## 🎉 Success!

Once all steps are complete, your WorkerConnect app will be running on:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **Database**: Supabase PostgreSQL

---

## 📞 Next Steps

After confirming everything works locally:
1. Deploy backend to Vercel/Railway/Heroku (see `MIGRATION_GUIDE.md`)
2. Update frontend `BASE_URL` with deployed backend URL
3. Deploy frontend
4. Celebrate! 🎉

---

## 📚 Additional Resources

- **Full Migration Guide**: `MIGRATION_GUIDE.md`
- **API Testing Guide**: `backend/TESTING.md`
- **Database Documentation**: `scripts/supabase/README.md`
- **Backend Documentation**: `backend/README.md`

---

**Your Supabase Project**: https://supabase.com/dashboard/project/jtseaglabuxnhowafnnm

