"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/** Search input that updates the `q` URL param on submit (server filters). */
export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (value.trim()) {
      next.set("q", value.trim());
    } else {
      next.delete("q");
    }
    router.push(`/?${next.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2" role="search">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search deals (e.g. coffee, shoes, charger)..."
        aria-label="Search deals"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
