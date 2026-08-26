import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const Accordion = ({
  items = [],
  defaultValue = null,
  value,
  onChange,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const accordionId = useId();

  const activeValue =
    value !== undefined ? value : internalValue;

  const handleToggle = (item) => {
    if (item.disabled) return;

    const nextValue =
      activeValue === item.value ? null : item.value;

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)]",
        "border border-outline-variant",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = activeValue === item.value;

        const triggerId = `${accordionId}-trigger-${index}`;
        const panelId = `${accordionId}-panel-${index}`;

        return (
          <div
            key={item.value}
            className={cn(
              index !== items.length - 1 &&
                "border-b border-outline-variant",
            )}
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => handleToggle(item)}
              className={cn(
                "flex w-full items-center justify-between gap-4",
                "px-4 py-4 text-left",
                "text-body-sm font-medium text-on-surface",
                "transition-colors",
                "hover:bg-surface-container-low",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-[-2px]",
                "focus-visible:outline-outline",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <item.icon
                    size={18}
                    aria-hidden="true"
                  />
                )}

                {item.title}
              </span>

              <ChevronDown
                size={18}
                aria-hidden="true"
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="px-4 pb-4 text-body-sm text-on-surface-variant"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;