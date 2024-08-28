// lib/userModel.js
import { connectToDatabase } from './mongodb';

export async function findOrCreateUser(email, name) {
    const { db } = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
        return existingUser;
    }

    const result = await db.collection('users').insertOne({
        email,
        name,
        role: 'candidate',
    });

    return result.ops[0];
}
