// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";

const CategorySelector = () => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/categories').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      if (mounted && Array.isArray(data)) setCategories(data);
    }).catch(()=>{});
    return () => { mounted = false };
  }, []);
  return (
    <div className="w-full flex items-center gap-2">
      <select className="select select-bordered w-full" onChange={(e)=>{
        const val = e.target.value;
        if (val) router.push(`/shop/${encodeURIComponent(val)}`);
      }}>
        <option value="">All categories</option>
        {categories.map((c)=> (<option key={c.id} value={c.name}>{c.name}</option>))}
      </select>
    </div>
  );
};

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = useCallback(async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string;
      stockAvailabillity: number;
    }[] = [];
    
    wishlist.map((item: any) => productArray.push({id: item?.product?.id, title: item?.product?.title, price: item?.product?.price, image: item?.product?.mainImage, slug: item?.product?.slug, stockAvailabillity: item?.product?.inStock}));
    
    setWishlist(productArray);
  }, [setWishlist]);

  // getting user by email so I can get his user id
  const getUserByEmail = useCallback(async () => {
    if (session?.user?.email) {
      
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  }, [session?.user?.email, getWishlistByUserId]);

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length, getUserByEmail]);

  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <>
          <div className="h-24 bg-blue-gradient flex items-center justify-between px-10 max-[1320px]:px-10 max-md:px-6 max-lg:flex-col max-lg:gap-y-5 max-lg:justify-center max-lg:h-48 max-w-screen-2xl mx-auto">
            <Link href="/">
              <span className="relative right-5 text-3xl font-extrabold tracking-wide text-white">Technology <span className="text-white/90">Zone</span></span>
            </Link>
          <div className="w-full flex items-center justify-center gap-x-4">
            <div className="hidden md:block w-full"><SearchInput /></div>
          </div>
          <div className="flex gap-x-8 items-center text-white relative">
              <NotificationBell />
              <HeartElement wishQuantity={wishQuantity} />
              <CartElement />
            <button
              className="md:hidden inline-flex items-center justify-center rounded-full bg-white/20 text-white w-10 h-10"
              aria-label="Categories"
              onClick={() => {
                const el = document.getElementById('mobile-categories-panel');
                if (el) el.classList.toggle('hidden');
              }}
            >
              ☰
            </button>
            </div>
          </div>
          <div id="mobile-categories-panel" className="md:hidden hidden px-6 pb-4 z-50 relative">
            <div className="dropdown-panel p-3">
              <div className="flex flex-col gap-3">
                <SearchInput />
                <CategorySelector />
              </div>
            </div>
          </div>
        </>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <span className="text-2xl font-extrabold tracking-wide" style={{color:'#1E396E'}}>Technology <span style={{color:'#111'}}>Zone</span></span>
          </Link>
          <div className="flex gap-x-5 items-center">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 border border-gray-200"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
