import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Check if .env exists
const envPath = path.resolve(process.cwd(), '.env');
console.log('--- Environment Debug ---');
console.log('.env path:', envPath);
console.log('.env exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('.env lines count:', content.split('\n').length);
}

// Load env
const result = dotenv.config();
if (result.error) {
    console.error('Dotenv Error:', result.error);
}

const keys = Object.keys(process.env);
const targetKeys = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'MONGODB_URI',
    'PORT',
    'FRONTEND_URL'
];

console.log('\n--- Variable Presence ---');
targetKeys.forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value ? '✅ (Length: ' + value.length + ')' : '❌ MISSING'}`);
    if (value && key === 'MONGODB_URI') {
        console.log(`  MONGODB_URI starts with: ${value.substring(0, 20)}...`);
    }
});

console.log('\n--- All keys starting with G or M ---');
keys.filter(k => k.startsWith('G') || k.startsWith('M')).forEach(k => console.log(`- ${k}`));
