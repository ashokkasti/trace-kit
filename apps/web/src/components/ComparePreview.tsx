import { useEffect, useState } from "react";

interface ComparePreviewProps {
  originalUrl: string;
  svg: string;
  tracing: boolean;
}

export function ComparePreview({ originalUrl, svg, tracing }: ComparePreviewProps) {
  const [split, setSplit] = useState(50);
  const [showCheckerboard, setShowCheckerboard] = useState(false);
  const [svgUrl, setSvgUrl] = useState("");

  useEffect(() => {
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    setSvgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [svg]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <span className="text-neutral-500">Original</span>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            className="w-48"
          />
          <span className="text-indigo-600">Traced SVG</span>
        </div>
        <button
          type="button"
          onClick={() => setShowCheckerboard((v) => !v)}
          title="Toggle transparency checkerboard"
          className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
            showCheckerboard
              ? "border-neutral-400 bg-neutral-100 text-neutral-800"
              : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
          }`}
        >
          Alpha
        </button>
      </div>

      <div
        className={`relative min-h-0 flex-1 overflow-hidden rounded-xl ring-1 ring-neutral-200 ${
          showCheckerboard ? "checkerboard" : "bg-white"
        }`}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 size-full object-contain p-4 select-none"
          draggable={false}
        />
        {svg && (
          <img
            src={svgUrl}
            alt="Traced SVG result"
            draggable={false}
            className="absolute inset-0 size-full object-contain p-4 select-none transition-opacity duration-150"
            style={{
              clipPath: `inset(0 ${100 - split}% 0 0)`,
            }}
          />
        )}
        {tracing && (
          <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-indigo-600 shadow-sm ring-1 ring-indigo-200 backdrop-blur">
            <span className="size-2 animate-ping rounded-full bg-indigo-500" />
            Tracing…
          </div>
        )}
      </div>
    </div>
  );
}
