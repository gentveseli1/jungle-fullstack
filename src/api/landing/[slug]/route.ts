import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SectionInput = {
    type: string;
    order?: number;
    data?: any;
};

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
    const page = await prisma.landingPage.findUnique({
        where: { slug: params.slug },
        include: { sections: { orderBy: { order: "asc" } } },
    });

    if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
    const body = await request.json().catch(() => null);

    const title = typeof body?.title === "string" ? body.title : null;
    const sections: SectionInput[] = Array.isArray(body?.sections) ? body.sections : [];

    const safeSections = sections
        .filter((s) => s && typeof s.type === "string")
        .map((s, idx) => ({
            type: s.type,
            order: Number.isFinite(s.order) ? Number(s.order) : idx + 1,
            data: s.data ?? {},
        }))
        .sort((a, b) => a.order - b.order);

    const updated = await prisma.$transaction(async (tx: any) => {
        const page = await tx.landingPage.upsert({
            where: { slug: params.slug },
            update: { title: title ?? undefined },
            create: { slug: params.slug, title: title ?? "Untitled" },
        });

        // FIX: tabela quhet landingSection (sipas modelit), jo "section"
        await tx.landingSection.deleteMany({ where: { landingPageId: page.id } });

        if (safeSections.length > 0) {
            await tx.landingSection.createMany({
                data: safeSections.map((s) => ({
                    landingPageId: page.id,
                    type: s.type,
                    order: s.order,
                    data: s.data,
                })),
            });
        }

        return tx.landingPage.findUnique({
            where: { id: page.id },
            include: { sections: { orderBy: { order: "asc" } } },
        });
    });

    return NextResponse.json(updated);
}