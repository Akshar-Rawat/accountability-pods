import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Switch = forwardRef(
  (
    {
      checked,
      defaultChecked,
      onChange,
      label,
      helperText,
      disabled = false,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => {
            onChange?.(!checked);
          }}
          className={cn(
            "relative mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full",
            "border border-outline-variant",
            "transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline",
            "disabled:cursor-not-allowed disabled:opacity-50",

            checked
              ? "bg-primary"
              : "bg-surface-container-high",
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              "block size-4 rounded-full transition-transform",
              checked
                ? "translate-x-6 bg-on-primary"
                : "translate-x-1 bg-on-surface-variant",
            )}
          />
        </button>

        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  "text-body-sm font-medium text-on-surface",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {label}
              </label>
            )}

            {helperText && (
              <span className="mt-1 text-body-sm text-on-surface-variant">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;