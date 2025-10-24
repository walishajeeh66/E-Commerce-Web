// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";


import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="xl:w-[300px] h-full max-xl:w-full bg-[color:var(--footer-dark,#373737)] text-white">
      <Link href="/admin">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <MdDashboard className="text-2xl" />{" "}
          <span className="font-normal">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <FaBagShopping className="text-2xl" />{" "}
          <span className="font-normal">Orders</span>
        </div>
      </Link>
      <Link href="/admin/products">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <FaTable className="text-2xl" />{" "}
          <span className="font-normal">Products</span>
        </div>
      </Link>
      <Link href="/admin/categories">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <MdCategory className="text-2xl" />{" "}
          <span className="font-normal">Categories</span>
        </div>
      </Link>
      <Link href="/admin/users">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <FaRegUser className="text-2xl" />{" "}
          <span className="font-normal">Users</span>
        </div>
      </Link>
      <Link href="/admin/merchant">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <FaStore className="text-2xl" />{" "}
          <span className="font-normal">Merchant</span>
        </div>
      </Link>
      <Link href="/admin/hero">
        <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
          <FaGear className="text-2xl" />{" "}
          <span className="font-normal">Hero Section</span>
        </div>
      </Link>
        <Link href="/admin/settings">
            <div className="flex gap-x-2 w-full hover:bg-[rgba(30,57,110,0.2)] cursor-pointer items-center py-4 pl-5 text-base text-white">
                <FaGear className="text-2xl" />{" "}
                <span className="font-normal">Settings</span>
            </div>
        </Link>
    </div>
  );
};

export default DashboardSidebar;
