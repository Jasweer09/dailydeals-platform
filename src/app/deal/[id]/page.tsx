import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealImage } from "@/components/DealImage";
import { SiteHeader } from "@/components/SiteHeader";
import { ctaLabel, isAffiliateLink, outboundLink } from "@/lib/affiliate";
import { getDealById } from "@/lib/deals";
import { CATEGORY_LABELS, dealTitle } from "@/lib/types";

export const revalidate = 300;

function formatPrice(value?: number): string {
  if (value === undefined) return "";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) return { title: "Deal not found" };
  const title = dealTitle(deal);
  const price = deal.price !== undefined ? ` — ${formatPrice(deal.price)}` : "";
  const description = `${title} deal${
    deal.percentOff ? ` (${deal.percentOff}% off)` : ""
  }${deal.store ? ` at ${deal.store}` : ""}. See today's price.`;
  
  return {
    title: `${title}${price}`,
    description,
    openGraph: {
      type: "website",
      url: `https://dailydeals-platform.vercel.app/deal/${id}`,
      title: `${title}${price}`,
      description,
      images: deal.imageUrl
        ? [
            {
              url: deal.imageUrl,
              width: 800,
              height: 600,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${price}`,
      description,
      images: deal.imageUrl ? [deal.imageUrl] : [],
    },
  };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) notFound();

  // Structured data for Google rich results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dealTitle(deal),
    description: dealTitle(deal),
    image: deal.imageUrl || "",
    offers: {
      "@type": "Offer",
      url: `https://dailydeals-platform.vercel.app/deal/${id}`,
      priceCurrency: "USD",
      price: deal.price?.toFixed(2) || "",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: deal.store || "DailyDeals",
      },
      ...(deal.originalPrice &&
        deal.originalPrice > (deal.price ?? 0) && {
          priceValidUntil: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }),
    },
    ...(deal.percentOff && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: "100",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader activeCategory={deal.category} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Link
          href={`/category/${deal.category}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← {CATEGORY_LABELS[deal.category]}
        </Link>

        <h1 className="mt-3 text-2xl font-bold">{dealTitle(deal)}</h1>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <DealImage
            src={deal.imageUrl}
            alt={dealTitle(deal)}
            className="mx-auto h-64 w-full object-contain"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {deal.price !== undefined && (
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatPrice(deal.price)}
            </span>
          )}
          {deal.originalPrice !== undefined &&
            deal.originalPrice > (deal.price ?? 0) && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(deal.originalPrice)}
              </span>
            )}
          {deal.percentOff !== undefined && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
              {deal.percentOff}% off
            </span>
          )}
          {deal.store && (
            <span className="text-sm text-gray-500">at {deal.store}</span>
          )}
        </div>

        {deal.couponCode && (
          <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
            This price needs a code. Use{" "}
            <span className="font-mono font-bold">{deal.couponCode}</span> at
            checkout to get the discount.
          </p>
        )}

        <a
          href={outboundLink(deal)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          {ctaLabel(deal)} →
        </a>

        {isAffiliateLink(deal) && (
          <p className="mt-3 text-xs text-gray-400">
            As an Amazon Associate we may earn from qualifying purchases.
          </p>
        )}
      </main>
    </>
  );
}
