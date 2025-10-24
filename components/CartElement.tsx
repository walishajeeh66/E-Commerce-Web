// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity } = useProductStore();
  return (
    <div className="relative">
            <Link href="/cart">
              <FaCartShopping className="text-2xl text-brand-dark" />
              <span className="block w-6 h-6 bg-brand-red text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
                { allQuantity }
              </span>
            </Link>
          </div>
  )
}

export default CartElement
