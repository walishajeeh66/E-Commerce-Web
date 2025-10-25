// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import { prisma } from "@/lib/prisma";

const ProductsSection = async () => {
  let products: any[] = [];
  
  try {
    // Direct database query instead of API call
    products = await prisma.product.findMany({
      include: {
        category: true,
        merchant: true
      },
      take: 8, // Limit to 8 featured products
      orderBy: { id: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Ensure products is always an array to prevent rendering errors
    products = [];
  }

  return (
    <div className="section-gradient-strong border-t-4 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-4 px-10 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="white" />
            ))
          ) : (
            <div className="col-span-full text-center text-white py-10">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
