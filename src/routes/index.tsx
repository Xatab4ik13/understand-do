import { createFileRoute, Link } from "@tanstack/react-router";
import { PARTITION_TYPES } from "@/lib/configurator/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRub } from "@/lib/configurator/calculate";

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTITION_TYPES.map((t) => (
            <Link
              key={t.id}
              to="/configurator/$typeId"
              params={{ typeId: t.id }}
              className="group"
            >
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <p className="mt-3 text-sm">
                    Створок: <span className="font-medium text-foreground">{t.sashCount}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    База:{" "}
                    <span className="font-medium text-foreground">
                      {formatRub(t.basePrice)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
