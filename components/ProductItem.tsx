"use client";
// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import { normalizeImageSrc } from "@/lib/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { sanitize } from "@/lib/sanitize";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const hasDiscount = typeof (product as any).discountedPrice === 'number' && (product as any).discountedPrice! > 0 && (product as any).discountedPrice! < product.price;
  const oldPrice = hasDiscount ? product.price : Math.round(product.price * 1.15);
  const currentPrice = hasDiscount ? (product as any).discountedPrice! : product.price;
  const discountPercent = hasDiscount ? Math.max(0, Math.round(((oldPrice - currentPrice) / oldPrice) * 100)) : Math.max(0, Math.round(((oldPrice - product.price) / oldPrice) * 100));
  const isInStock = product.inStock > 0;

  return (
    <div className="group relative w-full max-w-[320px] rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative flex items-center justify-center">
        <Link href={`/product/${product.slug}`} className="block">
          <Image
            src={normalizeImageSrc(product.mainImage)}
            width={260}
            height={260}
            sizes="(max-width: 640px) 200px, 260px"
            className="mx-auto w-[260px] h-[260px] object-contain"
            alt={sanitize(product?.title) || "Product image"}
          />
        </Link>

        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-[var(--brand-blue,#1E396E)] px-2 py-1 text-xs font-bold text-white">
            -{discountPercent}%
          </span>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
          aria-label="Add to wishlist"
        >
          {/* Heart icon via unicode to avoid extra imports */}
          <span className="text-lg">❤</span>
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        <Link
          href={`/product/${product.slug}`}
          className={
            color === "black"
              ? "line-clamp-2 text-base font-semibold text-gray-900"
              : "line-clamp-2 text-base font-semibold text-white"
          }
        >
          {sanitize(product.title)}
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-emerald-600">
            {isInStock ? "In stock" : "Out of stock"}
          </span>
          <span className="mx-1 h-1 w-1 rounded-full bg-gray-300" />
          <ProductItemRating productRating={product?.rating} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">PKR {currentPrice}</span>
          {discountPercent > 0 && (
            <span className="text-sm text-gray-500 line-through">PKR {oldPrice}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              try {
                const store = require("@/app/_zustand/store");
                const { useProductStore } = store;
                const { addToCart, calculateTotals } = useProductStore.getState();
                const finalPrice = (product as any)?.discountedPrice ?? product.price;
                addToCart({ id: product.id, title: product.title, price: finalPrice, image: product.mainImage, amount: 1 });
                calculateTotals();
                const toast = require("react-hot-toast").default;
                toast.success("✅ Added to Cart!");
              } catch {}
            }}
            className="inline-flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{backgroundImage:'linear-gradient(135deg,#1E396E,#35528A,#5F7AB1)'}}
          >
            Add to cart
          </button>
          <Link
            href={`/product/${product?.slug}`}
            className="hidden rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 group-hover:inline-flex"
          >
            Quick view
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
