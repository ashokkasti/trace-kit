const encoder = new TextEncoder();

export interface SvgStats {
  byteSize: number;
  pathCount: number;
  nodeCount: number;
}

const COMMAND_RE = /[mlhvqcsta]/gi;

export function computeSvgStats(svg: string): SvgStats {
  let nodeCount = 0;
  for (const d of svg.match(/\sd="[^"]*"/g) ?? []) {
    nodeCount += (d.match(COMMAND_RE) ?? []).length;
  }
  return {
    byteSize: encoder.encode(svg).length,
    pathCount: (svg.match(/<path/g) ?? []).length,
    nodeCount,
  };
}

export function stripGeneratorComment(svg: string): string {
  return svg.replace(/<!--[\s\S]*?-->\s*/, "");
}
