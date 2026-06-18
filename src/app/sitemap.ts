import type { MetadataRoute } from "next";
import { loadAllDeals, getCategoryCounts } from "@/lib/deals";
import { CATEGORIES } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dailydeals-platform.vercel.app";
  const deals = await loadAllDeals();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
  ];

  // Category pages
  for (const category of CATEGORIES) {
    routes.push({
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    });
  }

  // Individual deal pages
  for (const deal of deals) {
    routes.push({
      url: `${baseUrl}/deal/${deal.id}`,
      lastModified: deal.fetchedAt ? new Date(deal.fetchedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  return routes;
}
