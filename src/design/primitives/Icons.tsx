// v0.47 F — SVG icon set.
//
// Single-file library so the app has one visual language rather than
// mixing emoji + arbitrary SVGs from components. Each icon is a
// stateless 24x24 SVG that inherits currentColor. Chapter artwork
// lives in ChapterArt.tsx separately.

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function HomeIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function BookIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 4h9a3 3 0 0 1 3 3v13" />
      <path d="M4 4v13a3 3 0 0 0 3 3h9" />
      <path d="M8 8h5M8 12h5" />
    </svg>
  );
}

export function DumbbellIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 8v8M4 10v4M10 6v12M14 6v12M18 10v4M20 8v8" />
    </svg>
  );
}

export function TrendingUpIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 17 9 11l4 4L21 7" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </svg>
  );
}

export function CogIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M15 5a3 3 0 1 1 0 6" />
      <path d="M17 21c0-2.5 1.6-4.6 4-5.4" />
    </svg>
  );
}

export function ClipboardIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 14h4" />
    </svg>
  );
}

export function ChartIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 20V6M10 20v-8M16 20v-4M22 20H2" />
    </svg>
  );
}

export function FolderIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </svg>
  );
}
