import { createFileRoute, Link } from "@tanstack/react-router";
import { PARTITION_TYPES } from "@/lib/configurator/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatRub } from "@/lib/configurator/calculate";
import { TYPE_IMAGES } from "@/lib/configurator/typeImages";
import logoUrl from "@/assets/logo.svg?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BRANDOORS Brand Alum" },
      { name: "description", content: "Онлайн-расчёт стоимости алюминиевых стеклянных перегородок BRANDOORS" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <img
            src={logoUrl}
            alt="Логотип BRANDOORS Brand Alum"
            className="h-20 w-auto md:h-24"
          />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            BRANDOORS Brand Alum
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Выберите тип конструкции, чтобы рассчитать стоимость
          </p>
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
                {/* Схема-фото типа */}
                <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted/20">
                  <img
                    src={TYPE_IMAGES[t.id]}
                    alt={t.name}
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <CardContent className="p-5">
                  <h2 className="text-base font-semibold leading-snug">
                    {t.name}
                  </h2>
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
                        {formatRub(t.basePrice)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
