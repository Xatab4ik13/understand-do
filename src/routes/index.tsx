import { createFileRoute, Link } from "@tanstack/react-router";
import { PARTITION_TYPES } from "@/lib/configurator/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatRub } from "@/lib/configurator/calculate";
import { TypeScheme } from "@/components/configurator/TypeScheme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Конфигуратор перегородок" },
      { name: "description", content: "Онлайн-расчёт стоимости стеклянных перегородок" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Конфигуратор перегородок
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
                {/* Схема — крупно сверху */}
                <div className="border-b bg-muted/30 px-5 py-6 transition-colors group-hover:bg-muted/50">
                  <TypeScheme type={t} />
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

        {/* Легенда */}
        <div className="mt-8 rounded-md border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <div className="mb-2 font-medium uppercase tracking-wider text-foreground">
            Условные обозначения
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-3 w-6 border border-foreground"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.7) 0 1px, transparent 1px 4px)",
                }}
              />
              стена
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-3 w-6 border border-foreground"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, hsl(var(--foreground) / 0.35) 0 0.6px, transparent 0.6px 5px)",
                }}
              />
              стационар
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-3 w-6 items-center justify-center border border-foreground bg-background">
                <svg viewBox="0 0 24 8" className="h-2 w-5">
                  <line x1="3" y1="4" x2="21" y2="4" stroke="currentColor" strokeWidth="1" />
                  <polyline points="6,1 3,4 6,7" fill="none" stroke="currentColor" strokeWidth="1" />
                  <polyline points="18,1 21,4 18,7" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
              подвижная створка (стрелка — направление)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
