import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

async function clearDatabase() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('❌ MONGODB_URI not found in environment variables');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected.');

        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log(`🧹 Found ${collections.length} collections to clear.`);

        for (const collection of collections) {
            console.log(`🗑️  Dropping collection: ${collection.name}`);
            await mongoose.connection.db.dropCollection(collection.name);
        }

        console.log('✨ Database cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

clearDatabase();
