import type { MetadataRoute } from "next";
import { loadAllDeals } from "@/lib/deals";
import { CATEGORIES } from "@/lib/types";

export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dailydeals-platform.vercel.app";
  
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

  // Load deals with error handling
  try {
    const deals = await loadAllDeals();
    
    // Individual deal pages
    for (const deal of deals) {
      routes.push({
        url: `${baseUrl}/deal/${deal.id}`,
        lastModified: deal.fetchedAt ? new Date(deal.fetchedAt) : new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Sitemap: Failed to load deals", error);
    // Return routes with just homepage and categories if deals fail
  }

  return routes;
}
