import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  const goToPage = (nextPage) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    onPageChange?.(nextPage);
  };

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  };

  if (totalPages <= 1) {
    return null;
  }

  const buttonClasses =
    "flex size-9 items-center justify-center rounded-[var(--radius)] text-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-center gap-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className={cn(
          buttonClasses,
          "text-on-surface-variant hover:bg-surface-container",
        )}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {getPages().map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="flex size-9 items-center justify-center text-body-sm text-on-surface-variant"
            >
              ...
            </span>
          );
        }

        const isActive = item === page;

        return (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => goToPage(item)}
            className={cn(
              buttonClasses,
              isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface hover:bg-surface-container",
            )}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className={cn(
          buttonClasses,
          "text-on-surface-variant hover:bg-surface-container",
        )}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;