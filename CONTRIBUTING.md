# Contributing to TraceKit

Thanks for your interest in improving TraceKit!

## Development setup

```sh
pnpm install
pnpm dev          # web app at http://localhost:5173
pnpm test         # unit tests
pnpm lint && pnpm typecheck
```

For desktop (macOS) work you additionally need the Rust toolchain:

```sh
pnpm app:dev      # Tauri window with hot reload
pnpm app:build    # produce .app / .dmg
```

## Guidelines

- Keep PRs focused on one change; open separate PRs for unrelated fixes.
- Add or update unit tests in `packages/tracer-core/tests/` when touching tracing logic.
- Follow existing code style — no comments unless explaining a non-obvious invariant.
- Never add telemetry or network calls: TraceKit must keep working fully offline.

## Rebuilding the WASM engine

The VTracer WebAssembly bindings are vendored in `packages/tracer-core/src/wasm/`.
Only rebuild when bumping the engine version:

```sh
cargo install wasm-pack
pnpm build:wasm
```

## Reporting bugs

Include: OS/app version, input image type, the settings used (screenshot of the panel is fine), and the stats-bar output. For the web build include browser + version.
