import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

/** Horizontal category navigation. `active` highlights the current category. */
export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Deal categories">
      <Link
        href="/"
        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
          !active
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/category/${cat}`}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            active === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </nav>
  );
}
