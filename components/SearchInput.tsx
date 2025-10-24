// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { sanitize } from "@/lib/sanitize";
import apiClient from "@/lib/api";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    if (selectedCategory) {
      router.push(`/shop/${encodeURIComponent(selectedCategory)}${sanitizedSearch ? `?search=${encodeURIComponent(sanitizedSearch)}` : ""}`);
    } else {
      router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    }
    setSearchInput("");
  };

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get("/api/categories")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form className="flex w-full justify-center max-lg:w-full" onSubmit={searchProducts}>
      <select
        className="select select-bordered rounded-r-none rounded-l-xl bg-gray-50 max-lg:w-1/3"
        value={selectedCategory}
        onChange={(e) => {
          const val = e.target.value;
          setSelectedCategory(val);
          if (val) {
            const sanitizedSearch = sanitize(searchInput);
            const query = sanitizedSearch ? `?search=${encodeURIComponent(sanitizedSearch)}` : "";
            router.push(`/shop/${encodeURIComponent(val)}${query}`);
          }
        }}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Type here"
        className="bg-gray-50 input input-bordered w-[70%] rounded-none outline-none focus:outline-none max-sm:w-full max-lg:w-2/3"
      />
      <button type="submit" className="btn btn-primary rounded-l-none rounded-r-xl">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
