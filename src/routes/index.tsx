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
          <div className="mb-2 font-mono font-medium uppercase tracking-wider text-foreground">
            Условные обозначения
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-6 bg-foreground" />
              подвижная створка
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-6 border border-foreground bg-muted" />
              стационар (СТАЦ)
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-3 w-6 border border-foreground"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.55) 0 0.6px, transparent 0.6px 4px)",
                }}
              />
              стена
            </span>
            <span>Л / П — направление открывания</span>
            <span className="rounded-sm border border-primary bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
              SYNC
            </span>
            <span>синхронное открытие</span>
            <span className="rounded-sm border border-foreground/50 bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-foreground/75">
              CASC
            </span>
            <span>каскадная система</span>
          </div>
        </div>
      </main>
    </div>
  );
}
