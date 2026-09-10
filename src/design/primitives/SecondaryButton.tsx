// v0.47 F — Design primitive: secondary CTA button.

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { BUTTON } from '../tokens';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const SecondaryButton = forwardRef<HTMLButtonElement, Props>(
  function SecondaryButton({ children, className = '', ...rest }, ref) {
    return (
      <button
        ref={ref}
        {...rest}
        className={`${BUTTON.secondary} ${className}`}
      >
        {children}
      </button>
    );
  }
);
