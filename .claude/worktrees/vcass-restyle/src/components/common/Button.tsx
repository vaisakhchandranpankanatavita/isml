import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'on-image'
  | 'red';
type ButtonSize = 'sm' | 'md';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show the circular arrow chip. Defaults to on for links, off for buttons. */
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}

type AsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button';
    to?: undefined;
  };

type AsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | 'href'> & {
    as: 'a';
    /** Internal route, or an absolute URL (rendered as a plain <a>). */
    to: string;
  };

type ButtonProps = AsButton | AsLink;

/**
 * The VCASS pill button.
 *
 * All of the motion lives in CSS (`.vc-btn` in index.css): the pill fill
 * swells on a bounce curve, the label rolls up to a copy of itself, and the
 * arrow slides through its chip. This component only renders the markup
 * those rules expect.
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'primary', size = 'md', icon, children, className } = props;
  const showIcon = icon ?? props.as === 'a';

  const classes = clsx(
    'vc-btn',
    `vc-btn--${variant}`,
    size === 'sm' && 'vc-btn--sm',
    !showIcon && 'vc-btn--no-icon',
    className,
  );

  const inner = (
    <>
      <span className="vc-btn__text">
        <span>{children}</span>
      </span>
      {showIcon && (
        <span aria-hidden className="vc-btn__icon">
          <span className="vc-btn__glyph" />
        </span>
      )}
    </>
  );

  if (props.as === 'a') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _as, to, variant: _v, size: _s, icon: _i, children: _c, className: _cn, ...rest } = props;
    if (/^(https?:|mailto:|tel:)/.test(to)) {
      return (
        <a href={to} className={classes} {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _as, to: _to, variant: _v, size: _s, icon: _i, children: _c, className: _cn, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
};
