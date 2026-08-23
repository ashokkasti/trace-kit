import init, { vectorize_rgba } from "./wasm/vtracer_wasm.js";
import type { EngineOptions } from "./config";
import type { TraceRequest, TraceResultMessage, TraceErrorMessage } from "./protocol";

let ready: Promise<unknown> | null = null;

function ensureReady(): Promise<unknown> {
  if (!ready) ready = init();
  return ready;
}

self.addEventListener("message", (event: MessageEvent<TraceRequest>) => {
  const { id, rgba, width, height, config } = event.data;
  const started = performance.now();
  ensureReady()
    .then(() => {
      const pixels = new Uint8Array(rgba);
      const svg = vectorize_rgba(pixels, width, height, config as EngineOptions);
      const response: TraceResultMessage = {
        id,
        ok: true,
        svg,
        durationMs: performance.now() - started,
      };
      self.postMessage(response);
    })
    .catch((err: unknown) => {
      const response: TraceErrorMessage = {
        id,
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      };
      self.postMessage(response);
    });
});
