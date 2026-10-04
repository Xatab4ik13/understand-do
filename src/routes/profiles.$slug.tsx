import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
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
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Алюминиевый профиль</p>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
          {profile.name}
        </h1>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {profile.colors.map((c) => (
            <figure key={c} className="group overflow-hidden rounded-2xl bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_color-mix(in_oklab,var(--foreground)_10%,transparent)]">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={profileImage(profile.slug, c)} alt={`${profile.name} — ${colorName(c)}`} loading="lazy" className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035]" />
              </div>
              <figcaption className="p-5 text-sm font-medium text-foreground">{colorName(c)}</figcaption>
            </figure>
          ))}
        </div>
        {profile.scheme && (
          <section className="mt-16 md:mt-24">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Техническая документация</p>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">Схема</h2>
            <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-2xl bg-card p-8 md:min-h-[520px] md:p-14">
              <img src={profile.scheme} alt={`Схема — ${profile.name}`} className="max-h-[440px] w-auto object-contain" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
