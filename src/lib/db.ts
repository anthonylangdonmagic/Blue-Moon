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

        if (adminIndex === -1) {
            console.log("Seeding Admin User...");
            const hashedPassword = await hashPassword(adminPassword);
            db.users.push({
                id: uuidv4(),
                email: adminEmail,
                password_hash: hashedPassword,
                role: 'admin',
                created_at: new Date().toISOString()
            });
            dbChanged = true;
        } else {
            // FORCE UPDATE PASSWORD to ensure it works
            console.log("Forcing Admin Password Update...");
            const hashedPassword = await hashPassword(adminPassword);
            db.users[adminIndex].password_hash = hashedPassword;
            db.users[adminIndex].role = 'admin';
            dbChanged = true;
        }

        if (dbChanged) {
            console.log("Saving database changes...");
            try {
                await saveDatabase(db);
                console.log("Database saved successfully.");
            } catch (saveError) {
                console.error("Failed to save database (returning in-memory copy):", saveError);
                // Do NOT throw or return INITIAL_DB here. 
                // We want to return 'db' so the user can at least login with the in-memory admin.
            }
        }

        return db;

    } catch (error) {
        console.error('Error fetching database:', error);
        // If we fail to even read/parse, we should still try to return a DB with the admin user
        // so they can login.
        const fallbackDB = { ...INITIAL_DB };
        // Seed admin in fallback
        const adminEmail = 'anthonylangdonmagic@gmail.com';
        const adminPassword = 'Johnnycash11$';
        const { hashPassword } = await import('./password');
        const hashedPassword = await hashPassword(adminPassword);

        fallbackDB.users = [{
            id: uuidv4(),
            email: adminEmail,
            password_hash: hashedPassword,
            role: 'admin',
            created_at: new Date().toISOString()
        }];

        return fallbackDB;
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
