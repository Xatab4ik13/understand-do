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

/** Минимальная тонировка стекла (поверх фоновой фотографии) */
function glassTint(glassId: string): {
  color: string;
  opacity: number;
  /** базовая прозрачность даже у "прозрачного" стекла, чтобы был визуальный отклик */
  min?: number;
} {
  const g = GLASSES.find((x) => x.id === glassId);
  const n = (g?.name ?? "").toLowerCase();
  if (n.includes("зеркало")) return { color: "#cdd6dc", opacity: 0.82 };
  if (n.includes("мору")) return { color: "#e8edec", opacity: 0.62 };
  if (n.includes("кафедрал")) return { color: "#e1e7ea", opacity: 0.5 };
  if (n.includes("вижн")) return { color: "#d8e2e6", opacity: 0.45 };
  if (n.includes("сатинат")) return { color: "#f0f3f4", opacity: 0.68 };
  if (n.includes("дихроник")) return { color: "#b9d7e8", opacity: 0.32 };
  if (n.includes("черное") || n.includes("чёрное"))
    return { color: "#0e1112", opacity: 0.8 };
  if (n.includes("графит")) return { color: "#2c3035", opacity: 0.55 };
  if (n.includes("бронза")) return { color: "#8a5a25", opacity: 0.4 };
  if (n.includes("осветленное") || n.includes("осветлённое"))
    return { color: "#dbe8ed", opacity: 0.22 };
  return { color: "#bcd5dd", opacity: 0.18 };
}

interface ProfileLook {
  base: string;
  light: string;
  dark: string;
  /** для светлых профилей лучше тёмная подпись */
  isDark: boolean;
}

function profileLook(profileId: string): ProfileLook {
  const p = PROFILES.find((x) => x.id === profileId);
  const n = `${p?.code ?? ""} ${p?.name ?? ""}`.toLowerCase();
  if (n.includes("чёрн") || n.includes("черн") || n.includes("graf") || n.includes("граф"))
    return { base: "#1a1a1a", light: "#3a3a3a", dark: "#000000", isDark: true };
  if (n.includes("бронз"))
    return { base: "#5e3f1f", light: "#8a6638", dark: "#2e1d0c", isDark: true };
  if (n.includes("золот"))
    return { base: "#a8842e", light: "#d4ad55", dark: "#6e5414", isDark: true };
  if (n.includes("шамп"))
    return { base: "#9a8569", light: "#c4b39c", dark: "#5e4c37", isDark: true };
  if (n.includes("бел"))
    return { base: "#eaeaea", light: "#ffffff", dark: "#b8b8b8", isDark: false };
  // matt серебристый/алюм
  return { base: "#6b7178", light: "#9aa1a8", dark: "#3e4348", isDark: true };
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
  // ---- Каркас ----
  const PAD_L = 64;
  const PAD_R = 28;
  const PAD_T = 28;
  const PAD_B = 76;

  const MAX_W = 760;
  const MAX_H = 440;
  const ratio = openingWidth > 0 && openingHeight > 0 ? openingWidth / openingHeight : 1.5;
  let drawW = MAX_W - PAD_L - PAD_R;
  let drawH = drawW / ratio;
  if (drawH > MAX_H - PAD_T - PAD_B) {
    drawH = MAX_H - PAD_T - PAD_B;
    drawW = drawH * ratio;
  }
  const W = drawW + PAD_L + PAD_R;
  const H = drawH + PAD_T + PAD_B;
  const x0 = PAD_L;
  const y0 = PAD_T;

  const tint = glassTint(glassId);
  const prof = profileLook(profileId);
  const photoUrl = MODEL_IMAGES[modelId];
  const sashCount = type.sashCount;
  const sashPxW = drawW / sashCount;
  // Толщина рамы профиля — пропорциональна, но не меньше 6 / не больше 12
  const frameT = Math.max(6, Math.min(12, drawW * 0.014));

  const uid = `proj-${modelId}-${profileId}-${glassId}`;

  // Helper: профиль как многослойная "металлическая" рамка
  const drawProfileFrame = (sx: number, sy: number, w: number, h: number, key: string) => {
    const t = frameT;
    // 1) тёмная подложка (внешняя кромка)
    // 2) основной цвет
    // 3) светлая внутренняя кромка (фаска)
    return (
      <g key={key}>
        <rect
          x={sx + 0.5}
          y={sy + 0.5}
          width={w - 1}
          height={h - 1}
          fill="none"
          stroke={prof.dark}
          strokeWidth={t + 1}
        />
        <rect
          x={sx + 0.5}
          y={sy + 0.5}
          width={w - 1}
          height={h - 1}
          fill="none"
          stroke={`url(#${uid}-profGrad)`}
          strokeWidth={t}
        />
        <rect
          x={sx + t - 0.5}
          y={sy + t - 0.5}
          width={w - (t - 0.5) * 2}
          height={h - (t - 0.5) * 2}
          fill="none"
          stroke={prof.light}
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      </g>
    );
  };

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
          {/* Градиент металла на профиле (вертикальный — сверху светлее) */}
          <linearGradient id={`${uid}-profGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={prof.light} />
            <stop offset="45%" stopColor={prof.base} />
            <stop offset="100%" stopColor={prof.dark} />
          </linearGradient>
          {/* Лёгкий вертикальный sheen стекла */}
          <linearGradient id={`${uid}-glassSheen`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.28" />
            <stop offset="40%" stopColor="white" stopOpacity="0" />
            <stop offset="85%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
          {/* Диагональный блик */}
          <linearGradient id={`${uid}-diagSheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="35%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Свет сверху (мягкая засветка фотофона) */}
          <linearGradient id={`${uid}-topLight`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Тень от перегородки */}
          <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0" r="0.6">
            <stop offset="0%" stopColor="black" stopOpacity="0.45" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          {/* Скруглённый клип фотофона */}
          <clipPath id={`${uid}-clip`}>
            <rect x={x0} y={y0} width={drawW} height={drawH} rx={3} ry={3} />
          </clipPath>
        </defs>

        {/* ===== Фон-сцена: фото модели + мягкий верхний свет ===== */}
        <g clipPath={`url(#${uid}-clip)`}>
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
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            fill={`url(#${uid}-topLight)`}
          />
        </g>

        {/* ===== Верхняя направляющая (рельс) — тонкая линия над рамой ===== */}
        <line
          x1={x0 - 4}
          y1={y0 - 6}
          x2={x0 + drawW + 4}
          y2={y0 - 6}
          stroke={prof.base}
          strokeOpacity={0.4}
          strokeWidth={1.5}
          strokeLinecap="round"
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
          // Отступы ручки от рамы (внутри стекла).
          // По вертикали — отступ побольше, чтобы ручка читалась как
          // фурнитура, а не как уголок профиля. По горизонтали — ближе к
          // кромке створки (там, где ручка реально стоит).
          const hOffX = Math.max(14, Math.min(26, innerW * 0.09));
          const hOffY = Math.max(40, Math.min(70, innerH * 0.22));
          const handleCoord = (pos: number) => {
            // 2 = верх-лево, 3 = верх-право, 1 = низ-лево, 4 = низ-право
            const left = pos === 1 || pos === 2;
            const top = pos === 2 || pos === 3;
            return {
              x: left ? innerX + hOffX : innerX + innerW - hOffX,
              y: top ? innerY + hOffY : innerY + innerH - hOffY,
              left,
            };
          };

          return (
            <g key={i}>
              {/* Тонировка стекла */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={tint.color}
                opacity={tint.opacity}
              />
              {/* Вертикальный sheen */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={`url(#${uid}-glassSheen)`}
                pointerEvents="none"
              />
              {/* Диагональный блик */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={`url(#${uid}-diagSheen)`}
                pointerEvents="none"
              />

              {/* Профильная рамка */}
              {drawProfileFrame(sx, sy, sashPxW, drawH, `frame-${i}`)}

              {/* Индикатор открывания / стационара */}
              {opening === "Стационар" ? (
                <g opacity={0.45}>
                  <line
                    x1={innerX + 10}
                    y1={innerY + 10}
                    x2={innerX + innerW - 10}
                    y2={innerY + innerH - 10}
                    stroke={prof.dark}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                  <line
                    x1={innerX + innerW - 10}
                    y1={innerY + 10}
                    x2={innerX + 10}
                    y2={innerY + innerH - 10}
                    stroke={prof.dark}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                </g>
              ) : (
                <g>
                  {(() => {
                    const cy = sy + drawH - 22;
                    const cx = sx + sashPxW / 2;
                    const len = Math.min(sashPxW * 0.6, 80);
                    const isLeft = opening === "Левое";
                    const xL = cx - len / 2;
                    const xR = cx + len / 2;
                    const xArrowEnd = isLeft ? xL : xR;
                    const head = 6;
                    return (
                      <>
                        {/* Трек направляющей (пунктир) */}
                        <line
                          x1={xL}
                          y1={cy}
                          x2={xR}
                          y2={cy}
                          stroke="hsl(var(--primary))"
                          strokeOpacity={0.35}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                        {/* Стрелка */}
                        <line
                          x1={isLeft ? xR : xL}
                          y1={cy}
                          x2={xArrowEnd}
                          y2={cy}
                          stroke="hsl(var(--primary))"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                        />
                        <polyline
                          points={`${xArrowEnd + (isLeft ? head : -head)},${cy - head} ${xArrowEnd},${cy} ${xArrowEnd + (isLeft ? head : -head)},${cy + head}`}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Ручки: розетка + горизонтальный рычаг внутрь створки */}
              {sash?.hasHandle &&
                positions.map((pos) => {
                  const { x, y, left } = handleCoord(pos);
                  // рычаг направлен ОТ ближайшей вертикальной кромки внутрь
                  const leverLen = Math.max(22, Math.min(34, innerW * 0.16));
                  const dir = left ? 1 : -1;
                  const leverX1 = x;
                  const leverX2 = x + dir * leverLen;
                  const leverY = y;
                  return (
                    <g key={pos}>
                      {/* Тень под фурнитурой */}
                      <ellipse
                        cx={x + dir * leverLen * 0.45}
                        cy={leverY + 2}
                        rx={leverLen * 0.55}
                        ry={2}
                        fill="black"
                        opacity={0.18}
                      />
                      {/* Рычаг */}
                      <line
                        x1={leverX1}
                        y1={leverY}
                        x2={leverX2}
                        y2={leverY}
                        stroke={`url(#${uid}-profGrad)`}
                        strokeWidth={3.2}
                        strokeLinecap="round"
                      />
                      {/* Тёмный контур рычага */}
                      <line
                        x1={leverX1}
                        y1={leverY}
                        x2={leverX2}
                        y2={leverY}
                        stroke={prof.dark}
                        strokeOpacity={0.55}
                        strokeWidth={0.8}
                        strokeLinecap="round"
                      />
                      {/* Блик на рычаге */}
                      <line
                        x1={leverX1 + dir * 3}
                        y1={leverY - 0.9}
                        x2={leverX2 - dir * 3}
                        y2={leverY - 0.9}
                        stroke={prof.light}
                        strokeOpacity={0.75}
                        strokeWidth={0.6}
                        strokeLinecap="round"
                      />
                      {/* Розетка (накладка на стекло) */}
                      <circle
                        cx={x}
                        cy={y}
                        r={4.2}
                        fill={`url(#${uid}-profGrad)`}
                        stroke={prof.dark}
                        strokeWidth={0.8}
                      />
                      <circle
                        cx={x - 0.8}
                        cy={y - 0.8}
                        r={1.2}
                        fill={prof.light}
                        opacity={0.7}
                      />
                    </g>
                  );
                })}
            </g>
          );
        })}

        {/* ===== Тень под перегородкой (узкая, реалистичная) ===== */}
        <rect
          x={x0 - 8}
          y={y0 + drawH + 1}
          width={drawW + 16}
          height={18}
          fill={`url(#${uid}-shadow)`}
          opacity={0.7}
        />

        {/* ===== Линия пола ===== */}
        <line
          x1={x0 - 20}
          y1={y0 + drawH + 1}
          x2={x0 + drawW + 20}
          y2={y0 + drawH + 1}
          stroke="hsl(var(--foreground))"
          strokeOpacity={0.25}
          strokeWidth={0.8}
        />

        {/* ===== РАЗМЕРНЫЕ ЛИНИИ ===== */}
        {(() => {
          const dimStroke = "hsl(var(--muted-foreground))";
          const dimFill = "hsl(var(--muted-foreground))";
          const tickW = 0.8;
          const lineW = 0.5;
          return (
            <g fontFamily="ui-sans-serif, system-ui" fontSize="11">
              {/* Высота (слева) */}
              {/* Выносные линии от рамы */}
              <line
                x1={x0 - 4}
                y1={y0}
                x2={x0 - 38}
                y2={y0}
                stroke={dimStroke}
                strokeWidth={lineW}
              />
              <line
                x1={x0 - 4}
                y1={y0 + drawH}
                x2={x0 - 38}
                y2={y0 + drawH}
                stroke={dimStroke}
                strokeWidth={lineW}
              />
              {/* Размерная линия */}
              <line
                x1={x0 - 30}
                y1={y0}
                x2={x0 - 30}
                y2={y0 + drawH}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              {/* Засечки */}
              <line
                x1={x0 - 34}
                y1={y0 - 4}
                x2={x0 - 26}
                y2={y0 + 4}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              <line
                x1={x0 - 34}
                y1={y0 + drawH - 4}
                x2={x0 - 26}
                y2={y0 + drawH + 4}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              <text
                x={x0 - 42}
                y={y0 + drawH / 2}
                textAnchor="middle"
                fontWeight={500}
                fill={dimFill}
                transform={`rotate(-90 ${x0 - 42} ${y0 + drawH / 2})`}
              >
                {openingHeight}
              </text>

              {/* Ширина (низ) */}
              <line
                x1={x0}
                y1={y0 + drawH + 26}
                x2={x0}
                y2={y0 + drawH + 46}
                stroke={dimStroke}
                strokeWidth={lineW}
              />
              <line
                x1={x0 + drawW}
                y1={y0 + drawH + 26}
                x2={x0 + drawW}
                y2={y0 + drawH + 46}
                stroke={dimStroke}
                strokeWidth={lineW}
              />
              <line
                x1={x0}
                y1={y0 + drawH + 36}
                x2={x0 + drawW}
                y2={y0 + drawH + 36}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              <line
                x1={x0 - 4}
                y1={y0 + drawH + 32}
                x2={x0 + 4}
                y2={y0 + drawH + 40}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              <line
                x1={x0 + drawW - 4}
                y1={y0 + drawH + 32}
                x2={x0 + drawW + 4}
                y2={y0 + drawH + 40}
                stroke={dimStroke}
                strokeWidth={tickW}
              />
              <text
                x={x0 + drawW / 2}
                y={y0 + drawH + 56}
                textAnchor="middle"
                fontWeight={500}
                fill={dimFill}
              >
                {openingWidth} × {openingHeight} мм
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
