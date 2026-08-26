import React from "react";
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

export const Button = ({
  size = "md",
  variant = "primary",
  children,
  className,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-[var(--button-radius)] font-[var(--button-font-weight)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container active:bg-primary-container",

    secondary:
      "bg-secondary-container text-on-secondary-container hover:bg-secondary active:bg-secondary",

    outline:
      "bg-transparent border border-outline-variant text-primary hover:bg-surface-container-low active:bg-surface-container",

    ghost:
      "bg-transparent text-primary hover:bg-surface-container-low active:bg-surface-container",
  };

  const sizeClasses = {
    sm: "h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] text-body-sm",

    md: "h-[var(--button-height-md)] px-[var(--button-padding-x-md)] text-body-sm",

    lg: "h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] text-body-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        baseClasses,
        variantClasses[variant],

        sizeClasses[size],
        className,
      )}
    >
      {loading && <Spinner  size="sm"/>}
      {children}
    </button>
  );
};

export default Button;
