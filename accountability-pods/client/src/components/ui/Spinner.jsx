import React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const Spinner = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "size-[var(--spinner-size-sm)]",
    md: "size-[var(--spinner-size-md)]",
    lg: "size-[var(--spinner-size-lg)]",
  };

  return (
    <LoaderCircle
      aria-label="Loading"
      className={cn(
        "animate-spin text-current",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Spinner;