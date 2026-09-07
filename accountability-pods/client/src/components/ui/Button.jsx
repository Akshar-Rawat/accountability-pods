import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

const Button = forwardRef(
  (
    {
      size = "md",
      variant = "primary",
      children,
      className,
      type = "button",
      onClick,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 cursor-pointer transition-transform duration-150 rounded-[var(--button-radius)] font-[var(--button-font-weight)] focus-visible:outline-[var(--button-focus-ring-width)] focus-visible:outline-offset-[var(--button-focus-ring-offset)] focus-visible:outline-secondary active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50";

    const variantClasses = {
      primary:
        "bg-primary text-on-primary hover:bg-primary-container active:bg-primary-container",

      secondary:
        "bg-surface-container-low text-on-surface hover:bg-surface-container-high active:bg-surface-container-high",

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
        ref={ref}
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
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
