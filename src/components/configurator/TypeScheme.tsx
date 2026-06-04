import type { PartitionType } from "@/lib/configurator/types";

/**
 * Технический чертёж типа перегородки (вид сверху).
 * Стиль: blueprint / CAD — тонкие линии, монопространственные подписи,
 * размерные засечки, штриховка стен, маркировка створок.
 */
export function TypeScheme({ type }: { type: PartitionType }) {
  const W = 360;
  const H = 132;
  const wallW = 24;
  const trackY = 78;
  const sashH = 18;
  const gap = 2;

  const sashes = type.sashes;
  const innerW = W - wallW * 2;
  const sashW = (innerW - gap * (sashes.length - 1)) / sashes.length;
  const hasSync = sashes.some((s) => s.allowedSets.includes("set4"));
  const hasCascade = sashes.some((s) => s.allowedSets.includes("set5"));

  const sashTop = trackY - sashH / 2;
  const sashBot = trackY + sashH / 2;

  // Краткое обозначение направления открывания
  const dirLabel = (openings: string[]) => {
    const l = openings.includes("Левое");
    const r = openings.includes("Правое");
    if (l && r) return "Л/П";
    if (l) return "Л";
    if (r) return "П";
    return "";
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Схема: ${type.name}`}
    >
      <defs>
        {/* Штриховка стен */}
        <pattern
          id="wallHatch"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="5" height="5" fill="hsl(var(--muted))" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.55"
            strokeWidth="0.6"
          />
        </pattern>
        {/* Технический grid */}
        <pattern id="bpGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.06"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Подложка-чертёж */}
      <rect x={0} y={0} width={W} height={H} fill="url(#bpGrid)" />

      {/* Верхняя размерная линия (общий проём) */}
      <g
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.55"
        strokeWidth="0.6"
        fill="none"
      >
        <line x1={wallW} y1={20} x2={W - wallW} y2={20} />
        <line x1={wallW} y1={16} x2={wallW} y2={24} />
        <line x1={W - wallW} y1={16} x2={W - wallW} y2={24} />
      </g>
      <text
        x={W / 2}
        y={14}
        textAnchor="middle"
        fontSize="8"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fill="hsl(var(--muted-foreground))"
        letterSpacing="0.5"
      >
        ПРОЁМ
      </text>

      {/* Размерные засечки границ створок */}
      <g
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.4"
        strokeWidth="0.5"
      >
        {sashes.map((_, i) => {
          const x = wallW + i * (sashW + gap);
          return (
            <g key={`tick-${i}`}>
              <line x1={x} y1={28} x2={x} y2={34} />
              {i === sashes.length - 1 && (
                <line x1={x + sashW} y1={28} x2={x + sashW} y2={34} />
              )}
            </g>
          );
        })}
      </g>

      {/* Номера створок */}
      {sashes.map((_, i) => {
        const x = wallW + i * (sashW + gap) + sashW / 2;
        return (
          <text
            key={`num-${i}`}
            x={x}
            y={44}
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill="hsl(var(--muted-foreground))"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        );
      })}

      {/* Стены (по бокам) */}
      <rect
        x={0}
        y={sashTop - 8}
        width={wallW}
        height={sashH + 16}
        fill="url(#wallHatch)"
        stroke="hsl(var(--foreground))"
        strokeWidth="0.8"
      />
      <rect
        x={W - wallW}
        y={sashTop - 8}
        width={wallW}
        height={sashH + 16}
        fill="url(#wallHatch)"
        stroke="hsl(var(--foreground))"
        strokeWidth="0.8"
      />

      {/* Базовая линия пола (тонкая ось) */}
      <line
        x1={wallW}
        y1={sashBot + 4}
        x2={W - wallW}
        y2={sashBot + 4}
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.35"
        strokeWidth="0.5"
      />
      {/* Осевая (центр) */}
      <line
        x1={W / 2}
        y1={sashTop - 10}
        x2={W / 2}
        y2={sashBot + 10}
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.25"
        strokeWidth="0.4"
        strokeDasharray="2 3"
      />

      {/* Створки */}
      {sashes.map((sash, i) => {
        const x = wallW + i * (sashW + gap);
        const isStationary = !sash.hasHandle;
        const isCascade = sash.allowedSets.includes("set5");
        const cx = x + sashW / 2;

        return (
          <g key={i}>
            {/* Параллельная направляющая для каскада */}
            {isCascade && (
              <line
                x1={x + 1}
                y1={sashBot + 8}
                x2={x + sashW - 1}
                y2={sashBot + 8}
                stroke="hsl(var(--foreground))"
                strokeOpacity="0.5"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />
            )}

            <rect
              x={x}
              y={sashTop}
              width={sashW}
              height={sashH}
              fill={
                isStationary
                  ? "hsl(var(--muted))"
                  : "hsl(var(--foreground))"
              }
              stroke="hsl(var(--foreground))"
              strokeWidth="0.8"
            />

            {/* Содержимое створки */}
            {isStationary ? (
              <>
                {/* Диагонали — обозначение стационара */}
                <line
                  x1={x + 2}
                  y1={sashTop + 2}
                  x2={x + sashW - 2}
                  y2={sashBot - 2}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity="0.7"
                  strokeWidth="0.5"
                />
                <line
                  x1={x + sashW - 2}
                  y1={sashTop + 2}
                  x2={x + 2}
                  y2={sashBot - 2}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity="0.7"
                  strokeWidth="0.5"
                />
                {sashW > 36 && (
                  <text
                    x={cx}
                    y={trackY + 2}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                    fill="hsl(var(--muted-foreground))"
                    letterSpacing="0.5"
                  >
                    СТАЦ
                  </text>
                )}
              </>
            ) : (
              <>
                <Arrow
                  cx={cx}
                  cy={trackY}
                  width={Math.min(sashW * 0.6, 40)}
                  openings={sash.allowedOpenings as string[]}
                />
                {/* Подпись направления под створкой */}
                <text
                  x={cx}
                  y={sashBot + 14}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  fill="hsl(var(--foreground))"
                  fillOpacity="0.7"
                >
                  {dirLabel(sash.allowedOpenings as string[])}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Бейджи системы (SYNC / CASCADE) */}
      <g
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="7"
        fontWeight="600"
      >
        {hasSync && (
          <g transform={`translate(${W - 86}, ${H - 14})`}>
            <rect
              x={0}
              y={0}
              width={38}
              height={11}
              rx={2}
              fill="hsl(var(--primary) / 0.12)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            <text
              x={19}
              y={8}
              textAnchor="middle"
              fill="hsl(var(--primary))"
              letterSpacing="0.8"
            >
              SYNC
            </text>
          </g>
        )}
        {hasCascade && (
          <g transform={`translate(${W - 44}, ${H - 14})`}>
            <rect
              x={0}
              y={0}
              width={38}
              height={11}
              rx={2}
              fill="hsl(var(--foreground) / 0.08)"
              stroke="hsl(var(--foreground))"
              strokeOpacity="0.5"
              strokeWidth="0.5"
            />
            <text
              x={19}
              y={8}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fillOpacity="0.75"
              letterSpacing="0.8"
            >
              CASC
            </text>
          </g>
        )}
      </g>

      {/* Подпись количества створок (нижний левый угол) */}
      <text
        x={4}
        y={H - 5}
        fontSize="7"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fill="hsl(var(--muted-foreground))"
        letterSpacing="0.5"
      >
        N = {sashes.length}
      </text>
    </svg>
  );
}

function Arrow({
  cx,
  cy,
  width,
  openings,
}: {
  cx: number;
  cy: number;
  width: number;
  openings: string[];
}) {
  const hasLeft = openings.includes("Левое");
  const hasRight = openings.includes("Правое");
  const half = width / 2;
  const head = 3;
  const color = "hsl(var(--background))";
  const x1 = cx - half;
  const x2 = cx + half;

  return (
    <g stroke={color} strokeWidth="1" fill="none" strokeLinecap="round">
      <line x1={x1} y1={cy} x2={x2} y2={cy} />
      {hasLeft && (
        <polyline points={`${x1 + head},${cy - head} ${x1},${cy} ${x1 + head},${cy + head}`} />
      )}
      {hasRight && (
        <polyline points={`${x2 - head},${cy - head} ${x2},${cy} ${x2 - head},${cy + head}`} />
      )}
    </g>
  );
}
