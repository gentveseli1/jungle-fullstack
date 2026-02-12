import LandingRenderer from "./components/landing/LandingRenderer";

async function getLanding() {
    const res = await fetch("http://localhost:3000/api/landing/home", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

export default async function Page() {
    const data = await getLanding();

    if (!data) return <main className="p-10">No landing found</main>;

    return (
        <main>
            <LandingRenderer sections={data.sections} />
        </main>
    );
}