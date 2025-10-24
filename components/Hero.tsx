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
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Link from "next/link";

const Hero = () => {
  const [hero, setHero] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/hero').then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      if (mounted) setHero(data || null);
    }).catch(() => {});
    return () => { mounted = false };
  }, []);

  const heading = hero?.heading || 'THE PRODUCT OF THE FUTURE';
  const description = hero?.description || 'Discover cutting-edge tech tailored for you.';
  const product = hero?.product;
  const image = (product?.mainImage ? `/${product.mainImage}` : (hero?.image ? `/${hero.image}` : '/watch for banner.png'));
  const buyUrl = product?.slug ? `/product/${product.slug}` : (hero?.buyNowUrl || '/shop');
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
        <Image
          src={image}
          width={400}
          height={400}
          alt="smart watch"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
