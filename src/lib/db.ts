import { findFile, getFileContent, updateFile, uploadFile } from './storage/drive';
import { hashPassword } from './password';
import { v4 as uuidv4 } from 'uuid';

const DB_FILENAME = 'database.json';
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    type: 'short_form' | 'essay' | 'long_form';
    media_url?: string;
    published_at: string;
    tags?: string[];
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location?: string;
    description?: string;
}

export interface Subscriber {
    id: string;
    email: string;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    avatar_url?: string;
    created_at: string;
}

export interface Database {
    posts: Post[];
    events: Event[];
    subscribers: Subscriber[];
    users: User[];
}

const INITIAL_DB: Database = {
    posts: [],
    events: [],
    subscribers: [],
    users: [],
};

export async function getDatabase(): Promise<Database> {
    if (!FOLDER_ID) return INITIAL_DB;

    try {
        let db: Database;
        const file = await findFile(DB_FILENAME, FOLDER_ID);

        if (!file) {
            db = INITIAL_DB;
            await saveDatabase(db);
        } else {
            const stream = await getFileContent(file.id!);
            const chunks: any[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            db = JSON.parse(buffer.toString());
        }

        // --- SEED ADMIN USER ---
        const adminEmail = 'anthonylangdonmagic@gmail.com';
        const adminPassword = 'Johnnycash11$';

        if (!db.users) {
            db.users = [];
        }

        const adminIndex = db.users.findIndex(u => u.email === adminEmail);

        let dbChanged = false;


        const file = await findFile(DB_FILENAME, FOLDER_ID);
        if (file) {
            await updateFile(file.id!, buffer, 'application/json');
        } else {
            await uploadFile(buffer, DB_FILENAME, 'application/json', FOLDER_ID);
        }
    }
