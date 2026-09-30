import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PARTITION_TYPES } from "@/lib/configurator/types";
import { formatPrice } from "@/lib/configurator/calculate";
import { TYPE_IMAGES } from "@/lib/configurator/typeImages";
import { DealerLoginDialog } from "@/components/DealerLoginDialog";
import { DealerRequestDialog } from "@/components/DealerRequestDialog";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useDealerMode, useInvalidateDealerMode } from "@/hooks/useDealerMode";
import { dealerLogout } from "@/lib/api/dealer.functions";
import logoAsset from "@/assets/logo-icon.png.asset.json";

const logoUrl = logoAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brand Alum" },
      { name: "description", content: "Онлайн-расчёт стоимости алюминиевых стеклянных перегородок Brand Alum" },
      { property: "og:title", content: "Brand Alum — алюминиевые стеклянные перегородки" },
      { property: "og:description", content: "Выберите тип алюминиевой стеклянной перегородки и рассчитайте стоимость." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type ModalKind = null | "dealer-login" | "dealer-request";

function Index() {
  const [modal, setModal] = useState<ModalKind>(null);
  const isDealer = useDealerMode();
  const invalidate = useInvalidateDealerMode();

  const menuItemClass =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-[0.97]";

  const onLogout = async () => {
    try {
      await dealerLogout();
      await invalidate();
      toast.success("Дилерский режим выключен");
    } catch (e) {
      console.error(e);
      toast.error("Не удалось выйти");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors />
      <header className="glass-bar sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 md:h-24 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
          <div className="flex h-14 items-center gap-2.5 md:h-full">
            <img src={logoUrl} alt="Логотип Brand Alum" className="h-full w-auto" />
            <div className="flex flex-col justify-center">
              <div className="inline-flex flex-col">
                <span className="font-display text-2xl font-semibold uppercase leading-[0.82] text-foreground md:text-[2rem]">
                  Brand
                </span>
                <span className="font-display text-2xl font-semibold uppercase leading-[0.82] text-foreground md:text-[2rem]">
                  Alum
                </span>
              </div>
              <span className="mt-1 hidden text-xs font-medium leading-tight text-muted-foreground sm:block">
                Алюминиевые стеклянные перегородки
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:items-end">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end">
              {isDealer ? (
                <button type="button" className={menuItemClass} onClick={onLogout}>
                  Выйти
                </button>
              ) : (
                <button type="button" className={menuItemClass} onClick={() => setModal("dealer-login")}>
                  Для дилеров
                </button>
              )}
              <button type="button" className={menuItemClass} onClick={() => setModal("dealer-request")}>
                Стать дилером
              </button>
              <Link to="/profiles" className={menuItemClass}>
                Алюминиевый профиль
              </Link>
              <Link to="/about" className={menuItemClass}>
                О компании
              </Link>
              <Link to="/contacts" className={menuItemClass}>
                Контакты
              </Link>
            </nav>
            <p className="hidden text-sm text-muted-foreground md:block md:text-right">
              Выберите тип конструкции, чтобы рассчитать стоимость
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <div className="mb-10 max-w-3xl md:mb-14">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Конфигуратор перегородок</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
            Выберите тип конструкции
          </h1>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTITION_TYPES.map((t) => (
            <Link
              key={t.id}
              to="/configurator/$typeId"
              params={{ typeId: t.id }}
              className="group overflow-hidden rounded-2xl bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_color-mix(in_oklab,var(--foreground)_10%,transparent)] active:scale-[0.99]"
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={TYPE_IMAGES[t.id]}
                    alt={t.name}
                    className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-lg font-semibold leading-snug">{t.name}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-border/70 pt-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Створок
                      </div>
                      <div className="text-sm font-medium">{t.sashCount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        от
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {formatPrice(t.basePrice, isDealer)}
                      </div>
                    </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </main>

      <DealerLoginDialog
        open={modal === "dealer-login"}
        onOpenChange={(o) => setModal(o ? "dealer-login" : null)}
      />

      <DealerRequestDialog
        open={modal === "dealer-request"}
        onOpenChange={(o) => setModal(o ? "dealer-request" : null)}
      />
    </div>
  );
}
