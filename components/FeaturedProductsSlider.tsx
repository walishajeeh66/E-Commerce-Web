// *********************
// Role of the component: Featured products slider for homepage
// Name of the component: FeaturedProductsSlider.tsx
// *********************

import Heading from "./Heading";
import { prisma } from "@/lib/prisma";
import FeaturedProductsCarousel from "./FeaturedProductsCarousel";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const FeaturedProductsSlider = async () => {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: true, merchant: true },
      take: 12,
      orderBy: { id: "desc" },
    });
    // Ensure unique by id
    const seen = new Set<string>();
    products = products.filter((p: any) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  } catch (e) {
    products = [];
  }

  return (
    <div className="section-gradient-strong border-t-4 border-white pt-20 pb-14 mt-10">
      <div className="max-w-screen-2xl mx-auto">
        <Heading title="FEATURED PRODUCTS" />
        <FeaturedProductsCarousel products={products} />
      </div>
    </div>
  );
};

export default FeaturedProductsSlider;


