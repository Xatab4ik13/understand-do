import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PARTITION_TYPES } from "@/lib/configurator/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/configurator/calculate";
import { TYPE_IMAGES } from "@/lib/configurator/typeImages";
import { DealerLoginDialog } from "@/components/DealerLoginDialog";
import { DealerRequestDialog } from "@/components/DealerRequestDialog";
import { Button } from "@/components/ui/button";
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
    "font-['Inter'] text-sm font-black uppercase tracking-tight text-foreground transition-opacity hover:opacity-70 md:text-base";

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

          <div className="flex flex-col items-center gap-2 md:items-end">
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
              {isDealer ? (
                <>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-['Inter'] text-xs font-black uppercase tracking-tight text-primary md:text-sm">
                    Режим дилера
                  </span>
                  <button type="button" className={menuItemClass} onClick={onLogout}>
                    Выйти
                  </button>
                </>
              ) : (
                <button type="button" className={menuItemClass} onClick={() => setModal("dealer-login")}>
                  Для дилеров
                </button>
              )}
              <button type="button" className={menuItemClass} onClick={() => setModal("dealer-request")}>
                Стать дилером
              </button>
              <Link to="/about" className={menuItemClass}>
                О компании
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground md:text-right md:text-base">
              Выберите тип конструкции, чтобы рассчитать стоимость
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTITION_TYPES.map((t) => (
            <Link
              key={t.id}
              to="/configurator/$typeId"
              params={{ typeId: t.id }}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted/20">
                  <img
                    src={TYPE_IMAGES[t.id]}
                    alt={t.name}
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <CardContent className="p-5">
                  <h2 className="text-base font-semibold leading-snug">{t.name}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Створок
                      </div>
                      <div className="text-sm font-medium">{t.sashCount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        от
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {formatPrice(t.basePrice, isDealer)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
