import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Textarea = forwardRef(
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
    const textareaId = id || props.name || generatedId;
    const descriptionId = `${textareaId}-desc`;

    const sizeClasses = {
      sm: "min-h-[80px] px-3 py-2 text-body-sm",
      md: "min-h-[100px] px-4 py-2.5 text-body-sm",
      lg: "min-h-[120px] px-4 py-3 text-body-lg",
    };

    return (
      <div className="flex w-full flex-col">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 text-body-sm font-medium text-on-surface"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={
            error || helperText ? descriptionId : undefined
          }
          className={cn(
            "w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            error && "border-error focus-visible:outline-error",
            className,
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";

export default Textarea;