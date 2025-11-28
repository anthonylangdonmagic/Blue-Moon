import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const session = await verifySession();
        if (!session || session.role !== 'admin') {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};
