import assert from "node:assert/strict";
import { test } from "node:test";
import { filterDeals } from "./search";
import type { Deal } from "./types";

function makeDeal(overrides: Partial<Deal>): Deal {
  return {
    id: Math.random().toString(36).slice(2),
    title: "Some Deal",
    url: "https://example.com",
    category: "other",
    source: "slickdeals",
    fetchedAt: new Date().toISOString(),
    ...overrides,
  };
}

test("filterDeals matches query against title and store", () => {
  const deals = [
    makeDeal({ title: "Folgers Coffee 12oz" }),
    makeDeal({ title: "Running shoes", store: "amazon.com" }),
  ];
  assert.equal(filterDeals(deals, { query: "coffee" }).length, 1);
  assert.equal(filterDeals(deals, { query: "amazon" }).length, 1);
  assert.equal(filterDeals(deals, { query: "nonexistent" }).length, 0);
});

test("filterDeals filters by category", () => {
  const deals = [
    makeDeal({ category: "food" }),
    makeDeal({ category: "gadgets" }),
  ];
  assert.equal(filterDeals(deals, { category: "food" }).length, 1);
});

test("filterDeals filters by maxPrice and minPercentOff", () => {
  const deals = [
    makeDeal({ price: 5, percentOff: 60 }),
    makeDeal({ price: 50, percentOff: 10 }),
  ];
  assert.equal(filterDeals(deals, { maxPrice: 10 }).length, 1);
  assert.equal(filterDeals(deals, { minPercentOff: 50 }).length, 1);
});

test("filterDeals sorts hottest first (score*2 + percentOff)", () => {
  const deals = [
    makeDeal({ title: "low", sourceScore: 1, percentOff: 10 }),
    makeDeal({ title: "high", sourceScore: 100, percentOff: 5 }),
    makeDeal({ title: "mid", sourceScore: 10, percentOff: 80 }),
  ];
  assert.deepEqual(
    filterDeals(deals).map((d) => d.title),
    ["high", "mid", "low"],
  );
});

test("filterDeals with empty filter returns all deals", () => {
  const deals = [makeDeal({}), makeDeal({})];
  assert.equal(filterDeals(deals).length, 2);
});
