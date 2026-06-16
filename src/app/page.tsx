import { DealCard } from "@/components/DealCard";
import { SiteHeader } from "@/components/SiteHeader";
import { loadAllDeals } from "@/lib/deals";
import { filterDeals } from "@/lib/search";

// Deals change throughout the day; revalidate the static page every 5 minutes.
export const revalidate = 300;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const all = await loadAllDeals();
  const deals = filterDeals(all, { query: q });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">
          {q ? `Results for “${q}”` : "Today's best daily-essentials deals"}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {deals.length} deal{deals.length === 1 ? "" : "s"} on things you buy
          every day.
        </p>

        {deals.length === 0 ? (
          <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700">
            No deals yet. Run the fetcher to populate deals.
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
