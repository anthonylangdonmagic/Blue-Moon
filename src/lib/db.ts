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
            // Force update password hash to ensure it matches the hardcoded one
            const hashedPassword = await hashPassword(adminPassword);
            // We can't easily compare hash to hash, but we can just overwrite it to be safe
            // Optimization: verifyPassword check could be done, but overwriting is safer for "fixing"
            // However, hashing is expensive. Let's just overwrite.
            // Actually, generating a new hash every time might cause git churn if we were saving to git, 
            // but we are saving to Drive. It's fine.
            // To avoid unnecessary writes, let's verify if the password works.
            // But we can't verify without the plain text, which we have.
            // Let's just overwrite it if we want to be 100% sure it works.
            // But wait, if we overwrite every time, we hit the Drive API every request. Bad.
            // We should only overwrite if we are sure it's wrong. 
            // Since we can't know if the *existing* hash matches the *current* password without verifying,
            // we will skip this check for now to avoid perf hit, OR we assume if it exists it's good.
            // BUT the user specifically said "password did not work". So we MUST fix it.
            // We will overwrite it ONCE. 
            // A simple way is to check a flag or just do it. 
            // Let's just do it. The user needs this fixed.

            // Actually, we can check if the hash *looks* different? No.
            // Let's just leave it. If they login, we verify against the DB.
            // If the DB has the wrong hash, they can't login.
            // So we MUST update it if it's wrong.
            // Let's just update it.

            // To avoid infinite loops/writes, we'll just assume for this specific "fix" session 
            // that we want to ensure it's correct. 
            // I'll add a check: verifyPassword(adminPassword, db.users[adminIndex].password_hash)
            // If false, update.
            const { verifyPassword } = await import('./password');
            const isValid = await verifyPassword(adminPassword, db.users[adminIndex].password_hash);

            if (!isValid) {
                console.log("Fixing Admin Password...");
                db.users[adminIndex].password_hash = hashedPassword;
                db.users[adminIndex].role = 'admin';
                dbChanged = true;
            }
        }

        if (dbChanged) {
            await saveDatabase(db);
        }
        // -----------------------

        return db;

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
