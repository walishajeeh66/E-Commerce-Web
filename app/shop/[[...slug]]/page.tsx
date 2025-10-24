export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import FiltersMobile from "@/components/FiltersMobile";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await both params and searchParams
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  return (
    <div className="text-black bg-white">
      <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[260px_1fr] gap-8 max-md:grid-cols-1">
          <aside className="hidden md:block rounded-lg border border-gray-200 bg-white p-5 h-max">
            <Filters />
          </aside>
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 max-sm:text-xl">
                {awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
                  ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
                  : "All products"}
              </h2>
              <div className="flex items-center gap-3">
                <FiltersMobile />
                <div className="text-sm text-gray-600">Showing results</div>
                <SortBy />
              </div>
            </div>
            <div className="my-4 h-px w-full bg-gray-200"></div>
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
