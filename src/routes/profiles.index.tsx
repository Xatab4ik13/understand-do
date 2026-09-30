import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PROFILES, profileImage } from "@/lib/profiles";

export const Route = createFileRoute("/profiles/")({
  head: () => ({
    meta: [
      { title: "Алюминиевый профиль — Brand Alum" },
      { name: "description", content: "Алюминиевый профиль Brand Alum для стеклянных перегородок: черный анод, серебро, золото, шампань." },
      { property: "og:title", content: "Алюминиевый профиль — Brand Alum" },
      { property: "og:description", content: "Каталог алюминиевых профилей для стеклянных перегородок." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilesPage,
});

function ProfilesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-['Inter'] text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
          Алюминиевый профиль
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {PROFILES.map((p) => (
            <Link
              key={p.slug}
              to="/profiles/$slug"
              params={{ slug: p.slug }}
              className="group rounded-lg border bg-card p-3 transition-shadow hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden rounded-md bg-background">
                <img src={profileImage(p.slug, "01")} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground md:text-base">{p.name}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
