export type ClusteringMode = "color-cluster" | "bw" | "watershed";
export type ShapeMode = "spline" | "polygon" | "pixel";
export type HierarchicalMode = "stacked" | "cutout";

export interface TraceConfig {
  clustering: ClusteringMode;
  mode: ShapeMode;
  hierarchical: HierarchicalMode;
  filterSpeckle: number;
  colorPrecision: number;
  layerDifference: number;
  cornerThreshold: number;
  lengthThreshold: number;
  spliceThreshold: number;
  simplify: number;
  maxColors: number | null;
  binaryThreshold: number;
  adaptive: boolean;
  watershedDetail: number;
}

export const DEFAULT_CONFIG: TraceConfig = {
  clustering: "color-cluster",
  mode: "spline",
  hierarchical: "stacked",
  filterSpeckle: 4,
  colorPrecision: 6,
  layerDifference: 16,
  cornerThreshold: 60,
  lengthThreshold: 4,
  spliceThreshold: 45,
  simplify: 0,
  maxColors: null,
  binaryThreshold: 128,
  adaptive: true,
  watershedDetail: 128,
};

export type EngineOptions = Partial<{
  preset: "bw" | "poster" | "photo";
  clustering: ClusteringMode;
  hierarchical: HierarchicalMode;
  mode: ShapeMode;
  filterSpeckle: number;
  colorPrecision: number;
  layerDifference: number;
  cornerThreshold: number;
  lengthThreshold: number;
  maxIterations: number;
  spliceThreshold: number;
  simplify: number;
  pathPrecision: number;
  palette: string[];
  maxColors: number;
  binaryThreshold: number;
  adaptive: boolean;
  adaptiveWindow: number;
  adaptiveT: number;
  watershedDetail: number;
}>;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function sanitizeConfig(input: Partial<TraceConfig>): TraceConfig {
  const c = { ...DEFAULT_CONFIG, ...input };
  return {
    ...c,
    filterSpeckle: clamp(Math.round(c.filterSpeckle), 0, 32),
    colorPrecision: clamp(Math.round(c.colorPrecision), 1, 8),
    layerDifference: clamp(Math.round(c.layerDifference), 0, 64),
    cornerThreshold: clamp(Math.round(c.cornerThreshold), 0, 180),
    lengthThreshold: clamp(c.lengthThreshold, 0, 20),
    spliceThreshold: clamp(Math.round(c.spliceThreshold), 0, 180),
    simplify: clamp(c.simplify, 0, 10),
    maxColors: c.maxColors === null ? null : clamp(Math.round(c.maxColors), 2, 256),
    binaryThreshold: clamp(Math.round(c.binaryThreshold), 0, 255),
    watershedDetail: clamp(Math.round(c.watershedDetail), 8, 255),
  };
}

export function toEngineOptions(c: TraceConfig): EngineOptions {
  const opts: EngineOptions = {
    clustering: c.clustering,
    mode: c.mode,
    hierarchical: c.hierarchical,
    filterSpeckle: c.filterSpeckle,
    colorPrecision: c.colorPrecision,    layerDifference: c.layerDifference,
    cornerThreshold: c.cornerThreshold,
    lengthThreshold: c.lengthThreshold,
    spliceThreshold: c.spliceThreshold,
    adaptive: c.adaptive,
    watershedDetail: c.watershedDetail,
  };
  if (c.binaryThreshold >= 0 && c.clustering === "bw") opts.binaryThreshold = c.binaryThreshold;
  if (c.simplify > 0) opts.simplify = c.simplify;
  if (c.maxColors !== null && c.clustering !== "bw") opts.maxColors = c.maxColors;
  return opts;
}

export const DETAIL_MIN = 0;
export const DETAIL_MAX = 100;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export interface DetailLevelPatch {
  filterSpeckle: number;
  colorPrecision: number;
  layerDifference: number;
  cornerThreshold: number;
  lengthThreshold: number;
  spliceThreshold: number;
  simplify: number;
  maxColors: number | null;
}

export function configFromDetailLevel(level: number): DetailLevelPatch {
  const t = clamp(level, DETAIL_MIN, DETAIL_MAX) / 100;
  const maxColors = t < 0.4 ? Math.round(lerp(6, 24, t / 0.4)) : null;
  return {
    filterSpeckle: Math.round(lerp(22, 0, t)),
    colorPrecision: Math.round(lerp(3, 8, t)),
    layerDifference: Math.round(lerp(48, 8, t)),
    cornerThreshold: Math.round(lerp(110, 40, t)),
    lengthThreshold: Math.round(lerp(10, 2, t) * 2) / 2,
    spliceThreshold: Math.round(lerp(90, 35, t)),
    simplify: Math.round(lerp(6, 0, t) * 4) / 4,
    maxColors,
  };
}

export function describeDetailLevel(level: number): string {
  if (level < 34) return "Very simple";
  if (level < 67) return "Balanced";
  return "Very detailed";
}
