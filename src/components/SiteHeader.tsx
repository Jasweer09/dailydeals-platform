import Link from "next/link";
import { Suspense } from "react";
import { CategoryNav } from "./CategoryNav";
import { SearchBar } from "./SearchBar";

/** Shared site header: brand, search, and category navigation. */
export function SiteHeader({ activeCategory }: { activeCategory?: string }) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Daily<span className="text-blue-600">Deals</span>
          </Link>
          {/* SearchBar uses useSearchParams, which must be in Suspense. */}
          <Suspense fallback={<div className="h-10 w-full max-w-xl" />}>
            <SearchBar />
          </Suspense>
        </div>
        <CategoryNav active={activeCategory} />
      </div>
    </header>
  );
}
