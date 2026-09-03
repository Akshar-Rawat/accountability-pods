import { forwardRef, useId, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const Checkbox = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      checked,
      defaultChecked = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id || props.name || generatedId;
    const descriptionId = `${checkboxId}-desc`;

    const [internalChecked, setInternalChecked] =
      useState(defaultChecked);

    const isControlled = checked !== undefined;
    const isChecked = isControlled
      ? checked
      : internalChecked;

    const handleChange = (event) => {
      if (!isControlled) {
        setInternalChecked(event.target.checked);
      }

      onChange?.(event);
    };

    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={
                error || helperText
                  ? descriptionId
                  : undefined
              }
              className="sr-only"
              {...props}
            />

            <label
              htmlFor={checkboxId}
              className={cn(
                "flex size-4 cursor-pointer items-center justify-center rounded border bg-surface-container-lowest",
                "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-outline",
                "peer-disabled:cursor-not-allowed",
                isChecked
                  ? "border-primary bg-primary"
                  : "border-outline-variant",
                error && "border-error",
                className,
              )}
            >
              {isChecked && (
                <Check
                  size={12}
                  strokeWidth={3}
                  className="text-on-primary"
                  aria-hidden="true"
                />
              )}
            </label>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className="cursor-pointer text-body-sm text-on-surface"
            >
              {label}
            </label>
          )}
        </div>

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

Checkbox.displayName = "Checkbox";

export default Checkbox;