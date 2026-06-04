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
  return "#5b6168";
}

/** Затемнить hex-цвет на коэффициент 0..1 (1 = чёрный) */
function shade(hex: string, k: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 - k))));
  const to = (v: number) => f(v).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
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
  // ---- Каркас ----
  // Большие отступы под размерные линии + место для receding-плоскостей сверху/справа
  const PAD_L = 72;
  const PAD_R = 72;
  const PAD_T = 60;
  const PAD_B = 72;

  const MAX_W = 780;
  const MAX_H = 420;

  // Глубина проекции (cabinet projection, угол 30°, depth 28px)
  const depth = 28;
  const angle = (30 * Math.PI) / 180;
  const dx = depth * Math.cos(angle); // ≈ 24.2 — вправо
  const dy = -depth * Math.sin(angle); // ≈ -14 — вверх

  const ratio = openingWidth > 0 && openingHeight > 0 ? openingWidth / openingHeight : 1.5;
  // Доступная зона для фронтальной грани (исключая receding)
  const availW = MAX_W - PAD_L - PAD_R - dx;
  const availH = MAX_H - PAD_T - PAD_B + dy; // dy отрицательный, поэтому "+dy"

  let drawW = availW;
  let drawH = drawW / ratio;
  if (drawH > availH) {
    drawH = availH;
    drawW = drawH * ratio;
  }

  const W = MAX_W;
  const H = MAX_H;
  const x0 = PAD_L;
  const y0 = PAD_T - dy; // опускаем фронт-грань, чтобы receding-плоскость уместилась сверху

  const glass = glassFill(glassId);
  const profile = profileColor(profileId);
  const profileTop = shade(profile, 0.18); // верх — чуть темнее (свет сверху-слева)
  const profileSide = shade(profile, 0.32); // правая грань — ещё темнее

  const sashCount = type.sashCount;
  const sashPxW = drawW / sashCount;
  const frameT = Math.max(4, Math.min(10, drawW * 0.012));

  // ---- Helpers для размерных линий ----
  const dimColor = "hsl(var(--muted-foreground))";

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-full"
        style={{ height: "auto" }}
        role="img"
        aria-label="Изометрическая проекция перегородки"
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
          {/* Блик на стекле (диагональный) */}
          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="45%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </linearGradient>
          {/* Тень от перегородки на полу */}
          <linearGradient id="floorShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.18" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ===== Тень-пол (параллелограмм, уходит назад) ===== */}
        <polygon
          points={[
            `${x0},${y0 + drawH}`,
            `${x0 + drawW},${y0 + drawH}`,
            `${x0 + drawW + dx},${y0 + drawH + dy}`,
            `${x0 + dx},${y0 + drawH + dy}`,
          ].join(" ")}
          fill="url(#floorShadow)"
          opacity={0.55}
        />

        {/* ===== Створки ===== */}
        {Array.from({ length: sashCount }).map((_, i) => {
          const sx = x0 + i * sashPxW;
          const sy = y0;
          const sash = type.sashes[i];
          const opening = openings[i] as OpeningOption | undefined;
          const positions = handlePositions[i] ?? [];
          const isLast = i === sashCount - 1;

          let fillRef = glass.fill;
          if (glass.pattern === "satin") fillRef = "url(#satinPat)";
          if (glass.pattern === "moru") fillRef = "url(#moruPat)";
          if (glass.pattern === "kafedral") fillRef = "url(#kafedralPat)";

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
              {/* Верхняя receding-грань (торец рамы сверху) */}
              <polygon
                points={[
                  `${sx},${sy}`,
                  `${sx + sashPxW},${sy}`,
                  `${sx + sashPxW + dx},${sy + dy}`,
                  `${sx + dx},${sy + dy}`,
                ].join(" ")}
                fill={profileTop}
                stroke={shade(profile, 0.4)}
                strokeWidth={0.6}
              />

              {/* Правая receding-грань только у последней створки */}
              {isLast && (
                <polygon
                  points={[
                    `${sx + sashPxW},${sy}`,
                    `${sx + sashPxW + dx},${sy + dy}`,
                    `${sx + sashPxW + dx},${sy + drawH + dy}`,
                    `${sx + sashPxW},${sy + drawH}`,
                  ].join(" ")}
                  fill={profileSide}
                  stroke={shade(profile, 0.5)}
                  strokeWidth={0.6}
                />
              )}

              {/* Стекло (фронт) */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill={fillRef}
                opacity={glass.opacity}
              />
              {/* Блик на стекле */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                fill="url(#glassSheen)"
                pointerEvents="none"
              />

              {/* Профиль (рамка створки, фронт) */}
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
                <g opacity={0.5}>
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
            </g>
          );
        })}

        {/* ===== РАЗМЕРНЫЕ ЛИНИИ ===== */}
        {/* Общая ширина проёма (снизу) */}
        <g
          fontFamily="ui-sans-serif, system-ui"
          fontSize="11"
          fill={dimColor}
          stroke={dimColor}
        >
          {/* Выносные линии */}
          <line x1={x0} y1={y0 + drawH + 4} x2={x0} y2={y0 + drawH + 44} strokeWidth={0.6} />
          <line
            x1={x0 + drawW}
            y1={y0 + drawH + 4}
            x2={x0 + drawW}
            y2={y0 + drawH + 44}
            strokeWidth={0.6}
          />
          {/* Размерная линия */}
          <line
            x1={x0}
            y1={y0 + drawH + 36}
            x2={x0 + drawW}
            y2={y0 + drawH + 36}
            strokeWidth={0.8}
          />
          {/* Засечки */}
          <line
            x1={x0 - 4}
            y1={y0 + drawH + 32}
            x2={x0 + 4}
            y2={y0 + drawH + 40}
            strokeWidth={0.8}
          />
          <line
            x1={x0 + drawW - 4}
            y1={y0 + drawH + 32}
            x2={x0 + drawW + 4}
            y2={y0 + drawH + 40}
            strokeWidth={0.8}
          />
          {/* Текст в разрыве линии */}
          <rect
            x={x0 + drawW / 2 - 34}
            y={y0 + drawH + 28}
            width={68}
            height={16}
            fill="hsl(var(--background))"
            stroke="none"
          />
          <text
            x={x0 + drawW / 2}
            y={y0 + drawH + 40}
            textAnchor="middle"
            stroke="none"
            fontWeight={500}
          >
            {openingWidth} мм
          </text>
        </g>

        {/* Высота проёма (слева) */}
        <g
          fontFamily="ui-sans-serif, system-ui"
          fontSize="11"
          fill={dimColor}
          stroke={dimColor}
        >
          <line x1={x0 - 4} y1={y0} x2={x0 - 44} y2={y0} strokeWidth={0.6} />
          <line
            x1={x0 - 4}
            y1={y0 + drawH}
            x2={x0 - 44}
            y2={y0 + drawH}
            strokeWidth={0.6}
          />
          <line x1={x0 - 36} y1={y0} x2={x0 - 36} y2={y0 + drawH} strokeWidth={0.8} />
          <line x1={x0 - 40} y1={y0 - 4} x2={x0 - 32} y2={y0 + 4} strokeWidth={0.8} />
          <line
            x1={x0 - 40}
            y1={y0 + drawH - 4}
            x2={x0 - 32}
            y2={y0 + drawH + 4}
            strokeWidth={0.8}
          />
          <rect
            x={x0 - 52}
            y={y0 + drawH / 2 - 8}
            width={32}
            height={16}
            fill="hsl(var(--background))"
            stroke="none"
          />
          <text
            x={x0 - 36}
            y={y0 + drawH / 2}
            textAnchor="middle"
            stroke="none"
            fontWeight={500}
            transform={`rotate(-90 ${x0 - 36} ${y0 + drawH / 2})`}
          >
            {openingHeight} мм
          </text>
        </g>

        {/* Ширина одной створки (сверху, над первой) */}
        <g
          fontFamily="ui-sans-serif, system-ui"
          fontSize="10"
          fill={dimColor}
          stroke={dimColor}
        >
          <line x1={x0} y1={y0 - 4} x2={x0} y2={y0 - 26} strokeWidth={0.5} />
          <line
            x1={x0 + sashPxW}
            y1={y0 - 4}
            x2={x0 + sashPxW}
            y2={y0 - 26}
            strokeWidth={0.5}
          />
          <line x1={x0} y1={y0 - 20} x2={x0 + sashPxW} y2={y0 - 20} strokeWidth={0.6} />
          <line x1={x0 - 3} y1={y0 - 23} x2={x0 + 3} y2={y0 - 17} strokeWidth={0.6} />
          <line
            x1={x0 + sashPxW - 3}
            y1={y0 - 23}
            x2={x0 + sashPxW + 3}
            y2={y0 - 17}
            strokeWidth={0.6}
          />
          <rect
            x={x0 + sashPxW / 2 - 30}
            y={y0 - 28}
            width={60}
            height={14}
            fill="hsl(var(--background))"
            stroke="none"
          />
          <text
            x={x0 + sashPxW / 2}
            y={y0 - 17}
            textAnchor="middle"
            stroke="none"
          >
            створка {Math.round(sashWidth)}
          </text>
        </g>
      </svg>
    </div>
  );
}
