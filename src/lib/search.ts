import type { Category, Deal } from "./types";

export interface DealFilter {
  /** Free-text query matched against title and store. */
  query?: string;
  /** Restrict to a single category. */
  category?: Category;
  /** Only deals at or below this price. */
  maxPrice?: number;
  /** Only deals with at least this percent off. */
  minPercentOff?: number;
}

/** Hotness used for default ordering (mirrors the fetcher's ranking idea). */
function hotness(d: Deal): number {
  return (d.sourceScore ?? 0) * 2 + (d.percentOff ?? 0);
}

/**
 * Filter and sort deals. Pure function (no I/O) so it's trivially testable and
 * can run on the server or client. Results are sorted hottest-first.
 */
export function filterDeals(deals: Deal[], filter: DealFilter = {}): Deal[] {
  const q = filter.query?.trim().toLowerCase();

  const filtered = deals.filter((d) => {
    if (filter.category && d.category !== filter.category) return false;
    if (filter.maxPrice !== undefined && (d.price ?? Infinity) > filter.maxPrice) {
      return false;
    }
    if (
      filter.minPercentOff !== undefined &&
      (d.percentOff ?? 0) < filter.minPercentOff
    ) {
      return false;
    }
    if (q) {
      const haystack =
        `${d.displayTitle ?? ""} ${d.title} ${d.store ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => hotness(b) - hotness(a));
}
