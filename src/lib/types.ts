/**
 * Deal data model for the platform. This mirrors the shape produced by the
 * fetcher project (../../fetcher) so the two stay compatible. Keep these in
 * sync; the fetcher is the source of truth for the schema.
 */

export const CATEGORIES = [
  "food",
  "clothing",
  "essentials",
  "gadgets",
  "household",
  "vehicle",
  "baby-pet",
  "health",
  "subscriptions",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Human-friendly labels for each category (used in navigation and headings). */
export const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food & Groceries",
  clothing: "Clothing & Shoes",
  essentials: "Essentials",
  gadgets: "Gadgets & Electronics",
  household: "Home & Household",
  vehicle: "Vehicle",
  "baby-pet": "Baby & Pet",
  health: "Health & Personal Care",
  subscriptions: "Subscriptions & Digital",
  other: "More Deals",
};

export interface Deal {
  id: string;
  title: string;
  /** Cleaned, user-friendly title for display. Falls back to title if absent. */
  displayTitle?: string;
  url: string;
  productUrl?: string;
  price?: number;
  originalPrice?: number;
  percentOff?: number;
  couponCode?: string;
  store?: string;
  asin?: string;
  category: Category;
  source: "slickdeals" | "reddit";
  sourceScore?: number;
  imageUrl?: string;
  postedAt?: string;
  fetchedAt: string;
}

/** The best human-readable title to display (clean if available). */
export function dealTitle(deal: Deal): string {
  return deal.displayTitle?.trim() || deal.title;
}

/** Type guard used when loading untrusted JSON from disk/DB. */
export function isDeal(value: unknown): value is Deal {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.url === "string" &&
    typeof v.category === "string" &&
    typeof v.fetchedAt === "string"
  );
}
