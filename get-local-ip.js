#!/usr/bin/env node

/**
 * Get Local IP Address
 * 
 * This script helps you find your local IP address for mobile app development.
 * Run: node get-local-ip.js
 */

const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          interface: name,
          address: iface.address,
        });
      }
    }
  }

  return addresses;
}

function displayIPAddresses() {
  console.log('\n📡 Local IP Addresses for Mobile App Development\n');
  console.log('━'.repeat(60));

  const addresses = getLocalIPAddress();

  if (addresses.length === 0) {
    console.log('❌ No local IP addresses found.');
    console.log('   Make sure you are connected to a network.\n');
    return null;
  }

  addresses.forEach((addr, index) => {
    console.log(`${index + 1}. ${addr.interface}`);
    console.log(`   IP: ${addr.address}`);
    console.log('');
  });

  console.log('━'.repeat(60));
  console.log('\n📝 Next Steps:\n');
  console.log('1. Copy one of the IP addresses above (usually Wi-Fi)');
  console.log('2. Edit: src/api/config.ts');
  console.log('3. Set: USE_LOCAL_IP = true');
  console.log('4. Set: LOCAL_IP_ADDRESS = "YOUR_IP_ADDRESS"');
  console.log('5. Rebuild your mobile app\n');

  console.log('💡 For Backend:\n');
  console.log('Make sure your backend is running with Docker:');
  console.log('   cd backend');
  console.log('   docker-compose up -d\n');

  // Suggest the most likely IP (usually Wi-Fi or Ethernet)
  const suggested = addresses.find(
    (addr) =>
      addr.interface.toLowerCase().includes('wi-fi') ||
      addr.interface.toLowerCase().includes('wlan') ||
      addr.interface.toLowerCase().includes('en0') ||
      addr.interface.toLowerCase().includes('eth')
  );

  if (suggested) {
    console.log(`🎯 Suggested IP (${suggested.interface}): ${suggested.address}\n`);
    console.log(`Your mobile app should use: http://${suggested.address}:3001/api\n`);
  }

  return addresses[0]?.address || null;
}

// Run the script
const ip = displayIPAddresses();
process.exit(0);

