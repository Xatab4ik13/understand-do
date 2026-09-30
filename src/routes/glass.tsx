import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { GLASS_TYPES, glassImage } from "@/lib/glass";

export const Route = createFileRoute("/glass")({
  head: () => ({
    meta: [
      { title: "Виды стекла — Brand Alum" },
      {
        name: "description",
        content:
          "Виды стекла для алюминиевых перегородок Brand Alum: прозрачное, осветлённое, сатинат, тонированное, Мору, Вижн, Кафедрал, Дихроик.",
      },
      { property: "og:title", content: "Виды стекла — Brand Alum" },
      { property: "og:description", content: "Все виды стекла для перегородок Brand Alum с фото." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GlassPage,
});

function GlassPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <h1 className="mb-10 font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl">
          Виды стекла
        </h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {GLASS_TYPES.map((g) => (
            <figure key={g.slug} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <img
                src={glassImage(g.slug)}
                alt={g.name}
                width={768}
                height={1024}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-sm font-medium text-foreground">{g.name}</figcaption>
            </figure>
          ))}
        </div>
      </main>
    </div>
  );
}
