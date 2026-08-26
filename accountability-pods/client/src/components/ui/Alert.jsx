import React, { forwardRef } from "react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Alert = forwardRef(
  (
    {
      variant = "info",
      title,
      children,
      onClose,
      className,
    },
    ref,
  ) => {
    const variants = {
      success: {
        container:
          "border-primary bg-primary-fixed text-on-primary-fixed",
        icon: CircleCheck,
      },

      error: {
        container:
          "border-error bg-error-container text-on-error-container",
        icon: CircleAlert,
      },

      warning: {
        container:
          "border-secondary bg-secondary-container text-on-secondary-container",
        icon: TriangleAlert,
      },

      info: {
        container:
          "border-outline-variant bg-surface-container-low text-on-surface",
        icon: Info,
      },
    };

    const currentVariant =
      variants[variant] || variants.info;

    const Icon = currentVariant.icon;

    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        aria-live={variant === "error" ? "assertive" : "polite"}
        className={cn(
          "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border p-4",
          currentVariant.container,
          className,
        )}
      >
        <Icon
          size={20}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-body-sm font-medium">
              {title}
            </p>
          )}

          {children && (
            <div
              className={cn(
                "text-body-sm",
                title && "mt-1",
              )}
            >
              {children}
            </div>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alert"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              "transition-colors",
              "hover:bg-black/10",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-outline",
            )}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export default Alert;