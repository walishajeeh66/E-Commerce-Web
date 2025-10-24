// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <BuyNowSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with buy now functionality
// *********************

"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    const finalPrice = (product as any)?.discountedPrice ?? product?.price;
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: finalPrice,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    toast.success("Product added to the cart");
    router.push("/checkout");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg font-semibold btn-primary hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Buy Now
    </button>
  );
};

export default BuyNowSingleProductBtn;
