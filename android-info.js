#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Gathering Android build information...\n');

// Check Android directory structure
console.log('📁 Android directory structure:');
try {
  const androidDir = path.join(process.cwd(), 'android');
  if (fs.existsSync(androidDir)) {
    const files = fs.readdirSync(androidDir);
    console.log(`Found ${files.length} items in android directory:`);
    files.forEach(file => {
      const stats = fs.statSync(path.join(androidDir, file));
      console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
    });
  } else {
    console.log('Android directory not found!');
  }
} catch (error) {
  console.error('Error checking Android directory:', error.message);
}

// Check Android app directory
console.log('\n📁 Android app directory structure:');
try {
  const appDir = path.join(process.cwd(), 'android', 'app');
  if (fs.existsSync(appDir)) {
    const files = fs.readdirSync(appDir);
    console.log(`Found ${files.length} items in android/app directory:`);
    files.forEach(file => {
      const stats = fs.statSync(path.join(appDir, file));
      console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
    });
  } else {
    console.log('Android app directory not found!');
  }
} catch (error) {
  console.error('Error checking Android app directory:', error.message);
}

// Check build.gradle
console.log('\n📄 Android build.gradle:');
try {
  const buildGradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');
  if (fs.existsSync(buildGradlePath)) {
    console.log('build.gradle exists');
    const content = fs.readFileSync(buildGradlePath, 'utf8');
    console.log('First 500 characters of build.gradle:');
    console.log(content.substring(0, 500) + '...');
  } else {
    console.log('build.gradle not found!');
  }
} catch (error) {
  console.error('Error checking build.gradle:', error.message);
}

// Check AndroidManifest.xml
console.log('\n📄 AndroidManifest.xml:');
try {
  const manifestPath = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    console.log('AndroidManifest.xml exists');
    const content = fs.readFileSync(manifestPath, 'utf8');
    console.log('First 500 characters of AndroidManifest.xml:');
    console.log(content.substring(0, 500) + '...');
  } else {
    console.log('AndroidManifest.xml not found!');
  }
} catch (error) {
  console.error('Error checking AndroidManifest.xml:', error.message);
}

// Check capacitor.config.json
console.log('\n📄 capacitor.config.json:');
try {
  const capacitorConfigPath = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'assets', 'capacitor.config.json');
  if (fs.existsSync(capacitorConfigPath)) {
    console.log('capacitor.config.json exists');
    const content = fs.readFileSync(capacitorConfigPath, 'utf8');
    console.log('First 500 characters of capacitor.config.json:');
    console.log(content.substring(0, 500) + '...');
  } else {
    console.log('capacitor.config.json not found!');
  }
} catch (error) {
  console.error('Error checking capacitor.config.json:', error.message);
}

// Check for gradlew
console.log('\n📄 gradlew:');
try {
  const gradlewPath = path.join(process.cwd(), 'android', 'gradlew');
  if (fs.existsSync(gradlewPath)) {
    console.log('gradlew exists');
    const stats = fs.statSync(gradlewPath);
    console.log(`gradlew size: ${stats.size} bytes`);
    console.log(`gradlew executable: ${(stats.mode & 0o111) !== 0}`);
  } else {
    console.log('gradlew not found!');
  }
} catch (error) {
  console.error('Error checking gradlew:', error.message);
}

// Check for APK in downloads
console.log('\n📄 APK in downloads:');
try {
  const apkPath = path.join(process.cwd(), 'public', 'downloads', 'WorkerConnect.apk');
  if (fs.existsSync(apkPath)) {
    console.log('WorkerConnect.apk exists in public/downloads');
    const stats = fs.statSync(apkPath);
    console.log(`APK size: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log('WorkerConnect.apk not found in public/downloads!');
  }
} catch (error) {
  console.error('Error checking APK:', error.message);
}

console.log('\n🔍 Android build information gathering complete!');