"use client";
import React from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductItem from "./ProductItem";

interface FeaturedProductsCarouselProps {
  products: any[];
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const slides = Math.min(4, Math.max(1, products.length));
  const settings: Settings = {
    dots: true,
    arrows: false,
    infinite: products.length > slides,
    speed: 500,
    autoplay: products.length > 1,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    swipeToSlide: true,
    centerMode: products.length > slides,
    centerPadding: "48px",
    slidesToShow: slides,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: Math.min(4, products.length), centerPadding: "32px" } },
      { breakpoint: 1280, settings: { slidesToShow: Math.min(3, products.length), centerPadding: "24px" } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, products.length), centerPadding: "16px" } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, products.length), centerMode: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-3 py-6">
            <ProductItem product={product} color="white" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedProductsCarousel;


