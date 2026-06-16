import type { Deal } from "./types";

/**
 * Affiliate link handling. The Amazon Associates tag is read from env so it's
 * never hard-coded and can differ per environment (e.g. Amazon India tag for
 * the India route). If no tag is set, links are returned unchanged.
 *
 * The tag is read lazily (per call) rather than captured at module load, so
 * it always reflects the current environment and is trivial to test.
 */
function amazonTag(): string {
  return process.env.NEXT_PUBLIC_AMAZON_TAG ?? "";
}

/** Append/replace the Amazon affiliate tag on an Amazon URL. */
export function withAmazonTag(url: string): string {
  const tag = amazonTag();
  if (!tag) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)amazon\.[a-z.]+$/i.test(u.hostname)) return url;
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Resolve the best outbound link for a deal and apply affiliate tagging.
 * Prefers a direct product URL (Amazon) over the deal-thread URL.
 */
export function outboundLink(deal: Deal): string {
  const target = deal.productUrl ?? deal.url;
  return withAmazonTag(target);
}

/** Whether this deal monetizes via our Amazon affiliate tag. */
export function isAffiliateLink(deal: Deal): boolean {
  if (!amazonTag()) return false;
  const target = deal.productUrl ?? deal.url;
  return /amazon\./i.test(target);
}

/**
 * Whether we have a direct link to the product page (vs only a deal-thread
 * link on Slickdeals/Reddit). Drives an honest CTA label so users aren't
 * surprised to land on a forum page.
 */
export function hasDirectProductLink(deal: Deal): boolean {
  return Boolean(deal.productUrl);
}

/** Honest call-to-action label based on where the link actually goes. */
export function ctaLabel(deal: Deal): string {
  if (deal.productUrl && /amazon\./i.test(deal.productUrl)) {
    return "Get deal on Amazon";
  }
  if (deal.productUrl && deal.store) {
    return `Get deal at ${deal.store}`;
  }
  // Falls back to the deal thread — say so, don't pretend it's the product.
  return "See full deal details";
}
