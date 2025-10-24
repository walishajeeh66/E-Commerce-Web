// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************
"use client";
import React, { useEffect, useRef, useState } from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import apiClient from "@/lib/api";
import Heading from "./Heading";

const CategoryMenu = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/categories')
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  return (
    <div className="py-10 page-blue-gradient">
      <Heading title="BROWSE CATEGORIES" />
      <div className="max-w-screen-2xl mx-auto py-10 px-16 max-md:px-10">
        <div className="relative">
          <button
            type="button"
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow px-3 py-2 hidden md:block"
            onClick={() => {
              if (scrollerRef.current) scrollerRef.current.scrollBy({ left: -300, behavior: "smooth" });
            }}
          >
            ‹
          </button>
          <div ref={scrollerRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x snap-mandatory">
            {categories.map((cat) => (
              <div key={cat.id} className="shrink-0 snap-start">
                <div className="w-48 max-sm:w-40 flex flex-col items-center">
                  <CategoryItem title={cat.name} href={`/shop/${cat.name}`}>
                    <Image src={cat.icon ? `/${cat.icon}` : "/icons/default.png"} width={110} height={110} alt={cat.name} className="w-[110px] h-[110px] object-contain" />
                  </CategoryItem>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow px-3 py-2 hidden md:block"
            onClick={() => {
              if (scrollerRef.current) scrollerRef.current.scrollBy({ left: 300, behavior: "smooth" });
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
