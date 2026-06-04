import { jsPDF } from "jspdf";
import logoAsset from "@/assets/logo.svg.asset.json";

/** Загрузить изображение по URL в HTMLImageElement */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Растеризовать SVG-элемент в PNG dataURL */
async function svgToPngDataUrl(svg: SVGSVGElement, scale = 2): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
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
  const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { dataUrl: canvas.toDataURL("image/png"), width: w, height: h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface PdfExportOptions {
  fileName: string;
  /** SVG-элемент проекции */
  projectionSvg: SVGSVGElement;
  /** Заголовок документа (тип перегородки) */
  title: string;
  /** Строки заказа для текстового блока */
  lines: string[];
}

export async function exportOrderToPdf(opts: PdfExportOptions): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ---- Логотип ----
  try {
    const logoImg = await loadImage(logoAsset.url);
    // SVG → canvas чтобы получить PNG (jsPDF не понимает SVG напрямую)
    const ratio = logoImg.width / logoImg.height || 2000 / 600;
    const logoH = 18;
    const logoW = logoH * ratio;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(logoImg.width || 2000);
    canvas.height = Math.round(logoImg.height || 600);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);
    const logoData = canvas.toDataURL("image/png");
    doc.addImage(logoData, "PNG", margin, margin, logoW, logoH);
  } catch (e) {
    console.warn("logo render failed", e);
  }

  // ---- Заголовок ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(opts.title, pageW - margin, margin + 8, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(new Date().toLocaleDateString("ru-RU"), pageW - margin, margin + 14, {
    align: "right",
  });
  doc.setTextColor(0);

  // ---- Проекция ----
  const { dataUrl, width: svgW, height: svgH } = await svgToPngDataUrl(
    opts.projectionSvg,
    2,
  );
  const availW = pageW - margin * 2;
  const projW = availW;
  const projH = (svgH / svgW) * projW;
  const projY = margin + 26;
  doc.addImage(dataUrl, "PNG", margin, projY, projW, projH);

  // ---- Текстовый блок заказа ----
  let textY = projY + projH + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Параметры заказа", margin, textY);
  textY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const pageH = doc.internal.pageSize.getHeight();
  for (const raw of opts.lines) {
    const wrapped = doc.splitTextToSize(raw, pageW - margin * 2);
    for (const line of wrapped) {
      if (textY > pageH - margin) {
        doc.addPage();
        textY = margin;
      }
      doc.text(line, margin, textY);
      textY += 5;
    }
  }

  doc.save(opts.fileName);
}
