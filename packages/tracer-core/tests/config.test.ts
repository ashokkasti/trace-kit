import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, sanitizeConfig, toEngineOptions } from "../src/config";

describe("sanitizeConfig", () => {
  it("fills defaults for empty input", () => {
    expect(sanitizeConfig({})).toEqual(DEFAULT_CONFIG);
  });

  it("clamps out-of-range values", () => {
    const c = sanitizeConfig({
      colorPrecision: 99,
      filterSpeckle: -5,
      cornerThreshold: 1000,
      lengthThreshold: -2,
      maxColors: 1,
      watershedDetail: 1,
      binaryThreshold: 999,
    });
    expect(c.colorPrecision).toBe(8);
    expect(c.filterSpeckle).toBe(0);
    expect(c.cornerThreshold).toBe(180);
    expect(c.lengthThreshold).toBe(0);
    expect(c.maxColors).toBe(2);
    expect(c.watershedDetail).toBe(8);
    expect(c.binaryThreshold).toBe(255);
  });

  it("rounds fractional integers", () => {
    expect(sanitizeConfig({ filterSpeckle: 3.7 }).filterSpeckle).toBe(4);
  });
});

describe("toEngineOptions", () => {
  it("passes through base fields", () => {
    const opts = toEngineOptions(DEFAULT_CONFIG);
    expect(opts.clustering).toBe("color-cluster");
    expect(opts.mode).toBe("spline");
    expect(opts.filterSpeckle).toBe(4);
    expect(opts.adaptive).toBe(true);
  });

  it("omits maxColors when null", () => {
    expect(toEngineOptions(DEFAULT_CONFIG).maxColors).toBeUndefined();
  });

  it("includes maxColors when set", () => {
    const opts = toEngineOptions({ ...DEFAULT_CONFIG, maxColors: 12 });
    expect(opts.maxColors).toBe(12);
  });

  it("omits simplify when zero", () => {
    expect(toEngineOptions(DEFAULT_CONFIG).simplify).toBeUndefined();
    expect(toEngineOptions({ ...DEFAULT_CONFIG, simplify: 1.5 }).simplify).toBe(1.5);
  });

  it("includes binaryThreshold only in bw mode", () => {
    expect(toEngineOptions(DEFAULT_CONFIG).binaryThreshold).toBeUndefined();
    const bw = toEngineOptions({ ...DEFAULT_CONFIG, clustering: "bw", binaryThreshold: 140 });
    expect(bw.binaryThreshold).toBe(140);
  });
});
