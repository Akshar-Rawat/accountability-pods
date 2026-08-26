import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Avatar = forwardRef(
  (
    {
      src,
      alt = "",
      fallback,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "size-[var(--avatar-size-sm)] text-[var(--avatar-font-size-sm)]",
      md: "size-[var(--avatar-size-md)] text-[var(--avatar-font-size-md)]",
      lg: "size-[var(--avatar-size-lg)] text-[var(--avatar-font-size-lg)]",
    };

    const baseClasses =
      "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--avatar-radius)] bg-surface-container-high text-on-surface font-medium";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden={!fallback}>
            {fallback}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;