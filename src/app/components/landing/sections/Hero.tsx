export default function Hero({
    data,
}: {
    data: {
        title: string;
        subtitle?: string;
        primaryCta?: { label: string; href: string};
    };
}) {
    return (
        <>
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-3xl border p-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        {data.title}
                    </h1>
                    {data.subtitle ? <p className="mt-6 text-lg leading-8 text-gray-600">{data.subtitle}</p> : null}

                    {data.primaryCta ? (<a href={data.primaryCta.href} className="mt-10 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                        {data.primaryCta.label}
                    </a>) : null}
                </div>
            </section>
        </>
    )
}