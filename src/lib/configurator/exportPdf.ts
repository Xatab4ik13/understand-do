import { jsPDF } from "jspdf";
import logoAsset from "@/assets/logo.svg.asset.json";

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
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
  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url);
  } finally {
    // Не отзываем сразу — браузер может ещё декодировать; делаем это позже
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export interface PdfExportOptions {
  fileName: string;
  projectionSvg: SVGSVGElement;
  title: string;
  lines: string[];
}

/**
 * Печать заказа в PDF. Всё содержимое рендерится в canvas (поддержка кириллицы
 * через системный шрифт), потом одна страница A4 заполняется этим изображением.
 */
export async function exportOrderToPdf(opts: PdfExportOptions): Promise<void> {
  // ---- Подгружаем картинки ----
  const [logoImg, svgImg] = await Promise.all([
    loadImage(logoAsset.url).catch(() => null),
    svgToImage(opts.projectionSvg),
  ]);

  // ---- A4 в пикселях при 150 dpi: 1240×1754 ----
  const DPI = 150;
  const pageW = Math.round((210 / 25.4) * DPI); // 1240
  const pageH = Math.round((297 / 25.4) * DPI); // 1754
  const margin = Math.round((14 / 25.4) * DPI); // ~83

  const canvas = document.createElement("canvas");
  canvas.width = pageW;
  canvas.height = pageH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageW, pageH);
  ctx.textBaseline = "top";
  ctx.fillStyle = "#000000";

  // ---- Шапка: логотип слева, заголовок и дата справа ----
  const headerH = 110;
  if (logoImg) {
    const ratio = logoImg.width / logoImg.height || 2000 / 600;
    const lh = 90;
    const lw = lh * ratio;
    ctx.drawImage(logoImg, margin, margin, lw, lh);
  }
  ctx.font = `bold 32px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(opts.title, pageW - margin, margin + 8);
  ctx.font = `18px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = "#666";
  ctx.fillText(
    new Date().toLocaleDateString("ru-RU"),
    pageW - margin,
    margin + 50,
  );
  ctx.fillStyle = "#000";
  ctx.textAlign = "left";

  // Разделитель
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, margin + headerH);
  ctx.lineTo(pageW - margin, margin + headerH);
  ctx.stroke();

  // ---- Проекция ----
  const projY = margin + headerH + 24;
  const projW = pageW - margin * 2;
  const ratio = svgImg.width && svgImg.height ? svgImg.width / svgImg.height : 1.6;
  let drawW = projW;
  let drawH = drawW / ratio;
  const maxProjH = Math.round(pageH * 0.45);
  if (drawH > maxProjH) {
    drawH = maxProjH;
    drawW = drawH * ratio;
  }
  const projX = margin + (projW - drawW) / 2;
  ctx.drawImage(svgImg, projX, projY, drawW, drawH);

  // ---- Текстовый блок ----
  let y = projY + drawH + 40;
  ctx.font = `bold 24px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText("Параметры заказа", margin, y);
  y += 36;
  ctx.font = `18px "Helvetica Neue", Arial, sans-serif`;
  const lineH = 26;
  const maxW = pageW - margin * 2;
  const wrapAndDraw = (text: string) => {
    const words = text.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW) {
        ctx.fillText(line, margin, y);
        y += lineH;
        line = w;
      } else {
        line = test;
      }
      if (y > pageH - margin) return;
    }
    if (line) {
      ctx.fillText(line, margin, y);
      y += lineH;
    }
  };
  for (const raw of opts.lines) {
    if (y > pageH - margin) break;
    if (raw === "") {
      y += lineH / 2;
      continue;
    }
    wrapAndDraw(raw);
  }

  // ---- Собираем PDF ----
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.addImage(dataUrl, "JPEG", 0, 0, 210, 297);
  doc.save(opts.fileName);
}
