"use client";
// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import { optimizeForHero } from "@/lib/image";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Link from "next/link";

const Hero = () => {
  const [hero, setHero] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/consolidated/hero').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      if (mounted) {
        setHero(data || null);
        // If a productId is provided, load that product to build the BUY NOW link
        if (data?.productId) {
          try {
            const prodRes = await apiClient.get(`/api/products/${data.productId}`, { cache: 'no-store' });
            if (prodRes.ok) {
              const prod = await prodRes.json();
              if (mounted) setHero((prev: any) => ({ ...(prev || {}), product: prod }));
            }
          } catch {}
        }
      }
    }).catch(() => {});
    return () => { mounted = false };
  }, []);

  const heading = hero?.heading || 'THE PRODUCT OF THE FUTURE';
  const description = hero?.description || 'Discover cutting-edge tech tailored for you.';
  const product = hero?.product;
  const image = optimizeForHero(hero?.image || '/watch for banner.png');
  const buyUrl = product?.slug ? `/product/${product.slug}` : (hero?.buyNowUrl || '#');
  const learnUrl = hero?.learnMoreUrl || '#';

  return (
    <div className="h-[700px] w-full bg-transparent max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">{heading}</h1>
          <p className="text-white max-sm:text-sm">{description}</p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1">
            <Link href={buyUrl} className="btn-primary px-12 py-3 max-lg:text-xl max-sm:text-lg rounded-md">BUY NOW</Link>
            <Link href={learnUrl} className="btn-secondary px-12 py-3 max-lg:text-xl max-sm:text-lg rounded-md">LEARN MORE</Link>
          </div>
        </div>
        <div className="w-full max-w-[900px] justify-self-end">
          <div className="relative h-[520px] w-full max-xl:h-[460px] max-lg:h-[400px] max-md:h-[340px] max-sm:h-[260px]">
          <Image
            src={image}
            alt="hero product"
            fill
            sizes="(max-width: 1536px) 55vw, 1100px"
            className="object-contain"
            priority
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
