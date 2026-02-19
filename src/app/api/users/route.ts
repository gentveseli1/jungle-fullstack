import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const rawEmail = body?.email;
        const rawName = body?.name;

        if (!rawEmail || typeof rawName !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const email = rawEmail.trim().toLowerCase();
        const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : null;

        const created = await prisma.user.create({
            data: { email, name },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user"}, { status: 500});
    }
}

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return NextResponse.json(users);
}