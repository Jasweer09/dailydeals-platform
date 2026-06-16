import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { isAffiliateLink, outboundLink, withAmazonTag } from "./affiliate";
import type { Deal } from "./types";

function makeDeal(overrides: Partial<Deal>): Deal {
  return {
    id: "x",
    title: "T",
    url: "https://slickdeals.net/f/123",
    category: "other",
    source: "slickdeals",
    fetchedAt: new Date().toISOString(),
    ...overrides,
  };
}

// The tag is read lazily per call, so we just set env before each test.
beforeEach(() => {
  process.env.NEXT_PUBLIC_AMAZON_TAG = "mytag-20";
});

test("withAmazonTag injects tag on amazon urls only", () => {
  const amazon = withAmazonTag("https://www.amazon.com/dp/B0123?ref=x");
  assert.match(amazon, /tag=mytag-20/);

  const nonAmazon = withAmazonTag("https://lowes.com/product/123");
  assert.equal(nonAmazon, "https://lowes.com/product/123");
});

test("outboundLink prefers productUrl and tags it", () => {
  const deal = makeDeal({
    productUrl: "https://www.amazon.com/dp/B0999",
    url: "https://slickdeals.net/f/999",
  });
  assert.match(outboundLink(deal), /amazon\.com\/dp\/B0999/);
  assert.match(outboundLink(deal), /tag=mytag-20/);
});

test("isAffiliateLink true only for amazon targets when tag set", () => {
  assert.equal(
    isAffiliateLink(makeDeal({ productUrl: "https://www.amazon.com/dp/B1" })),
    true,
  );
  assert.equal(
    isAffiliateLink(makeDeal({ url: "https://slickdeals.net/f/1" })),
    false,
  );
});
