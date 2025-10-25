// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import { prisma } from "@/lib/prisma";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";
  
  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
 // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
   // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
   // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  let products: any[] = [];

  try {
    // Build where clause for Prisma query
    const where: any = {};
    
    // Price filter
    const priceBucket = (searchParams?.priceBucket as string) || 'all';
    if (priceBucket === '0-1000') {
      where.price = { gte: 0, lte: 1000 };
    } else if (priceBucket === '1000-2000') {
      where.price = { gte: 1000, lte: 2000 };
    } else if (priceBucket === '3000+') {
      where.price = { gte: 3000 };
    }
    
    // Rating filter
    if (searchParams?.rating) {
      where.rating = { gte: Number(searchParams.rating) };
    }
    
    // Stock filter
    if (stockMode === 'gt') {
      where.inStock = { gt: 1 };
    } else if (stockMode === 'lte') {
      where.inStock = { lte: 1 };
    }
    
    // Category filter
    if (params?.slug?.length! > 0) {
      where.category = { name: params.slug[0] };
    }

    // Direct database query instead of API call
    products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        merchant: true
      },
      skip: (page - 1) * 12,
      take: 12,
      orderBy: searchParams?.sort === 'price-asc' ? { price: 'asc' } : 
               searchParams?.sort === 'price-desc' ? { price: 'desc' } : 
               searchParams?.sort === 'rating' ? { rating: 'desc' } : 
               { id: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="grid grid-cols-4 gap-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
