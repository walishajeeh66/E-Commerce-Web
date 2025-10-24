// *********************
// Role of the component: SortBy
// Name of the component: SortBy.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SortBy />
// Input parameters: no input parameters
// Output: select input with options for sorting by a-z, z-a, price low, price high
// *********************

"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  // getting values from Zustand sort store
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-gray-700">Sort by</label>
      <select
        id="sort"
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-[var(--brand-blue,#1E396E)] focus:ring-2 focus:ring-[var(--brand-blue,#1E396E)]/10 hover:border-gray-400"
        name="sort"
      >
        <option value="defaultSort">Default</option>
        <option value="titleAsc">Popularity</option>
        <option value="titleDesc">Rating</option>
        <option value="lowPrice">Price: Low to High</option>
        <option value="highPrice">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortBy;
