import { useEffect, useRef, useState } from "react";
import { TracerClient, type TraceOutcome, type TraceConfig } from "@tracekit/tracer-core";

export interface TracerState {
  outcome: TraceOutcome | null;
  tracing: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 250;

export function useTracer(
  imageData: ImageData | null,
  config: TraceConfig,
): TracerState {
  const [state, setState] = useState<TracerState>({
    outcome: null,
    tracing: false,
    error: null,
  });
  const clientRef = useRef<TracerClient | null>(null);
  if (!clientRef.current) clientRef.current = new TracerClient();
  const client = clientRef.current;

  const configKey = JSON.stringify(config);

  useEffect(() => {
    if (!imageData) {
      setState({ outcome: null, tracing: false, error: null });
      return;
    }
    let stale = false;
    setState((s) => ({ ...s, tracing: true, error: null }));
    const timer = setTimeout(() => {
      client.cancelAll();
      client
        .trace(imageData, config)
        .then((outcome) => {
          if (!stale) setState({ outcome, tracing: false, error: null });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          if (!stale && message !== "Trace cancelled") {
            setState({ outcome: null, tracing: false, error: message });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [imageData, configKey, config, client]);

  useEffect(() => () => client.dispose(), [client]);

  return state;
}
