import { describe, expect, it } from "vitest";
import {
  DETAIL_MAX,
  DETAIL_MIN,
  configFromDetailLevel,
  describeDetailLevel,
} from "../src/config";

describe("configFromDetailLevel", () => {
  it("produces simplest settings at the low end", () => {
    const c = configFromDetailLevel(DETAIL_MIN);
    expect(c.filterSpeckle).toBeGreaterThan(15);
    expect(c.colorPrecision).toBeLessThanOrEqual(3);
    expect(c.layerDifference).toBeGreaterThanOrEqual(40);
    expect(c.simplify).toBeGreaterThanOrEqual(3.5);
    expect(c.maxColors).not.toBeNull();
  });

  it("produces maximum-fidelity settings at the high end", () => {
    const c = configFromDetailLevel(DETAIL_MAX);
    expect(c.filterSpeckle).toBe(0);
    expect(c.colorPrecision).toBe(8);
    expect(c.layerDifference).toBe(8);
    expect(c.simplify).toBe(0);
    expect(c.maxColors).toBeNull();
  });

  it("is monotonic: more detail means less filtering and more precision", () => {
    for (let level = 0; level <= 100; level += 10) {
      const a = configFromDetailLevel(level);
      const b = configFromDetailLevel(Math.min(100, level + 25));
      expect(b.filterSpeckle).toBeLessThanOrEqual(a.filterSpeckle);
      expect(b.colorPrecision).toBeGreaterThanOrEqual(a.colorPrecision);
      expect(b.layerDifference).toBeLessThanOrEqual(a.layerDifference);
      expect(b.simplify).toBeLessThanOrEqual(a.simplify);
    }
  });

  it("clamps out-of-range levels", () => {
    expect(configFromDetailLevel(-50)).toEqual(configFromDetailLevel(0));
    expect(configFromDetailLevel(500)).toEqual(configFromDetailLevel(100));
  });

  it("drops maxColors in the detailed range", () => {
    expect(configFromDetailLevel(30).maxColors).not.toBeNull();
    expect(configFromDetailLevel(60).maxColors).toBeNull();
  });
});

describe("describeDetailLevel", () => {
  it("labels the three ranges", () => {
    expect(describeDetailLevel(0)).toBe("Very simple");
    expect(describeDetailLevel(50)).toBe("Balanced");
    expect(describeDetailLevel(100)).toBe("Very detailed");
  });
});
