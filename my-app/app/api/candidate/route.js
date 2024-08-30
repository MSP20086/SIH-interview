import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const config = {
    api: {
        bodyParser: false
    }
};

export async function PATCH(request) {
    try {
        const data = await request.formData();
        const file = data.get('resume');

        if (!file) {
            return NextResponse.json({ error: 'Resume file is missing' }, { status: 400 });
        }

        // Prepare FormData for Pinata
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('pinataMetadata', JSON.stringify({ name: 'Resume' }));

        // Upload file to Pinata
        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`
                // Do not set 'Content-Type' header manually
            },
            body: formDataToSend
        });

        if (!pinataResponse.ok) {
            const errorText = await pinataResponse.text();
            throw new Error(`Pinata API error: ${errorText}`);
        }

        const pinataResult = await pinataResponse.json();
        console.log('Pinata Response:', pinataResult);

        const { IpfsHash } = pinataResult;

        if (!IpfsHash) {
            throw new Error('IPFS Hash not found in Pinata response');
        }

        const resumeLink = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

        // Connect to MongoDB
        const { db } = await connectToDatabase();

        // Store data in MongoDB
        const { id, name, email, skillSets } = Object.fromEntries(data.entries());
        const interview = await db.collection('interviews').findOne({ _id: ObjectId(id) });

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        interview.name = name;
        interview.email = email;
        interview.skillSets = skillSets;
        interview.resumeLink = resumeLink;

        await db.collection('interviews').updateOne(
            { _id: ObjectId(id) },
            { $set: { name, email, skillSets, resumeLink } }
        );

        return NextResponse.json({ message: 'Submission successful', resumeLink }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
