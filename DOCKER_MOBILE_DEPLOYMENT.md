# 🚀 Complete Guide: Deploy Backend on Docker for Mobile App Access

This guide provides everything you need to deploy your WorkerConnect backend on Docker and connect your mobile app using your local IP address.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Setup](#detailed-setup)
4. [Configuration Files](#configuration-files)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Topics](#advanced-topics)

## Prerequisites

✅ Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))  
✅ Node.js installed (for mobile app build)  
✅ Supabase account with credentials  
✅ Mobile device and computer on same WiFi network  

## Quick Start (5 Minutes)

### 1️⃣ Get Your Local IP Address

**Windows (PowerShell):**
```powershell
.\backend\get-ip.ps1
```

**Mac/Linux:**
```bash
chmod +x backend/get-ip.sh
./backend/get-ip.sh
```

**Or use Node.js script:**
```bash
node get-local-ip.js
```

Save the IP address (e.g., `192.168.1.100`)

### 2️⃣ Configure Backend

```bash
cd backend

# Create .env file (copy from example and edit)
cp env.example.txt .env

# Edit .env with your Supabase credentials
# Set FRONTEND_URL=* to allow mobile app access
```

Required `.env` variables:
```env
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret-key
FRONTEND_URL=*
```

### 3️⃣ Start Backend with Docker

```bash
docker-compose up -d --build
```

Verify it's running:
```bash
docker-compose ps
```

### 4️⃣ Configure Mobile App

Edit `src/api/config.ts`:
```typescript
const USE_LOCAL_IP = true;
const LOCAL_IP_ADDRESS = "192.168.1.100"; // Your actual IP
```

### 5️⃣ Rebuild Mobile App

```bash
# From project root
npm run build
npx cap sync android  # or ios
```

Build and run from Android Studio or Xcode.

### ✅ Done! Your mobile app should now connect to your local backend.

---

## Detailed Setup

### Backend Configuration

The backend has been configured to:
- ✅ Bind to `0.0.0.0` to accept external connections
- ✅ Allow CORS from any origin when `FRONTEND_URL=*`
- ✅ Run in a Docker container for consistency
- ✅ Use port 3001 (configurable)

### Mobile App Configuration

The mobile app uses a centralized configuration:
- **File**: `src/api/config.ts`
- **Toggle**: `USE_LOCAL_IP` flag
- **IP Setting**: `LOCAL_IP_ADDRESS` variable

This makes it easy to switch between:
- Local development (localhost)
- Network development (IP address)
- Production deployment

## Configuration Files

### 📁 Backend Files

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Docker container definition |
| `backend/docker-compose.yml` | Docker Compose configuration |
| `backend/.dockerignore` | Files to exclude from Docker image |
| `backend/.env` | Environment variables (create from example) |
| `backend/src/server.js` | Server configuration (updated for 0.0.0.0 binding) |

### 📁 Mobile App Files

| File | Purpose |
|------|---------|
| `src/api/config.ts` | Centralized API configuration |
| `src/api/api.ts` | API client (updated to use config) |
| `get-local-ip.js` | Node.js script to find local IP |

### 📁 Helper Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `backend/get-ip.ps1` | Windows | Get local IP (PowerShell) |
| `backend/get-ip.sh` | Mac/Linux | Get local IP (Bash) |
| `get-local-ip.js` | All | Get local IP (Node.js) |

### 📁 Documentation

| Document | Description |
|----------|-------------|
| `backend/DOCKER_SETUP.md` | Detailed Docker setup guide |
| `backend/QUICK_START.md` | Quick reference guide |
| `MOBILE_APP_SETUP.md` | Mobile app configuration guide |
| `DOCKER_MOBILE_DEPLOYMENT.md` | This file - complete overview |

## Testing

### 1. Test Backend Locally

```bash
# From computer browser
http://localhost:3001/health

# From computer terminal
curl http://localhost:3001/health
```

### 2. Test Backend via IP

```bash
# From computer browser
http://YOUR_IP:3001/health

# From computer terminal
curl http://YOUR_IP:3001/health
```

### 3. Test from Mobile Device

Open mobile browser and visit:
```
http://YOUR_IP:3001/health
```

You should see a JSON response like:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-11-04T10:30:00.000Z"
}
```

### 4. Test Mobile App

Run your mobile app and check:
- Login functionality
- API calls in network inspector
- Console logs for any errors

## Troubleshooting

### 🔴 Cannot Connect from Mobile Device

**Check Network:**
```bash
# Make sure both devices are on same WiFi
# Ping your computer from mobile terminal app
ping YOUR_IP
```

**Check Backend:**
```bash
cd backend
docker-compose ps    # Should show container running
docker-compose logs  # Check for errors
```

**Check Firewall:**

Windows:
```powershell
# Test if port is open
Test-NetConnection -ComputerName YOUR_IP -Port 3001

# Add firewall rule if needed
New-NetFirewallRule -DisplayName "WorkerConnect" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

Mac:
- System Preferences → Security & Privacy → Firewall → Firewall Options
- Allow Docker or add exception for port 3001

Linux:
```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

### 🔴 CORS Errors

Ensure `.env` has:
```env
FRONTEND_URL=*
```

Restart backend:
```bash
cd backend
docker-compose restart
```

### 🔴 Database Connection Errors

Verify Supabase credentials in `.env`:
1. Go to Supabase Dashboard → Settings → API
2. Copy correct values
3. Check project is not paused
4. Restart container after updating `.env`

### 🔴 IP Address Changed

If your computer's IP changes:
1. Run IP detection script again
2. Update `LOCAL_IP_ADDRESS` in `src/api/config.ts`
3. Rebuild mobile app

**Prevent IP changes:** Set static IP in router settings

### 🔴 Old Configuration Cached

```bash
# Clean and rebuild mobile app
npm run build
npx cap sync android
# Then clean build in Android Studio

# For iOS
npx cap sync ios
# Then Product → Clean Build Folder in Xcode
```

## Advanced Topics

### Android Emulator

Android emulators use special networking:
- `10.0.2.2` = host machine's localhost
- Update config for emulator: `LOCAL_IP_ADDRESS = "10.0.2.2"`

### iOS Simulator

iOS simulators can use `localhost` directly:
- Set `USE_LOCAL_IP = false` for simulator testing

### Port Configuration

To use a different port:

1. Update `backend/.env`:
```env
PORT=3002
```

2. Update `backend/docker-compose.yml`:
```yaml
ports:
  - "3002:3002"
```

3. Update `src/api/config.ts`:
```typescript
const BACKEND_PORT = 3002;
```

### Production Deployment

For production:

1. **Backend**: Deploy to cloud platform (Vercel, Railway, etc.)
2. **Update Config**: Set production URL in `config.ts`
3. **Secure CORS**: Change from `*` to specific origins
4. **Environment**: Use production environment variables

### Multiple Environments

Create environment-specific configs:

```typescript
const ENVIRONMENTS = {
  local: 'http://localhost:3001/api',
  network: `http://${LOCAL_IP_ADDRESS}:3001/api`,
  staging: 'https://staging-api.example.com/api',
  production: 'https://api.example.com/api',
};

const BASE_URL = ENVIRONMENTS[process.env.REACT_APP_ENV || 'local'];
```

## Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop and remove |
| `docker-compose ps` | List containers |
| `docker-compose logs -f` | View live logs |
| `docker-compose restart` | Restart container |
| `docker-compose up -d --build` | Rebuild and start |
| `docker-compose exec workerconnect-backend sh` | Access container shell |

## Mobile Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build web assets |
| `npx cap sync` | Sync to mobile platforms |
| `npx cap sync android` | Sync to Android |
| `npx cap sync ios` | Sync to iOS |
| `npx cap open android` | Open Android Studio |
| `npx cap open ios` | Open Xcode |

## Network Configuration Matrix

| Scenario | Config | URL |
|----------|--------|-----|
| Android Emulator | `USE_LOCAL_IP=false` or `LOCAL_IP="10.0.2.2"` | `http://10.0.2.2:3001/api` |
| iOS Simulator | `USE_LOCAL_IP=false` | `http://localhost:3001/api` |
| Physical Device | `USE_LOCAL_IP=true` with your IP | `http://192.168.1.100:3001/api` |
| Production | N/A | `https://your-api.com/api` |

## Security Considerations

⚠️ **Development Only**: The configuration with `FRONTEND_URL=*` is for development only.

For production:
1. Set specific allowed origins
2. Use HTTPS/SSL certificates
3. Implement rate limiting
4. Use API keys or OAuth
5. Enable request validation
6. Set up monitoring and logging

## Support & Resources

### Documentation
- 📖 Backend Setup: `backend/DOCKER_SETUP.md`
- 📖 Quick Start: `backend/QUICK_START.md`
- 📖 Mobile Config: `MOBILE_APP_SETUP.md`
- 📖 API Docs: `backend/README.md`

### Common URLs
- Local Backend: `http://localhost:3001`
- Network Backend: `http://YOUR_IP:3001`
- Health Check: `http://YOUR_IP:3001/health`
- API Base: `http://YOUR_IP:3001/api`

### Helpful Commands
```bash
# Get IP
node get-local-ip.js

# Start backend
cd backend && docker-compose up -d

# View logs
cd backend && docker-compose logs -f

# Rebuild mobile
npm run build && npx cap sync

# Test connection
curl http://YOUR_IP:3001/health
```

---

## ✅ Checklist

Before running your mobile app:

- [ ] Docker is installed and running
- [ ] Backend `.env` file is configured with Supabase credentials
- [ ] `FRONTEND_URL=*` is set in backend `.env`
- [ ] Backend container is running (`docker-compose ps`)
- [ ] Health check works (`curl http://YOUR_IP:3001/health`)
- [ ] Mobile app `config.ts` has correct IP address
- [ ] `USE_LOCAL_IP=true` in mobile app config
- [ ] Mobile app is rebuilt (`npm run build && npx cap sync`)
- [ ] Both devices are on same WiFi network
- [ ] Firewall allows port 3001

---

**Your Backend URL**: `http://YOUR_LOCAL_IP:3001/api`  
**Example**: `http://192.168.1.100:3001/api`

Happy coding! 🎉

