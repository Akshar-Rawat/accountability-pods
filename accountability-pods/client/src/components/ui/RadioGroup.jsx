import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const RadioGroup = forwardRef(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      name,
      label,
      error,
      helperText,
      className,
      disabled = false,
    },
    ref,
  ) => {
    const generatedName = useId();
    const radioName = name || generatedName;

    return (
      <div className={cn("flex flex-col", className)}>
        {label && (
          <p className="mb-2 text-body-sm font-medium text-on-surface">
            {label}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {options.map((option, index) => {
            const optionId = `${radioName}-${index}`;

            return (
              <div
                key={option.value}
                className="flex items-center gap-2"
              >
                <input
                  ref={index === 0 ? ref : undefined}
                  id={optionId}
                  type="radio"
                  name={radioName}
                  value={option.value}
                  checked={
                    value !== undefined
                      ? value === option.value
                      : undefined
                  }
                  defaultChecked={
                    defaultValue === option.value
                  }
                  onChange={onChange}
                  disabled={disabled || option.disabled}
                  className={cn(
                    "size-4 cursor-pointer appearance-none rounded-full border border-outline-variant bg-surface-container-lowest",
                    "checked:border-primary checked:bg-primary",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-error",
                  )}
                />

                <label
                  htmlFor={optionId}
                  className={cn(
                    "cursor-pointer text-body-sm text-on-surface",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>

        {(error || helperText) && (
          <span
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

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;