import pinataSDK from '@pinata/sdk';

const apiKey = process.env.PINATA_API_KEY;
const apiSecret = process.env.PINATA_API_SECRET;

const pinata = pinataSDK(apiKey, apiSecret);

export async function uploadToPinata(file) {
    try {
        const result = await pinata.pinFileToIPFS(file);
        return result;
    } catch (error) {
        throw new Error('Error uploading file to Pinata: ' + error.message);
    }
}
