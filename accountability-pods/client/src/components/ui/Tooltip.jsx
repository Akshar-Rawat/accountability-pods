import React, { useId } from "react";
import { cn } from "../../lib/utils";

const Tooltip = ({
  content,
  children,
  side = "top",
  className,
}) => {
  const tooltipId = useId();

  const sideClasses = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div className="group relative inline-flex">
      <span
        aria-describedby={tooltipId}
        tabIndex={0}
        className="inline-flex focus:outline-none"
      >
        {children}
      </span>

      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap",
          "rounded-[var(--radius)]",
          "bg-inverse-surface text-inverse-on-surface",
          "px-2 py-1",
          "text-label-caps",
          "opacity-0 transition-opacity duration-150",
          "group-hover:opacity-100",
          "group-focus-within:opacity-100",
          sideClasses[side] || sideClasses.top,
          className,
        )}
      >
        {content}
      </span>
      
    </div>
  );
};

export default Tooltip;