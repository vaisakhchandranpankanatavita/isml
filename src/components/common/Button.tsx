import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "dark"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "on-image"
  | "red";
type ButtonSize = "sm" | "md";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show the trailing arrow. Defaults to on for links, off for buttons. */
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}

type AsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
    to?: undefined;
  };

type AsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href"> & {
    as: "a";
    /** Internal route, or an absolute URL (rendered as a plain <a>). */
    to: string;
  };

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: "", // soft lime, the default look
  primary: "rbtn--dark",
  dark: "rbtn--dark",
  secondary: "rbtn--outline",
  outline: "rbtn--outline",
  ghost: "rbtn--ghost",
  "on-image": "rbtn--cream",
  red: "rbtn--signal",
};

/** Soft pill button in the reference's lime, dark and outline variants. */
export const Button: React.FC<AsButton | AsLink> = (props) => {
  const { variant = "primary", size = "md", icon, children, className } = props;
  const showIcon = icon ?? props.as === "a";
  const classes = clsx("rbtn", VARIANT_CLASS[variant], size === "sm" && "rbtn--sm", className);

  const inner = (
    <>
      <span>{children}</span>
      {showIcon && (
        <span aria-hidden className="rbtn__arrow">
          →
        </span>
      )}
    </>
  );

  if (props.as === "a") {
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
