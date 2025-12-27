import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import emailService from './src/services/emailService.js';

dotenv.config();

async function verifyLimit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'rajatsingh586155@gmail.com';
        let user = await User.findOne({ email: testEmail });

        if (!user) {
            console.log('Test user not found, please run onboarding or create user first.');
            process.exit(1);
        }

        // Phase 1: Reset and test increment
        console.log('\n--- Phase 1: Test Increment ---');
        user.emailsSent = 19;
        await user.save();
        console.log(`Set emailsSent to ${user.emailsSent}`);

        // Trigger digest (we need at least one event for this to work, or we can mock sendDigest result)
        // For this verification, we'll manually call sendDigest and check the result
        const result = await emailService.sendDigest(user);
        console.log('Send attempt 1 (at 19):', result);

        if (result.sent) {
            user = await User.findOne({ email: testEmail });
            console.log(`emailsSent after successful send: ${user.emailsSent}`);
        }

        // Phase 2: Test Block
        console.log('\n--- Phase 2: Test Block ---');
        const result2 = await emailService.sendDigest(user);
        console.log('Send attempt 2 (at 20):', result2);

        if (result2.reason === 'limit_reached') {
            console.log('✅ Success: Email was blocked after reaching 20');
        } else {
            console.log('❌ Failure: Email was not blocked at 20');
        }

    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await mongoose.connection.close();
    }
}

verifyLimit();
