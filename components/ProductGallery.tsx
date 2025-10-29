"use client";
import Image from "next/image";
import { normalizeImageSrc } from "@/lib/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface GalleryProps {
  mainImage: string;
  images: Array<{ imageID: string; image: string }>;
}

const ProductGallery: React.FC<GalleryProps> = ({ mainImage, images }) => {
  const slides = useMemo(() => {
    const extra = (images || []).map((i) => normalizeImageSrc(i.image));
    const base = [normalizeImageSrc(mainImage)];
    return [...base, ...extra];
  }, [mainImage, images]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div>
      <div className="relative w-[440px] h-[440px] max-lg:w-[400px] max-lg:h-[400px] max-md:w-full max-md:h-[360px] overflow-hidden rounded-xl shadow-sm bg-white">
        <Image src={slides[index]} alt="product" width={440} height={440} className="w-[440px] h-[440px] max-lg:w-[400px] max-lg:h-[400px] max-md:w-full max-md:h-[360px] object-contain mx-auto" />
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                className={i === index ? "w-2 h-2 rounded-full bg-white" : "w-2 h-2 rounded-full bg-white/50"}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
      {slides.length > 1 && (
        <div className="flex justify-center mt-4 gap-3 flex-wrap">
          {images?.map((imageItem, i) => (
            <button
              key={imageItem.imageID}
              type="button"
              className={i + 1 === index ? "rounded-lg ring-2 ring-blue-600 p-1" : "rounded-lg ring-1 ring-gray-200 hover:ring-gray-300 p-1"}
              onClick={() => setIndex(i + 1)}
            >
              <Image src={normalizeImageSrc(imageItem.image)} width={96} height={96} alt="thumb" className="w-[96px] h-[96px] object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;



