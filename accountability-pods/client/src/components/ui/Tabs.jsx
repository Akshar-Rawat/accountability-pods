import { useId } from "react";
import { cn } from "../../lib/utils";

const Tabs = ({
  tabs = [],
  value,
  defaultValue,
  onChange,
  className,
}) => {
  const tabsId = useId();

  const activeValue =
    value ?? defaultValue ?? tabs[0]?.value;

  const handleChange = (tab) => {
    if (tab.disabled) return;

    onChange?.(tab.value);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-1 border-b border-outline-variant"
      >
        {tabs.map((tab) => {
          const isActive = activeValue === tab.value;
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              id={`${tabsId}-${tab.value}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabsId}-panel-${tab.value}`}
              disabled={tab.disabled}
              onClick={() => handleChange(tab)}
              className={cn(
                "relative inline-flex items-center justify-center gap-2",
                "px-4 py-3",
                "text-body-sm font-medium",
                "transition-colors",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-[-2px]",
                "focus-visible:outline-outline",
                "disabled:cursor-not-allowed disabled:opacity-50",

                isActive
                  ? "text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface",

                isActive &&
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary",
              )}
            >
              {Icon && (
                <Icon
                  size={16}
                  aria-hidden="true"
                />
              )}

              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;