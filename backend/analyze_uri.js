import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.log('❌ MONGODB_URI is not set in .env');
} else {
    console.log('Structure Analysis of MONGODB_URI:');
    console.log(`- Starts with mongodb+srv: ${uri.startsWith('mongodb+srv://')}`);
    console.log(`- Starts with mongodb://: ${uri.startsWith('mongodb://')}`);

    try {
        const parts = uri.split('://');
        if (parts.length > 1) {
            const afterProtocol = parts[1];
            const hostPart = afterProtocol.split('@').pop().split('/')[0];
            console.log(`- Detected Host/Cluster: "${hostPart}"`);

            if (hostPart === '58615') {
                console.log('👉 FOUND THE ISSUE: "58615" is being used as the hostname. If this is a port, you should use mongodb://localhost:58615/ instead of mongodb+srv://');
            }
        }
    } catch (e) {
        console.log('- Could not parse URI structure');
    }
}
