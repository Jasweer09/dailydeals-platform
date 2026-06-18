import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealCard } from "@/components/DealCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getDealsByCategory } from "@/lib/deals";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/types";

export const revalidate = 300;

/** Pre-render a page for every known category. */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const label = CATEGORY_LABELS[category];
  const title = `${label} deals`;
  const description = `The cheapest ${label.toLowerCase()} deals in the US right now, updated all day.`;
  
  return {
    title,
    description,
    keywords: [
      `${label.toLowerCase()} deals`,
      `cheap ${label.toLowerCase()}`,
      `${label.toLowerCase()} discounts`,
      `${label.toLowerCase()} sales`,
      `best ${label.toLowerCase()} deals`,
    ],
    openGraph: {
      type: "website",
      url: `https://dailydeals-platform.vercel.app/category/${category}`,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const deals = await getDealsByCategory(category);
  const label = CATEGORY_LABELS[category];

  return (
    <>
      <SiteHeader activeCategory={category} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">{label} deals</h1>
        <p className="mb-6 text-sm text-gray-500">
          {deals.length} deal{deals.length === 1 ? "" : "s"} right now.
        </p>

        {deals.length === 0 ? (
          <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700">
            No deals in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
