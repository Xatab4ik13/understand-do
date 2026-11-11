export function projectionGeometry(sashWidth: number, sashHeight: number, sashCount: number) {
  const ratio = sashWidth > 0 && sashHeight > 0 ? sashWidth / sashHeight : 0.45;
  const overallRatio = ratio * sashCount;
  const drawH = Math.min(336, 668 / overallRatio);
  const drawW = drawH * overallRatio;
  return { drawW, drawH, sashPxW: drawW / sashCount };
}