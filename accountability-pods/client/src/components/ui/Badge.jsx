import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Badge = forwardRef(
  (
    {
      size = "md",
      variant = "primary",
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap font-[var(--badge-font-weight)]";

    const variantClasses = {
      primary: "bg-primary text-on-primary",
      secondary:
        "bg-secondary-container text-on-secondary-container",
      outline:
        "border border-outline-variant bg-transparent text-primary",
      error: "bg-error-container text-on-error-container",
    };

    const sizeClasses = {
      sm: "h-[var(--badge-height-sm)] px-[var(--badge-padding-x-sm)] text-body-sm",
      md: "h-[var(--badge-height-md)] px-[var(--badge-padding-x-md)] text-body-sm",
      lg: "h-[var(--badge-height-lg)] px-[var(--badge-padding-x-lg)] text-body-lg",
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          "rounded-[var(--badge-radius)]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;