import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-headline-xl",
        "text-headline-lg",
        "text-headline-lg-mobile",
        "text-headline-md",
        "text-body-lg",
        "text-body-sm",
        "text-label-caps",
      ],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}