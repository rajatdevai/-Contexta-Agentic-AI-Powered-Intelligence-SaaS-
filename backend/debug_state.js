console.log('--- STARTING DEBUG SCRIPT ---');
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

async function checkState() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected.');

        const User = mongoose.model('User', new mongoose.Schema({ email: String }, { strict: false }));
        const uCount = await User.countDocuments();
        console.log(`Users in DB: ${uCount}`);

        const onboardedUsers = await User.find({ isOnboarded: true });
        console.log(`Onboarded users: ${onboardedUsers.length}`);
        onboardedUsers.forEach(u => console.log(` - ${u.email}: ${JSON.stringify(u.delivery?.times)}`));

    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await mongoose.disconnect();
        console.log('--- END DEBUG SCRIPT ---');
        process.exit();
    }
}

checkState();
