import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import ProductGallery from "@/components/ProductGallery";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${product?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 gap-10 items-start max-lg:grid-cols-1">
          <div className="flex flex-col items-center">
            <ProductGallery mainImage={product?.mainImage} images={images || []} />
          </div>
          <div className="flex flex-col gap-4 text-black">
            <h1 className="text-2xl font-semibold">{sanitize(product?.title)}</h1>
            <div className="flex items-center gap-3">
              <SingleProductRating rating={product?.rating} />
              <span className="text-sm text-green-600">{product?.inStock ? "In stock" : "Out of stock"}</span>
            </div>
            {(() => {
              const dp = (product as any)?.discountedPrice;
              const hasDiscount = typeof dp === 'number' && dp > 0 && dp < product.price;
              const oldPrice = hasDiscount ? product.price : Math.round(product.price * 1.15);
              const currentPrice = hasDiscount ? dp : product.price;
              const discountPercent = hasDiscount ? Math.max(0, Math.round(((oldPrice - currentPrice) / oldPrice) * 100)) : 0;
              return (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-blue-700">PKR {currentPrice}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-500 line-through">PKR {oldPrice}</span>
                      <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor:'#1E396E'}}>-{discountPercent}%</span>
                    </>
                  )}
                </div>
              );
            })()}
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            <div className="flex gap-3 mt-2 flex-wrap">
              <AddToWishlistBtn product={product} slug={paramsAwaited.productSlug} />
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
