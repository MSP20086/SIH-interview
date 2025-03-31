import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
        }
        const token = jwt.sign(
            {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );

        return new Response(JSON.stringify({ token, user: { _id: user._id, email: user.email, name: user.name, role: user.role } }), { status: 200 });
    } catch (error) {
        console.error('Error in login API:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
