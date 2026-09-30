import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О компании — Brand Alum" },
      { name: "description", content: "О компании Brand Alum" },
      { property: "og:title", content: "О компании — Brand Alum" },
      { property: "og:description", content: "О компании Brand Alum" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20" />
    </div>
  );
}
