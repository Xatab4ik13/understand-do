import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-icon.png.asset.json";

const logoUrl = logoAsset.url;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О компании — Brand Alum" },
      { name: "description", content: "О компании Brand Alum" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Link to="/" aria-label="На главную">
        <img src={logoUrl} alt="Логотип Brand Alum" className="h-48 w-auto md:h-64" />
      </Link>
    </div>
  );
}
