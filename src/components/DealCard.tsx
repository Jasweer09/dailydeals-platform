import Link from "next/link";
import { ctaLabel, outboundLink } from "@/lib/affiliate";
import { CATEGORY_LABELS, dealTitle, type Deal } from "@/lib/types";
import { DealImage } from "./DealImage";

function formatPrice(value?: number): string {
  if (value === undefined) return "";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/** A single deal card. Links to the SEO detail page; the buy button is the
 * affiliate outbound link. */
export function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Product image — uses a plain <img> since sources are external CDNs.
          object-contain keeps the whole product visible. */}
      <Link href={`/deal/${deal.id}`} className="block bg-white p-2 dark:bg-gray-950">
        <DealImage
          src={deal.imageUrl}
          alt={dealTitle(deal)}
          className="mx-auto h-40 w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {CATEGORY_LABELS[deal.category]}
          </span>
          {deal.percentOff !== undefined && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
              {deal.percentOff}% off
            </span>
          )}
        </div>

        <Link
          href={`/deal/${deal.id}`}
          className="line-clamp-2 text-sm font-semibold text-gray-900 hover:underline dark:text-gray-100"
        >
          {dealTitle(deal)}
        </Link>

        <div className="mt-3 flex items-end gap-2">
          {deal.price !== undefined && (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(deal.price)}
            </span>
          )}
          {deal.originalPrice !== undefined &&
            deal.originalPrice > (deal.price ?? 0) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(deal.originalPrice)}
              </span>
            )}
        </div>
        {deal.store && (
          <span className="mt-0.5 text-xs text-gray-500">at {deal.store}</span>
        )}

        {deal.couponCode && (
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Use code{" "}
            <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
              {deal.couponCode}
            </span>{" "}
            at checkout
          </p>
        )}

        <a
          href={outboundLink(deal)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="mt-3 inline-block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {ctaLabel(deal)}
        </a>
      </div>
    </article>
  );
}
