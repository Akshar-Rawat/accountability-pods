import React, { forwardRef } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Toast = forwardRef(
  (
    {
      variant = "info",
      title,
      message,
      onClose,
      className,
    },
    ref,
  ) => {
    const variantClasses = {
      success: {
        container: "border-primary bg-surface-container-lowest",
        icon: "text-primary",
      },

      error: {
        container: "border-error bg-error-container",
        icon: "text-error",
      },

      warning: {
        container:
          "border-secondary bg-secondary-container",
        icon: "text-on-secondary-container",
      },

      info: {
        container:
          "border-outline-variant bg-surface-container-lowest",
        icon: "text-primary",
      },
    };

    const icons = {
      success: CheckCircle2,
      error: CircleAlert,
      warning: TriangleAlert,
      info: Info,
    };

    const Icon = icons[variant] || Info;
    const styles =
      variantClasses[variant] || variantClasses.info;

    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        aria-live={variant === "error" ? "assertive" : "polite"}
        className={cn(
          "flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
          styles.container,
          className,
        )}
      >
        <Icon
          size={20}
          className={cn("mt-0.5 shrink-0", styles.icon)}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-body-sm font-medium text-on-surface">
              {title}
            </p>
          )}

          {message && (
            <p
              className={cn(
                "text-body-sm text-on-surface-variant",
                title && "mt-1",
              )}
            >
              {message}
            </p>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              "text-on-surface-variant",
              "transition-colors",
              "hover:bg-surface-container",
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

Toast.displayName = "Toast";

export default Toast;