import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPartitionType, type PartitionType } from "@/lib/configurator/types";
import { GLASSES } from "@/lib/configurator/glasses";
import { PROFILES } from "@/lib/configurator/profiles";
import { PARTITION_MODELS } from "@/lib/configurator/models";
import { HANDLE_COUNT_PRICES, SETS } from "@/lib/configurator/sets";
import { calculate, formatMm, formatPrice, formatRub, type Selections } from "@/lib/configurator/calculate";
import { useDealerMode, useInvalidateDealerMode } from "@/hooks/useDealerMode";
import { dealerLogout } from "@/lib/api/dealer.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PartitionProjection } from "@/components/configurator/PartitionProjection";
import { exportOrderToPdf } from "@/lib/configurator/exportPdf";
import logoAsset from "@/assets/logo-icon.png.asset.json";
import { TYPE_SCHEMES } from "@/lib/configurator/typeImages";

const logoUrl = logoAsset.url;

export const Route = createFileRoute("/configurator/$typeId")({
  head: ({ params }) => ({
    meta: [{ title: `Brand Alum — ${params.typeId}` }],
  }),
  component: ConfiguratorPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">Тип перегородки не найден</div>
  ),
  loader: ({ params }) => {
    if (!getPartitionType(params.typeId)) throw notFound();
    return { typeId: params.typeId };
  },
});

/** Вычислить макс. допустимую высоту проёма с учётом ограничения стекла */
function maxOpeningHeight(type: PartitionType, glassId: string): number | undefined {
  const glass = GLASSES.find((g) => g.id === glassId);
  if (!glass?.maxHeight) return undefined;
  // sashHeight = openingHeight + offset → openingHeight = maxHeight − offset
  return glass.maxHeight - type.sashHeightOffset;
}

/** Допустимые системы с учётом текущей ширины створки */
function allowedSetsFor(
  allowed: string[],
  sashWidth: number,
): string[] {
  return allowed.filter((id) => {
    const set = SETS[id];
    if (!set) return false;
    if (set.minSashWidth && sashWidth > 0 && sashWidth < set.minSashWidth) return false;
    return true;
  });
}

function ConfiguratorPage() {
  const { typeId } = Route.useLoaderData() as { typeId: string };
  const type = getPartitionType(typeId)!;
  const isDealer = useDealerMode();
  const invalidateDealer = useInvalidateDealerMode();

  const [s, setS] = useState<Selections>(() => ({
    openingHeight: 0,
    openingWidth: 0,
    glassId: GLASSES[4].id,
    profileId: PROFILES[0].id,
    modelId: PARTITION_MODELS[0].id,
    setIds: type.sashes.map((sash) => sash.allowedSets[0]),
    openings: type.sashes.map((sash) => sash.allowedOpenings[0]),
    handleCount: Math.min(type.sashCount, type.maxHandleCount) || 1,
    handlePositions: type.sashes.map(() => []),
  }));

  const result = useMemo(() => calculate(type, s), [type, s]);
  const sashWidth = result.sashWidth;

  // Авто-clamp высоты проёма при смене стекла
  useEffect(() => {
    const maxH = maxOpeningHeight(type, s.glassId);
    if (maxH && s.openingHeight > maxH) {
      setS((prev) => ({ ...prev, openingHeight: Math.floor(maxH) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.glassId]);

  // Авто-переключение системы, если текущая стала недопустимой
  useEffect(() => {
    setS((prev) => {
      let changed = false;
      const newSetIds = prev.setIds.map((id, idx) => {
        const allowed = allowedSetsFor(type.sashes[idx].allowedSets, sashWidth);
        if (allowed.length === 0) return id;
        if (!allowed.includes(id)) {
          changed = true;
          return allowed[0];
        }
        return id;
      });
      return changed ? { ...prev, setIds: newSetIds } : prev;
    });
  }, [sashWidth, type]);

  const updateSet = (idx: number, value: string) => {
    setS((prev) => ({
      ...prev,
      setIds: prev.setIds.map((v, i) => (i === idx ? value : v)),
    }));
  };
  const updateOpening = (idx: number, value: string) => {
    setS((prev) => ({
      ...prev,
      openings: prev.openings.map((v, i) => (i === idx ? value : v)),
    }));
  };
  const togglePosition = (sashIdx: number, pos: number) => {
    setS((prev) => {
      const current = prev.handlePositions[sashIdx] ?? [];
      const next = current.includes(pos)
        ? current.filter((p) => p !== pos)
        : [...current, pos].sort();
      return {
        ...prev,
        handlePositions: prev.handlePositions.map((arr, i) =>
          i === sashIdx ? next : arr,
        ),
      };
    });
  };

  const handleCountOptions = Array.from(
    { length: type.maxHandleCount },
    (_, i) => i + 1,
  );

  const maxH = maxOpeningHeight(type, s.glassId);

  const summaryLines = useMemo(
    () => buildSummaryLines(type.name, s, result),
    [type, s, result],
  );

  const projectionWrapRef = useRef<HTMLDivElement | null>(null);

  const onDownloadPdf = async () => {
    const svg = projectionWrapRef.current?.querySelector("svg") as
      | SVGSVGElement
      | null;
    if (!svg) {
      toast.error("Не удалось получить проекцию");
      return;
    }
    try {
      await exportOrderToPdf({
        fileName: `${type.id}-заказ.pdf`,
        projectionSvg: svg,
        title: type.name,
        lines: summaryLines,
      });
      toast.success("PDF сохранён");
    } catch (e) {
      console.error(e);
      toast.error("Не удалось сформировать PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors />
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <img
            src={logoUrl}
            alt="Логотип Brand Alum"
            className="h-16 w-auto md:h-20"
          />
          <div className="min-w-0 flex-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> К выбору типа
            </Link>
            <h1 className="mt-1 truncate text-xl font-semibold">{type.name}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Перегородка</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Высота проёма (мм)"
                hint={
                  maxH
                    ? `Мин. 1000 мм. Макс. для выбранного стекла: ${maxH} мм`
                    : "Мин. 1000 мм"
                }
              >
                <Input
                  type="number"
                  min={1000}
                  max={maxH}
                  value={s.openingHeight || ""}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 0;
                    const clamped = maxH ? Math.min(v, maxH) : v;
                    setS({ ...s, openingHeight: clamped });
                  }}
                />
              </Field>
              <Field label="Ширина проёма (мм)" hint="Мин. 500 мм">
                <Input
                  type="number"
                  min={500}
                  value={s.openingWidth || ""}
                  onChange={(e) =>
                    setS({ ...s, openingWidth: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <ReadOnly
                label="Высота створки"
                value={`${formatMm(result.sashHeight)} мм`}
              />
              <ReadOnly
                label="Ширина створки"
                value={`${formatMm(result.sashWidth)} мм`}
              />
              <ReadOnly
                label={`Кв.м (×${type.sashCount} створ.)`}
                value={`${result.totalSqm.toFixed(3)} м²`}
              />

              <Field label="Выбор стекла">
                <Select
                  value={s.glassId}
                  onValueChange={(v) => setS({ ...s, glassId: v })}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {GLASSES.find((g) => g.id === s.glassId)?.name ?? "—"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {GLASSES.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} — {formatRub(g.pricePerSqm)}/м²
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Цвет профиля">
                <Select
                  value={s.profileId}
                  onValueChange={(v) => setS({ ...s, profileId: v })}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {(() => {
                        const p = PROFILES.find((p) => p.id === s.profileId);
                        return p ? `${p.code} — ${p.name}` : "—";
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} — {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Комплектация</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Модель перегородки">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {PARTITION_MODELS.map((m) => {
                    const selected = s.modelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setS({ ...s, modelId: m.id })}
                        className={`group flex flex-col overflow-hidden rounded-md border bg-background text-left transition-all hover:border-primary ${
                          selected
                            ? "border-primary ring-2 ring-primary"
                            : "border-border"
                        }`}
                      >
                        <div className="aspect-square overflow-hidden bg-muted/30">
                          <img
                            src={m.image}
                            alt={m.code}
                            loading="lazy"
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                        <div className="border-t px-2 py-1.5">
                          <div className="text-xs font-medium leading-tight">
                            {m.code}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {m.price > 0 ? `+${formatRub(m.price)}` : "базовая"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Количество ручек">
                <Select
                  value={String(s.handleCount)}
                  onValueChange={(v) => setS({ ...s, handleCount: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {s.handleCount}{" "}
                      {s.handleCount === 1
                        ? "ручка"
                        : s.handleCount < 5
                          ? "ручки"
                          : "ручек"}{" "}
                      — {formatRub(HANDLE_COUNT_PRICES[s.handleCount] ?? 0)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {handleCountOptions.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "ручка" : n < 5 ? "ручки" : "ручек"} —{" "}
                        {formatRub(HANDLE_COUNT_PRICES[n] ?? 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Проекция</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={projectionWrapRef} className="w-full">
                <PartitionProjection
                  type={type}
                  openingHeight={s.openingHeight}
                  openingWidth={s.openingWidth}
                  sashWidth={result.sashWidth}
                  sashHeight={result.sashHeight}
                  glassId={s.glassId}
                  profileId={s.profileId}
                  modelId={s.modelId}
                  openings={s.openings}
                  handlePositions={s.handlePositions}
                />
              </div>
              {TYPE_SCHEMES[type.id] && (
                <div className="mt-4 border rounded-md bg-background p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    Схема типа
                  </div>
                  <img
                    src={TYPE_SCHEMES[type.id]}
                    alt={`Схема ${type.name}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Створки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {type.sashes.map((sash, idx) => {
                const allowedSets = allowedSetsFor(sash.allowedSets, sashWidth);
                const displaySets =
                  allowedSets.length > 0 ? allowedSets : sash.allowedSets;
                return (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-md border p-3 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2 text-sm font-medium">
                      Створка {idx + 1}{" "}
                      {!sash.hasHandle && (
                        <span className="text-muted-foreground">(без ручки)</span>
                      )}
                    </div>
                    <Field label="Система">
                      <Select
                        value={s.setIds[idx]}
                        onValueChange={(v) => updateSet(idx, v)}
                        disabled={displaySets.length === 1}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {(() => {
                              const set = SETS[s.setIds[idx]];
                              return set ? `${set.name} — ${formatRub(set.price)}` : "—";
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {displaySets.map((setId) => {
                            const set = SETS[setId];
                            return (
                              <SelectItem key={setId} value={setId}>
                                {set.name} — {formatRub(set.price)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Открывание">
                      <Select
                        value={s.openings[idx]}
                        onValueChange={(v) => updateOpening(idx, v)}
                        disabled={sash.allowedOpenings.length === 1}
                      >
                        <SelectTrigger>
                          <SelectValue>{s.openings[idx]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {sash.allowedOpenings.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    {sash.hasHandle && (
                      <div className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          Расположение ручек
                        </Label>
                        <HandlePositionPicker
                          selected={s.handlePositions[idx] ?? []}
                          onToggle={(p) => togglePosition(idx, p)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Расчёт</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Базовая цена" value={formatRub(type.basePrice)} />
              <Row
                label={`Стекло × ${result.totalSqm.toFixed(2)} м²`}
                value={formatRub(result.glassPrice * result.totalSqm)}
              />
              <Row
                label={`Модель × ${type.sashCount}`}
                value={formatRub(result.modelsPrice)}
              />
              <Row label="Системы" value={formatRub(result.setsPrice)} />
              <Row label="Ручки" value={formatRub(result.handlesPrice)} />
              <div className="my-2 border-t" />
              <Row label="Цена" value={formatRub(result.totalPrice)} bold />
              {result.isNonStandard && (
                <Row
                  label="Наценка нестандарт +30%"
                  value={formatRub(result.nonStandardMarkup)}
                />
              )}
              <Row
                label="Цена общая"
                value={formatRub(result.totalWithMarkup)}
                bold
              />
              <div className="my-2 border-t" />
              <Row
                label="Цена РРЦ (+70%)"
                value={formatRub(result.rrcPrice)}
                accent
              />

              {result.warnings.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200"
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.errors.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.errors.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive"
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={onDownloadPdf} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Скачать PDF
          </Button>
        </aside>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        accent ? "text-base text-primary font-semibold" : bold ? "font-medium" : ""
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}

/** Сетка позиций ручек:  2  3
 *                         1  4
 */
function HandlePositionPicker({
  selected,
  onToggle,
}: {
  selected: number[];
  onToggle: (pos: number) => void;
}) {
  // Сетка 2 рядов × 2 колонок. Верх: 2,3. Низ: 1,4.
  const grid = [
    [2, 3],
    [1, 4],
  ];
  return (
    <div className="mt-1 inline-grid grid-cols-2 gap-1.5 rounded-md border p-2">
      {grid.flat().map((pos) => {
        const isSelected = selected.includes(pos);
        return (
          <button
            type="button"
            key={pos}
            onClick={() => onToggle(pos)}
            className={`h-9 w-9 rounded text-sm font-medium transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
            aria-pressed={isSelected}
            title={`Позиция ${pos}`}
          >
            {pos}
          </button>
        );
      })}
    </div>
  );
}

function buildSummaryLines(
  typeName: string,
  s: Selections,
  r: ReturnType<typeof calculate>,
): string[] {
  const glass = GLASSES.find((g) => g.id === s.glassId)?.name ?? "—";
  const profile = PROFILES.find((p) => p.id === s.profileId);
  const model = PARTITION_MODELS.find((m) => m.id === s.modelId)?.code ?? "—";
  const lines = [
    `Тип: ${typeName}`,
    `Высота проёма: ${s.openingHeight} мм`,
    `Ширина проёма: ${s.openingWidth} мм`,
    `Высота створки: ${formatMm(r.sashHeight)} мм`,
    `Ширина створки: ${formatMm(r.sashWidth)} мм`,
    `Площадь: ${r.totalSqm.toFixed(3)} м²`,
    `Стекло: ${glass}`,
    `Профиль: ${profile?.code} (${profile?.name})`,
    `Модель перегородки: ${model}`,
    `Кол-во ручек: ${s.handleCount}`,
    ``,
    `Створки:`,
    ...s.setIds.map((id, i) => {
      const positions = s.handlePositions[i] ?? [];
      const posStr =
        positions.length > 0 ? ` — ручки в позициях: ${positions.join(", ")}` : "";
      return `  ${i + 1}. ${SETS[id]?.name ?? id} — открывание: ${s.openings[i]}${posStr}`;
    }),
    ``,
    `Цена: ${formatRub(r.rrcPrice)}`,
  ];
  return lines.filter((l) => l !== null && l !== undefined) as string[];
}
