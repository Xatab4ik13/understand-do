import { describe, it, expect } from "bun:test";
import { projectionGeometry } from "./projectionGeometry";
import { fitsPdfPage } from "./pdfLayout";

describe("projection proportions", () => {
  it("preserves type 7 sash proportions at 4200 × 2620 opening", () => {
    const width = (4200 - 23) / 4 + 23;
    const height = 2620 - 77;
    const g = projectionGeometry(width, height, 4);
    expect(g.sashPxW / g.drawH).toBeCloseTo(width / height, 10);
  });
  it("does not stretch a narrow sash", () => {
    const g = projectionGeometry(500, 3000, 1);
    expect(g.sashPxW / g.drawH).toBeCloseTo(1 / 6, 10);
  });
});
describe("PDF overflow", () => {
  it("requires another page for the formerly omitted type 7 price", () => {
    expect(fitsPdfPage(1658, 46, 1754, 94)).toBe(false);
    expect(fitsPdfPage(134, 46, 1754, 94)).toBe(true);
  });
});