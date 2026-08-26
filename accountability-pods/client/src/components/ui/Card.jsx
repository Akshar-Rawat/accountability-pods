import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Card = forwardRef(
  (
    {
      children,
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default:
        "bg-surface-container-lowest border border-outline-variant",

      elevated:
        "bg-surface-container-lowest shadow-md",

      outlined:
        "bg-transparent border border-outline-variant",

      muted:
        "bg-surface-container-low",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-[var(--card-radius)]",
          variantClasses[variant] || variantClasses.default,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";


const CardHeader = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        "p-[var(--card-padding)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardHeader.displayName = "CardHeader";


const CardTitle = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        "text-headline-md text-on-surface",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

CardTitle.displayName = "CardTitle";


const CardDescription = ({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn(
        "text-body-sm text-on-surface-variant",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

CardDescription.displayName = "CardDescription";


const CardContent = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "px-[var(--card-padding)] pb-[var(--card-padding)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardContent.displayName = "CardContent";


const CardFooter = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "border-t border-outline-variant",
        "px-[var(--card-padding)] py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = "CardFooter";


const CardAction = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "ml-auto shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardAction.displayName = "CardAction";


export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
};

export default Card;