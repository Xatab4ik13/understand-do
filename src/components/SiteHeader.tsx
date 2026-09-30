import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/logo-icon.png.asset.json";

export function SiteHeader({ backTo = "/" }: { backTo?: string }) {
  return (
    <header className="glass-bar sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5 md:h-24 md:px-8">
        <Link to="/" className="flex h-full min-w-0 items-center gap-2.5 transition-opacity hover:opacity-70">
          <img src={logoAsset.url} alt="Логотип Brand Alum" className="h-[78%] w-auto shrink-0" />
          <div className="flex flex-col justify-center">
            <div className="inline-flex flex-col">
              <span className="font-display text-2xl font-semibold uppercase leading-[0.82] text-foreground md:text-[2rem]">
                Brand
              </span>
              <span className="font-display text-2xl font-semibold uppercase leading-[0.82] text-foreground md:text-[2rem]">
                Alum
              </span>
            </div>
            <span className="mt-1 hidden text-[0.68rem] font-medium leading-tight text-muted-foreground sm:block md:text-xs">
              Алюминиевые стеклянные перегородки
            </span>
          </div>
        </Link>
        <Link
          to={backTo}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>
      </div>
    </header>
  );
}
