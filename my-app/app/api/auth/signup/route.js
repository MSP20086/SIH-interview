import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
        return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const user = await db.collection('users').findOne({ _id: result.insertedId });

        const token = jwt.sign(
            { email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );

        return new Response(JSON.stringify({ token, user: { name: user.name, email: user.email, role: user.role } }), { status: 200 });
    } catch (error) {
        console.error('Error in signup API:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
