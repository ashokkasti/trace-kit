import { computeSvgStats, stripGeneratorComment } from "@tracekit/tracer-core";

interface StatsBarProps {
  svg: string | null;
  durationMs: number | null;
  width: number;
  height: number;
  fileName: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function StatsBar({ svg, durationMs, width, height, fileName }: StatsBarProps) {
  if (!svg) return null;
  const clean = stripGeneratorComment(svg);
  const stats = computeSvgStats(clean);
  const heavy =
    stats.byteSize > 2 * 1024 * 1024 || stats.pathCount > 20000 || stats.nodeCount > 100000;

  const download = () => {
    const blob = new Blob([clean], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.[^.]+$/, "")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(clean);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-white px-4 py-2.5 text-xs ring-1 ring-neutral-200">
      <span className="font-mono text-neutral-500">
        {width}×{height}
      </span>
      <span className="font-mono text-neutral-500">{formatBytes(stats.byteSize)}</span>
      <span className="font-mono text-neutral-500">
        {stats.pathCount.toLocaleString()} paths
      </span>
      <span
        className="font-mono text-neutral-500"
        title="Total anchor points — reduce via Simplify points"
      >
        {stats.nodeCount.toLocaleString()} pts
      </span>
      {durationMs !== null && (
        <span className="font-mono text-neutral-500">{Math.round(durationMs)} ms</span>
      )}
      {heavy && (
        <span className="text-amber-600" title="Consider higher noise filter or lower resolution">
          ⚠ Heavy output
        </span>
      )}
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-neutral-300 px-3 py-1.5 font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
        >
          Copy SVG
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
