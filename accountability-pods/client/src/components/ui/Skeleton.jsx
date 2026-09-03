import { cn } from "../../lib/utils";

const Skeleton = ({
  className,
  variant = "default",
}) => {
  const variantClasses = {
    default: "rounded-[var(--radius)]",
    circle: "rounded-full",
    rounded: "rounded-[var(--radius-lg)]",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-surface-container-high",
        variantClasses[variant] || variantClasses.default,
        className,
      )}
    />
  );
};

export default Skeleton;