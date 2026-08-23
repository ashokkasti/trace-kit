#!/usr/bin/env bash
# Rebuilds the vendored web-target wasm bindings from the visioncortex/vtracer repo.
# Requires: cargo + rustup target wasm32-unknown-unknown (wasm-pack installs it on demand).
set -euo pipefail

REPO="${VTRACER_REPO:-https://github.com/visioncortex/vtracer.git}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/src/wasm"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

command -v wasm-pack >/dev/null || { echo "wasm-pack missing. Install: cargo install wasm-pack"; exit 1; }

git clone --depth 1 "$REPO" "$WORK_DIR/vtracer"
cd "$WORK_DIR/vtracer/nodejs"

wasm-pack build --release --target web --out-dir "$WORK_DIR/pkg-web"

mkdir -p "$OUT_DIR"
cp "$WORK_DIR/pkg-web/vtracer_wasm.js" \
   "$WORK_DIR/pkg-web/vtracer_wasm.d.ts" \
   "$WORK_DIR/pkg-web/vtracer_wasm_bg.wasm" \
   "$WORK_DIR/pkg-web/vtracer_wasm_bg.wasm.d.ts" \
   "$OUT_DIR/"

echo "vendored wasm bindings -> $OUT_DIR"
ls -la "$OUT_DIR"
