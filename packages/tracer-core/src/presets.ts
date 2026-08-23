import { DEFAULT_CONFIG, type TraceConfig } from "./config";

export interface TracePreset {
  id: string;
  label: string;
  description: string;
  config: Omit<TraceConfig, "binaryThreshold" | "watershedDetail"> & {
    binaryThreshold?: number;
    watershedDetail?: number;
  };
}

export const PRESETS: TracePreset[] = [
  {
    id: "logo",
    label: "Logo",
    description: "Flat graphics, icons, screenshots with few colors",
    config: { ...DEFAULT_CONFIG },
  },
  {
    id: "photo",
    label: "Photo",
    description: "Detailed images — heavier output, smoother curves",
    config: {
      ...DEFAULT_CONFIG,
      filterSpeckle: 10,
      colorPrecision: 6,
      layerDifference: 28,
      cornerThreshold: 90,
      lengthThreshold: 5,
      spliceThreshold: 60,
      maxColors: 32,
    },
  },
  {
    id: "bw-scan",
    label: "B&W Scan",
    description: "Signatures, line art, scans — adaptive threshold",
    config: {
      ...DEFAULT_CONFIG,
      clustering: "bw",
      mode: "spline",
      filterSpeckle: 4,
      adaptive: true,
      binaryThreshold: 128,
    },
  },
  {
    id: "pixel-art",
    label: "Pixel Art",
    description: "Retro game art — exact square pixels",
    config: {
      ...DEFAULT_CONFIG,
      mode: "pixel",
      filterSpeckle: 0,
      colorPrecision: 8,
      layerDifference: 8,
    },
  },
  {
    id: "poster",
    label: "Poster",
    description: "Few flat colors — compact stylized output",
    config: {
      ...DEFAULT_CONFIG,
      filterSpeckle: 8,
      colorPrecision: 4,
      layerDifference: 40,
      cornerThreshold: 80,
      maxColors: 12,
    },
  },
];
