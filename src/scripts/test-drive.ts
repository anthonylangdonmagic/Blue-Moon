import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getDriveClient } from '../lib/storage/drive';

async function test() {
    try {
        console.log("Testing Google Drive Connection...");
        const drive = await getDriveClient();
        const res = await drive.files.list({ pageSize: 1 });
        console.log("Connection Successful!");
        console.log("Files found:", res.data.files?.length);
    } catch (error: any) {
        console.error("Connection Failed:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

test();
