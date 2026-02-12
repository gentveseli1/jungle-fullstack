export default function Features({
  data,
}: {
  data: { title?: string; items: { title: string; description: string }[] };
}) {
    return (
        <section className="mx-auto max-w-6xl px-6 py-16">
            {data.title ? <h2 className="text-2xl font-semibold">{data.title}</h2> : null}

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(data.items ?? []).map((item, idx) => (
                    <div key={idx} className="rounded-2xl border p-6">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}