// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden flex flex-col items-center justify-center gap-y-4 cursor-pointer bg-white py-8 text-black rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl px-6">
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-105 rounded-xl p-2 shadow-sm">
          {children}
        </div>
        <h3 className="relative z-10 font-semibold text-lg text-gray-800">
          {title}
        </h3>
        <button className="relative z-10 mt-1 hidden rounded-full px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 group-hover:block hover:bg-gray-200">
          Shop Now
        </button>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{backgroundImage:'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(30,57,110,0.65) 100%)'}}></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{background:'radial-gradient(circle at center, #5F7AB1, transparent 60%)'}}></div>
      </div>
    </Link>
  );
};

export default CategoryItem;
