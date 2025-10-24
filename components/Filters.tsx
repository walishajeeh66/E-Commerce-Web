// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string, isChecked: boolean },
  outOfStock: { text: string, isChecked: boolean },
  priceFilter: { text: string, value: number },
  ratingFilter: { text: string, value: number },
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  // getting current page number from Zustand store
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<any>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceBucket: { text: "priceBucket", value: "all" }, // all | 0-1000 | 1000-2000 | 3000+
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    // setting URL params and after that putting them all in URL
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    if (inputCategory.priceBucket.value && inputCategory.priceBucket.value !== 'all') {
      params.set("priceBucket", inputCategory.priceBucket.value);
    } else {
      params.delete("priceBucket");
    }
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page, pathname, replace]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      <div className="my-3 h-px w-full bg-gray-200"></div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-sm font-medium text-gray-800">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-sm"
            />
            <span className="label-text ml-2 text-sm text-gray-800">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-sm"
            />
            <span className="label-text ml-2 text-sm text-gray-800">Out of stock</span>
          </label>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gray-200"></div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-sm font-medium text-gray-800">Price</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand">
            <input
              type="radio"
              name="priceBucket"
              checked={inputCategory.priceBucket.value === '0-1000'}
              onChange={() => setInputCategory({ ...inputCategory, priceBucket: { text: 'priceBucket', value: '0-1000' } })}
              className="accent-[var(--brand-blue,#1E396E)] focus:ring-[var(--brand-blue,#1E396E)]"
            />
            <span className="text-sm text-gray-800">PKR 0 - 1,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand">
            <input
              type="radio"
              name="priceBucket"
              checked={inputCategory.priceBucket.value === '1000-2000'}
              onChange={() => setInputCategory({ ...inputCategory, priceBucket: { text: 'priceBucket', value: '1000-2000' } })}
              className="accent-[var(--brand-blue,#1E396E)] focus:ring-[var(--brand-blue,#1E396E)]"
            />
            <span className="text-sm text-gray-800">PKR 1,000 - 2,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand">
            <input
              type="radio"
              name="priceBucket"
              checked={inputCategory.priceBucket.value === '3000+'}
              onChange={() => setInputCategory({ ...inputCategory, priceBucket: { text: 'priceBucket', value: '3000+' } })}
              className="accent-[var(--brand-blue,#1E396E)] focus:ring-[var(--brand-blue,#1E396E)]"
            />
            <span className="text-sm text-gray-800">PKR ≥ 3,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand">
            <input
              type="radio"
              name="priceBucket"
              checked={inputCategory.priceBucket.value === 'all'}
              onChange={() => setInputCategory({ ...inputCategory, priceBucket: { text: 'priceBucket', value: 'all' } })}
              className="accent-[var(--brand-blue,#1E396E)] focus:ring-[var(--brand-blue,#1E396E)]"
            />
            <span className="text-sm text-gray-800">All prices</span>
          </label>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gray-200"></div>

      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-2">Minimum Rating</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-sm accent-[var(--brand-blue,#1E396E)]"
          step="1"
        />
        <div className="w-full flex justify-between text-[10px] px-2 text-gray-600">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
