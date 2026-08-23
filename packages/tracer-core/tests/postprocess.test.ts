import { describe, expect, it } from "vitest";
import { PRESETS } from "../src/presets";
import { computeSvgStats, stripGeneratorComment } from "../src/postprocess";

describe("presets", () => {
  it("has unique ids with labels and descriptions", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(PRESETS.length);
    for (const p of PRESETS) {
      expect(p.label).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.config.mode).toBeDefined();
    }
  });

  it("bw-scan preset uses bw clustering with adaptive threshold", () => {
    const bw = PRESETS.find((p) => p.id === "bw-scan")!;
    expect(bw.config.clustering).toBe("bw");
    expect(bw.config.adaptive).toBe(true);
  });
});

describe("postprocess", () => {
  it("counts paths, nodes, and byte size", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 0 C20 5 30 5 40 0 Z"/><path d="m1 1 l2 2 q3 3 4 4"/></svg>`;
    const stats = computeSvgStats(svg);
    expect(stats.pathCount).toBe(2);
    expect(stats.nodeCount).toBe(6);
    expect(stats.byteSize).toBe(new TextEncoder().encode(svg).length);
  });

  it("strips generator comments", () => {
    const svg = `<!-- Generator: visioncortex VTracer -->\n<svg><path/></svg>`;
    expect(stripGeneratorComment(svg)).toBe(`<svg><path/></svg>`);
  });

  it("handles unicode byte lengths correctly", () => {
    const stats = computeSvgStats(`<svg><!-- ☂ --></svg>`);
    expect(stats.byteSize).toBeGreaterThan(20);
  });
});
