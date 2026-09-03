import { cn } from "../../lib/utils";

const Progress = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = "md",
  className,
}) => {
  const safeMax = max > 0 ? max : 100;

  const percentage = Math.min(
    Math.max((value / safeMax) * 100, 0),
    100,
  );

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-4">
          {label && (
            <span className="text-body-sm font-medium text-on-surface">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-body-sm text-on-surface-variant">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={value}
        aria-label={label || "Progress"}
        className={cn(
          "w-full overflow-hidden rounded-full",
          "bg-surface-container-high",
          sizeClasses[size] || sizeClasses.md,
        )}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            background: "var(--progress-gradient)",
          }}
        />
      </div>
    </div>
  );
};

export default Progress;