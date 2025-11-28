import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, Post, Event } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    const db = await getDatabase();

    if (slug) {
        const post = db.posts.find((p) => p.slug === slug);
        return NextResponse.json(post || { error: 'Not found' }, { status: post ? 200 : 404 });
    }

    let posts = db.posts;
    if (type) {
        posts = posts.filter((p) => p.type === type);
    }

    // Sort by date desc
    posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    return NextResponse.json({ posts, events: db.events });
}

export async function POST(request: NextRequest) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDatabase();

    if (body.type === 'event') {
        const newEvent: Event = {
            id: uuidv4(),
            ...body,
        };
        db.events.push(newEvent);
    } else {
        const newPost: Post = {
            id: uuidv4(),
            published_at: new Date().toISOString(),
            ...body,
        };
        // Update if exists (simple check by id if provided, else create)
        if (body.id) {
            const index = db.posts.findIndex(p => p.id === body.id);
            if (index !== -1) {
                db.posts[index] = { ...db.posts[index], ...body };
            } else {
                db.posts.push(newPost);
            }
        } else {
            db.posts.push(newPost);
        }
    }

    await saveDatabase(db);
    return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'post' or 'event'

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = await getDatabase();

    if (type === 'event') {
        db.events = db.events.filter(e => e.id !== id);
    } else {
        db.posts = db.posts.filter(p => p.id !== id);
    }

    await saveDatabase(db);
    return NextResponse.json({ success: true });
}
