"use client";

import { useEffect, useState } from "react";
import LandingRenderer from "./LandingRenderer";

type LandingResponse = {
    slug: string;
    title?: string | null;
    description?: string | null;
    sections: {
        id: string;
        type: string;
        order: number;
        data: any;
    }[];
};

export default function LandingClient({ slug }: { slug: string }) {
    const [data, setData] = useState<LandingResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        setLoading(true);

        fetch(`/api/landing/${slug}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
            if (!alive) return;

            setData(json);

        })

        .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };

    }, [slug]);

    if (loading) {
        return (
            <main className="mx-auto max-w-3xl p-10">
                <div className="rounded-2xl border p-6">Loading landing page…</div>
            </main>
        );
    }
    
    if (!data) {
        return (
            <main className="mx-auto max-w-3xl p-10">
                <div className="rounded-2xl border p-6">Landing page not found.</div>
            </main>
        );
    }

    return (
        <main>
            <LandingRenderer sections={data.sections} />
        </main>
    );
}