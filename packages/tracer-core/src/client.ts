import { sanitizeConfig, toEngineOptions, type TraceConfig } from "./config";
import type { TraceRequest, TraceResponse } from "./protocol";

export interface TraceStats {
  durationMs: number;
}

export interface TraceOutcome extends TraceStats {
  svg: string;
}

interface PendingJob {
  resolve: (outcome: TraceOutcome) => void;
  reject: (err: Error) => void;
}

export class TracerClient {
  #worker: Worker | null = null;
  #nextId = 1;
  #pending = new Map<number, PendingJob>();

  async trace(image: ImageData, config: Partial<TraceConfig>): Promise<TraceOutcome> {
    const worker = this.#ensureWorker();
    const id = this.#nextId++;
    const buffer = image.data.slice().buffer;
    const request: TraceRequest = {
      id,
      rgba: buffer,
      width: image.width,
      height: image.height,
      config: toEngineOptions(sanitizeConfig(config)),
    };
    return new Promise<TraceOutcome>((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      worker.postMessage(request, [request.rgba]);
    });
  }

  cancelAll(): void {
    if (this.#pending.size === 0) return;
    for (const job of this.#pending.values()) job.reject(new Error("Trace cancelled"));
    this.#pending.clear();
    this.#worker?.terminate();
    this.#worker = null;
  }

  dispose(): void {
    this.cancelAll();
  }

  #ensureWorker(): Worker {
    if (!this.#worker) {
      this.#worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
      this.#worker.addEventListener("message", (event: MessageEvent<TraceResponse>) => {
        const msg = event.data;
        const job = this.#pending.get(msg.id);
        if (!job) return;
        this.#pending.delete(msg.id);
        if (msg.ok) {
          job.resolve({ svg: msg.svg, durationMs: msg.durationMs });
        } else {
          job.reject(new Error(msg.message));
        }
      });
      this.#worker.addEventListener("error", (event) => {
        const err = new Error(event.message || "Worker crashed");
        for (const job of this.#pending.values()) job.reject(err);
        this.#pending.clear();
        this.#worker?.terminate();
        this.#worker = null;
      });
    }
    return this.#worker;
  }
}
