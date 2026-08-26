import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Select = forwardRef(
  (
    {
      size = "md",
      label,
      error,
      helperText,
      className,
      id,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || props.name || generatedId;
    const descriptionId = `${selectId}-desc`;

    const sizeClasses = {
      sm: "h-9 px-3 text-body-sm",
      md: "h-10 px-4 text-body-sm",
      lg: "h-12 px-4 text-body-lg",
    };

    return (
      <div className="flex w-full flex-col">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 text-body-sm font-medium text-on-surface"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={
            error || helperText ? descriptionId : undefined
          }
          className={cn(
            "w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            error && "border-error focus-visible:outline-error",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        {(error || helperText) && (
          <span
            id={descriptionId}
            className={cn(
              "mt-1.5 text-body-sm",
              error
                ? "text-error"
                : "text-on-surface-variant",
            )}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;