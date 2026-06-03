import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lineTotalSyp, usdToSyp } from "../lib/pricing.ts";

describe("usdToSyp", () => {
  it("10 USD × 15000 → 150000 (nearest 1000)", () => {
    assert.equal(usdToSyp(10, 15000, "NEAREST_1000"), 150000);
  });

  it("10 USD × 15250 → 153000 (nearest 1000)", () => {
    assert.equal(usdToSyp(10, 15250, "NEAREST_1000"), 153000);
  });

  it("10 USD × 15250 → 152500 (nearest 500)", () => {
    assert.equal(usdToSyp(10, 15250, "NEAREST_500"), 152500);
  });
});

describe("lineTotalSyp", () => {
  it("multiplies rounded unit by quantity", () => {
    assert.equal(lineTotalSyp(10, 2, 15000, "NEAREST_1000"), 300000);
  });
});
