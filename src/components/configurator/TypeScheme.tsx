import type { PartitionType, SashConfig } from "@/lib/configurator/types";

/**
 * Схема типа перегородки в виде сверху.
 * Слева и справа — стены (заштрихованные блоки).
 * Между ними — створки в один ряд:
 *   • стационар — светлая заливка, без стрелки
 *   • подвижная — тёмная заливка со стрелкой направления
 * Под каскадными створками (Сет 5) рисуется параллельная направляющая.
 * Над синхронными (Сет 4) — символ синхронизации.
 */
export function TypeScheme({ type }: { type: PartitionType }) {
  const W = 320;
  const H = 88;
  const wallW = 22;
  const trackY = 50;
  const sashH = 16;
  const gap = 2;

  const sashes = type.sashes;
  const innerW = W - wallW * 2;
  const sashW = (innerW - gap * (sashes.length - 1)) / sashes.length;

  const hasSync = sashes.some((s) => s.allowedSets.includes("set4"));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Схема: ${type.name}`}
    >
      <defs>
        <pattern
          id="wallHatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill="hsl(var(--muted))" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Левая стена */}
      <rect
        x={0}
        y={trackY - sashH - 6}
        width={wallW}
        height={sashH + 12}
        fill="url(#wallHatch)"
        stroke="hsl(var(--border))"
      />
      {/* Правая стена */}
      <rect
        x={W - wallW}
        y={trackY - sashH - 6}
        width={wallW}
        height={sashH + 12}
        fill="url(#wallHatch)"
        stroke="hsl(var(--border))"
      />

      {/* Направляющая (рельс) */}
      <line
        x1={wallW}
        y1={trackY + sashH / 2 + 5}
        x2={W - wallW}
        y2={trackY + sashH / 2 + 5}
        stroke="hsl(var(--border))"
        strokeWidth="1"
      />

      {/* Створки */}
      {sashes.map((sash, i) => {
        const x = wallW + i * (sashW + gap);
        const y = trackY - sashH / 2;
        const isStationary = !sash.hasHandle;
        const isCascade = sash.allowedSets.includes("set5");

        const fill = isStationary
          ? "hsl(var(--muted))"
          : "hsl(var(--foreground))";
        const stroke = "hsl(var(--foreground))";

        return (
          <g key={i}>
            {/* Каскадная параллельная направляющая */}
            {isCascade && (
              <line
                x1={x}
                y1={y + sashH + 8}
                x2={x + sashW}
                y2={y + sashH + 8}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            )}

            {/* Створка */}
            <rect
              x={x}
              y={y}
              width={sashW}
              height={sashH}
              fill={fill}
              stroke={stroke}
              strokeWidth="0.8"
              rx="1"
            />

            {isStationary ? (
              // Метка стационара — маленький квадрат по центру
              <rect
                x={x + sashW / 2 - 2}
                y={y + sashH / 2 - 2}
                width="4"
                height="4"
                fill="hsl(var(--background))"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.6"
              />
            ) : (
              // Стрелка направления открывания
              <Arrow
                cx={x + sashW / 2}
                cy={y + sashH / 2}
                width={Math.min(sashW * 0.55, 36)}
                openings={sash.allowedOpenings as string[]}
              />
            )}
          </g>
        );
      })}

      {/* Иконка синхронизации над парой створок */}
      {hasSync && (
        <g transform={`translate(${W / 2 - 18}, 6)`}>
          <rect
            x={0}
            y={0}
            width={36}
            height={14}
            rx={7}
            fill="hsl(var(--primary) / 0.12)"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
          />
          <text
            x={18}
            y={10}
            textAnchor="middle"
            fontSize="8"
            fontFamily="ui-sans-serif, system-ui"
            fill="hsl(var(--primary))"
            fontWeight="600"
            letterSpacing="0.5"
          >
            SYNC
          </text>
        </g>
      )}
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
  const head = 3.5;
  const color = "hsl(var(--background))";
  const x1 = cx - half;
  const x2 = cx + half;

  return (
    <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round">
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

// Подавить неиспользуемое предупреждение на SashConfig (если tree-shaking ругнётся)
export type _SashConfig = SashConfig;
