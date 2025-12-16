# Mobile App Setup - Connect to Local Backend via IP Address

This guide will help you configure your mobile app to connect to your local backend using your computer's IP address instead of localhost.

## Quick Setup

### Step 1: Get Your Local IP Address

Run this script to automatically find your IP:

```bash
node get-local-ip.js
```

Or manually find it:

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Start Backend with Docker

```bash
cd backend
docker-compose up -d --build
```

Verify it's running:
```bash
# Check container
docker-compose ps

# Test API (replace with your IP)
curl http://YOUR_IP:3001/health
```

### Step 3: Configure Mobile App

Edit `src/api/config.ts`:

```typescript
// Configuration flags
const USE_LOCAL_IP = true; // ✅ Set to true
const LOCAL_IP_ADDRESS = "192.168.1.100"; // ✅ Use your actual IP
```

### Step 4: Rebuild Mobile App

```bash
# Build the app
npm run build

# For Android
npx cap sync android
npx cap open android

# For iOS
npx cap sync ios
npx cap open ios
```

Then build and run the app from Android Studio or Xcode.

## Detailed Configuration

### API Configuration File

The `src/api/config.ts` file controls how your app connects to the backend:

```typescript
// Enable IP-based connection
const USE_LOCAL_IP = true;

// Your computer's local IP address
const LOCAL_IP_ADDRESS = "192.168.1.100";

// Backend port (must match backend configuration)
const BACKEND_PORT = 3001;
```

### How It Works

1. **Development Mode (Local Network)**:
   - When `USE_LOCAL_IP = true`, app uses: `http://YOUR_IP:3001/api`
   - Perfect for testing on physical devices

2. **Development Mode (Emulator)**:
   - When `USE_LOCAL_IP = false`, app uses: `http://localhost:3001/api`
   - Works for emulators/simulators

3. **Production Mode**:
   - Automatically uses your production URL
   - Configure in `config.ts`: `https://your-backend.com/api`

## Troubleshooting

### Cannot Connect from Mobile Device

**1. Check Network Connection**
- Ensure mobile device and computer are on the same WiFi network
- Try pinging your computer from mobile device

**2. Check Backend is Running**
```bash
cd backend
docker-compose ps
docker-compose logs
```

**3. Check Firewall**
Allow port 3001 through your firewall:

**Windows:**
```powershell
# Check if port is open
netstat -an | findstr :3001

# Add firewall rule
New-NetFirewallRule -DisplayName "WorkerConnect Backend" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

**macOS:**
```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Allow through firewall (if needed)
# Go to System Preferences → Security & Privacy → Firewall → Firewall Options
```

**Linux:**
```bash
# Allow port through UFW
sudo ufw allow 3001/tcp
```

**4. Test Connection**
From your computer:
```bash
# Test localhost
curl http://localhost:3001/health

# Test IP address
curl http://YOUR_IP:3001/health
```

From your mobile browser:
- Visit: `http://YOUR_IP:3001/health`
- You should see a JSON response

### CORS Errors

Make sure your backend `.env` file has:
```env
FRONTEND_URL=*
```

Then restart the backend:
```bash
cd backend
docker-compose restart
```

### IP Address Changed

If your computer's IP address changes (common on DHCP networks):

1. Run `node get-local-ip.js` to get the new IP
2. Update `LOCAL_IP_ADDRESS` in `src/api/config.ts`
3. Rebuild the mobile app

**Tip**: To avoid IP changes, set a static IP in your router settings.

### App Shows Old URL

Make sure you:
1. Saved `config.ts` with the correct IP
2. Ran `npm run build` to rebuild
3. Ran `npx cap sync` to sync changes
4. Closed and rebuilt the app in Android Studio/Xcode

### Cannot Build Mobile App

**Android:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

**iOS:**
```bash
npx cap sync ios
# Then clean build in Xcode: Product → Clean Build Folder
```

## Testing the Connection

### Test from Computer Browser
```
http://localhost:3001/health
http://YOUR_IP:3001/health
```

### Test from Mobile Browser
```
http://YOUR_IP:3001/health
```

### Test from Mobile App
The app should now be able to make API calls. Check the console logs in Android Studio/Xcode for any connection errors.

## Network Configuration Comparison

| Scenario | Configuration | URL |
|----------|--------------|-----|
| Android Emulator | `USE_LOCAL_IP = false` | `http://localhost:3001/api` or `http://10.0.2.2:3001/api` |
| iOS Simulator | `USE_LOCAL_IP = false` | `http://localhost:3001/api` |
| Physical Device (Same WiFi) | `USE_LOCAL_IP = true` | `http://YOUR_IP:3001/api` |
| Production | N/A | `https://your-backend.com/api` |

## Android Emulator Special Case

Android emulators use special IP addresses:
- `10.0.2.2` points to the host machine's localhost
- Update `config.ts` if needed:

```typescript
const LOCAL_IP_ADDRESS = "10.0.2.2"; // For Android emulator
```

## Production Deployment

Before deploying to production:

1. **Update Backend CORS**: Change from `*` to specific origins
2. **Deploy Backend**: Deploy to Vercel, Railway, or other platform
3. **Update Config**: Set production URL in `config.ts`
4. **Set Environment**: Ensure `NODE_ENV=production` when building

## Quick Reference

### Get IP Address
```bash
node get-local-ip.js
```

### Start Backend
```bash
cd backend
docker-compose up -d
```

### Stop Backend
```bash
cd backend
docker-compose down
```

### View Logs
```bash
cd backend
docker-compose logs -f
```

### Rebuild Mobile App
```bash
npm run build
npx cap sync android  # or ios
```

### Test Connection
```bash
curl http://YOUR_IP:3001/health
```

## Support

For more information:
- Backend Setup: `backend/DOCKER_SETUP.md`
- Quick Start: `backend/QUICK_START.md`
- API Documentation: `backend/README.md`

---

**Your Mobile App URL**: `http://YOUR_LOCAL_IP:3001/api`

Example: `http://192.168.1.100:3001/api`

