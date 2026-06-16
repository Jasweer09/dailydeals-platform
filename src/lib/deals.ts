import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { type Category, type Deal, isDeal } from "./types";

/**
 * Data layer. The rest of the app depends ONLY on these functions, never on
 * where deals come from. Tries Supabase first, falls back to JSON.
 */

let cache: { deals: Deal[]; loadedAt: number; source: string } | null = null;
const CACHE_TTL_MS = 60_000;

/**
 * Get Supabase client. Requires NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY in env.
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Load deals from Supabase. Returns null if not configured or if fetch fails.
 */
async function loadFromSupabase(): Promise<Deal[] | null> {
  try {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("deals")
      .select("*")
      .order("source_score", { ascending: false })
      .limit(1000);

    if (error) {
      console.warn("Supabase fetch failed:", error.message);
      return null;
    }

    if (!Array.isArray(data)) return null;
    
    // Transform snake_case to camelCase
    const deals = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      displayTitle: row.display_title,
      url: row.url,
      productUrl: row.product_url,
      price: row.price,
      originalPrice: row.original_price,
      percentOff: row.percent_off,
      couponCode: row.coupon_code,
      store: row.store,
      asin: row.asin,
      category: row.category,
      source: row.source,
      sourceScore: row.source_score,
      imageUrl: row.image_url,
      postedAt: row.posted_at,
      fetchedAt: row.fetched_at,
    })).filter(isDeal);
    
    return deals.length > 0 ? deals : null;
  } catch (error) {
    console.warn("Supabase connection failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Path to the fetcher's "all deals" JSON output. Used as fallback.
 */
function jsonDataPath(): string {
  const override = process.env.DEALS_DATA_FILE;
  if (override) return override;
  return resolve(process.cwd(), "..", "fetcher", "data", "latest-all-deals.json");
}

/**
 * Load deals from JSON file (fallback).
 */
async function loadFromJSON(): Promise<Deal[] | null> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ jsonDataPath(), "utf8");
    const parsed = JSON.parse(raw);
    const deals = Array.isArray(parsed) ? parsed.filter(isDeal) : [];
    return deals.length > 0 ? deals : null;
  } catch {
    return null;
  }
}

/** Load and validate all deals (Supabase first, JSON fallback). */
export async function loadAllDeals(): Promise<Deal[]> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache.deals;
  }

  // Try Supabase first
  let deals = await loadFromSupabase();
  let source = "supabase";

  // Fall back to JSON if Supabase unavailable
  if (!deals) {
    deals = await loadFromJSON();
    source = "json";
  }

  // No data yet (neither Supabase nor JSON) — return empty
  if (!deals) {
    deals = [];
    source = "none";
  }

  cache = { deals, loadedAt: Date.now(), source };
  
  if (source === "supabase") {
    console.log(`✓ Loaded ${deals.length} deals from Supabase`);
  } else if (source === "json") {
    console.log(`⚠ Loaded ${deals.length} deals from JSON (Supabase unavailable)`);
  }

  return deals;
}

/** Reset the in-memory cache (used by tests). */
export function clearDealsCache(): void {
  cache = null;
}

/** Return deals for a single category, newest first. */
export async function getDealsByCategory(category: Category): Promise<Deal[]> {
  const all = await loadAllDeals();
  return all.filter((d) => d.category === category);
}

/** Find one deal by id. */
export async function getDealById(id: string): Promise<Deal | undefined> {
  const all = await loadAllDeals();
  return all.find((d) => d.id === id);
}

/** Count of deals per category, for navigation badges. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const all = await loadAllDeals();
  return all.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + 1;
    return acc;
  }, {});
}
