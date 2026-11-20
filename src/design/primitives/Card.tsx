// v0.47 F — Design primitive: neutral card container.
//
// A single card style used by dashboard tiles, empty states,
// and chapter overview blocks. Composes ELEVATION.card + RADIUS.xl.

import type { ReactNode } from 'react';
import { ELEVATION, RADIUS } from '../tokens';

export function Card({
  children,
  className = '',
  as: Tag = 'section',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
  padded?: boolean;
}) {
  return (
    <Tag
      className={`bg-white ring-1 ring-slate-200 ${RADIUS.xl} ${ELEVATION.card} ${
        padded ? 'p-3.5 sm:p-5 md:p-6' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
