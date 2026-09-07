/**
 * The TraceKit app icon — the same mark used for the desktop app icon and
 * the README (apps/web/src-tauri/app-icon.svg). Rendered as an inline SVG so
 * it stays crisp at any size and needs no asset request. Sizing is controlled
 * by the caller via className (e.g. "size-7").
 */
export function AppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={className}
      role="img"
      aria-label="TraceKit"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tk-icon-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="tk-icon-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1024" height="1024" rx="232" fill="url(#tk-icon-bg)" />
      <rect width="1024" height="1024" rx="232" fill="url(#tk-icon-sheen)" />

      <g opacity="0.25" fill="#ffffff">
        <circle cx="238" cy="700" r="14" />
        <circle cx="330" cy="762" r="14" />
        <circle cx="430" cy="806" r="14" />
        <circle cx="540" cy="820" r="14" />
        <circle cx="650" cy="794" r="14" />
        <circle cx="742" cy="724" r="14" />
      </g>

      <path
        d="M 180 660 C 320 300, 520 240, 588 400 C 656 560, 500 620, 452 480 C 404 340, 640 260, 844 352"
        fill="none"
        stroke="#ffffff"
        strokeWidth="52"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g fill="#ffffff" stroke="#4f46e5" strokeWidth="12">
        <rect x="140" y="620" width="80" height="80" rx="18" />
        <rect x="548" y="360" width="80" height="80" rx="18" />
        <rect x="412" y="440" width="80" height="80" rx="18" />
        <rect x="804" y="312" width="80" height="80" rx="18" />
      </g>
    </svg>
  );
}
