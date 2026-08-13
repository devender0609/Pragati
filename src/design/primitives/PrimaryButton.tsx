// v0.47 F — Design primitive: primary CTA button.
//
// Wraps the tokens.BUTTON.primary composite. Consumers pass only
// props they care about; the composite class string lives in tokens.

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { BUTTON } from '../tokens';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Renders a leading icon (SVG) before children. */
  leadingIcon?: ReactNode;
  /** Renders a trailing icon (SVG) after children. */
  trailingIcon?: ReactNode;
  /** Full-width on mobile, natural on ≥sm. Handy for hero CTAs. */
  fullWidthOnMobile?: boolean;
};

export const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
  function PrimaryButton(
    { children, className = '', leadingIcon, trailingIcon, fullWidthOnMobile, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        {...rest}
        className={`${BUTTON.primary} ${
          fullWidthOnMobile ? 'w-full sm:w-auto' : ''
        } ${className}`}
      >
        {leadingIcon}
        <span>{children}</span>
        {trailingIcon}
      </button>
    );
  }
);
