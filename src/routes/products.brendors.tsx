import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getProductLine } from "@/lib/products";

export const Route = createFileRoute("/products/brendors")({
  head: () => ({
    meta: [
      { title: "Наша продукция — Брендорс — Brand Alum" },
      {
        name: "description",
        content:
          "Алюминиевые стеклянные перегородки Брендорс: раздвижные и распашные конструкции в чёрном профиле — фото выполненных работ.",
      },
      { property: "og:title", content: "Наша продукция — Брендорс" },
      {
        property: "og:description",
        content: "Фото выполненных работ: алюминиевые стеклянные перегородки Брендорс.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BrendorsPage,
});

function BrendorsPage() {
  const line = getProductLine("brendors");
  if (!line) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">{line.eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
            {line.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {line.caption}
          </p>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 md:mt-14 lg:columns-3">
          {line.images.map((img, i) => (
            <figure
              key={img.src}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={img.src}
                alt={`Перегородка ${line.name}, работа ${i + 1}`}
                width={img.w}
                height={img.h}
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </main>
    </div>
  );
}
