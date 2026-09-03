import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  (
    {
      size = "md",
      label,
      error,
      helperText,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;

    const sizeClasses = {
      sm: "h-[var(--input-height-sm)] px-[var(--input-padding-x-sm)]",
      md: "h-[var(--input-height-md)] px-[var(--input-padding-x-md)]",
      lg: "h-[var(--input-height-lg)] px-[var(--input-padding-x-lg)]",
    };

    const descriptionId =
      error || helperText ? `${inputId}-desc` : undefined;

    return (
      <div className="flex w-full flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-[var(--input-label-spacing)] text-body-sm font-medium text-on-surface"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={descriptionId}
          className={cn(
            "w-full border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant rounded-[var(--input-radius)]",
            "focus-visible:outline-[var(--input-focus-ring-width)] focus-visible:outline-offset-[var(--input-focus-ring-offset)] focus-visible:outline-outline",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            error && "border-error focus-visible:outline-error",
            className,
          )}
          {...props}
        />

        {error ? (
          <span
            id={descriptionId}
            className="mt-[var(--input-helper-spacing)] text-body-sm text-error"
          >
            {error}
          </span>
        ) : (
          helperText && (
            <span
              id={descriptionId}
              className="mt-[var(--input-helper-spacing)] text-body-sm text-on-surface-variant"
            >
              {helperText}
            </span>
          )
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;