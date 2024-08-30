import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function PATCH(request) {
    try {
        const data = await request.formData();
        console.log('Data:', data);
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
            },
            body: formDataToSend
        });

        if (!pinataResponse.ok) {
            const errorText = await pinataResponse.text();
            throw new Error(`Pinata API error: ${errorText}`);
        }

        const pinataResult = await pinataResponse.json();
        const { IpfsHash } = pinataResult;

        if (!IpfsHash) {
            throw new Error('IPFS Hash not found in Pinata response');
        }

        const resumeLink = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

        const { db } = await connectToDatabase();

        const { id, name, email, skillSets } = Object.fromEntries(data.entries());

        console.log('ID:', id);
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const interview = await db.collection('interviews').findOne({ _id: new ObjectId(id) }); 

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        
        interview.skillSets = skillSets;
        interview.resumeLink = resumeLink;
        
        await db.collection('interviews').updateOne(
            { _id: new ObjectId(id) }, 
            { $set: interview }
        );

        console.log('Interview updated successfully:', interview);
        return NextResponse.json({ message: 'Submission successful', resumeLink, interview }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
