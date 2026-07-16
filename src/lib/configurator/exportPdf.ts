import { jsPDF } from "jspdf";
import logoAsset from "@/assets/logo.svg.asset.json";

const logoUrl = logoAsset.url;

function loadImage(url: string, useCors = true): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (useCors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Image load failed: ${url}`));
    img.src = url;
  });
}


async function urlToDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function svgToImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  const vb = svg.viewBox.baseVal;
  const w = vb && vb.width ? vb.width : svg.clientWidth || 800;
  const h = vb && vb.height ? vb.height : svg.clientHeight || 500;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));

  // Инлайним все <image href="..."> в data-URL, иначе canvas taint при toDataURL
  const imgEls = Array.from(clone.querySelectorAll("image"));
  await Promise.all(
    imgEls.map(async (el) => {
      const href =
        el.getAttribute("href") ||
        el.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.startsWith("data:")) return;
      const abs = new URL(href, window.location.origin).href;
      const dataUrl = await urlToDataUrl(abs);
      if (dataUrl) {
        el.setAttribute("href", dataUrl);
        el.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
      } else {
        // не удалось получить — удаляем image, чтобы не тейнтить canvas
        el.parentNode?.removeChild(el);
      }
    }),
  );

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url, false);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

}


export interface PdfExportOptions {
  fileName: string;
  projectionSvg: SVGSVGElement;
  title: string;
  lines: string[];
}

// ---- Утилиты рисования ----
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface ParsedItem {
  type: "kv" | "section" | "sash" | "spacer";
  label?: string;
  value?: string;
  text?: string;
}

function parseLines(lines: string[]): {
  params: ParsedItem[];
  sashes: string[];
  prices: { label: string; value: string; highlight?: boolean }[];
} {
  const params: ParsedItem[] = [];
  const sashes: string[] = [];
  const prices: { label: string; value: string; highlight?: boolean }[] = [];
  let section: "params" | "sashes" | "prices" = "params";

  for (const raw of lines) {
    const line = raw ?? "";
    if (line === "") {
      if (section === "params") section = "sashes";
      else if (section === "sashes") section = "prices";
      continue;
    }
    if (section === "sashes") {
      if (line.trim().toLowerCase().startsWith("створки")) continue;
      sashes.push(line.trim());
      continue;
    }
    const idx = line.indexOf(":");
    if (idx === -1) {
      params.push({ type: "section", text: line });
      continue;
    }
    const label = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (section === "prices") {
      const highlight =
        label.toLowerCase().includes("общая") ||
        label.toLowerCase().includes("ррц");
      prices.push({ label, value, highlight });
    } else {
      params.push({ type: "kv", label, value });
    }
  }
  return { params, sashes, prices };
}

export async function exportOrderToPdf(opts: PdfExportOptions): Promise<void> {
  const [logoImg, svgImg] = await Promise.all([
    loadImage(logoUrl).catch(() => null),
    svgToImage(opts.projectionSvg).catch((e) => {
      console.warn("SVG projection render failed", e);
      return null;
    }),
  ]);


  // A4 при 150 dpi
  const DPI = 150;
  const pageW = Math.round((210 / 25.4) * DPI); // 1240
  const pageH = Math.round((297 / 25.4) * DPI); // 1754
  const margin = Math.round((16 / 25.4) * DPI); // ~94

  const canvas = document.createElement("canvas");
  canvas.width = pageW;
  canvas.height = pageH;
  const ctx = canvas.getContext("2d")!;

  // Фон
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageW, pageH);
  ctx.textBaseline = "top";

  const COLOR_TEXT = "#111827";
  const COLOR_MUTED = "#6b7280";
  const COLOR_BORDER = "#e5e7eb";
  const COLOR_CARD_BG = "#fafafa";
  const COLOR_ROW_ALT = "#f5f6f8";
  const COLOR_ACCENT = "#111827";
  const COLOR_HIGHLIGHT_BG = "#111827";
  const COLOR_HIGHLIGHT_TEXT = "#ffffff";
  const FONT = `"Helvetica Neue", Arial, sans-serif`;

  // ---------- Шапка ----------
  const headerTop = margin;
  const logoH = 100;
  if (logoImg) {
    const ratio = logoImg.width / logoImg.height || 2000 / 600;
    ctx.drawImage(logoImg, margin, headerTop, logoH * ratio, logoH);
  }
  ctx.fillStyle = COLOR_TEXT;
  ctx.font = `bold 34px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(opts.title, pageW - margin, headerTop + 8);
  ctx.font = `20px ${FONT}`;
  ctx.fillStyle = COLOR_MUTED;
  ctx.fillText(
    new Date().toLocaleDateString("ru-RU"),
    pageW - margin,
    headerTop + 52,
  );
  ctx.textAlign = "left";

  // Толстый акцентный разделитель
  const dividerY = headerTop + logoH + 24;
  ctx.fillStyle = COLOR_ACCENT;
  ctx.fillRect(margin, dividerY, pageW - margin * 2, 3);

  // ---------- Карточка с проекцией ----------
  const cardX = margin;
  const cardY = dividerY + 28;
  const cardW = pageW - margin * 2;
  const cardH = Math.round(pageH * 0.36);

  ctx.fillStyle = COLOR_CARD_BG;
  roundRect(ctx, cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 12);
  ctx.stroke();

  const padIn = 24;
  const innerW = cardW - padIn * 2;
  const innerH = cardH - padIn * 2;
  const ratio = svgImg.width && svgImg.height ? svgImg.width / svgImg.height : 1.6;
  let drawW = innerW;
  let drawH = drawW / ratio;
  if (drawH > innerH) {
    drawH = innerH;
    drawW = drawH * ratio;
  }
  const drawX = cardX + (cardW - drawW) / 2;
  const drawY = cardY + (cardH - drawH) / 2;
  ctx.drawImage(svgImg, drawX, drawY, drawW, drawH);

  // ---------- Парсинг данных ----------
  const { params, sashes, prices } = parseLines(opts.lines);

  let y = cardY + cardH + 36;

  const drawSectionTitle = (text: string) => {
    ctx.fillStyle = COLOR_ACCENT;
    ctx.fillRect(margin, y + 6, 6, 22);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = `bold 24px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(text, margin + 18, y);
    y += 40;
  };

  // ---------- Таблица параметров ----------
  drawSectionTitle("Параметры заказа");

  const tableX = margin;
  const tableW = pageW - margin * 2;
  const rowH = 40;
  const labelColW = Math.round(tableW * 0.42);
  const kvParams = params.filter((p) => p.type === "kv");
  const tableH = rowH * kvParams.length;

  // Контур таблицы
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, tableX, y, tableW, tableH, 10);
  ctx.fill();

  // Строки с альтернативным фоном
  kvParams.forEach((row, i) => {
    const ry = y + i * rowH;
    if (i % 2 === 1) {
      ctx.fillStyle = COLOR_ROW_ALT;
      ctx.fillRect(tableX + 1, ry, tableW - 2, rowH);
    }
    // разделитель снизу строки
    if (i < kvParams.length - 1) {
      ctx.strokeStyle = COLOR_BORDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tableX + 12, ry + rowH);
      ctx.lineTo(tableX + tableW - 12, ry + rowH);
      ctx.stroke();
    }
    // текст
    ctx.fillStyle = COLOR_MUTED;
    ctx.font = `18px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(row.label ?? "", tableX + 20, ry + 11);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = `bold 18px ${FONT}`;
    ctx.fillText(row.value ?? "", tableX + labelColW, ry + 11);
  });

  // Внешняя рамка таблицы
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1.5;
  roundRect(ctx, tableX, y, tableW, tableH, 10);
  ctx.stroke();

  y += tableH + 28;

  // ---------- Створки ----------
  if (sashes.length > 0) {
    drawSectionTitle("Створки");
    const sRowH = 36;
    const sH = sRowH * sashes.length + 16;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, tableX, y, tableW, sH, 10);
    ctx.fill();
    ctx.strokeStyle = COLOR_BORDER;
    ctx.lineWidth = 1.5;
    roundRect(ctx, tableX, y, tableW, sH, 10);
    ctx.stroke();

    ctx.fillStyle = COLOR_TEXT;
    ctx.font = `18px ${FONT}`;
    sashes.forEach((s, i) => {
      ctx.fillText(`• ${s}`, tableX + 20, y + 12 + i * sRowH);
    });
    y += sH + 28;
  }

  // ---------- Цены ----------
  if (prices.length > 0) {
    drawSectionTitle("Стоимость");
    const pRowH = 46;
    prices.forEach((p) => {
      if (y + pRowH > pageH - margin) return;
      if (p.highlight) {
        ctx.fillStyle = COLOR_HIGHLIGHT_BG;
        roundRect(ctx, tableX, y, tableW, pRowH, 8);
        ctx.fill();
        ctx.fillStyle = COLOR_HIGHLIGHT_TEXT;
        ctx.font = `bold 20px ${FONT}`;
        ctx.textAlign = "left";
        ctx.fillText(p.label, tableX + 20, y + 13);
        ctx.textAlign = "right";
        ctx.font = `bold 22px ${FONT}`;
        ctx.fillText(p.value, tableX + tableW - 20, y + 12);
      } else {
        ctx.strokeStyle = COLOR_BORDER;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tableX, y + pRowH);
        ctx.lineTo(tableX + tableW, y + pRowH);
        ctx.stroke();
        ctx.fillStyle = COLOR_MUTED;
        ctx.font = `18px ${FONT}`;
        ctx.textAlign = "left";
        ctx.fillText(p.label, tableX + 20, y + 13);
        ctx.fillStyle = COLOR_TEXT;
        ctx.font = `bold 18px ${FONT}`;
        ctx.textAlign = "right";
        ctx.fillText(p.value, tableX + tableW - 20, y + 13);
      }
      y += pRowH + 8;
    });
    ctx.textAlign = "left";
  }

  // ---------- Футер ----------
  ctx.fillStyle = COLOR_MUTED;
  ctx.font = `14px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(
    "Сформировано в конфигураторе перегородок Brand Alum",
    pageW / 2,
    pageH - margin + 12,
  );

  // ---------- В PDF ----------
  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.addImage(dataUrl, "JPEG", 0, 0, 210, 297);
  doc.save(opts.fileName);
}
