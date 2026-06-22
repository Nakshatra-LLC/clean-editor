import type { ReactNode } from "react";

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconText = (): ReactNode => (
  <svg {...base}><path d="M4 7V5h16v2M9 19h6M12 5v14" /></svg>
);
export const IconH1 = (): ReactNode => (
  <svg {...base}><path d="M4 6v12M12 6v12M4 12h8M17 18v-7l-2 1.5" /></svg>
);
export const IconH2 = (): ReactNode => (
  <svg {...base}><path d="M4 6v12M12 6v12M4 12h8M16 18c0-2 4-3 4-5a2 2 0 0 0-4 0" /></svg>
);
export const IconH3 = (): ReactNode => (
  <svg {...base}><path d="M4 6v12M12 6v12M4 12h8M16 10a2 2 0 1 1 2 3 2 2 0 1 1-2 3" /></svg>
);
export const IconBullet = (): ReactNode => (
  <svg {...base}><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
);
export const IconOrdered = (): ReactNode => (
  <svg {...base}><path d="M10 6h10M10 12h10M10 18h10M4 6h1v4M4 10h2M4 16h2v2H4" /></svg>
);
export const IconTask = (): ReactNode => (
  <svg {...base}><path d="M10 6h10M10 12h10M10 18h10M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11" /></svg>
);
export const IconQuote = (): ReactNode => (
  <svg {...base}><path d="M7 7H5v5h4V9M17 7h-2v5h4V9" /></svg>
);
export const IconCode = (): ReactNode => (
  <svg {...base}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /></svg>
);
export const IconDivider = (): ReactNode => (
  <svg {...base}><path d="M4 12h16" /></svg>
);
export const IconSparkle = (): ReactNode => (
  <svg {...base}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /></svg>
);
