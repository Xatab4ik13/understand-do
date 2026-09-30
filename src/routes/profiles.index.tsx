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
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Каталог Brand Alum</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
            Алюминиевый профиль
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {PROFILES.map((p) => (
            <Link
              key={p.slug}
              to="/profiles/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_color-mix(in_oklab,var(--foreground)_10%,transparent)] active:scale-[0.99]"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={profileImage(p.slug, "01")} alt={p.name} loading="lazy" className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.035]" />
              </div>
              <div className="p-6">
                <p className="text-lg font-semibold text-foreground">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">Чёрный анод</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
