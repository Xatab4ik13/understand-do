import { GLASSES } from "@/lib/configurator/glasses";
import { PROFILES } from "@/lib/configurator/profiles";
import type { PartitionType, OpeningOption } from "@/lib/configurator/types";
import alp01 from "@/assets/models/alp-01.png.asset.json";
import alp02 from "@/assets/models/alp-02.png.asset.json";
import alp03 from "@/assets/models/alp-03.png.asset.json";
import alp04 from "@/assets/models/alp-04.png.asset.json";
import alp05 from "@/assets/models/alp-05.png.asset.json";
import alp06 from "@/assets/models/alp-06.png.asset.json";
import alp07 from "@/assets/models/alp-07.png.asset.json";
import alp08 from "@/assets/models/alp-08.png.asset.json";
import alp09 from "@/assets/models/alp-09.png.asset.json";
import alp10 from "@/assets/models/alp-10.png.asset.json";

const MODEL_IMAGES: Record<string, string> = {
  m1: alp01.url,
  m2: alp02.url,
  m3: alp03.url,
  m4: alp04.url,
  m5: alp05.url,
  m6: alp06.url,
  m7: alp07.url,
  m8: alp08.url,
  m9: alp09.url,
  m10: alp10.url,
};

interface Props {
  type: PartitionType;
  openingHeight: number;
  openingWidth: number;
  sashWidth: number;
  sashHeight: number;
  glassId: string;
  profileId: string;
  modelId: string;
  openings: string[];
  handlePositions: number[][];
}

/** Тонировка стекла поверх фоновой фотографии (через прозрачность) */
function glassTint(glassId: string): { color: string; opacity: number } {
  const g = GLASSES.find((x) => x.id === glassId);
  const n = (g?.name ?? "").toLowerCase();
  if (n.includes("зеркало")) return { color: "#cdd6dc", opacity: 0.78 };
  if (n.includes("мору")) return { color: "#e8edec", opacity: 0.55 };
  if (n.includes("кафедрал")) return { color: "#e1e7ea", opacity: 0.45 };
  if (n.includes("вижн")) return { color: "#d8e2e6", opacity: 0.4 };
  if (n.includes("сатинат")) return { color: "#f0f3f4", opacity: 0.6 };
  if (n.includes("дихроник")) return { color: "#b9d7e8", opacity: 0.3 };
  if (n.includes("черное") || n.includes("чёрное"))
    return { color: "#0e1112", opacity: 0.78 };
  if (n.includes("графит")) return { color: "#2c3035", opacity: 0.5 };
  if (n.includes("бронза")) return { color: "#8a5a25", opacity: 0.35 };
  if (n.includes("осветленное") || n.includes("осветлённое"))
    return { color: "#dbe8ed", opacity: 0.18 };
  return { color: "#bcd5dd", opacity: 0.22 };
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
  return "#5b6168";
}

export function PartitionProjection({
  type,
  openingHeight,
  openingWidth,
  sashWidth,
  sashHeight,
  glassId,
  profileId,
  modelId,
  openings,
  handlePositions,
}: Props) {
  const PAD = 56;
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

  const tint = glassTint(glassId);
  const profile = profileColor(profileId);
  const photoUrl = MODEL_IMAGES[modelId];
  const sashCount = type.sashCount;
  const sashPxW = drawW / sashCount;
  const frameT = Math.max(4, Math.min(10, drawW * 0.012));

  const clipId = `proj-clip-${modelId}`;

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
          {/* Блик на стекле */}
          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          {/* Виньетка по краям фото — мягко уводит фон */}
          <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.7">
            <stop offset="60%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.35" />
          </radialGradient>
          {/* Тень от перегородки на полу */}
          <linearGradient id="floorShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.22" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>
          {/* Скруглённый клип для всей сцены — мягкие углы */}
          <clipPath id={clipId}>
            <rect x={x0} y={y0} width={drawW} height={drawH} rx={4} ry={4} />
          </clipPath>
        </defs>

        {/* ===== Фон-сцена: фото выбранной модели ===== */}
        <g clipPath={`url(#${clipId})`}>
          {photoUrl && (
            <image
              href={photoUrl}
              x={x0}
              y={y0}
              width={drawW}
              height={drawH}
              preserveAspectRatio="xMidYMid slice"
            />
          )}
          {/* Виньетка поверх фото */}
          <rect x={x0} y={y0} width={drawW} height={drawH} fill="url(#vignette)" />
        </g>

        {/* Тонкая рамка проёма */}
        <rect
          x={x0}
          y={y0}
          width={drawW}
          height={drawH}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          rx={4}
        />

        {/* Тень-пол */}
        <ellipse
          cx={x0 + drawW / 2}
          cy={y0 + drawH + 14}
          rx={drawW * 0.5}
          ry={7}
          fill="url(#floorShadow)"
        />

        {/* ===== Створки ===== */}
        {Array.from({ length: sashCount }).map((_, i) => {
          const sx = x0 + i * sashPxW;
          const sy = y0;
          const sash = type.sashes[i];
          const opening = openings[i] as OpeningOption | undefined;
          const positions = handlePositions[i] ?? [];

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
              {/* Тонировка стекла (полупрозрачная — фон просвечивает) */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={tint.color}
                opacity={tint.opacity}
              />
              {/* Блик */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill="url(#glassSheen)"
                pointerEvents="none"
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
                </g>
              ) : (
                <g opacity={0.85}>
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
                        opacity={0.95}
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
            </g>
          );
        })}

        {/* ===== Размерные линии ===== */}
        {/* Ширина (низ) */}
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

        {/* Высота (слева) */}
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

        {/* Подпись створки (верх) */}
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
