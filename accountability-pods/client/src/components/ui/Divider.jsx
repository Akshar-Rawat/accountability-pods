import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Divider = forwardRef(
  (
    {
      orientation = "horizontal",
      className,
      ...props
    },
    ref,
  ) => {
    const orientationClasses = {
      horizontal:
        "h-[var(--divider-thickness)] w-full",

      vertical:
        "h-full w-[var(--divider-thickness)]",
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-[var(--divider-color)]",
          orientationClasses[orientation],
          className,
        )}
        {...props}
      />
    );
  },
);

Divider.displayName = "Divider";

export default Divider;