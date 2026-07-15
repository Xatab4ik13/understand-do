import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex h-24 items-center gap-2 md:h-32 md:items-stretch">
            <img src={logoUrl} alt="Логотип Brand Alum" className="h-full w-auto" />
            <div className="flex flex-col justify-center">
              <div className="inline-flex flex-col">
                <span className="font-['Inter'] text-[2.5rem] font-black uppercase leading-[0.85] tracking-tight text-foreground md:text-[3.25rem]">
                  Brand
                </span>
                <span className="font-['Inter'] text-[2.5rem] font-black uppercase leading-[0.85] tracking-tight text-foreground md:text-[3.25rem]">
                  Alum
                </span>
                <div className="mt-1 h-[2px] w-full bg-foreground" />
              </div>
              <span className="mt-1 font-sans text-sm font-medium leading-tight text-foreground md:text-base">
                Алюминиевые стеклянные перегородки
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1 font-['Inter'] text-sm font-black uppercase tracking-tight text-foreground transition-opacity hover:opacity-70 md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8" />
    </div>
  );
}
