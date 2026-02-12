export default function CTA({
  data,
}: {
  data: { title: string; cta: { label: string; href: string } };
}) {
    return (
        <>
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-3xl bg-black p-10 text-white">
                    <div className="flex flex-col gap-6 lg:flex-row lg-items-center lg:justify-between">
                        <h3 className="text-2xl font-semibold">{data.title}</h3>
                        <a href={data.cta.href} className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                            {data.cta.label}
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}