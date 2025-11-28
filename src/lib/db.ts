import { findFile, getFileContent, updateFile, uploadFile } from './storage/drive';

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

export interface Database {
    posts: Post[];
    events: Event[];
    subscribers: Subscriber[];
}

const INITIAL_DB: Database = {
    posts: [],
    events: [],
    subscribers: [],
};

export async function getDatabase(): Promise<Database> {
    if (!FOLDER_ID) return INITIAL_DB;

    try {
        const file = await findFile(DB_FILENAME, FOLDER_ID);
        if (!file) {
            // Create it if it doesn't exist
            await saveDatabase(INITIAL_DB);
            return INITIAL_DB;
        }

        const stream = await getFileContent(file.id!);
        const chunks: any[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return JSON.parse(buffer.toString());
    } catch (error) {
        console.error('Error fetching database:', error);
        return INITIAL_DB;
    }
}

export async function saveDatabase(data: Database) {
    if (!FOLDER_ID) throw new Error('GOOGLE_DRIVE_FOLDER_ID is not set');

    const buffer = Buffer.from(JSON.stringify(data, null, 2));

    const file = await findFile(DB_FILENAME, FOLDER_ID);
    if (file) {
        await updateFile(file.id!, buffer, 'application/json');
    } else {
        await uploadFile(buffer, DB_FILENAME, 'application/json', FOLDER_ID);
    }
}
