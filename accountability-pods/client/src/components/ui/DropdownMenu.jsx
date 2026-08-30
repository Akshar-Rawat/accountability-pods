import React, {
  forwardRef,
  useEffect,
  useRef,
} from "react";

import { cn } from "../../lib/utils";

const DropdownMenu = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative inline-block",
        className,
      )}
    >
      {children}
    </div>
  );
};

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = forwardRef(
  (
    {
      children,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "rounded-[var(--radius-lg)]",
          "text-body-sm font-medium text-on-surface",
          "transition-colors",
          "hover:bg-surface-container-low",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-2",
          "focus-visible:outline-outline",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({
  children,
  open,
  className,
  align = "end",
  onClose,
}) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      role="menu"
      className={cn(
        
        "absolute z-50 top-full mt-2",
        "w-40",
        "overflow-hidden",
        "rounded-[var(--radius-lg)]",
        "border border-outline-variant",
        "bg-surface-container-lowest",
        "p-1",
        "shadow-lg",
        align === "end"
          ? "right-0"
          : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef(
  (
    {
      children,
      icon: Icon,
      disabled = false,
      danger = false,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3",
          "rounded-[var(--radius)]",
          "px-3 py-2.5",
          "text-left text-body-sm",
          "transition-colors",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-[-2px]",
          "focus-visible:outline-outline",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          danger
            ? "text-error hover:bg-error-container"
            : "text-on-surface hover:bg-surface-container-low",
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="shrink-0"
          />
        )}

        <span>{children}</span>
      </button>
    );
  },
);

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = ({
  className,
}) => {
  return (
    <div
      role="separator"
      className={cn(
        "my-1 h-px bg-outline-variant",
        className,
      )}
    />
  );
};

DropdownMenuSeparator.displayName =
  "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

export default DropdownMenu;