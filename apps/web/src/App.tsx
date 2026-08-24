import { useCallback, useEffect, useState } from "react";
import {
  PRESETS,
  configFromDetailLevel,
  decodeImageToImageData,
  type TraceConfig,
} from "@tracekit/tracer-core";
import { useTracer } from "./hooks/useTracer";
import { Dropzone } from "./components/Dropzone";
import { ControlsPanel } from "./components/ControlsPanel";
import { ComparePreview } from "./components/ComparePreview";
import { StatsBar } from "./components/StatsBar";

interface LoadedFile {
  blob: Blob;
  name: string;
  url: string;
}

export default function App() {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [config, setConfig] = useState<TraceConfig>(PRESETS[0].config as TraceConfig);
  const [activePresetId, setActivePresetId] = useState<string | null>(PRESETS[0].id);
  const [detailLevel, setDetailLevel] = useState(50);
  const [maxEdge, setMaxEdge] = useState(2048);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { outcome, tracing, error } = useTracer(imageData, config);

  useEffect(() => () => { if (file) URL.revokeObjectURL(file.url); }, [file]);

  const loadFile = useCallback(
    async (blob: Blob, name: string, cap: number) => {
      try {
        setLoadError(null);
        const decoded = await decodeImageToImageData(blob, cap);
        setFile((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, name, url: URL.createObjectURL(blob) };
        });
        setImageData(decoded);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load image");
      }
    },
    [],
  );

  const handleFile = useCallback(
    (f: File) => {
      void loadFile(f, f.name, maxEdge);
    },
    [loadFile, maxEdge],
  );

  const handleMaxEdge = useCallback(
    (cap: number) => {
      setMaxEdge(cap);
      if (file) void loadFile(file.blob, file.name, cap);
    },
    [file, loadFile],
  );

  const handleReset = useCallback(() => {
    setFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
    setImageData(null);
    setLoadError(null);
  }, []);

  const loadSample = useCallback(() => {
    void (async () => {
      try {
        const res = await fetch("sample.png");
        const blob = await res.blob();
        void loadFile(blob, "sample.png", maxEdge);
      } catch {
        setLoadError("Could not load the sample image");
      }
    })();
  }, [loadFile, maxEdge]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("sample")) {
      loadSample();
    }
  }, [loadSample]);

  const applyPreset = useCallback((id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setConfig(preset.config as TraceConfig);
    setActivePresetId(id);
    setDetailLevel(50);
  }, []);

  const patchConfig = useCallback((patch: Partial<TraceConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
    setActivePresetId(null);
  }, []);

  const handleDetailLevel = useCallback((level: number) => {
    setDetailLevel(level);
    setConfig((c) => ({ ...c, ...configFromDetailLevel(level) }));
    setActivePresetId(null);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6 text-indigo-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <div>
            <h1 className="text-sm leading-tight font-semibold text-neutral-900">TraceKit</h1>
            <p className="text-[11px] leading-tight text-neutral-500">Raster to SVG, fully local</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {file && (
            <>
              <Dropzone onFile={handleFile} compact />
              <button
                type="button"
                onClick={handleReset}
                title="Clear image and start over"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
              >
                Reset
              </button>
            </>
          )}
          <span
            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200"
            title="Images are processed entirely in your browser"
          >
            100% private
          </span>
        </div>
      </header>

      {!imageData ? (
        <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Vectorize any image — free, instantly, offline
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Illustrator-style image trace powered by VTracer, running entirely in your browser.
              Your images never leave this device.
            </p>
          </div>
          {loadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
              <button type="button" onClick={() => setLoadError(null)} className="ml-3 underline">
                Try again
              </button>
            </div>
          ) : (
            <>
              <Dropzone onFile={handleFile} />
              <button
                type="button"
                onClick={loadSample}
                className="text-sm font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-500 hover:underline"
              >
                Or try it with a sample image →
              </button>
            </>
          )}
        </main>
      ) : (
        <main className="grid min-h-0 flex-1 grid-cols-[320px_1fr] gap-4 bg-neutral-100 p-4">
          <aside className="min-h-0 overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200">
            <ControlsPanel
              config={config}
              activePresetId={activePresetId}
              maxEdge={maxEdge}
              detailLevel={detailLevel}
              onPreset={applyPreset}
              onChange={patchConfig}
              onMaxEdge={handleMaxEdge}
              onDetailLevel={handleDetailLevel}
            />
          </aside>

          <section className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1">
              {error ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
                  Trace failed: {error}
                </div>
              ) : outcome ? (
                <ComparePreview
                  originalUrl={file!.url}
                  svg={outcome.svg}
                  tracing={tracing}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200">
                  {tracing ? (
                    <span className="animate-pulse text-sm text-indigo-600">Tracing…</span>
                  ) : (
                    <span className="text-sm text-neutral-400">Preparing…</span>
                  )}
                </div>
              )}
            </div>
            <StatsBar
              svg={outcome?.svg ?? null}
              durationMs={outcome?.durationMs ?? null}
              width={imageData.width}
              height={imageData.height}
              fileName={file!.name}
            />
          </section>
        </main>
      )}
    </div>
  );
}
