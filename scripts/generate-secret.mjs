#!/usr/bin/env node
import crypto from 'crypto';

/**
 * Generate a secure random secret for ADMIN_SESSION_SECRET
 */
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('\n🔐 Generated Secure Session Secret:\n');
console.log(generateSecret());
console.log('\n✅ Copy this to your .env.local as ADMIN_SESSION_SECRET\n');
