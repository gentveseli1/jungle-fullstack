import LandingClient from "../components/landing/LandingClient";

export default function Page({ params }: { params: { slug: string } }) {
  return <LandingClient slug={params.slug} />;
}