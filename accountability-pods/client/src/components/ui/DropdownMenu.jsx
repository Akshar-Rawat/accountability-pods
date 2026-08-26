import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";

const DropdownMenu = ({
  trigger,
  items = [],
  onSelect,
  align = "left",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleItemClick = (item) => {
    if (item.disabled) return;

    onSelect?.(item.value, item);

    item.onClick?.();

    setOpen(false);
  };

  const alignClasses = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-block", className)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
      >
        {trigger}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute z-50 mt-2 min-w-48 overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border border-outline-variant",
            "bg-surface-container-lowest",
            "p-1 shadow-lg",
            alignClasses[align] || alignClasses.left,
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[var(--radius)] px-3 py-2",
                  "text-left text-body-sm",
                  "transition-colors",
                  "focus-visible:outline-2",
                  "focus-visible:outline-offset-[-2px]",
                  "focus-visible:outline-outline",
                  "disabled:cursor-not-allowed disabled:opacity-50",

                  item.danger
                    ? "text-error hover:bg-error-container"
                    : "text-on-surface hover:bg-surface-container",
                )}
              >
                {Icon && (
                  <Icon
                    size={16}
                    aria-hidden="true"
                  />
                )}

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;