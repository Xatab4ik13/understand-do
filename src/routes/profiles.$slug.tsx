import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PROFILES, profileImage, colorName } from "@/lib/profiles";

export const Route = createFileRoute("/profiles/$slug")({
  loader: ({ params }) => {
    const profile = PROFILES.find((p) => p.slug === params.slug);
    if (!profile) throw notFound();
    return { profile };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.profile.name ?? "Профиль";
    return {
      meta: [
        { title: `${name} — Brand Alum` },
        { name: "description", content: `${name}: цвета и схема. Алюминиевый профиль Brand Alum.` },
        { property: "og:title", content: `${name} — Brand Alum` },
        { property: "og:description", content: `${name}: цвета и схема профиля.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader backTo="/profiles" />
      <p className="p-8 text-center">Профиль не найден</p>
    </div>
  ),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader backTo="/profiles" />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-['Inter'] text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
          {profile.name}
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {profile.colors.map((c) => (
            <figure key={c} className="rounded-lg border bg-card p-3">
              <div className="aspect-square overflow-hidden rounded-md bg-background">
                <img src={profileImage(profile.slug, c)} alt={`${profile.name} — ${colorName(c)}`} loading="lazy" className="h-full w-full object-contain" />
              </div>
              <figcaption className="mt-3 text-sm font-semibold text-foreground">{colorName(c)}</figcaption>
            </figure>
          ))}
        </div>
        {profile.scheme && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Схема</h2>
            <div className="mt-4 rounded-lg border bg-card p-4">
              <img src={profile.scheme} alt={`Схема — ${profile.name}`} className="mx-auto max-h-[600px] w-auto object-contain" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
