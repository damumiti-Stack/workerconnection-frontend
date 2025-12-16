#!/bin/bash

# Build the web app
echo "Building web application..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Navigate to Android directory
cd android

# Check if gradlew exists
if [ ! -f "./gradlew" ]; then
  echo "gradlew not found, creating it..."
  chmod +x gradlew
fi

# Build the APK
echo "Building APK..."
./gradlew assembleDebug

# Copy the APK to downloads folder
echo "Copying APK to downloads folder..."
mkdir -p ../public/downloads
cp app/build/outputs/apk/debug/app-debug.apk ../public/downloads/WorkerConnect.apk

echo "APK build complete! Check public/downloads/WorkerConnect.apk"