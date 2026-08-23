import type { EngineOptions } from "./config";

export interface TraceRequest {
  id: number;
  rgba: ArrayBuffer;
  width: number;
  height: number;
  config: EngineOptions;
}

export interface TraceResultMessage {
  id: number;
  ok: true;
  svg: string;
  durationMs: number;
}

export interface TraceErrorMessage {
  id: number;
  ok: false;
  message: string;
}

export type TraceResponse = TraceResultMessage | TraceErrorMessage;

export class CancelledError extends Error {
  constructor() {
    super("Trace cancelled");
    this.name = "CancelledError";
  }
}
