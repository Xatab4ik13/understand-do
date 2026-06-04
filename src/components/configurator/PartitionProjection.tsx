import { GLASSES } from "@/lib/configurator/glasses";
import { PROFILES } from "@/lib/configurator/profiles";
import type { PartitionType, OpeningOption } from "@/lib/configurator/types";

interface Props {
  type: PartitionType;
  openingHeight: number;
  openingWidth: number;
  sashWidth: number;
  sashHeight: number;
  glassId: string;
  profileId: string;
  openings: string[];
  handlePositions: number[][];
}

/** Подобрать визуальную заливку стекла по его названию */
function glassFill(glassId: string): {
  fill: string;
  opacity: number;
  pattern?: "satin" | "moru" | "mirror" | "kafedral";
} {
  const g = GLASSES.find((x) => x.id === glassId);
  const n = (g?.name ?? "").toLowerCase();
  if (n.includes("зеркало"))
    return { fill: "url(#mirrorGrad)", opacity: 1, pattern: "mirror" };
  if (n.includes("мору")) return { fill: "#cfd8d6", opacity: 0.85, pattern: "moru" };
  if (n.includes("кафедрал"))
    return { fill: "#d6dde0", opacity: 0.85, pattern: "kafedral" };
  if (n.includes("вижн")) return { fill: "#c9d4d8", opacity: 0.85, pattern: "kafedral" };
  if (n.includes("сатинат"))
    return { fill: "#eef1f2", opacity: 0.9, pattern: "satin" };
  if (n.includes("дихроник"))
    return { fill: "url(#dichroicGrad)", opacity: 0.85 };
  if (n.includes("черное") || n.includes("чёрное"))
    return { fill: "#0f1112", opacity: 0.85 };
  if (n.includes("графит")) return { fill: "#3a4046", opacity: 0.6 };
  if (n.includes("бронза")) return { fill: "#a06a2c", opacity: 0.45 };
  if (n.includes("осветленное") || n.includes("осветлённое"))
    return { fill: "#eaf3f6", opacity: 0.55 };
  return { fill: "#b7d4dc", opacity: 0.4 };
}

function profileColor(profileId: string): string {
  const p = PROFILES.find((x) => x.id === profileId);
  const n = `${p?.code ?? ""} ${p?.name ?? ""}`.toLowerCase();
  if (n.includes("чёрн") || n.includes("черн") || n.includes("graf") || n.includes("граф"))
    return "#1a1a1a";
  if (n.includes("бронз")) return "#6a4a25";
  if (n.includes("золот")) return "#b08a3e";
  if (n.includes("шамп")) return "#a89377";
  if (n.includes("бел")) return "#e8e8e8";
  return "#5b6168"; // matt серебристый/алюм
}

export function PartitionProjection({
  type,
  openingHeight,
  openingWidth,
  sashWidth,
  sashHeight,
  glassId,
  profileId,
  openings,
  handlePositions,
}: Props) {
  // Каркас рисования
  const PAD = 56; // отступ под подписи размеров
  const MAX_W = 720;
  const MAX_H = 360;
  const ratio = openingWidth > 0 && openingHeight > 0 ? openingWidth / openingHeight : 1.5;
  let drawW = MAX_W - PAD * 2;
  let drawH = drawW / ratio;
  if (drawH > MAX_H - PAD * 2) {
    drawH = MAX_H - PAD * 2;
    drawW = drawH * ratio;
  }
  const W = drawW + PAD * 2;
  const H = drawH + PAD * 2;
  const x0 = PAD;
  const y0 = PAD;

  const glass = glassFill(glassId);
  const profile = profileColor(profileId);
  const sashCount = type.sashCount;
  const sashPxW = drawW / sashCount;
  const frameT = Math.max(4, Math.min(10, drawW * 0.012));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-full"
        style={{ height: "auto" }}
        role="img"
        aria-label="Проекция перегородки"
      >
        <defs>
          <linearGradient id="mirrorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8eef2" />
            <stop offset="50%" stopColor="#c9d4dc" />
            <stop offset="100%" stopColor="#9aa8b2" />
          </linearGradient>
          <linearGradient id="dichroicGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb3d9" />
            <stop offset="33%" stopColor="#b3d9ff" />
            <stop offset="66%" stopColor="#b3ffd9" />
            <stop offset="100%" stopColor="#ffe0a3" />
          </linearGradient>
          <pattern id="satinPat" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#eef1f2" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#dde2e4" strokeWidth="1" />
          </pattern>
          <pattern id="moruPat" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#cfd8d6" />
            <circle cx="3" cy="4" r="1.6" fill="#b9c4c2" />
            <circle cx="10" cy="9" r="2" fill="#b9c4c2" />
            <circle cx="6" cy="11" r="1.2" fill="#b9c4c2" />
            <circle cx="12" cy="3" r="1" fill="#b9c4c2" />
          </pattern>
          <pattern id="kafedralPat" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#d6dde0" />
            <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="none" stroke="#bcc6ca" strokeWidth="0.8" />
          </pattern>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Тень-пол */}
        <ellipse
          cx={x0 + drawW / 2}
          cy={y0 + drawH + 14}
          rx={drawW * 0.48}
          ry={6}
          fill="black"
          opacity={0.08}
        />

        {/* Створки */}
        {Array.from({ length: sashCount }).map((_, i) => {
          const sx = x0 + i * sashPxW;
          const sy = y0;
          const sash = type.sashes[i];
          const opening = openings[i] as OpeningOption | undefined;
          const positions = handlePositions[i] ?? [];

          // Эффективная заливка
          let fillRef = glass.fill;
          if (glass.pattern === "satin") fillRef = "url(#satinPat)";
          if (glass.pattern === "moru") fillRef = "url(#moruPat)";
          if (glass.pattern === "kafedral") fillRef = "url(#kafedralPat)";

          // Координаты ручек: 2=верх-лево, 3=верх-право, 1=низ-лево, 4=низ-право
          const innerX = sx + frameT;
          const innerY = sy + frameT;
          const innerW = sashPxW - frameT * 2;
          const innerH = drawH - frameT * 2;
          const hOffX = Math.min(18, innerW * 0.12);
          const hOffY = Math.min(28, innerH * 0.18);
          const handleCoord = (pos: number) => {
            const left = pos === 1 || pos === 2;
            const top = pos === 2 || pos === 3;
            return {
              x: left ? innerX + hOffX : innerX + innerW - hOffX,
              y: top ? innerY + hOffY : innerY + innerH - hOffY,
            };
          };

          return (
            <g key={i}>
              {/* Стекло */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={fillRef}
                opacity={glass.opacity}
              />
              {/* Профиль (рамка створки) */}
              <rect
                x={sx + frameT / 2}
                y={sy + frameT / 2}
                width={sashPxW - frameT}
                height={drawH - frameT}
                fill="none"
                stroke={profile}
                strokeWidth={frameT}
              />

              {/* Индикатор открывания / стационара */}
              {opening === "Стационар" ? (
                <g opacity={0.55}>
                  <line
                    x1={innerX + 8}
                    y1={innerY + 8}
                    x2={innerX + innerW - 8}
                    y2={innerY + innerH - 8}
                    stroke={profile}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={innerX + innerW - 8}
                    y1={innerY + 8}
                    x2={innerX + 8}
                    y2={innerY + innerH - 8}
                    stroke={profile}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={sx + sashPxW / 2}
                    y={sy + drawH / 2 + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill="hsl(var(--muted-foreground))"
                    fontFamily="ui-sans-serif, system-ui"
                  >
                    стационар
                  </text>
                </g>
              ) : (
                <g opacity={0.7}>
                  {(() => {
                    const cy = sy + drawH - 18;
                    const cx = sx + sashPxW / 2;
                    const len = Math.min(sashPxW * 0.45, 60);
                    const isLeft = opening === "Левое";
                    const x1 = isLeft ? cx + len / 2 : cx - len / 2;
                    const x2 = isLeft ? cx - len / 2 : cx + len / 2;
                    const head = 5;
                    return (
                      <>
                        <line
                          x1={x1}
                          y1={cy}
                          x2={x2}
                          y2={cy}
                          stroke="hsl(var(--primary))"
                          strokeWidth={1.5}
                        />
                        <polyline
                          points={`${x2 + (isLeft ? head : -head)},${cy - head} ${x2},${cy} ${x2 + (isLeft ? head : -head)},${cy + head}`}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth={1.5}
                        />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Ручки */}
              {sash?.hasHandle &&
                positions.map((pos) => {
                  const { x, y } = handleCoord(pos);
                  return (
                    <g key={pos}>
                      <rect
                        x={x - 3}
                        y={y - 14}
                        width={6}
                        height={28}
                        rx={2}
                        fill={profile}
                        opacity={0.9}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={3}
                        fill="hsl(var(--background))"
                        stroke={profile}
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}

              {/* Номер створки */}
              <text
                x={sx + sashPxW / 2}
                y={sy + 14}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
                fontFamily="ui-sans-serif, system-ui"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Подпись ширины (низ) */}
        <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fill="hsl(var(--muted-foreground))">
          <line
            x1={x0}
            y1={y0 + drawH + 30}
            x2={x0 + drawW}
            y2={y0 + drawH + 30}
            stroke="currentColor"
            strokeWidth={0.8}
          />
          <line x1={x0} y1={y0 + drawH + 26} x2={x0} y2={y0 + drawH + 34} stroke="currentColor" />
          <line
            x1={x0 + drawW}
            y1={y0 + drawH + 26}
            x2={x0 + drawW}
            y2={y0 + drawH + 34}
            stroke="currentColor"
          />
          <text x={x0 + drawW / 2} y={y0 + drawH + 46} textAnchor="middle">
            {openingWidth} мм
          </text>
        </g>

        {/* Подпись высоты (слева) */}
        <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fill="hsl(var(--muted-foreground))">
          <line
            x1={x0 - 22}
            y1={y0}
            x2={x0 - 22}
            y2={y0 + drawH}
            stroke="currentColor"
            strokeWidth={0.8}
          />
          <line x1={x0 - 26} y1={y0} x2={x0 - 18} y2={y0} stroke="currentColor" />
          <line
            x1={x0 - 26}
            y1={y0 + drawH}
            x2={x0 - 18}
            y2={y0 + drawH}
            stroke="currentColor"
          />
          <text
            x={x0 - 30}
            y={y0 + drawH / 2}
            textAnchor="middle"
            transform={`rotate(-90 ${x0 - 30} ${y0 + drawH / 2})`}
          >
            {openingHeight} мм
          </text>
        </g>

        {/* Подпись створки */}
        <text
          x={x0 + drawW / 2}
          y={y0 - 16}
          textAnchor="middle"
          fontSize="11"
          fill="hsl(var(--muted-foreground))"
          fontFamily="ui-sans-serif, system-ui"
        >
          створка {Math.round(sashWidth)} × {Math.round(sashHeight)} мм
        </text>
      </svg>
    </div>
  );
}
