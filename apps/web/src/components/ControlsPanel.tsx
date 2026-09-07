import {
  PRESETS,
  DETAIL_MAX,
  DETAIL_MIN,
  describeDetailLevel,
  type ClusteringMode,
  type ShapeMode,
  type TraceConfig,
} from "@tracekit/tracer-core";
import { SectionTitle, Segmented, Slider, Toggle } from "./ui";

interface ControlsPanelProps {
  config: TraceConfig;
  activePresetId: string | null;
  maxEdge: number;
  detailLevel: number;
  onPreset: (id: string) => void;
  onChange: (patch: Partial<TraceConfig>) => void;
  onMaxEdge: (v: number) => void;
  onDetailLevel: (v: number) => void;
}

const RESOLUTIONS = [
  { value: 1024, label: "1K" },
  { value: 2048, label: "2K" },
  { value: 4096, label: "4K" },
  { value: Number.MAX_SAFE_INTEGER, label: "Full" },
];

export function ControlsPanel({
  config,
  activePresetId,
  maxEdge,
  detailLevel,
  onPreset,
  onChange,
  onMaxEdge,
  onDetailLevel,
}: ControlsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <section className="space-y-2 rounded-lg bg-neutral-50 p-3 ring-1 ring-neutral-200">
        <SectionTitle>Simplification</SectionTitle>
        <Slider
          label={describeDetailLevel(detailLevel)}
          min={DETAIL_MIN}
          max={DETAIL_MAX}
          step={5}
          value={detailLevel}
          onChange={onDetailLevel}
        />
        <p className="text-[10px] leading-snug text-neutral-500">
          Left = fewer, larger shapes. Right = maximum fidelity.
        </p>
      </section>

      <section className="space-y-2">
        <SectionTitle>Preset</SectionTitle>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.description}
              onClick={() => onPreset(p.id)}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                activePresetId === p.id
                  ? "bg-brand-600 text-white"
                  : activePresetId === null
                    ? "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-200"
                    : "bg-neutral-50 text-neutral-500 ring-1 ring-neutral-200/70 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              {p.label}
            </button>
          ))}
          <div
            className={`flex items-center justify-center rounded-lg px-2 py-2 text-xs font-medium ${
              activePresetId === null
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                : "text-neutral-400"
            }`}
          >
            Custom
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Clustering</SectionTitle>
        <Segmented<ClusteringMode>
          options={[
            { value: "color-cluster", label: "Color" },
            { value: "bw", label: "B&W" },
            { value: "watershed", label: "Watershed" },
          ]}
          value={config.clustering}
          onChange={(clustering) => onChange({ clustering })}
        />
      </section>

      <section className="space-y-2">
        <SectionTitle>Shape mode</SectionTitle>
        <Segmented<ShapeMode>
          options={[
            { value: "spline", label: "Smooth" },
            { value: "polygon", label: "Polygon" },
            { value: "pixel", label: "Pixel" },
          ]}
          value={config.mode}
          onChange={(mode) => onChange({ mode })}
        />
      </section>

      {config.clustering === "bw" && (
        <section className="space-y-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200">
          <SectionTitle>B&W threshold</SectionTitle>
          <Toggle
            label="Adaptive (uneven lighting)"
            checked={config.adaptive}
            onChange={(adaptive) => onChange({ adaptive })}
          />
          {!config.adaptive && (
            <Slider
              label="Threshold"
              min={16}
              max={240}
              value={config.binaryThreshold}
              onChange={(binaryThreshold) => onChange({ binaryThreshold })}
            />
          )}
        </section>
      )}

      {config.clustering === "watershed" && (
        <section className="space-y-3">
          <Slider
            label="Watershed detail"
            min={8}
            max={255}
            value={config.watershedDetail}
            onChange={(watershedDetail) => onChange({ watershedDetail })}
          />
        </section>
      )}

      {config.clustering !== "bw" && (
        <section className="space-y-3">
          <SectionTitle>Color</SectionTitle>
          <Slider
            label="Color precision"
            min={1}
            max={8}
            value={config.colorPrecision}
            format={(v) => `${v} bit`}
            onChange={(colorPrecision) => onChange({ colorPrecision })}
          />
          <Slider
            label="Layer difference"
            min={0}
            max={64}
            value={config.layerDifference}
            onChange={(layerDifference) => onChange({ layerDifference })}
          />
          <Toggle
            label="Limit colors"
            checked={config.maxColors !== null}
            onChange={(on) => onChange({ maxColors: on ? 16 : null })}
          />
          {config.maxColors !== null && (
            <Slider
              label="Max colors"
              min={2}
              max={64}
              value={config.maxColors}
              onChange={(maxColors) => onChange({ maxColors })}
            />
          )}
        </section>
      )}

      <section className="space-y-3">
        <SectionTitle>Detail</SectionTitle>
        <Slider
          label="Noise filter"
          min={0}
          max={32}
          value={config.filterSpeckle}
          offLabel="Off"
          onChange={(filterSpeckle) => onChange({ filterSpeckle })}
        />
        <Slider
          label="Simplify points"
          min={0}
          max={10}
          step={0.25}
          value={config.simplify}
          offLabel="Off"
          onChange={(simplify) => onChange({ simplify })}
        />
        <p className="text-[10px] leading-snug text-neutral-500">
          Simplify points merges nearby anchors — like Illustrator's Simplify. Raise it to
          collapse jagged edges into fewer, smoother nodes.
        </p>
      </section>

      <section className="space-y-3">
        <SectionTitle>Geometry</SectionTitle>
        <Slider
          label="Corner threshold"
          min={0}
          max={180}
          value={config.cornerThreshold}
          format={(v) => `${v}°`}
          onChange={(cornerThreshold) => onChange({ cornerThreshold })}
        />
        <Slider
          label="Segment length"
          min={0}
          max={10}
          step={0.5}
          value={config.lengthThreshold}
          offLabel="Auto"
          onChange={(lengthThreshold) => onChange({ lengthThreshold })}
        />
        <Slider
          label="Splice threshold"
          min={0}
          max={180}
          value={config.spliceThreshold}
          format={(v) => `${v}°`}
          onChange={(spliceThreshold) => onChange({ spliceThreshold })}
        />
      </section>

      <section className="space-y-2">
        <SectionTitle>Trace resolution</SectionTitle>
        <Segmented<string>
          options={RESOLUTIONS.map((r) => ({ value: String(r.value), label: r.label }))}
          value={String(maxEdge)}
          onChange={(v) => onMaxEdge(Number(v))}
        />
      </section>
    </div>
  );
}
