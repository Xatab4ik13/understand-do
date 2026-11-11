import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { projectionGeometry } from "./projectionGeometry";
import { fitsPdfPage } from "./pdfLayout";

describe("projection proportions", () => {
  it("preserves type 7 sash proportions at 4200 × 2620 opening", () => {
    const width = (4200 - 23) / 4 + 23;
    const height = 2620 - 77;
    const g = projectionGeometry(width, height, 4);
    assert.ok(Math.abs(g.sashPxW / g.drawH - width / height) < 1e-10);
  });
  it("does not stretch a narrow sash", () => {
    const g = projectionGeometry(500, 3000, 1);
    assert.ok(Math.abs(g.sashPxW / g.drawH - 1 / 6) < 1e-10);
  });
});
describe("PDF overflow", () => {
  it("requires another page for the formerly omitted type 7 price", () => {
    assert.equal(fitsPdfPage(1658, 46, 1754, 94), false);
    assert.equal(fitsPdfPage(134, 46, 1754, 94), true);
  });
});