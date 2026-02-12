import Hero from "./sections/Hero";
import Features from "./sections/Features";
import CTA from "./sections/CTA";

type LandingSection = {
    id?: string;
    type: string;
    order: number;
    data: any;
}

export default function LandingRenderer({ sections }: { sections: LandingSection[] }) {
    return (
        <>
            {sections.map((s, i) => {
                const key = s.id ?? `${s.type}-${i}`;
                switch (s.type) {
                    case "hero":
                        return <Hero key={key} data={s.data} />;
                    case "features":
                        return <Features key={key} data={s.data} />;
                    case "cta":
                        return <CTA key={key} data={s.data} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}