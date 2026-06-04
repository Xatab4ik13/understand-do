import type { PartitionType } from "@/lib/configurator/types";

/**
 * Схема типа перегородки (вид сверху) — чистый чертёж без подписей.
 * Стены — плотная штриховка, стационары — диагональная штриховка стекла,
 * подвижные створки — прозрачное стекло со стрелкой направления.
 */
export function TypeScheme({ type }: { type: PartitionType }) {
  const W = 360;
  const H = 120;
  const wallW = 22;
  const trackY = 64;
  const sashH = 22;
  const gap = 3;

  const sashes = type.sashes;
  const innerW = W - wallW * 2;
  const sashW = (innerW - gap * (sashes.length - 1)) / sashes.length;

  const sashTop = trackY - sashH / 2;
  const sashBot = trackY + sashH / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Схема: ${type.name}`}
    >
      <defs>
        {/* Штриховка стен — плотная */}
        <pattern
          id="ts-wall"
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
            strokeOpacity="0.7"
            strokeWidth="1"
          />
        </pattern>
        {/* Штриховка стационара — лёгкая, другая ориентация */}
        <pattern
          id="ts-stationary"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="6" height="6" fill="hsl(var(--muted) / 0.5)" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>

      {/* Верхняя направляющая (рельс) */}
      <line
        x1={wallW}
        y1={sashTop - 8}
        x2={W - wallW}
        y2={sashTop - 8}
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      {/* Пол */}
      <line
        x1={wallW}
        y1={sashBot + 8}
        x2={W - wallW}
        y2={sashBot + 8}
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />

      {/* Стены */}
      <rect
        x={0}
        y={sashTop - 14}
        width={wallW}
        height={sashH + 28}
        fill="url(#ts-wall)"
        stroke="hsl(var(--foreground))"
        strokeWidth="1"
      />
      <rect
        x={W - wallW}
        y={sashTop - 14}
        width={wallW}
        height={sashH + 28}
        fill="url(#ts-wall)"
        stroke="hsl(var(--foreground))"
        strokeWidth="1"
      />

      {/* Створки */}
      {sashes.map((sash, i) => {
        const x = wallW + i * (sashW + gap);
        const isStationary = !sash.hasHandle;
        const cx = x + sashW / 2;

        return (
          <g key={i}>
            <rect
              x={x}
              y={sashTop}
              width={sashW}
              height={sashH}
              fill={isStationary ? "url(#ts-stationary)" : "hsl(var(--background))"}
              stroke="hsl(var(--foreground))"
              strokeWidth="1"
            />

            {!isStationary && (
              <Arrow
                cx={cx}
                cy={trackY}
                width={Math.min(sashW * 0.55, 44)}
                openings={sash.allowedOpenings as string[]}
              />
            )}
          </g>
        );
      })}
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
  const head = 4;
  const x1 = cx - half;
  const x2 = cx + half;

  return (
    <g
      stroke="hsl(var(--foreground))"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={x1} y1={cy} x2={x2} y2={cy} />
      {hasLeft && (
        <polyline
          points={`${x1 + head},${cy - head} ${x1},${cy} ${x1 + head},${cy + head}`}
        />
      )}
      {hasRight && (
        <polyline
          points={`${x2 - head},${cy - head} ${x2},${cy} ${x2 - head},${cy + head}`}
        />
      )}
    </g>
  );
}
